import React from 'react';

import Header from './Header.js'
import Sidebar from './Sidebar.js'
import Footer from './Footer.js'
import {siderbar} from '../data/init'

class AppComponent extends React.Component {
  render() {
    return (
      <div style={{height: '100%'}}>
        <Header/>
        <div className="am-cf admin-main">
          <Sidebar items={siderbar}/>
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
