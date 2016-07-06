'use strict';

import {hermes} from './dashboard.config.js';

let siderbar = [
  {
    label: '首页',
    className: 'am-icon-home',
    link: '/'
  },
  {
    label: '订单',
    className: 'am-icon-file',
    id: 'order',
    children: [
      {
        label: '订单查询',
        link: '/query',
        className: 'am-icon-search'
      }
    ]
  },
  {
    label: '商家',
    className: 'am-icon-file',
    id: 'supplier',
    children: [
      {
        label: '商家产品',
        link: '/supplier_product',
        className: 'am-icon-file'
      },
      {
        label: '商家对账',
        link: '/supplier_account',
        className: 'am-icon-file'
      }
    ]
  }
];


let hermesApi = `http://${hermes.host}:${hermes.port}/hermes/webapi`;

let HEADERS_JSON = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
};

let HEADERS_DOWNLOAD = {
  "content": "text/html;charset=utf-8",
  "Content-Type": "application/octet-stream",
  "Expires": "0",
  "Cache-Control": "must-revalidate, post-check=0, pre-check=0"
};

let ACCOUNT_COLUMNS = [
  'tb_order_id',
  'inner_order_id',
  'card_id',
  'customer',
  'create_date',
  'finish_date'
];

export {siderbar, hermesApi, HEADERS_JSON, ACCOUNT_COLUMNS, HEADERS_DOWNLOAD}
