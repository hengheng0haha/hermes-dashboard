'use strict';

import crypto from 'crypto';
import fetch from 'node-fetch';
import {hermesApi} from '../data/init';

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
  return fetch(`${hermesApi}/do/supplier/add_supplier`, {method: 'POST', body: JSON.stringify(body)});
};

/**
 * @param supplier supplier名称
 * @param prices
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
  return fetch(`${hermesApi}/do/supplier/add_price`, {method: 'POST', body: JSON.stringify(body)});
};

const md5 = (text) => {
  return crypto.createHash('md5').update(text).digest('hex');
};

export {
  SupplierFactory,
  SupplierPriceFactory
}
