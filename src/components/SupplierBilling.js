/**
 * Created by Baxter on 2016/5/28.
 */
'use strict';

import React, {Component} from 'react';
import Top from './Top';
import Panel from './Panel';
import {Selected} from 'amazeui-react';

import {getSuppliers, transformMoney, getSupplierFromHermes} from '../core/utils';

class SupplierBilling extends Component {


  constructor(props) {
    super(props);
    this.state = {
      suppliers: [],
      selectedSupplier: '',
      balance: ''
    };

    this.initSuppliers = this.initSuppliers.bind(this);
  }

  render() {
    return (
      <div className="am-u-sm-12">
        <Top first="商家管理" second="商家计费"/>
        <Panel title="选择一个商家">
          <div className="am-u-sm-12 am-u-md-3 ">
            <Selected
              ref="supplier"
              placeholder="选择一个商家"
              data={this.state.suppliers}
              value={this.state.selectedSupplier}
              onChange={(value) => {
                this.handleSupplierSelected(value);
              }}
            />
          </div>
          <div className="am-u-sm-12 am-u-md-3 am-u-end">
            <button type="button" className="am-btn am-btn-success " onClick={() => {this.handleCharge()}}>充值</button>
          </div>
        </Panel>
        <ul className="am-avg-sm-1 am-avg-md-1 am-padding am-text-center admin-content-list ">
          <li style={{fontSize: '4em'}}>
            {`￥${transformMoney(this.state.balance || '0')}`}
          </li>
        </ul>
      </div>
    );
  }

  componentDidMount() {
    this.initSuppliers();
  }

  async initSuppliers() {
    let suppliers = await getSuppliers();
    console.log(suppliers);
    let tmp = suppliers.map((supplier) => {
      return {
        value: supplier.code,
        label: supplier.name || supplier.code
      };
    });
    let state = Object.assign({}, this.state, {suppliers: tmp});
    this.setState(state);
  }

  async handleSupplierSelected(value) {
    console.log(value);
    // let supplier = getSupplierFromHermes(value);
    // console.log(supplier);

    let supplier = (await getSuppliers({name: value, way: 'hermes'}))[0];
    console.log(supplier);
    console.log(supplier.balance);
    let state = Object.assign({}, this.state, {
      balance: supplier.balance.toString(),
      selectedSupplier: value
    });
    console.log(state);
    this.setState(state);
  }

  async handleCharge() {
    console.log(this.state.selectedSupplier);
  }
}

export default SupplierBilling;
