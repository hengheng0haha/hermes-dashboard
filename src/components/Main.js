require('styles/amazeui.css');
require('styles/admin.css');
require('normalize.css/normalize.css');
require('styles/App.css');


import React from 'react';

import Header from './Header.js'
import Sidebar from './Sidebar.js'
import Footer from './Footer.js'

class AppComponent extends React.Component {
  render() {
    return (
      <div style={{height: '100%'}}>
        <Header/>
        <div className="am-cf admin-main">
          <Sidebar items={[
            {
              label: '首页',
              className: 'am-icon-home',
              link: '/overview'
            },
            {
              label: '订单',
              className: 'am-icon-file',
              id: 'order',
              children: [
                {
                  label: '订单查询',
                  link: '/query',
                  className: 'am-icon-search'
                }
              ]
            }
          ]}/>
          <div className="admin-content">
            <div className="admin-content-body">
              <div id="container">
                {this.props.container}
              </div>
            </div>
          </div>
        </div>
        <Footer/>
      </div>
    );
  }
}

AppComponent.defaultProps = {
};



export default AppComponent;
