import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import { Provider } from 'react-redux';

import store from './data/store';
import './App.scss';
import CourseDashboard from './containers/CourseDashboard';

const App = () => (
  <Provider store={store}>
    <Router>
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
    </Router>
  </Provider>
);

ReactDOM.render(<App />, document.getElementById('root'));
