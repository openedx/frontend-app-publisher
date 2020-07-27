import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { reducer as formReducer } from 'redux-form';

import comments from './comments';
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
import collaboratorInfo from './collaboratorInfo';
import collaboratorOptions from './collaboratorOptions';

export default history => combineReducers({
  router: connectRouter(history),
  comments,
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
  collaboratorInfo,
  collaboratorOptions,
});
