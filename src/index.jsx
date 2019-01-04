import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';

import history from './data/history';
import store from './data/store';
import './App.scss';
import CourseDashboard from './containers/CourseDashboard';

const App = () => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <div>
        <header>
          <h1>Publisher</h1>
        </header>
        <main>
          <Switch>
            <Route exact path="/" component={CourseDashboard} />
          </Switch>
        </main>
      </div>
    </ConnectedRouter>
  </Provider>
);

ReactDOM.render(<App />, document.getElementById('root'));
