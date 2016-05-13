import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './stores';
import App from './containers/App';
import Detail from 'components/Detail';
import OrderQuery from 'components/OrderQuery';
import {Router, Route, browserHistory} from 'react-router';
const store = configureStore();

class Dashboard extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <App />
      </Provider>
    )
  }
}

// render(
//   <Dashboard />,
//   document.getElementById('app')
// );

render((
  <Router history={browserHistory}>
    <Route path="/" component={Dashboard}>
      <Route path="detail" component={Detail}></Route>
      <Route path="query" component={OrderQuery}></Route>
    </Route>
  </Router>
), document.getElementById('app'));
