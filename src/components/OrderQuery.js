'use strict';

import React, {Component} from 'react'
import ReactDOM from 'react-dom';
import Top from './Top'
import Panel from './Panel';
import Table, {ButtonInTable} from './Table';
import InputGroup from './InputGroup';
import OrderDetail from './OrderDetail';
import {HEADERS_JSON} from '../data/init';
import {Selected} from 'amazeui-react';
import StartEndDateTimePicker from './StartEndDateTimePicker';


class OrderQuery extends Component {


  constructor(props) {
    super(props);
    this.state = {
      backend: [{value: '', label: '无'}],
      values: {
        status: '',
        to_platform: '',
        type: '',
        sort: '',
        startDate: '',
        endDate: ''
      },
      table: {
        rows: [],
        currentPage: 0,
        count: 0
      },
      showOrder: {}
    };
    this.handleFirstPage = this.handleFirstPage.bind(this);
    this.handleLastPage = this.handleLastPage.bind(this);
    this.handleNextPage = this.handleNextPage.bind(this);
    this.handlePrevPage = this.handlePrevPage.bind(this);
    this.getOrderDetailButton = this.getOrderDetailButton.bind(this);
    this.handleOrderDetail = this.handleOrderDetail.bind(this);
  }

  render() {
    return (
      <div className="am-u-sm-12">
        <Top first="订单" second="订单查询"/>
        <Panel title="筛选条件">
          <div className="am-g" style={{marginBottom: '10px'}}>
            <div className="am-u-sm-12 am-u-md-3">
              <Selected
                ref="status"
                placeholder="按订单状态查询"
                data={[{value: '', label: '无'},
                 {value: 'success', label: '成功'},
                 {value: 'failed', label: '失败'},
                 {value: 'error', label: '异常'},
                 {value: 'underway', label: '正在充值'}]}
                btnSize="sm"
                value={this.state.values.status}
              />
            </div>
            <div className="am-u-sm-12 am-u-md-3 am-u-end">
              <Selected
                ref="backend"
                placeholder="按运营商查询"
                data={this.state.backend}
                btnSize="sm"
                value={this.state.values.to_platform}
              />
            </div>
            <div className="am-u-sm-12 am-u-md-3 am-u-end">
              <Selected
                ref="type"
                placeholder="按手机/订单号/其他查询"
                data={[
                {value: '', label: '无'},
                {value: 'inner_order_id', label: '内部订单号'},
                {value: 'tb_order_id', label: '供应商订单号'},
                {value: 'back_end_id', label: '运营商订单号'},
                {value: 'customer', label: '手机号码'},
                {value: 'fail_reason', label: '失败原因'},
                ]}
                btnSize="sm"
                value={this.state.values.type}
              />
            </div>
            <div className="am-u-sm-12 am-u-md-3 am-u-end">
              <Selected
                ref="sort"
                placeholder="排序"
                data={[{value: '', label: '无'}, {value: 'asc', label: '升序'}, {value: 'desc', label: '降序'}]}
                btnSize="sm"
                value={this.state.values.sort}
              />
            </div>
          </div>
          <div className="am-g">
            <StartEndDateTimePicker
              startValue={this.state.values.startDate}
              endValue={this.state.values.endDate}
              ref="date"/>
          </div>
          <div className="am-g">
            <InputGroup
              ref="input"
              name="搜索"
              onClick={this.handleFirstPage}
            />
          </div>
        </Panel>
        <Table
          ref="table"
          names={{
          inner_order_id: '内部订单号',
          customer: '手机号码',
          create_date: '订单时间',
          status: '状态',
          _operation: '操作'
          }}
          onFirstPage={this.handleFirstPage}
          onLastPage={this.handleLastPage}
          onPrevPage={this.handlePrevPage}
          onNextPage={this.handleNextPage}
          rows={this.state.table.rows}
          totalDataCount={this.state.table.count}
          currentPage={this.state.table.currentPage}
        />
        <div id="detail" className="am-offcanvas"></div>
      </div>
    );
  }

