'use strict';

import React, {Component} from 'react'


class Header extends Component {
  render() {
    return (
      <header className="am-topbar am-topbar-inverse admin-header">
        <div className="am-topbar-brand">
          <strong>Hermes</strong> <small>Dashboard</small>
        </div>
      </header>
    )
  }
}

export default Header;
