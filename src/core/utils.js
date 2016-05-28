/**
 * Created by Baxter on 2016/5/20.
 */
require('date-utils');
import {HEADERS_JSON} from '../data/init';

let getAllBackend = async(params = {}) => {
  let tmp = await fetch('/orderCounter', {
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

export {
  getAllBackend,
  getOrderCount
};
