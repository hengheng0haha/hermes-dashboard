'use strict'

import React, {Component} from 'react'
import Top from './Top'

class BackendManage extends Component {
  render() {
    return (
      <div>
        <Top first="运营商" second="运营商管理"/>
        <div className="am-avg-sm-1 am-avg-md-4 am-margin am-padding am-text-center admin-content-list ">
          <h1>运营商管理</h1>
        </div>
      </div>
    )
  }
}

export default BackendManage;
