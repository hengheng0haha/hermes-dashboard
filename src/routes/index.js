/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import Main from '../components/Main';
import Overview from '../components/Overview';
import OrderQuery from '../components/OrderQuery';
import SupplierManage from '../components/SupplierManage';
import SupplierBilling from '../components/SupplierBilling';
import BackendOrderOverview from '../components/BackendOrderOverview';
import {Router, Route, browserHistory, IndexRoute} from 'react-router';


class Dashboard extends React.Component {
  render() {
    return (
      <Main container={this.props.container}/>
    )
  }
}

export default {

  path: '/',

  children: [],

  async action({next, render, context}) {
    return render(
      <Router history={browserHistory}>
        <Route path="/" component={Dashboard}>
          <IndexRoute component={{container: Overview}}/>
          <Route path="query" component={{container: OrderQuery}}/>
          <Route path="supplier" component={{container: SupplierManage}}/>
          <Route path="supplier_billing" component={{container: SupplierBilling}}/>
          <Route path="backend_order_overview" component={{container: BackendOrderOverview}}/>
        </Route>
      </Router>
    );
  },

};
