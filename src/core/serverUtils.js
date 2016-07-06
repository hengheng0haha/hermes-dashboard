/**
 * Created by Baxter on 2016/5/28.
 */
import {execute, solrQuery} from './cassandra';
import {hermesApi} from '../data/init';
import fetch from 'node-fetch';
import {types} from 'cassandra-driver';
import {info} from './account.js';
import moment from 'moment-timezone';

const FORMAT = 'YYYY-MM-DDTHH24:MI:SSZ';


let getOrderChartByDate = async(date, params = {}) => {
  let query = solrQuery('orders')
    .q('create_date', getDateRange(date))
    .facet({'field': 'status'});

  Object.keys(params).forEach((key) => {
    query.fq(key, params[key]);
  });
  let rst = {};
  try {
    let result = await execute(query.build());
    let status = JSON.parse(result.rows[0].facet_fields).status;
    let total = (status.success || 0) + (status.underway || 0) + (status.failed || 0);
    let tmp = {
      total,
      success: status.success || 0,
      underway: status.underway || 0
    };
    if (status.failed == 0) {
      tmp['failed'] = 0;
      tmp['error'] = 0;
      rst[moment(date).format('YYYY-MM-DD')] = tmp;
    } else {
      let errorQuery = solrQuery('orders')
        .q('create_date', getDateRange(date))
        .fq('is_error', true)
        .count(true);
      Object.keys(params).forEach((key) => {
        errorQuery.fq(key, params[key]);
      });
      let error = (await execute(errorQuery.build())).rows[0].count;
      tmp['failed'] = status.failed - error;
      tmp['error'] = error;
      rst[moment(date).format('YYYY-MM-DD')] = tmp;
    }
    return rst;
  } catch (e) {
    console.log(e)
  }
};

/**
 * 获取2个时间段的solr返回字符串([yyyy-MM-DDTHH:mm:ssZ TO yyyy-MM-DDTHH:mm:ssZ])
 * Note: 2个时间点都包含在最后得到的时间段内
 *
 * @param date 起始时间
 * @param end 结束时间
 * @returns {*}
 */
let getDateRange = (date, end) => {
  return `[${moment(date).utc().format()} TO ${end ? moment(end).utc().format() : moment(date).add(1, 'days').utc().format()}]`;
};

let getBillingCountInMonth = async(query, suppliers, page = 1, pageSize = 300) => {
  let result = types.BigDecimal.fromNumber(0);
  query
    .start((page - 1) * pageSize)
    .limit(pageSize);
  try {
    let rst = (await execute(query.build())).rows;
    rst.forEach((order) => {
      console.log(order);
      let tmp = suppliers[order.coop_id][order.card_id] || '0';
      console.log(typeof tmp, tmp);
      result = result.add(types.BigDecimal.fromString(tmp));
    });
    return result;
  } catch (e) {
    console.log(e);
  }
};

let getCardsPriceBySupplier = async(supplier) => {
  let tmp = await fetch(`${hermesApi}/do/supplier/get_supplier`, {
      method: 'POST',
      body: JSON.stringify({name: supplier})
    }),
    _supplier = await tmp.json();
  let {priceMap} = JSON.parse(_supplier.result.value);
  let CARDS = {};
  Object.keys(priceMap).forEach((card) => {
    CARDS[card] = priceMap[card].price;
  });
  return CARDS;
};

export {
  getOrderChartByDate,
  getDateRange,
  getBillingCountInMonth,
  getCardsPriceBySupplier
};
