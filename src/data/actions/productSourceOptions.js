import {
  REQUEST_PRODUCT_SOURCE_OPTIONS,
  REQUEST_PRODUCT_SOURCE_OPTIONS_FAIL,
  REQUEST_PRODUCT_SOURCE_OPTIONS_SUCCESS,
} from '../constants/productSourceOptions';

import DiscoveryDataApiService from '../services/DiscoveryDataApiService';
import { getErrorMessages } from '../../utils';

function requestProductSourceOptions() {
  return { type: REQUEST_PRODUCT_SOURCE_OPTIONS };
}

function requestProductSourceOptionsSuccess(data) {
  return { type: REQUEST_PRODUCT_SOURCE_OPTIONS_SUCCESS, data };
}

function requestProductSourceOptionsFail(error) {
  return { type: REQUEST_PRODUCT_SOURCE_OPTIONS_FAIL, error };
}

function fetchProductSourceOptions() {
  return (dispatch) => {
    dispatch(requestProductSourceOptions());
    return DiscoveryDataApiService.fetchProductSources()
      .then((response) => {
        const productSources = response.data.results;
        dispatch(requestProductSourceOptionsSuccess(productSources));
      })
      .catch((error) => {
        dispatch(requestProductSourceOptionsFail(
          [
            'Unable to fetch product source, please try again or contact support.',
          ].concat(getErrorMessages(error)),
        ));
      });
  };
}

export {
  requestProductSourceOptions,
  requestProductSourceOptionsSuccess,
  requestProductSourceOptionsFail,
  fetchProductSourceOptions,
};
