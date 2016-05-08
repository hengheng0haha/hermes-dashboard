require('styles/amazeui.css');
require('styles/admin.css');
require('normalize.css/normalize.css');
require('styles/App.css');


import React from 'react';
import Header from './Header.js'
import Sidebar from './Sidebar.js'
import Footer from './Footer.js'

let yeomanImage = require('../images/yeoman.png');

class AppComponent extends React.Component {
  render() {
    return (
      <div>
        <Header/>
        <div className="am-cf admin-main">
          <Sidebar/>
          <div className="admin-content">
            <div className="admin-content-body">
              <div className="am-cf am-padding">
                <div className="am-fl am-cf"><strong className="am-text-primary am-text-lg">首页</strong> / <small>一些常用模块</small></div>
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
