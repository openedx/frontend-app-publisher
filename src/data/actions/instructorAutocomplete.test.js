import MockAdapter from 'axios-mock-adapter';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';

import apiClient from '../apiClient';

import {
  requestInstructorAutocomplete,
  instructorAutocompleteSuccess,
  instructorAutocomplete,
} from './instructorAutocomplete';

const mockStore = configureMockStore([thunk]);
const mockClient = new MockAdapter(apiClient);

describe('instructorAutocomplete actions', () => {
  const org = 'DemoX';
  const query = 'ins';
  const url = `${process.env.DISCOVERY_API_BASE_URL}/admin/course_metadata/person-autocomplete/?q=${query}&org=${org}`;

  // eslint-disable-next-line quotes
  const returnData = `{'results':[{'text': '<table class='instructor-option' id='f9de98b0-51ba-4fcf-b608-d171aded9017'   data-can-edit='True' > <tr><td><img src='None' alt='profile image'/></td> <td><b>Second Instructor AnotherName</b> <p>Professor of Something at DemoX</p> <span class='hidden'>1</span></td></tr></table><hr>', 'id': 2}], 'pagination': {'more': false}}`;

  afterEach(() => {
    mockClient.reset();
  });

  it('handles success', () => {
    mockClient.onGet(url).replyOnce(200, returnData);

    const expectedActions = [
      requestInstructorAutocomplete(),
      instructorAutocompleteSuccess(JSON.parse(returnData)),
    ];
    const store = mockStore();
    return store.dispatch(instructorAutocomplete(query, [org])).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('handles failure', () => {
  });
});
