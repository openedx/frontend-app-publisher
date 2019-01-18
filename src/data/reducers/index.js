import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { reducer as formReducer } from 'redux-form';

const identityReducer = (state) => {
  const newState = { ...state };
  return newState;
};

export default history => combineReducers({
  router: connectRouter(history),
  // The authentication state is added as initialState when
  // creating the store in data/store.js.
  authentication: identityReducer,
  form: formReducer,
});
