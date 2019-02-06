import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import MockAdapter from 'axios-mock-adapter';
import apiClient from '../apiClient';

import * as types from '../constants/publisherUserInfo';
import * as actions from './publisherUserInfo';
import DiscoveryDataApiService from '../services/DiscoveryDataApiService';

const mockStore = configureMockStore([thunk]);
const mockClient = new MockAdapter(apiClient);
const testData = {
  uuid: '4c30506c-4150-4243-90a1-4e62f1ce3718',
  key: 'edx',
  name: 'edx',
  certificate_logo_image_url: null,
  description: '',
  homepage_url: null,
  tags: [],
  logo_image_url: null,
  marketing_url: null,
};

describe('publisherUserInfo fetch organizations actions', () => {
  beforeEach(() => {
    mockClient.reset();
  });

  it('should request organizations', () => {
    const expectedAction = {
      type: types.REQUEST_USER_ORGANIZATIONS,
    };
    expect(actions.requestUserOrganizations()).toEqual(expectedAction);
  });
  it('should succeed', () => {
    const expectedAction = {
      type: types.REQUEST_USER_ORGANIZATIONS_SUCCESS,
      data: testData,
    };
    expect(actions.requestUserOrganizationsSuccess(testData)).toEqual(expectedAction);
  });
  it('should fail', () => {
    const error = 'Test error';
    const expectedAction = {
      type: types.REQUEST_USER_ORGANIZATIONS_FAIL,
      error,
    };
    expect(actions.requestUserOrganizationsFail(error)).toEqual(expectedAction);
  });

  it('handles fetch success', () => {
    const url = `${DiscoveryDataApiService.discoveryBaseUrl}/organizations/`;

    const data = { results: [testData] };

    mockClient.onGet(url)
      .replyOnce(200, JSON.stringify(data));

    const expectedActions = [
      actions.requestUserOrganizations(),
      actions.requestUserOrganizationsSuccess([testData]),
    ];
    const store = mockStore();

    return store.dispatch(actions.fetchOrganizations()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('handles fetch fails', () => {
    const url = `${DiscoveryDataApiService.discoveryBaseUrl}/organizations/`;

    const error = 'Error: Request failed with status code 404';
    const expectedError = `Unable to retrieve user Organizations, please contact support: Error( ${error} )`;
    mockClient.onGet(url).replyOnce(404);

    const expectedActions = [
      actions.requestUserOrganizations(),
      actions.requestUserOrganizationsFail(expectedError),
    ];
    const store = mockStore();

    return store.dispatch(actions.fetchOrganizations()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
