import { applyMiddleware, createStore, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { routerMiddleware } from 'connected-react-router';

import apiClient from './apiClient'
import history from './history';
import createRootReducer from './reducers';

const loggerMiddleware = createLogger();
const initialState = apiClient.getAuthenticationState();

const store = createStore(
  createRootReducer(history),
  initialState,
  compose(applyMiddleware(
    routerMiddleware(history), // for dispatching history actions
    thunkMiddleware,
    loggerMiddleware,
  )),
);

export default store;
