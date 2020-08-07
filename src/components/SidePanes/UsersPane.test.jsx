import React from 'react';
import { mount, shallow } from 'enzyme';

import RemoveButton from '../RemoveButton';

import User from './User';
import UsersPane from './UsersPane';

describe('UsersPane', () => {
  const basicCourseEditors = {
    data: [
      {
        id: 1,
        user: {
          id: 10,
          full_name: 'Editor 1',
          email: 'one@example.com',
        },
      },
      {
        id: 2,
        user: {
          id: 12,
          full_name: 'No Email',
        },
      },
      {
        id: 3,
        user: {
          id: 13,
          full_name: 'Editor 3',
          email: 'three@example.com',
        },
      },
    ],
    error: null,
    isFetching: false,
  };
  const emptyCourseEditors = {
    data: [],
    error: null,
    isFetching: false,
  };
  const basicOrganizationRoles = {
    data: [
      {
        id: 2,
        role: 'project_coordinator',
        user: {
          full_name: 'PC 1',
          email: 'pc@example.com',
        },
      },
    ],
    error: null,
    isFetching: false,
  };
  const basicOrganizationUsers = {
    data: [
      {
        id: 10,
        full_name: 'Editor 1',
        email: 'one@example.com',
      },
      {
        id: 12,
        full_name: 'No Email',
      },
      {
        id: 13,
        full_name: 'Editor 3',
        email: 'three@example.com',
      },
      {
        id: 14,
        full_name: 'New User',
        email: 'new@example.com',
      },
    ],
    error: null,
    isFetching: false,
  };

  it('shows name and email of editors', () => {
    const wrapper = shallow(<UsersPane
      courseEditors={basicCourseEditors}
    />);
    const users = wrapper.find(User);
    expect(users).toHaveLength(3);
    expect(users.at(0).prop('name')).toEqual('Editor 1 (one@example.com)');
    expect(users.at(1).prop('name')).toEqual('No Email');
    expect(users.at(2).prop('name')).toEqual('Editor 3 (three@example.com)');
  });

  it('has label for no editors', () => {
    const wrapper = shallow(<UsersPane
      courseEditors={emptyCourseEditors}
    />);
    const users = wrapper.find(User);
    expect(users).toHaveLength(0);
    expect(wrapper.contains(<div>All team members</div>)).toEqual(true);
  });

  it('allows editor removal', () => {
    const mockCallback = jest.fn();
    const wrapper = mount(<UsersPane
      courseEditors={basicCourseEditors}
      removeCourseEditor={mockCallback}
    />);
    const buttons = wrapper.find(RemoveButton);
    expect(buttons).toHaveLength(3);
    buttons.at(1).simulate('click');
    expect(mockCallback.mock.calls.length).toBe(1);
    expect(mockCallback.mock.calls[0][0]).toBe(2); // second editor's editor id
  });

  it('allows adding an editor', () => {
    const mockCallback = jest.fn();
    const wrapper = mount(<UsersPane
      addCourseEditor={mockCallback}
      courseEditors={basicCourseEditors}
      organizationUsers={basicOrganizationUsers}
    />);

    const startAddButton = wrapper.find('.usersPane-startAdd');
    startAddButton.simulate('click');

    const selectOption = wrapper.find('option');
    expect(selectOption.html()).toEqual('<option value="14">New User (new@example.com)</option>');

    const addButton = wrapper.find('.usersPane-add');
    addButton.simulate('click');
    expect(mockCallback.mock.calls.length).toBe(1);
    expect(mockCallback.mock.calls[0][0]).toBe(14); // new editor's user id
  });

  it('shows PC', () => {
    const wrapper = shallow(<UsersPane
      organizationRoles={basicOrganizationRoles}
    />);
    const users = wrapper.find(User);
    expect(users).toHaveLength(1);
    expect(users.at(0).prop('name')).toEqual('PC 1 (pc@example.com)');
  });
});
