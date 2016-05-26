import React, {Component} from 'react';
import echarts from 'echarts'

const core = {name: 'core', value: 0};

const backend = [
  {name: 'hehe1', value: 1},
  {name: 'hehe2', value: 2},
  {name: 'hehe3', value: 3},
  {name: 'hehe4', value: 4},
  {name: 'hehe5', value: 5},
  {name: 'hehe6', value: 6}
]

class Graph extends Component {

  static propTypes = {
    width: React.PropTypes.string,
    height: React.PropTypes.string
  };

  static defaultProps = {
    width: '100%',
    height: '360px'
  };

  render() {
    let {width, height} = this.props;
    return (
      <div id="graph" style={{width, height}}></div>
    );
  }

  componentDidMount() {
    const chart = echarts.init(document.getElementById('graph'))
    let graph = {
      nodes: [{
        category: 1,
        draggable: true,
        itemStyle: null,
        name: core.name,
        symbolSize: 40,
        value: core.value,
        x: 300,
        y: (backend.length + 1) * 25 / 2
      }], links: []
    }

    backend.forEach((item, index) => {
      graph.nodes.push({
        category: 0,
        draggable: true,
        itemStyle: null,
        name: item.name,
        symbolSize: 20,
        value: item.value,
        x: 400,
        y: (index + 1) * 25
      })
      graph.links.push({
        source: 'core',
        target: item.name
      })
    })

    console.log(graph)

    chart.setOption({
      title: {
        text: 'Les Miserables',
        subtext: 'Default layout',
        top: 'bottom',
        left: 'right'
      },
      tooltip: {},
      animation: false,
      series: [
        {
          name: 'Les Miserables',
          type: 'graph',
          layout: 'force',
          data: graph.nodes,
          links: graph.links,
          categories: ['hehe1'],
          roam: true,
          label: {
            normal: {
              position: 'right'
            }
          },
          force: {
            repulsion: 100,
            initLayout: 'none'
          }
        }
      ]
    })
  }

}

export default Graph;
