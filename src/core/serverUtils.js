/**
 * Created by Baxter on 2016/5/28.
 */
require('date-utils');
import {execute, solrQuery} from './cassandra';
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
      rst[date.toYMD('-')] = tmp;
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
      rst[date.toYMD('-')] = tmp;
    }
    return rst;
  } catch (e) {
    console.log(e)
  }
};

let getDateRange = (date, end) => {
  let rst;
  if (!end) {
    rst = `[${date.addHours(-8).toFormat(FORMAT)} TO ${date.add({days: 1}).toFormat(FORMAT)}]`;
  } else {
    date.addHours(24);
    end.addHours(24);
    rst = `[${date.addHours(-8).toFormat(FORMAT)} TO ${end.addHours(-8).toFormat(FORMAT)}]`;
    end.addHours(-16);
  }
  date.addHours(-16);
  return rst;
};

export {
  getOrderChartByDate,
  getDateRange
};
