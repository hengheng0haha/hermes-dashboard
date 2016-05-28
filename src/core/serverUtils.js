/**
 * Created by Baxter on 2016/5/28.
 */
import {execute, solrQuery} from './cassandra';
const FORMAT = 'YYYY-MM-DDTHH24:MI:SSZ';

let getOrderChartByDate = async(date, params = {}) => {
  let query = solrQuery('orders')
    .q('create_date', `[${date.toFormat(FORMAT)} TO ${date.add({days: 1}).toFormat(FORMAT)}]`)
    .facet({'field': 'status'});

  Object.keys(params).forEach((key) => {
    query.fq(key, params[key]);
  });

  console.log(query.build());
  date.add({days: -1});
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
        .q('create_date', `[${date.toFormat(FORMAT)} TO ${date.add({days: 1}).toFormat(FORMAT)}]`)
        .fq('is_error', true)
        .count(true)
        .build();
      date.add({days: -1});
      let error = (await execute(errorQuery)).rows[0].count;
      tmp['failed'] = status.failed - error;
      tmp['error'] = error;
      rst[date.toYMD('-')] = tmp;
    }
    return rst;

  } catch (e) {
    console.log(e)
  }
};

export {
  getOrderChartByDate
};
