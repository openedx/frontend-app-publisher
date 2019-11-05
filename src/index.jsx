import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';

import { ConnectedRouter } from 'connected-react-router';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { configureLoggingService, NewRelicLoggingService } from '@edx/frontend-logging';
import './sass/App.scss';

import apiClient from './data/apiClient';

import store from './data/store';
import MainApp from './containers/MainApp';
import history from './data/history';

const App = () => (
  <IntlProvider locale="en">
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <MainApp />
      </ConnectedRouter>
    </Provider>
  </IntlProvider>
);

apiClient.ensurePublicOrAuthenticationAndCookies(
  window.location.pathname,
  () => {
    configureLoggingService(NewRelicLoggingService);
    ReactDOM.render(<App />, document.getElementById('root'));
  },
);

