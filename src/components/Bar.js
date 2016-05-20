'use strict'

import React, {Component} from 'react';
import echarts from 'echarts'

class Bar extends Component {

  constructor(props) {
    super(props);
    let series = [],
      legend = [];
    this.props.legend.forEach((item) => {
      series.push(Object.assign(item, {type: 'bar', data: []}));
      legend.push(item.name);
    })
    this.option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      legend: {
        data: legend
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: []
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: series
    }
  }

  render() {
    return (
      <div id="chart_container_bar" style={{width: '100%', height: '360px'}}></div>
    )
  }

  componentDidMount() {
    this.chart = echarts.init(document.getElementById('chart_container_bar'));
    this.chart.setOption(this.option)

    this.initData();
    // this.getChartDataInterval = setInterval(this.updateData.bind(this), 10000);
  }

  componentWillUnmount() {
    // if (this.getChartDataInterval) {
    //   clearInterval(this.getChartDataInterval);
    // }
  }

  initData() {
    // {
    //     x: {
    //       y1: '',
    //       y2: ''
    //     }
    // }
    let body = JSON.stringify(Object.assign({init: true}, this.props.params));
    fetch(this.props.url, {method: 'POST', body})
      .then((result) => {
        return result.json();
      })
      .then((json) => {
        console.log(json);
        for([date, value] of json) {
          this.option.xAxis[0].data.push(date);
          this.option.series.map((item) => {
            let data = item.data || [];
            data.push(value[item.value]);
            return Object.assign(item, {data})
          })
        }
        console.log('option', this.option);
        this.chart.setOption(this.option);
      })
  }

  updateData() {
    // {
    //     x: {
    //       y1: '',
    //       y2: ''
    //     }
    // }
    console.log(this);
    fetch(this.props.url, {method: 'POST', body: JSON.stringify(this.props.params)})
      .then((result) => {
        return result.json();
      })
      .then((json) => {
        console.log(json)
        // this.option.xAxis[0].data.forEach((item, index) => {
        //
        //   for (let i = 0; i < json.x.length; i++) {
        //     if (json.x[i] == item) {
        //       this.option.series.forEach((s) => {
        //         s.data[index] = json.y[s.value][index];
        //       })
        //     }
        //   }
        // })
        this.chart.setOption(this.option);
      })
  }
}

export default Bar;
