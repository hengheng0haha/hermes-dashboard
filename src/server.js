/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

require('date-utils');
import 'babel-polyfill';
import path from 'path';
import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import PrettyError from 'pretty-error';
import assets from './assets'; // eslint-disable-line import/no-unresolved
import {port} from './config';
import {getOrderChartByDate} from './core/serverUtils';
import {hermesApi, HEADERS_JSON} from './data/init';
import {execute, solrQuery} from './core/cassandra';
import fetch from 'node-fetch';

const app = express();

//
// Tell any CSS tooling (such as Material UI) to use all vendor prefixes if the
// user agent is not known.
// -----------------------------------------------------------------------------
global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'all';

//
// Register Node.js middleware
// -----------------------------------------------------------------------------
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


app.post('/orders', async(req, res, next) => {
  let result = {};

  try {
    let query = solrQuery('orders').count(true);
    let {startDate, endDate} = req.body.date;
    if (startDate || endDate) {
      let start = startDate ? `${startDate}T00:00:00Z` : '*';
      let end = endDate ? `${endDate}T00:00:00Z` : '*';
      query.q('create_date', `[${start} TO ${end}]`)
    }
    Object.keys(req.body.option).forEach((key) => {
      let value = req.body.option[key];
      if (value) {
        if (key == 'text') {
          query.fq(value.type, value.content)
        } else if (key == 'sort') {
          query.sort('create_date', value)
        } else if (key == 'status' && value == 'error') {
          query.fq('is_error', true)
        } else {
          query.fq(key, value)
        }
      }
    });
    let count = (await execute(query.build())).rows[0].count;

    query.count(false)
      .start((req.body.page - 1) * req.body.pageSize)
      .limit(req.body.pageSize);
    let orders = (await execute(query.build())).rows;

    Object.assign(result, {count, orders});

  } catch (e) {
    console.log(e);
  }
  res.send(JSON.stringify(result));
});

app.post('/orderCounter', async(req, res, next) => {
  let body = req.body;
  let result = {};
  let today = await getOrderChartByDate(Date.today(), body.param || {});
  Object.assign(result, today);
  if (body.init) {
    for (let i = -1; i > -7; i--) {
      Object.assign(result, (await getOrderChartByDate(Date.today().add({days: i}), body.param || {})));
    }
  } else if (body.prevDate && body.prevDate !== (new Date()).toYMD('-')) {
    Object.assign(result, (await getOrderChartByDate(Date.today().add({days: -1}), body.param || {})));
  }
  res.send(JSON.stringify(result));
});

app.post('/listBackend', async(req, res, next) => {
  let way = req.body.way;
  let results = [];
  if (way == 'solr') {
    let start = Date.today().add({days: -7}).toFormat('YYYY-MM-DDTHH24:MI:SSZ'),
      end = Date.today().add({days: 1}).toFormat('YYYY-MM-DDTHH24:MI:SSZ'),
      query = solrQuery('orders')
        .q('create_date', `[${start} TO ${end}]`)
        .facet({
          field: 'to_platform'
        })
        .build(),
      result = (await execute(query)).rows[0].facet_fields;
    let tmp = JSON.parse(result).to_platform;
    console.log(tmp);
    Object.keys(tmp).forEach((item) => {
      if (tmp[item] != 0) {
        results.push(item);
      }
    })
  } else {
    let json = (await execute('select name from hermes.backends;')).rows;
    json.forEach((item) => {
      results.push(item.name);
    })
  }
  console.log(results);
  res.send(JSON.stringify(results));
});

app.post('/listSuppliers', async(req, res) => {
  let results = [];
  let body = req.body;
  let way = body.way || 'cql';
  try {
    if (way == 'cql') {
      let suppliers = (await execute('select * from hermes.suppliers;')).rows;
      suppliers.forEach((item) => {
        results.push({
          code: item.supplier_name,
          name: item.memo,
        })
      })
    } else if (way == 'hermes') {
      let hBody = body.name ? {name: body.name} : {all: true};
      let tmp = (await fetch(`${hermesApi}/do/supplier/get_supplier`, {
        method: 'POST',
        body: JSON.stringify(hBody)
      }));
      let suppliers = JSON.parse((await tmp.json()).result.value);
      results.push({
        code: suppliers.supplier_name,
        name: suppliers.memo,
        balance: suppliers.balance,
        cards: suppliers.price_map,
        coopId: suppliers.coop_id
      })
    }
  } catch (e) {
    console.log(e);
  }
  res.send(JSON.stringify(results));
});

app.post('/supplier_charge', async(req, res) => {
  let {supplier, sum} = req.body;
  let tmp = (await fetch(`${hermesApi}/do/supplier/supplier_charge`, {
    method: 'POST',
    body: JSON.stringify({name: supplier, sum})
  }));
  let resp;
  try {
    let result = await tmp.json();
    resp = JSON.parse(result.result.value);
  } catch (e) {
    console.log(e);
  }
  res.send(resp || JSON.stringify({code: 1}));
});

//
// Register server-side rendering middleware
// -----------------------------------------------------------------------------
app.get('*', async(req, res, next) => {
  try {
    let statusCode = 200;
    const template = require('./views/index.jade'); // eslint-disable-line global-require
    const data = {title: '', description: '', css: '', body: '', entry: assets.main.js};
    res.status(statusCode);
    res.send(template(data));
  } catch (err) {
    next(err);
  }
});

//
// Error handling
// -----------------------------------------------------------------------------
const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage('express');

app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.log(pe.render(err)); // eslint-disable-line no-console
  const template = require('./views/error.jade'); // eslint-disable-line global-require
  const statusCode = err.status || 500;
  res.status(statusCode);
  res.send(template({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '' : err.stack,
  }));
});

//
// Launch the server
// -----------------------------------------------------------------------------
/* eslint-disable no-console */
app.listen(port, () => {
  console.log(`The server is running at http://localhost:${port}/`);
});
/* eslint-enable no-console */
