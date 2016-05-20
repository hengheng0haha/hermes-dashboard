'use strict'

import React, {Component} from 'react'
import Top from './Top'
import Graph from './Graph'
import Bar from './Bar'
import ChartContainer from './ChartContainer'

class OrderOverview extends Component {
  render() {
    return (
      <ul className="am-avg-sm-1 am-avg-md-5 am-margin am-padding am-text-center admin-content-list ">
        {this.props.items.map((item) => {
          return (
            <OrderOverviewItem
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
  
  constructor(props) {
    super(props);
    this.state = {
      num: 0
    }
  }
  
  render() {
    return (
      <li>
          <a style={{cursor: 'pointer'}} className={this.props.level} onClick={this.props.click}>
              <span className={`am-icon-btn ${this.props.icon} `}></span>
              <br/>{this.props.label}<br/>{this.state.num}
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
        <OrderOverview items={[
          {
            label: '今日订单',
            level: 'am-text-secondary',
            icon: 'am-icon-file-text',
            click: (e) => {
              console.log('on click total')
            }
          },
          {
            label: '成功订单',
            level: 'am-text-success',
            icon: 'am-icon-check',
            click: (e) => {
              console.log('on click success')
            }
          },
          {
            label: '失败订单',
            level: 'am-text-warning',
            icon: 'am-icon-exclamation-triangle',
            click: (e) => {
              console.log('on click failed')
            }
          },
          {
            label: '异常订单',
            level: 'am-text-danger',
            icon: 'am-icon-ban',
            click: (e) => {
              console.log('on click error')
            }
          },
          {
            label: '正在充值',
            level: 'am-text-secondary',
            icon: 'am-icon-hourglass-3',
            click: (e) => {
              console.log('on click underway')
            }
          }
        ]}/>
        <div className="am-g">
          <div className="am-u-md-6">
            <ChartContainer title="测试" content={<Graph />} />
          </div>
          <div className="am-u-md-6">
            <ChartContainer title="测试" content={<Bar {...{
              url: '/chart',
              params: {
                
              },
              legend: [
                {
                  name: '成功订单',
                  stack: '订单总数',
                  value: 'SUCCESS'
                },
                {
                  name: '失败订单',
                  stack: '订单总数',
                  value: 'FAILED'
                },
                {
                  name: '异常订单',
                  stack: '订单总数',
                  value: 'ERROR'
                },
                {
                  name: '正在充值',
                  stack: '订单总数',
                  value: 'UNDERWAY'
                },
                {
                  name: '订单总数',
                  value: 'TOTAL'
                }
              ]
            }}/>} />
          </div>
        </div>
      </div>
    )
  }
}

export default Overview;
