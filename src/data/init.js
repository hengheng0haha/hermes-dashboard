'use strict'

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
        label: '商家管理',
        link: '/supplier',
        className: 'am-icon-file'
      },
      {
        label: '商家计费',
        link: '/supplier',
        className: 'am-icon-file'
      }
    ]
  },
  {
    label: '运营商管理',
    className: 'am-icon-file',
    link: '/backend'
  }
]

let hermesHost = '172.16.10.20'
let hermesPort = '8080'
let hermesApi = `http://${hermesHost}:${hermesPort}/hermes/webapi`

let HEADERS_JSON = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
};

export {siderbar, hermesApi, HEADERS_JSON}
