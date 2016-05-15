'use strict'

import React, {Component} from 'react'
import Top from './Top'
import Graph from './Graph'

class OrderOverview extends Component {
  render() {
    return (
      <div className="am-avg-sm-1 am-avg-md-4 am-margin am-padding am-text-center admin-content-list ">
        <h1>订单概况</h1>
      </div>
    )
  }
}

class Overview extends Component {
  render() {
    return (
      <div>
        <Top first="首页" second="服务概况"/>
        <OrderOverview/>
        <div class="am-g">
          <Graph />
        </div>
      </div>
    )
  }
}

export default Overview;
