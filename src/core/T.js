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
SupplierPriceFactory('zx', {
  "UFJXG00020X": {price:'0.8'},
  "UFJXG00030X": {price:'1.2'},
  "UFJXG00050X": {price:'2'},
  "UFJXG00100X": {price:'4'},
  "UFJXG00200X": {price:'8'},
  "UFJXG00300X": {price:'12'},
  "UFJXG00500X": {price:'20'},
  "UFJXG01000X": {price:'40'},
  "UFJXG02000X": {price:'80'},
  "UFJXG00020": {price:'1.12'},
  "UFJXG00030": {price:'1.68'},
  "UFJXG00050": {price:'2.8'},
  "UFJXG00100": {price:'5.6'},
  "UFJXG00200": {price:'11.2'},
  "UFJXG00300": {price:'16.8'},
  "UFJXG00500": {price:'28'},
  "UFJXG01000": {price:'56'},
  "UFJXG02000": {price:'112'}
})
  .then((result) => {
    return result.json();
  })
  .then((json) => {
    console.log(json)
  });

// (async()=> {
//   console.log(await generate(Date.yesterday()));
// })();
