/**
 * Created by Baxter on 2016/5/30.
 */
'use strict';

import React, {Component} from 'react';
import moment from 'moment-timezone';
import {DateTimeInput} from 'amazeui-react';
import Top from './Top';
import Panel from './Panel';
import {getSuppliers, transformMoney, getCards, doAccount, downloadAccount} from '../core/utils';
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

class SupplierAccount extends Component {


  constructor(props) {
    super(props);
    this.state = {
      day: moment().add(-1, 'days').format('YYYY-MM-DD'),
      supplier: SUPPLIER,
      info: {
        fileName: '',
        size: 0,
        createTime: ''
      }
    };
    this.handleSelectDate = this.handleSelectDate.bind(this);
    this.handleAccountCreate = this.handleAccountCreate.bind(this);
  }

  render() {
    let fileInfo = this.state.info.fileName ? (
      <ul className="am-avg-sm-1 am-avg-md-3 am-padding am-text-center admin-content-list ">
        <li style={{fontSize: '1em'}}>
          <label>文件名: </label>
          {this.state.info.fileName}
        </li>
        <li style={{fontSize: '1em'}}>
          <label>文件大小: </label>
          {`${this.state.info.size / 1024}kb`}
        </li>
        <li style={{fontSize: '1em'}}>
          <label>生成时间: </label>
          {this.state.info.createTime}
        </li>
      </ul>
    ) : (
      <ul className="am-avg-sm-1 am-avg-md-1 am-padding am-text-center admin-content-list ">
        <li style={{fontSize: '3em'}}>对账文件未生成</li>
      </ul>
    );
    return (
      <div className="am-u-sm-12">
        <Top first="商家管理" second="商家对账"/>
        <Panel title="选择对账日期">
          <div className="am-u-sm-12 am-u-md-3 ">
            <DateTimeInput onSelect={this.handleSelectDate} dateTime={this.state.day} format="YYYY-MM-DD"
                           minViewMode="days" showTimePicker={false} viewMode="days"/>
          </div>
          <div className="am-u-sm-12 am-u-md-3 ">
            <a
              className="am-btn am-btn-success"
              disabled={this.state.info.fileName ? '' : 'disabled'}
              href={`/download/${this.state.info.fileName}`}
              target="_blank">
              下载
            </a>
          </div>
          <div className="am-u-sm-12 am-u-md-3 am-u-end">
            <button
              id="load-btn"
              type="button"
              className="am-btn am-btn-success "
              onClick={this.handleAccountCreate}
              data-am-loading="{loadingText: '对账文件努力生成中...'}"
            >生成对账文件
            </button>
          </div>
        </Panel>
        <Panel title="对账文件信息">
          {fileInfo}
        </Panel>
        <Panel title="对账文件格式">
          <ul className="am-avg-sm-1 am-avg-md-1 am-padding am-text-left admin-content-list ">
            <li style={{fontSize: '0.9em'}}>
              成功订单数|扣款金额
              <br/>
              商家订单号1|内部订单号1|产品编号1|手机号码1|订单创建时间(YYYYMMDDHHmmssSSS)1|订单完成时间(YYYYMMDDHHmmssSSS)1|金额1
              <br/>
              商家订单号2|内部订单号2|产品编号2|手机号码2|订单创建时间(YYYYMMDDHHmmssSSS)2|订单完成时间(YYYYMMDDHHmmssSSS)2|金额2
              <br/>
              ...
              <br/>
              商家订单号N|内部订单号N|产品编号N|手机号码N|订单创建时间(YYYYMMDDHHmmssSSS)N|订单完成时间(YYYYMMDDHHmmssSSS)N|金额N
            </li>
          </ul>
        </Panel>
      </div>
    );
  }

  async componentDidMount() {
    let result = await doAccount(this.state.day, this.state.supplier, 'info');
    let state = Object.assign({}, this.state, {
      info: {
        fileName: result.fileName,
        createTime: result.createTime,
        size: result.size
      }
    });
    console.log(state);
    this.setState(state);
  }

  async componentDidUpdate(prevProps, prevState) {
    if (prevState.day != this.state.day) {
      let result = await doAccount(this.state.day, this.state.supplier, 'info');
      let state = Object.assign({}, this.state, {
        info: {
          fileName: result.fileName,
          createTime: result.createTime,
          size: result.size
        }
      });
      console.log(state);
      this.setState(state);
    }
  }

  handleSelectDate(time) {
    console.log(time);
    let state = Object.assign({}, this.state, {day: time});
    console.log(state);
    this.setState(state);
  }

  async handleAccountCreate() {
    if (this.state.info.fileName) {
      alert('对账文件已存在!');
      return;
    }
    $('#load-btn').button('loading');
    let result = await doAccount(this.state.day, this.state.supplier, 'create');
    $('#load-btn').button('reset');
    console.log(result);
    let state = Object.assign({}, this.state, {
      info: {
        fileName: result.fileName,
        createTime: result.createTime,
        size: result.size
      }
    });
    this.setState(state);
  }
}

export {
  SupplierBilling,
  SupplierManage,
  SupplierProducts,
  SupplierAccount
}
