'use strict'

import React from 'react'
import Top from './Top'

class OrderOverview extends React.Component {
  render() {
    return (
      <div>
        <h1>订单概况</h1>
      </div>
    )
  }
}

class Overview extends React.Component {
  render() {
    return (
      <div>
        <Top first="首页" second="服务概况"/>
        <OrderOverview/>
      </div>
    )
  }
}

export default Overview;
