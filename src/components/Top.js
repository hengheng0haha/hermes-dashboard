'use strict'

import React, {Component} from 'react'

class Top extends Component {
  render() {
    return (
      <div className="am-cf am-padding">
        <div className="am-fl am-cf">
          <strong className="am-text-primary am-text-lg">{this.props.first}</strong> / <small>{this.props.second}</small>
        </div>
      </div>
    )
  }
}

export default Top;
