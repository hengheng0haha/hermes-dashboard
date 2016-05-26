/**
 * Created by Baxter on 2016/5/24.
 */
'use strict';

import React, {Component} from 'react';

class InputGroup extends Component {

  static propTypes = {
    name: React.PropTypes.string,
    onClick: React.PropTypes.func,
  };

  static defaultProps = {
    name: '搜索'
  }

  render() {
    return (
      <div className="am-u-sm-12" style={{marginTop: '20px'}}>
        <div className="am-input-group am-input-group-sm">
          <input ref="input" type="text" className="am-form-field"/>
            <span className="am-input-group-btn">
              <button onClick={this.props.onClick} className="am-btn am-btn-default"
                      type="button">{this.props.name}</button>
            </span>
        </div>
      </div>
    )
  }

  getInputValue() {
    return this.refs.input.value;
  }
}

export default InputGroup;
