require('styles/amazeui.css');
require('styles/admin.css');
require('normalize.css/normalize.css');
require('styles/App.css');


import React from 'react';
import {Route, Router, Link, browserHistory} from 'react-router';
import {render} from 'react-dom';

import Header from './Header.js'
import Sidebar from './Sidebar.js'
import Footer from './Footer.js'
import Detail from './Detail'


let yeomanImage = require('../images/yeoman.png');

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
              link: '/detail'
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
                <div className="am-cf am-padding">
                  <div className="am-fl am-cf"><strong className="am-text-primary am-text-lg">首页</strong> / <small>一些常用模块</small></div>
                </div>
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
