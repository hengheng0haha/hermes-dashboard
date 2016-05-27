/**
 * Created by Baxter on 2016/4/10.
 */

'use strict';

import {SupplierFactory, SupplierPriceFactory} from './supplier';


// (async function () {
//     // let result = await SupplierFactory('test', 'tmall', '测试账号');
//     let result = await SupplierPriceFactory('test', {'UFJSS00010': {price: '1'}})
//     console.log(JSON.stringify(result))
// })();

// SupplierPriceFactory('test', {'UFDBG00200': {price: '1'}})
//   .then((result) => {
//     return result.json();
//   })
//   .then((json) => {
//     console.log(json)
//   });

// console.log(
//     (async function(){
//         await '....!!!!'
//     })()
// )

let param = {
  a: 'a',
  b: 'b'
};
for ([k, v] in param) {
  console.log(k, v);
}
