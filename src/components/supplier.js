/**
 * Created by Baxter on 2016/5/30.
 */
'use strict';

import React, {Component} from 'react';
import Top from './Top';
import Panel from './Panel';
import {getSuppliers, transformMoney, getCards} from '../core/utils';
import Table from './Table';
import {SUPPLIER} from '../data/dashboard.config';

const PRODUCT_TYPE = {
  FLOW: '流量',
  BILL: '话费'
}

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

class SupplierProducts extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedSupplier: SUPPLIER,
      table: {
        rows: [],
        count: '',
        current: ''
      }
    };
  }

  render() {
    return (
      <div className="am-u-sm-12">
        <Top first="商家" second="商家产品"/>
        <Table
          names={{
          code: '产品编号',
          name: '产品名称',
          price: '产品价格(￥)',
          type: '产品类型'
          }}
          rows={this.state.table.rows}
          totalDataCount={this.state.table.count}
          pageSize={this.state.table.count}
          currentPage={this.state.table.current}
          onFirstPage={this.handleFirstPage}
          onLastPage={this.handleLastPage}
          onPrevPage={this.handlePrevPage}
          onNextPage={this.handleNextPage}
        />
      </div>
    );
  }

  async componentDidMount() {
    let cards = await getCards(this.state.selectedSupplier);
    let rows = [];
    Object.keys(cards).forEach((item) => {
      if (cards[item].code) {
        rows.push(Object.assign({}, cards[item], {
          type: PRODUCT_TYPE[cards[item].type]
        }));
      }
    });
    let state = Object.assign({}, this.state, {
      table: {
        rows,
        count: rows.length,
        current: 1
      }
    });
    this.setState(state);
  }

}

class SupplierBilling extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedSupplier: SUPPLIER,
      balance: '0'
    };

    this.getBalance = this.getBalance.bind(this);
  }

  render() {
    return (
      <div className="am-u-sm-12">
        <Top first="商家管理" second="商家计费"/>
        <Panel title="您的账户余额">
          <ul className="am-avg-sm-1 am-avg-md-1 am-padding am-text-center admin-content-list ">
            <li style={{fontSize: '4em'}}>
              {`￥${transformMoney(this.state.balance)}`}
            </li>
          </ul>
        </Panel>
      </div>
    );
  }

  componentDidMount() {
    this.getBalance();
    this.balanceInterval = setInterval(this.getBalance, 10000)
  }

  async getBalance() {
    let supplier = (await getSuppliers({name: this.state.selectedSupplier, way: 'hermes'}))[0];
    let state = Object.assign({}, this.state, {
      balance: supplier.balance.toString()
    });
    this.setState(state);
  }

  componentWillUnmount() {
    clearInterval(this.balanceInterval);
  }
}

export {
  SupplierBilling,
  SupplierManage,
  SupplierProducts
}
