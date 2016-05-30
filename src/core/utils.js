/**
 * Created by Baxter on 2016/5/20.
 */
require('date-utils');
import {HEADERS_JSON, hermesApi} from '../data/init';

let getAllBackend = async(params = {}) => {
  let tmp = await fetch('/listBackend', {
    method: 'POST', headers: HEADERS_JSON, body: JSON.stringify(params)
  });
  return await tmp.json();
};

let getOrderCount = async(params = {}) => {
  let tmp = await fetch('/orderCounter', {
    method: 'POST', headers: HEADERS_JSON, body: JSON.stringify(params)
  });
  return await tmp.json();
};

let getSuppliers = async(params = {}) => {
  let tmp = await fetch('/listSuppliers', {
    method: 'POST', headers: HEADERS_JSON, body: JSON.stringify(params)
  });
  return await tmp.json();
};

let supplierCharge = async(supplier, sum) => {
  let body = {supplier, sum};
  let tmp = await fetch('/supplier_charge', {
    method: 'POST', headers: HEADERS_JSON, body: JSON.stringify(body)
  });
  return await tmp.json();
};

let transformMoney = (s) => {
  if (s == '-1')  return "∞";
  if (/[^0-9\.]/.test(s)) return "invalid value";

  s = s.replace(/^(\d*)$/, "$1.");
  s = (s + "00").replace(/(\d*\.\d\d)\d*/, "$1");
  s = s.replace(".", ",");
  var re = /(\d)(\d{3},)/;
  while (re.test(s)) {
    s = s.replace(re, "$1,$2");
  }
  s = s.replace(/,(\d\d)$/, ".$1");

  return s.replace(/^\./, "0.");
};


export {
  getAllBackend,
  getOrderCount,
  getSuppliers,
  transformMoney,
  supplierCharge
};
