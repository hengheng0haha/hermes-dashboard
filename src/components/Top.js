'use strict'

import React from 'react'

class Top extends React.Component {
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
