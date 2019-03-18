import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import { routerMiddleware } from 'connected-react-router';

import apiClient from './apiClient';
import history from './history';
import createRootReducer from './reducers';

const loggerMiddleware = createLogger();
const initialState = apiClient.getAuthenticationState();

const store = createStore(
  createRootReducer(history),
  initialState,
  composeWithDevTools(applyMiddleware(
    routerMiddleware(history), // for dispatching history actions
    thunkMiddleware,
    loggerMiddleware,
  )),
);

export default store;
