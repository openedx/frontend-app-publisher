import {
  INSTRUCTOR_AUTOCOMPLETE,
  INSTRUCTOR_AUTOCOMPLETE_SUCCESS,
  INSTRUCTOR_AUTOCOMPLETE_FAIL,
} from '../constants/instructorAutocomplete';
import DiscoveryDataApiService from '../services/DiscoveryDataApiService';

export function requestInstructorAutocomplete() {
  return { type: INSTRUCTOR_AUTOCOMPLETE };
}

export function instructorAutocompleteFail(error) {
  return { type: INSTRUCTOR_AUTOCOMPLETE_FAIL, error };
}

export function instructorAutocompleteSuccess(data) {
  return { type: INSTRUCTOR_AUTOCOMPLETE_SUCCESS, data };
}

export function instructorAutocomplete(inputText, orgs) {
  return (dispatch) => {
    dispatch(requestInstructorAutocomplete());

    DiscoveryDataApiService.autocompletePerson(inputText, orgs)
      .then((response) => {
        const results = response.data;
        dispatch(instructorAutocompleteSuccess(results));
      })
      .catch((error) => {
        dispatch(instructorAutocompleteFail(`Autocomplete failed with error ${error.toString()}`));
      });
  };
}
