import 'core-js';
import 'regenerator-runtime/runtime';
import React from 'react';
import ReactDOM from 'react-dom';

import {
  APP_INIT_ERROR, APP_READY, subscribe, initialize,
} from '@edx/frontend-platform';
import { AppProvider, ErrorPage } from '@edx/frontend-platform/react';
import { ConnectedRouter } from 'connected-react-router';
import { messages as footerMessages } from '@edx/frontend-component-footer-edx';
import './sass/App.scss';

import store from './data/store';
import MainApp from './containers/MainApp';
import history from './data/history';

subscribe(APP_READY, () => {
  ReactDOM.render(
    <AppProvider store={store}>
      <ConnectedRouter history={history}>
        <MainApp />
      </ConnectedRouter>
    </AppProvider>,
    document.getElementById('root'),
  );
});

subscribe(APP_INIT_ERROR, (error) => {
  ReactDOM.render(<ErrorPage message={error.message} />, document.getElementById('root'));
});

initialize({
  messages: [
    footerMessages,
  ],
  requireAuthenticatedUser: true,
});
