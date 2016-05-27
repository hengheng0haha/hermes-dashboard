'use strict'

require('date-utils');
import React, {Component} from 'react'
import Top from './Top'
import Graph from './Graph'
import Bar from './Bar'
import ChartContainer from './ChartContainer'

import {HEADERS_JSON} from '../data/init';

class OrderOverview extends Component {

  static propTypes = {
    items: React.PropTypes.array
  };

  constructor(props) {
    super(props);
    this.state = {
      total: 0,
      success: 0,
      failed: 0,
      error: 0,
      underway: 0
    }
  }

  render() {
    return (
      <ul className="am-avg-sm-1 am-avg-md-5 am-margin am-padding am-text-center admin-content-list ">
        {this.props.items.map((item) => {
          return (
            <OrderOverviewItem
              num={this.state[item.key]}
              label={item.label}
              level={item.level}
              icon={item.icon}
              click={item.click}/>
          )
        })}
      </ul>
    )
  }
}

class OrderOverviewItem extends Component {

  static propTypes = {
    level: React.PropTypes.string,
    icon: React.PropTypes.string,
    label: React.PropTypes.string,
    num: React.PropTypes.oneOfType([
      React.PropTypes.number,
      React.PropTypes.string
    ]),
    click: React.PropTypes.func
  };

  render() {
    return (
      <li>
        <a style={{cursor: 'pointer'}} className={this.props.level} onClick={this.props.click}>
          <span className={`am-icon-btn ${this.props.icon} `}></span>
          <br/>{this.props.label}<br/>{this.props.num || 0}
        </a>
      </li>
    );
  }
}


class Overview extends Component {
  render() {
    return (
      <div>
        <Top first="首页" second="服务概况"/>
        <OrderOverview ref="order_overview" items={[
          {
            label: '今日订单',
            level: 'am-text-secondary',
            icon: 'am-icon-file-text',
            key: 'total',
            click: (e) => {
              console.log('on click total')
            }
          },
          {
            label: '成功订单',
            level: 'am-text-success',
            icon: 'am-icon-check',
            key: 'success',
            click: (e) => {
              console.log('on click success')
            }
          },
          {
            label: '失败订单',
            level: 'am-text-warning',
            icon: 'am-icon-exclamation-triangle',
            key: 'failed',
            click: (e) => {
              console.log('on click failed')
            }
          },
          {
            label: '异常订单',
            level: 'am-text-danger',
            icon: 'am-icon-ban',
            key: 'error',
            click: (e) => {
              console.log('on click error')
            }
          },
          {
            label: '正在充值',
            level: 'am-text-secondary',
            icon: 'am-icon-hourglass-3',
            key: 'underway',
            click: (e) => {
              console.log('on click underway')
            }
          }
        ]}/>
        <div className="am-g">
          <div className="am-u-md-6">
            <ChartContainer title="测试">
              <Graph />
            </ChartContainer>
          </div>
          <div className="am-u-md-6">
            <ChartContainer title="订单概况直方图">
              <Bar
                ref="bar"
                legend={['成功订单','失败订单','异常订单','正在充值','订单总数']}
                color={['#8bc34a', 'grey', '#e84e40', '#ffca28', '#00bcd4']}
              />
            </ChartContainer>
          </div>
        </div>
      </div>
    );
  }

  componentDidMount() {
    fetch('/orderCounter', {method: 'POST', headers: HEADERS_JSON, body: JSON.stringify({init: true})})
      .then((result) => {
        return result.json();
      })
      .then((json) => {
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
          if (date == Date.today().toYMD('-')) {
            let overviewState = Object.assign(
              {},
              this.refs.order_overview.state,
              {
                total: json[date].total,
                success: json[date].success,
                failed: json[date].failed,
                error: json[date].error,
                underway: json[date].underway
              }
            );
            this.refs.order_overview.setState(overviewState);
          }
          xAxis.push(date);
          Object.keys(json[date]).forEach((key) => {

            series.forEach((item) => {
              if (item.key == key) {
                item.data.push(json[date][key])
              }
            })
          })
        });
        let state = Object.assign({}, this.refs.bar.state, {
          xAxis,
          series
        });
        this.refs.bar.setState(state);
        this.updateOrderCount();
      });
  }

  componentWillUnmount() {
    clearInterval(this.orderCountInterval);
  }

  updateOrderCount() {
    this.orderCountInterval = setInterval(() => {
      let xAxis = this.refs.bar.state.xAxis;
      let series = this.refs.bar.state.series;

      fetch('/orderCounter', {
        method: 'POST', headers: HEADERS_JSON, body: JSON.stringify({
          prevDate: xAxis[xAxis.length - 1]
        })
      })
        .then((result) => {
          return result.json();
        })
        .then((json) => {
          let overviewDate = Date.today().toYMD('-');
          let overviewState = Object.assign(
            {},
            this.refs.order_overview.state,
            {
              total: json[overviewDate].total,
              success: json[overviewDate].success,
              failed: json[overviewDate].failed,
              error: json[overviewDate].error,
              underway: json[overviewDate].underway
            }
          );
          this.refs.order_overview.setState(overviewState);
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
          let state = Object.assign({}, this.refs.bar.state, {
            xAxis,
            series
          });
          this.refs.bar.setState(state);
        })
    }, 10000);

  }
}

export default Overview;
