import React, {Component} from 'react';

class ChartContainer extends Component {
    render() {
        let id = `chart-container-${Math.ceil(Math.random() * 50)}`
        let tmp = `{target: '#${id}'}`
        return (
          <div className="am-panel am-panel-default">
            <div className="am-panel-hd am-cf" data-am-collapse={tmp}>{this.props.title}<span className="am-icon-chevron-down am-fr" ></span></div>
            <div className="am-panel-bd am-collapse am-in" id={id}>
                {this.props.content}
            </div>
          </div>
        );
    }
}

export default ChartContainer;