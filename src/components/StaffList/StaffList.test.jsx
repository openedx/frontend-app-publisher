import React from 'react';
import { mount, shallow } from 'enzyme';

import StaffList from './index';


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

describe('StaffList', () => {
  afterEach(() => {
    // Clear onChange's call count after each test
    input.onChange.mockClear();
  });

  it('renders a list of staff members', () => {
    const component = shallow(<StaffList input={input} />);
    expect(component).toMatchSnapshot();
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