  componentDidMount() {
    this.initBackendList();
  }

  initBackendList() {
    fetch('/listBackend', {method: 'POST'})
      .then((result) => {
        return result.json();
      })
      .then((json) => {
        let backendNames = this.state.backend;
        json.forEach((item) => {
          backendNames.push({
            value: item.name,
            label: item.name
          })
        });
        let state = Object.assign({}, this.state, {
          backend: backendNames
        });
        this.setState(state);
      });
  }

  async handleFirstPage(e) {
    let body = this.getBody(1);
    let result = await this.goToPage(e, body);
    let state = Object.assign({}, this.state, {
      values: this.getValuesByBody(body),
      table: {
        rows: result.orders,
        currentPage: 1,
        count: result.count
      }
    });
    console.log(state);
    this.setState(state);
  }

  async handlePrevPage(e) {
    let toPage = --this.state.table.currentPage;
    let body = this.getBody(toPage);
    let result = await this.goToPage(e, body);
    let state = Object.assign({}, this.state, {
      values: this.getValuesByBody(body),
      table: {
        rows: result.orders,
        currentPage: toPage,
        count: result.count
      }
    });
    console.log(state);
    this.setState(state);
  }

  async handleNextPage(e) {
    let toPage = ++this.state.table.currentPage;
    let body = this.getBody(toPage);
    let result = await this.goToPage(e, body);
    let state = Object.assign({}, this.state, {
      values: this.getValuesByBody(body),
      table: {
        rows: result.orders,
        currentPage: toPage,
        count: result.count
      }
    });
    console.log(state);
    this.setState(state);
  }

  async handleLastPage(e) {
    let toPage = Math.ceil(this.state.table.count / 10);
    let body = this.getBody(toPage);
    let result = await this.goToPage(e, body);
    let state = Object.assign({}, this.state, {
      values: this.getValuesByBody(body),
      table: {
        rows: result.orders,
        currentPage: toPage,
        count: result.count
      }
    });
    console.log(state);
    this.setState(state);
  }

  async goToPage(e, body) {
    e.preventDefault();

    let result = await fetch('/orders', {
      method: 'POST', headers: HEADERS_JSON, body: JSON.stringify(body)
    });
    let json = await result.json();
    json.orders.forEach((item, index) => {
      Object.assign(item, {_operation: this.getOrderDetailButton(index)})
    });
    return json;
  }

  getOrderDetailButton(index) {
    return (
      <ButtonInTable>
        <button onClick={this.handleOrderDetail} className="am-btn am-btn-default am-btn-xs am-text-secondary"><span
          className="am-icon-pencil-square-o" value={index}></span> 详细
        </button>
      </ButtonInTable>
    )
  }

  handleOrderDetail(e) {
    e.preventDefault();
    let index = e.currentTarget.getElementsByTagName("span")[0].value;
    let data = this.state.table.rows[index];

    ReactDOM.render(<OrderDetail style={{width: '40%', backgroundColor: 'white'}} order={data}/>, document.getElementById("detail"));
    $('#detail').offCanvas('open');

  }

  getBody(page, pageSize = 10) {
    let {start, end} = this.refs.date.getDateTime();
    let status = this.refs.status.state.value;
    let to_platform = this.refs.backend.state.value;
    let sort = this.refs.sort.state.value;
    let {type, content} = {
      type: this.refs.type.state.value,
      content: this.refs.input.getInputValue()
    };
    let text = (type) ? {type, content} : undefined;
    return {
      page,
      pageSize,
      option: {
        status,
        to_platform,
        sort,
        text
      },
      date: {
        startDate: start,
        endDate: end
      }

    };
  }

  getValuesByBody(body) {
    return {
        status: body.option.status,
        to_platform: body.option.to_platform,
        sort: body.option.sort,
        startDate: body.date.startDate,
        endDate: body.date.endDate
      } || {
        status: '',
        to_platform: '',
        type: '',
        sort: '',
        startDate: '',
        endDate: ''
      }
  }

}

export default OrderQuery;
