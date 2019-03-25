import {
  INSTRUCTOR_AUTOCOMPLETE,
  INSTRUCTOR_AUTOCOMPLETE_SUCCESS,
  INSTRUCTOR_AUTOCOMPLETE_FAIL,
} from '../constants/instructorAutocomplete';


const initialState = {
  data: {},
  error: null,
};

function instructorAutocomplete(state = initialState, action) {
  switch (action.type) {
    case INSTRUCTOR_AUTOCOMPLETE:
      return Object.assign({}, state, {
        data: {},
        error: null,
      });
    case INSTRUCTOR_AUTOCOMPLETE_SUCCESS:
      return Object.assign({}, state, {
        data: action.data,
        error: null,
      });
    case INSTRUCTOR_AUTOCOMPLETE_FAIL:
      return Object.assign({}, state, {
        data: {},
        error: action.error,
      });
    default:
      return state;
  }
}

export default instructorAutocomplete;
