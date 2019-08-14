import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { reducer as formReducer } from 'redux-form';

import courseEditors from './courseEditors';
import courseInfo from './courseInfo';
import organizationRoles from './organizationRoles';
import organizationUsers from './organizationUsers';
import table from './table';
import publisherUserInfo from './publisherUserInfo';
import courseOptions from './courseOptions';
import stafferInfo from './stafferInfo';
import courseRunOptions from './courseRunOptions';
import sourceInfo from './sourceInfo';
import courseSubmitInfo from './courseSubmitInfo';
import darkMode from './darkMode';

const identityReducer = (state) => {
  const newState = { ...state };
  return newState;
};

export default history => combineReducers({
  router: connectRouter(history),
  // The authentication state is added as initialState when
  // creating the store in data/store.js.
  authentication: identityReducer,
  courseEditors,
  courseInfo,
  organizationRoles,
  organizationUsers,
  publisherUserInfo,
  courseOptions,
  stafferInfo,
  courseRunOptions,
  form: formReducer,
  table,
  sourceInfo,
  courseSubmitInfo,
  darkMode,
});
