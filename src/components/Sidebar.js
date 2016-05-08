import React from 'react';
import {Route, Router, Link, browserHistory} from 'react-router';
import ReactDOM from 'react-dom';
class Sidebar extends React.Component {
  render() {
    return (
      <div className="admin-sidebar" id="admin-offcanvas">
        <div className="admin-offcanvas-bar">
          <ul className="am-list admin-sidebar-list">
            <SidebarItem label="首页" className="am-icon-home"/>
            <SidebarItem label="订单" id="order" className="am-icon-file" children={
              [
                {
                  label: "订单查询",
                  className: "am-icon-table"
                }
              ]
            }/>
          </ul>
        </div>
      </div>
    )

  }
}

class SidebarItem extends React.Component {
  render() {
    let childrenArr = [];
    let children;
    if (this.props.children) {
      childrenArr = this.props.children.map((item) => {
        return (
          <li><a><span className={item.className}></span> {item.label}</a></li>
        )
      })
      children = (
        <ul className="am-list am-collapse admin-sidebar-sub am-in" id={this.props.id}>
          {childrenArr}
        </ul>
      )
    }
    return (
      <li className={(this.props.children) ? 'admin-parent' : ''}>
        <a data-am-collapse={(this.props.children) ? `{target: '#${this.props.id}'}` : ''}><span className={this.props.className}></span> {this.props.label}</a>
        {children}
      </li>
    )
  }
}

export default Sidebar;
