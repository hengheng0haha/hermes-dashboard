/**
 * Created by Baxter on 2016/4/10.
 */

'use strict';
require('date-utils');
import {SupplierFactory, SupplierPriceFactory} from './supplier';
import {getDateRange, getBillingCountInMonth} from './serverUtils';
import generate from './account';

// (async () => {
//   let {sums, cards} = await getBillingCountInMonth('1970004461', 'UNICOM_NAT_CQY', '2016-05');
//   console.log(sums);
//   console.log(cards);
// })();

// (async function () {
//     // let result = await SupplierFactory('test', 'tmall', '测试账号');
//     let result = await SupplierPriceFactory('test', {'UFJSS00010': {price: '1'}})
//     console.log(JSON.stringify(result))
// })();

// todo 生产环境产品配置, 改cassandra ip
// SupplierPriceFactory('test', {
//   'UFFJM00020': {price: 1}
// })
//   .then((result) => {
//     return result.json();
//   })
//   .then((json) => {
//     console.log(json)
//   });

(async()=> {
  console.log(await generate(Date.yesterday()));
})();
