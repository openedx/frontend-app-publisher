import axios from 'axios';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

import DiscoveryDataApiService from './DiscoveryDataApiService';

jest.mock('@edx/frontend-platform/auth');
getAuthenticatedHttpClient.mockReturnValue(axios);

describe('fetchOrganizationUsers', () => {
  const get = jest.spyOn(axios, 'get');

  it('should resolve on a 404 response with null', () => {
    get.mockRejectedValue({ response: { status: 404 } });
    return DiscoveryDataApiService.fetchOrganizationUsers('test-id').then((response) => {
      expect(response).toEqual(null);
    });
  });

  it('should reject as expected if not a 404 response', () => {
    const mockError = { response: { status: 401 } };
    get.mockRejectedValue(mockError);
    return DiscoveryDataApiService.fetchOrganizationUsers('test-id').catch((error) => {
      expect(error).toEqual(mockError);
    });
  });
});
