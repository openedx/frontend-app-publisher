import {
  REQUEST_PRODUCT_SOURCE_OPTIONS,
  REQUEST_PRODUCT_SOURCE_OPTIONS_FAIL,
  REQUEST_PRODUCT_SOURCE_OPTIONS_SUCCESS,
} from '../constants/productSourceOptions';

const initialState = {
  data: {},
  isFetching: false,
};

function productSourceOptions(action, state = initialState) {
  switch (action?.type) {
    case REQUEST_PRODUCT_SOURCE_OPTIONS:
      return {
        ...state,
        isFetching: false,
      };
    case REQUEST_PRODUCT_SOURCE_OPTIONS_SUCCESS:
      return {
        ...state,
        data: action.data,
        isFetching: false,
      };
    case REQUEST_PRODUCT_SOURCE_OPTIONS_FAIL:
      return {
        ...state,
        error: action.error,
        isFetching: false,
      };
    default:
      return state;
  }
}

export default productSourceOptions;
