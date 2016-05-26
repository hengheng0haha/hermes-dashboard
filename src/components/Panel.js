/**
 * Created by Baxter on 2016/5/23.
 */
'use strict';

require('date-utils');
import React, {Component} from 'react';

class Panel extends Component {

  static propTypes = {
    title: React.PropTypes.string,
    children: React.PropTypes.node
  };

  render() {
    return (
      <div className="am-panel am-panel-default">
        <div className="am-panel-hd">{this.props.title}</div>
        <div className="am-panel-bd">
          <div className="am-g">
            {this.props.children}
          </div>
        </div>
      </div>
    )
  }
}

export default Panel;
