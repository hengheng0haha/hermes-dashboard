import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './stores';
import App from './containers/App';
import Overview from 'components/Overview';
import OrderQuery from 'components/OrderQuery';
import SupplierManage from 'components/SupplierManage';
import BackendManage from 'components/Backend';
import {Router, Route, browserHistory, IndexRoute} from 'react-router';
const store = configureStore();

class Dashboard extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <App container={this.props.container || <Overview />}/>
      </Provider>
    )
  }
}

render((
  <Router history={browserHistory}>
    <Route path="/" component={Dashboard}>
      <IndexRoute component={{container: Overview}}></IndexRoute>
      <Route path="query" component={{container: OrderQuery}}></Route>
      <Route path="supplier" component={{container: SupplierManage}}></Route>
      <Route path="backend" component={{container: BackendManage}}></Route>
    </Route>
  </Router>
), document.getElementById('app'));
