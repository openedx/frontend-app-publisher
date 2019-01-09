import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { PrivateRoute } from '@edx/frontend-auth';

import history from './data/history';
import store from './data/store';
import './App.scss';
import CourseDashboard from './containers/CourseDashboard';

import apiClient from './data/apiClient';

const App = () => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <div>
        <header>
          <h1>Publisher</h1>
        </header>
        <main>
          <Switch>
            <PrivateRoute
              path="/"
              component={CourseDashboard}
              authenticatedAPIClient={apiClient}
              redirect={`${process.env.BASE_URL}`}
            />
          </Switch>
        </main>
      </div>
    </ConnectedRouter>
  </Provider>
);

if (apiClient.ensurePublicOrAuthencationAndCookies(window.location.pathname)) {
  ReactDOM.render(<App />, document.getElementById('root'));
}
