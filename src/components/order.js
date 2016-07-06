/**
 * Created by Baxter on 2016/5/30.
 */
'use strict';

import moment from 'moment-timezone';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Top from './Top'
import Panel from './Panel';
import Table, {ButtonInTable} from './Table';
import InputGroup from './InputGroup';
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
          names={{
          tb_order_id: '商家订单号',
          inner_order_id: '内部订单号',
          sum: '订单金额',
          customer: '手机号码',
          tb_order_snap: '订单快照',
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
            value: item,
            label: item
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

    ReactDOM.render(
      <OrderDetail
        style={{width: '40%', backgroundColor: 'white'}}
        order={data}
      />, document.getElementById("detail"));
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
        text,
        type
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
        endDate: body.date.endDate,
        type: body.option.type
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

const DetailKeyMapping = {
  'id': 'id',
  'create_date': '订单创建时间',
  'back_end_id': '运营商订单号',
  'card_id': '产品编码',
  'coop_id': '商家编号',
  'customer': '手机号码',
  'fail_reason': '失败原因',
  'finish_code': '订单错误码',
  'finish_date': '订单完成时间',
  'from_platform': '供应商名称',
  'hermes_id': '处理订单的服务器',
  'inner_order_id': '内部订单号',
  'is_error': '是否为异常订单',
  'memo': '备注',
  'message': {
    title: '订单交互报文',
    children: {
      'BackendCallbackRequest': '运营商回调请求报文',
      'BackendCallbackResponse': '响应给运营商的报文',
      'BackendRequest': '向运营商请求的报文',
      'BackendResponse': '运营商响应报文',
      'SupplierCallbackRequest': '向供应商回调的报文',
      'SupplierCallbackResponse': '供应商响应回调的报文',
      'SupplierRequest': '供应商请求报文',
      'SupplierResponse': '向供应商响应的报文'
    }
  },
  'notify_url': '运营商回调地址',
  'status': '订单状态',
  'sum': '客户支付金额',
  'tb_order_id': '供应商订单编号',
  'tb_order_snap': '供应商订单快照',
  'to_platform': '运营商编号',
  'type': '订单类型',
};

class OrderDetail extends Component {
  static propTypes = {
    children: React.PropTypes.array,
    style: React.PropTypes.object,
    order: React.PropTypes.object
  };

  static defaultProps = {
    children: [],
    style: {},
    order: {}
  };

  render() {
    let items = [];
    Object.keys(DetailKeyMapping).forEach((col) => {
      let value = this.props.order[col];
      console.log(col, value);
      if (typeof value != 'boolean' && !value) {
        items.push(this.getDetailItem(col == 'message' ? DetailKeyMapping.message.title : DetailKeyMapping[col], '无'));
      } else {
        if (col == 'message') {
          let messages = [];
          let subMessage = DetailKeyMapping.message.children;
          Object.keys(subMessage).forEach((msgKey) => {
            messages.push(this.getDetailItem(subMessage[msgKey], value[msgKey]))
          });
          items.push(messages);
        } else if (col.endsWith('date')) {
          items.push(this.getDetailItem(DetailKeyMapping[col], moment(value).format('YYYY-MM-DD HH:mm:ss')));
        } else {
          items.push(this.getDetailItem(DetailKeyMapping[col], value.toString()));
        }
      }
    })
    console.log(items);
    return (
      <div className="am-offcanvas-bar am-offcanvas-bar-flip"
           style={this.props.style}>
        <div className="am-offcanvas-content" style={{marginTop: '20%'}}>
          <ul className="am-list am-list-static am-list-border ">
            {items.map((item) => {
              return item;
            })}
          </ul>
        </div>
      </div>
    )
  }

  getDetailItem(key, value) {
    return (
      <li style={{marginBottom: '5%'}}>
        <h2>{key}</h2>
        <textarea style={{width: '100%'}} rows="5" value={value} disabled/>
      </li>
    )
  }
}

export {
  OrderDetail,
  OrderQuery
}
