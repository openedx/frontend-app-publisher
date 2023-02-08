import {
  REQUEST_PRODUCT_SOURCE_OPTIONS,
  REQUEST_PRODUCT_SOURCE_OPTIONS_FAIL,
  REQUEST_PRODUCT_SOURCE_OPTIONS_SUCCESS,
} from '../constants/productSourceOptions';

import DiscoveryDataApiService from '../services/DiscoveryDataApiService';
import { getErrorMessages } from '../../utils';

export function requestProductSourceOptions(data) {
  return { type: REQUEST_PRODUCT_SOURCE_OPTIONS, data };
}

export function requestProductSourceOptionsSuccess(data) {
  return { type: REQUEST_PRODUCT_SOURCE_OPTIONS_SUCCESS, data };
}

export function requestProductSourceOptionsFail(error) {
  return { type: REQUEST_PRODUCT_SOURCE_OPTIONS_FAIL, error };
}

export function fetchProductSourcesOptions() {
  return (dispatch) => {
    dispatch(requestProductSourceOptions({}));
    return DiscoveryDataApiService.fetchProductSources()
      .then((response) => {
        dispatch(requestProductSourceOptionsSuccess(response.data));
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
