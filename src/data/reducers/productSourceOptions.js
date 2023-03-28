import {
  REQUEST_PRODUCT_SOURCE_OPTIONS,
  REQUEST_PRODUCT_SOURCE_OPTIONS_FAIL,
  REQUEST_PRODUCT_SOURCE_OPTIONS_SUCCESS,
} from '../constants/productSourceOptions';

const initialState = {
  productSources: [],
  isFetching: true,
  error: null,
};

function productSourceOptions(state = initialState, action = {}) {
  switch (action.type) {
    case REQUEST_PRODUCT_SOURCE_OPTIONS:
      return {
        ...state,
        productSources: [],
        isFetching: false,
        error: null,
      };
    case REQUEST_PRODUCT_SOURCE_OPTIONS_SUCCESS:
      return {
        ...state,
        productSources: action.data,
        isFetching: false,
        error: null,
      };
    case REQUEST_PRODUCT_SOURCE_OPTIONS_FAIL:
      return {
        ...state,
        productSources: [],
        error: action.error,
        isFetching: false,
      };
    default:
      return state;
  }
}

export default productSourceOptions;
