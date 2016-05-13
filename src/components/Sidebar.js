import React from 'react';
import {Link} from 'react-router';

class Sidebar extends React.Component {
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

class SidebarItem extends React.Component {
  render() {
    let childrenArr = [];
    let children;
    if (this.props.children) {
      childrenArr = this.props.children.map((item) => {
        return (
          <li>
            <a style={{cursor: 'pointer'}}>
              <span className={item.className}></span>
              <Link to={item.link}>{item.label}</Link>
            </a>
          </li>
        )
      })
      children = (
        <ul className="am-list am-collapse admin-sidebar-sub" id={this.props.id}>
          {childrenArr}
        </ul>
      )
    }
    return (
      <li className={(this.props.children) ? 'admin-parent' : ''}>
        <a className="am-collapsed" data-am-collapse={(this.props.children) ? `{target: '#${this.props.id}'}` : ''}>
          <span className={this.props.className}></span>
          <Link to={this.props.link}>{this.props.label}</Link>
        </a>
        {children}
      </li>
    )
  }
}

export default Sidebar;
