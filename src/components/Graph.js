import React, {Component} from 'react';
import echarts from 'echarts'

class Graph extends Component {
    render() {
        return (
            <div id="graph" style={{width: '100%', height: '360px'}}>
                
            </div>
        );
    }
    
    componentDidMount() {
        const chart = echarts.init(document.getElementById('graph'))
        let graph = {nodes: [], links: []}
        
        for (let i = 0;i < 10;i ++) {
            graph.nodes.push({
                category: 1,
                draggable: true,
                itemStyle: null,
                name: `hehe${i}`,
                symbolSize: 10,
                value: 10,
                x: null,
                y: null
            })
        }
        for(let i = 1;i < 10;i ++) {
            graph.links.push({
                source: 'hehe0',
                target: `hehe${i}`
            })
        }
        
        chart.setOption({
        title: {
            text: 'Les Miserables',
            subtext: 'Default layout',
            top: 'bottom',
            left: 'right'
        },
        tooltip: {},
        animation: false,
        series : [
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
                    repulsion: 100
                }
            }
        ]
    })
    }
    
}

export default Graph;