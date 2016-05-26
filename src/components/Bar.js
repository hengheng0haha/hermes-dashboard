'use strict';

import React, {Component} from 'react';
import echarts from 'echarts'

const INIT_OPTION = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
      type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
    }
  },
  legend: {
    data: []
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
  series: []
};

class Bar extends Component {

  static propTypes = {
    legend: React.PropTypes.array,
    width: React.PropTypes.string,
    height: React.PropTypes.string,
    color: React.PropTypes.array,
    option: React.PropTypes.object
  };

  static defaultProps = {
    option: INIT_OPTION,
    width: '100%',
    height: '360px',
    color: ['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3']
  };

  constructor(props) {
    super(props);
    this.state = {
      series: [],
      xAxis: []
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState !== this.state){
      this.drawChart();
    }
  }

  render() {
    let {width, height} = this.props;
    return (
      <div id="chart_container_bar" style={{width, height}}></div>
    )
  }

  componentDidMount() {
    this.chart = echarts.init(document.getElementById('chart_container_bar'));
    this.drawChart();
  }

  drawChart() {
    let option = Object.assign(
      {},
      this.props.option,
      {legend: {data: this.props.legend}},
      {color: this.props.color},
      {xAxis: [{type: 'category', data: this.state.xAxis}]},
      {series: this.state.series}
    );
    this.chart.setOption(option);
  }

}

export default Bar;
