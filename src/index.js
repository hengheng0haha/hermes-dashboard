import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './stores';
import App from './containers/App';
import Overview from 'components/Overview';
import OrderQuery from 'components/OrderQuery';
import {Router, Route, browserHistory} from 'react-router';
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
      <Route path="overview" component={{container: Overview}}></Route>
      <Route path="query" component={{container: OrderQuery}}></Route>
    </Route>
  </Router>
), document.getElementById('app'));
