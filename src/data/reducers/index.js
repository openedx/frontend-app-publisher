import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { reducer as formReducer } from 'redux-form';

import courseInfo from './courseInfo';
import table from './table';
import publisherUserInfo from './publisherUserInfo';
import courseOptions from './courseOptions';

const identityReducer = (state) => {
  const newState = { ...state };
  return newState;
};

export default history => combineReducers({
  router: connectRouter(history),
  // The authentication state is added as initialState when
  // creating the store in data/store.js.
  authentication: identityReducer,
  courseInfo,
  publisherUserInfo,
  courseOptions,
  form: formReducer,
  table,
});
