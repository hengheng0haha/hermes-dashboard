'use strict'

import React, {Component} from 'react'
import Top from './Top'

class SupplierManage extends Component {

  render() {
    return (
      <div>
        <Top first="商家" second="商家管理"/>
        <div className="am-avg-sm-1 am-avg-md-4 am-margin am-padding am-text-center admin-content-list ">
          <h1>商家管理</h1>
        </div>
      </div>
    )
  }
  
}


export default SupplierManage;
