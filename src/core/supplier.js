'use strict';

import crypto from 'crypto';
import fetch from 'node-fetch';

const hermesHost = '172.16.10.20';
const hermesApi = `http://${hermesHost}:8080/hermes/webapi`;


const SupplierFactory = (name, plugin, memo, balance) => {
  let time = new Date().getTime();
  let coopId = String(Math.abs(time >> Math.random()));
  let key = md5(String(time));
  let body = {
    name,
    coopId,
    plugin,
    memo,
    balance,
    key
  };
  console.log(body);
  return fetch(`${hermesApi}/do/supplier/add_supplier`, {method: 'POST', body: JSON.stringify(body)});
};

/**
 * @param supplier supplier名称
 * @param prices   {{card_id: {price, percent}}}
 *           card_id: 产品编号
 *           price:   给商家的产品价格
 *           percent: 给商家的折扣
 */
const SupplierPriceFactory = (supplier, prices) => {
  let body = {
    name: supplier,
    cards: [],
    prices: [],
    percents: []
  };
  Object.keys(prices).forEach((card) => {
    body.cards.push(card);
    body.prices.push(prices[card].price);
    body.percents.push(prices[card].percent || '1');
  });
  console.log(body);
  return fetch(`${hermesApi}/do/supplier/add_price`, {method: 'POST', body: JSON.stringify(body)});
};

const md5 = (text) => {
  return crypto.createHash('md5').update(text).digest('hex');
};

export {
  SupplierFactory,
  SupplierPriceFactory
}
