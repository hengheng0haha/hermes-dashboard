/**
 * Created by Baxter on 2016/5/30.
 */
'use strict';

import moment from 'moment-timezone';
import React, {Component} from 'react';
import ChartContainer from './ChartContainer';
import Top from './Top';
import Bar from './Bar';
import Panel from './Panel';
import {Selected, DateTimeInput} from 'amazeui-react';
import {getAllBackend, getOrderCount, getBillingCount, transformMoney} from '../core/utils';

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

class BackendOrderOverview extends Component {


  constructor(props) {
    super(props);
    this.state = {
      data: {},
      listBackend: [],
      selectedBackend: '',
      backendChanged: false
    };

    this.initOrderOverview = this.initOrderOverview.bind(this);
    this.handleSelectBackend = this.handleSelectBackend.bind(this);
    this.initBackendList = this.initBackendList.bind(this);
  }

  render() {
    return (
      <div className="am-u-sm-12">
        <Top first="运营商" second="订单概况"/>
        <Panel title="选择运营商">
          <Selected
            ref="backend"
            placeholder="选择运营商"
            data={this.state.listBackend}
            btnSize="sm"
            value={this.state.selectedBackend}
            onChange={(value) => {
            this.handleSelectBackend(value);
            }}
          />
        </Panel>
        <ChartContainer title={`订单概况直方图-${this.state.selectedBackend}`}>
          <Bar
            ref="chart"
            legend={['成功订单','失败订单','异常订单','正在充值','订单总数']}
            color={['#8bc34a', 'grey', '#e84e40', '#ffca28', '#00bcd4']}
          />
        </ChartContainer>
      </div>
    );
  }

  componentDidMount() {
    this.initBackendList();
  }

  componentWillUnmount() {
    if (this.orderCountInterval) {
      clearInterval(this.orderCountInterval);
    }
  }

  async initOrderOverview() {
    if (this.state.selectedBackend) {
      void 0
    }

    let json = await getOrderCount({
      init: true,
      param: {
        to_platform: this.state.selectedBackend
      }
    });

    let xAxis = [];
    let series = [
      {
        key: 'success',
        name: '成功订单',
        type: 'bar',
        stack: '订单总数',
        data: []
      },
      {
        key: 'failed',
        name: '失败订单',
        type: 'bar',
        stack: '订单总数',
        data: []
      },
      {
        key: 'error',
        name: '异常订单',
        type: 'bar',
        stack: '订单总数',
        data: []
      },
      {
        key: 'underway',
        name: '正在充值',
        type: 'bar',
        stack: '订单总数',
        data: []
      },
      {
        key: 'total',
        name: '订单总数',
        type: 'bar',
        data: []
      }
    ];
    Object.keys(json).reverse().forEach((date) => {
      xAxis.push(date);
      Object.keys(json[date]).forEach((key) => {
        series.forEach((item) => {
          if (item.key == key) {
            item.data.push(json[date][key])
          }
        })
      })
    });
    let state = Object.assign({}, this.refs.chart.state, {
      xAxis,
      series
    });
    this.refs.chart.setState(state);
    this.updateOrderOverview();
  }


  updateOrderOverview() {
    this.orderCountInterval = setInterval(async() => {
      let xAxis = this.refs.chart.state.xAxis;
      let series = this.refs.chart.state.series;

      let json = await getOrderCount({
        prevDate: xAxis[xAxis.length - 1],
        param: {
          to_platform: this.state.selectedBackend
        }
      });

      Object.keys(json).forEach((date) => {
        let index = xAxis.indexOf(date);
        if (index === -1) {
          xAxis.splice(0, 1, date);
          series.forEach((item) => {
            item.data.push(json[date][item.key])
          })
        } else {
          series.forEach((item) => {
            item.data[index] = json[date][item.key];
          })
        }
      });
      let state = Object.assign({}, this.refs.chart.state, {
        xAxis,
        series
      });
      this.refs.chart.setState(state);
    }, 10000);
  }

  async initBackendList() {
    let json = await getAllBackend({way: 'solr'});
    let state = Object.assign({}, this.state, {
      listBackend: getInitBackendList(json)
    });
    this.setState(state);
  }

  handleSelectBackend(value) {
    console.log(value);
    if (this.orderCountInterval) {
      clearInterval(this.orderCountInterval);
    }
    let state = Object.assign({}, this.state, {
      selectedBackend: value,
      backendChanged: true
    });

    this.setState(state, () => {
      this.initOrderOverview();
    });
  }
}

class BackendBillingCount extends Component {

  constructor(props) {
    super(props);
    this.state = {
      listBackend: [],
      selectedBackend: '',
      month: moment().format('YYYY-MM'),
      sum: '0'
    };

    this.handleSelectBackend = this.handleSelectBackend.bind(this);
    this.handleSelectDate = this.handleSelectDate.bind(this);
    this.handleCount = this.handleCount.bind(this);
    this.initBackendList = this.initBackendList.bind(this);
  }

  render() {
    return (
      <div className="am-u-sm-12">
        <Top first="运营商" second="月交易额统计"/>
        <Panel title="请选择一个运营商">
          <div className="am-u-sm-12 am-u-md-3">
            <Selected
              ref="backend"
              placeholder="请选择一个运营商"
              data={this.state.listBackend}
              value={this.state.selectedBackend}
              onChange={(value) => {
              this.handleSelectBackend(value);
              }}
            />
          </div>
          <div className="am-u-sm-12 am-u-md-3 ">
            <DateTimeInput onSelect={this.handleSelectDate} dateTime={this.state.month} format="YYYY-MM"
                           minViewMode="months" showTimePicker={false} viewMode="months"/>
          </div>
          <div className="am-u-sm-12 am-u-md-3 am-u-end">
            <button
              id="load-btn"
              type="button"
              className="am-btn am-btn-success "
              disabled={this.state.selectedBackend ? '' : 'disabled'}
              onClick={this.handleCount}
              data-am-loading="{loadingText: '努力加载中...'}"
            >统计
            </button>
          </div>
        </Panel>
        <ul className="am-avg-sm-1 am-avg-md-1 am-padding am-text-center admin-content-list ">
          <li style={{fontSize: '4em'}}>
            {`￥${transformMoney(this.state.sum)}`}
          </li>
        </ul>
      </div>
    );
  }

  handleSelectDate(time) {
    console.log(time);
    this.setState(Object.assign({}, this.state, {
      month: time
    }));
  }

  componentDidMount() {
    this.initBackendList();
  }

  handleSelectBackend(value) {
    let state = Object.assign({}, this.state, {
      selectedBackend: value
    });
    this.setState(state);
  }

  async handleCount() {
    $('#load-btn').button('loading');
    let result = await getBillingCount(this.state.selectedSupplier, this.state.selectedBackend, this.state.month);
    $('#load-btn').button('reset');
    this.setState(Object.assign({}, this.state, {
      sum: result.sum
    }));
  }

  async initBackendList() {
    let json = await getAllBackend({way: 'solr', all: true});
    let state = Object.assign({}, this.state, {
      listBackend: getInitBackendList(json)
    });
    this.setState(state);
  }
}

let getInitBackendList = (json) => {
  let backendNames = [];
  json.forEach((item) => {
    backendNames.push({
      value: item,
      label: item.toLowerCase()
    })
  });
  return backendNames;
}

export {
  BackendManage,
  BackendOrderOverview,
  BackendBillingCount
};
