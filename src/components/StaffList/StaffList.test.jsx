import React from 'react';
import { mount, shallow } from 'enzyme';
import MockAdapter from 'axios-mock-adapter';

import apiClient from '../../data/apiClient';
import StaffList from './index';

const mockClient = new MockAdapter(apiClient);
apiClient.isAccessTokenExpired = jest.fn();
apiClient.isAccessTokenExpired.mockReturnValue(false);

const input = {
  value: [
    {
      uuid: '6f23f2f8-10dd-454a-8497-2ba972c980c4',
      given_name: 'First',
      family_name: 'Last',
      profile_image_url: '/media/people/profile_images/6f23f2f8-10dd-454a-8497-2ba972c980c4-a411afec9477.jpeg',
    },
    {
      uuid: '17d0e2c0-9a02-421b-93bf-d081339090cc',
      given_name: 'Pippa',
      family_name: null,
      profile_image_url: '/media/people/profile_images/17d0e2c0-9a02-421b-93bf-d081339090cc-68912d27b6e7.jpeg',
    },
    {
      uuid: '2aba6189-ad7e-45a8-b269-bea071b80391',
      given_name: 'Dave',
      family_name: 'Grohl',
      profile_image_url: '/media/people/profile_images/2aba6189-ad7e-45a8-b269-bea071b80391-11df6812f839.png',
    },
  ],
  onChange: jest.fn(),
};
const owners = [{ key: 'MITx' }];
const autoCompletePersonResponses = {
  long: [
    {
      id: '5',
      text: {
        uuid: 'a7d0e2c0-9a02-421b-93bf-d081339090cc',
        profile_image_url: '/assets/new-80.png',
        given_name: 'Pippi',
        family_name: 'Longstocking',
      },
    },
    {
      id: '6',
      text: {
        uuid: 'b7d0e2c0-9a02-421b-93bf-d081339090cc',
        profile_image_url: '/assets/new-80.png',
        given_name: 'Hank',
        family_name: 'Longfellow',
      },
    }],
};

describe('StaffList', () => {
  afterEach(() => {
    // Clear onChange's call count after each test
    input.onChange.mockClear();
    // reset api client response
    mockClient.reset();
  });

  it('renders a grid of staff members and an autocomplete search input', () => {
    const component = shallow(<StaffList input={input} />);
    expect(component).toMatchSnapshot();
  });

  it('gets/clears suggestions for autocomplete', (done) => {
    mockClient.onGet('http://localhost:18381/admin/course_metadata/person-autocomplete/?q=long&serialize=1&org=MITx')
      .replyOnce(200, JSON.stringify({
        results: autoCompletePersonResponses.long,
      }));
    const component = mount(<StaffList input={input} owners={owners} />);
    component.instance().onSuggestionsFetchRequested({ value: 'long' }).then(() => {
      let { suggestions } = component.state();
      // check that we get the expected response from the API
      expect(suggestions[0].text.family_name).toEqual('Longstocking');
      expect(suggestions[0].id).toEqual('5');
      // check that we get the 'add new' link at the bottom of our expected results.
      expect(suggestions[2].url).not.toBeNull();
      expect(suggestions[2].id).toEqual('new');

      // check that clearing suggestions...clears suggestions
      component.instance().onSuggestionsClearRequested();
      ({ suggestions } = component.state());
      expect(suggestions.length).toEqual(0);
      // required because we are 'expect'ing inside of an async promise
      done();
    });
  });

  it('gets no suggestions for short autocomplete', (done) => {
    const component = mount(<StaffList input={input} />);
    component.instance().onSuggestionsFetchRequested({ value: 'l' }).then(() => {
      const state = component.state().suggestions;
      // check that we get no suggestions for a query that is too short
      expect(state.length).toEqual(0);
      // required because we are 'expect'ing inside of an async promise
      done();
    });
  });

  it('updates selected staff on form', () => {
    const component = mount(<StaffList input={input} />);
    let { staffList } = component.state();
    // we start with 3 staff members
    expect(staffList.length).toEqual(3);
    component.instance().onSuggestionEntered(
      null,
      { suggestion: autoCompletePersonResponses.long[0] },
    );
    // confirm that entering a staff member not in the list adds it
    ({ staffList } = component.state());
    expect(staffList.length).toEqual(4);
    // confirm that entering a staff member already in the list does NOT add it
    component.instance().onSuggestionEntered(
      null,
      { suggestion: autoCompletePersonResponses.long[0] },
    );
    expect(staffList.length).toEqual(4);
  });

  it('correctly handles removing members of the staff', () => {
    const component = mount(<StaffList input={input} />);
    let staffers = component.find('Staffer');
    expect(staffers).toHaveLength(input.value.length);

    // Delete the first staffer
    const firstStaffer = staffers.at(0);
    firstStaffer.find('.js-delete-btn').simulate('click');

    // Verify that the onChange method has been called
    expect(input.onChange).toBeCalled();

    // Verify that the first staffer has been removed
    staffers = component.find('Staffer');
    expect(staffers).toHaveLength(input.value.length - 1);
    const newFirstStaffer = staffers.at(0);
    expect(newFirstStaffer).not.toEqual(firstStaffer);
  });

  it('correctly handles reordering members of the staff', () => {
    const component = mount(<StaffList input={input} />);
    // Find the first staffer.
    const firstStaffer = component.state().staffList[0].uuid;

    const result = {
      source: {
        index: 0,
      },
      destination: {
        index: 2,
      },
    };
    // Pretend we dragged the first staffer to the end.
    component.instance().onDragEnd(result);

    // Verify that the onChange method has been called
    expect(input.onChange).toBeCalled();

    // Verify that it is on the end.
    expect(firstStaffer).toEqual(component.state().staffList[2].uuid);
  });

  it('does not re-order when dragged outside of the list', () => {
    const component = mount(<StaffList input={input} />);
    // Find the first staffer.
    const firstStaffer = component.state().staffList[0].uuid;

    const result = {
      source: {
        index: 0,
      },
    };
    // Pretend we dragged the first staffer outside the list.
    component.instance().onDragEnd(result);

    // Verify that the onChange method has NOT been called
    expect(input.onChange).not.toBeCalled();
    expect(firstStaffer).toEqual(component.state().staffList[0].uuid);
  });

  it('does not re-order when dragged to the same position', () => {
    const component = mount(<StaffList input={input} />);
    // Find the first staffer.
    const firstStaffer = component.state().staffList[0].uuid;

    const result = {
      source: {
        index: 0,
      },
      destination: {
        index: 0,
      },
    };
    // Pretend we dragged the first staffer to their original position.
    component.instance().onDragEnd(result);
    // Verify that the onChange method has NOT been called
    expect(input.onChange).not.toBeCalled();
    expect(firstStaffer).toEqual(component.state().staffList[0].uuid);
  });
});
