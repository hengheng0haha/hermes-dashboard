'use strict';

import React, {Component} from 'react'
import Top from './Top'

class OrderQuery extends Component {
  render() {
    return (
      <div>
        <Top first="订单" second="订单查询"/>
        <div className="am-avg-sm-1 am-avg-md-4 am-margin am-padding am-text-center admin-content-list ">
          <h1>Order query</h1>
        </div>
      </div>
    )
  }
}

export default OrderQuery;
