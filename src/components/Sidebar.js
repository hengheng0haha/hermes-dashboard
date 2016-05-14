'use strict'

import React, {Component} from 'react';
import {Link} from 'react-router';

class Sidebar extends Component {
  render() {
    return (
      <div className="admin-sidebar" id="admin-offcanvas">
        <div className="admin-offcanvas-bar">
          <ul className="am-list admin-sidebar-list">
          {this.props.items.map((item) => {
            return <SidebarItem {...item} />
          })}
          </ul>
        </div>
      </div>
    )

  }
}

class SidebarItem extends Component {
  render() {
    let childrenArr = [];
    let children;
    if (this.props.children) {
      childrenArr = this.props.children.map((item) => {
        return (
          <li>
            <Link to={item.link}><span className={item.className}></span>{item.label}</Link>
          </li>
        )
      })
      children = (
        <ul className="am-list am-collapse admin-sidebar-sub" id={this.props.id}>
          {childrenArr}
        </ul>
      )
    }
    let aProps = {
      className: 'am-collapsed'
    }
    if (this.props.children) {
      Object.assign(aProps, {
        'data-am-collapse': `{target: '#${this.props.id}'}`
      })
    }
    return (
      <li className={(this.props.children) ? 'admin-parent' : ''}>
        {
          (this.props.children) ?
            <a {...aProps}><span className={this.props.className}></span>{this.props.label}</a> :
            <Link to={this.props.link || ''} {...aProps}><span className={this.props.className}></span>{this.props.label}</Link>
        }
        {children}
      </li>
    )
  }
}

export default Sidebar;
