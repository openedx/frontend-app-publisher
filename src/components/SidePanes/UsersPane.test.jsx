import React from 'react';
import {
  screen, render, fireEvent, waitFor,
} from '@testing-library/react';

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
    render(<UsersPane
      courseEditors={basicCourseEditors}
    />);
    const users = screen.findByTestId('test-id-user');
    waitFor(() => expect(users).toHaveLength(3));
    waitFor(() => expect(users.at(0).prop('name')).toEqual('Editor 1'));
    waitFor(() => expect(users.at(0).prop('email')).toEqual('one@example.com'));
    waitFor(() => expect(users.at(1).prop('name')).toEqual('No Email'));
    waitFor(() => expect(users.at(2).prop('name')).toEqual('Editor 3'));
    waitFor(() => expect(users.at(2).prop('email')).toEqual('three@example.com'));
  });

  it('has label for no editors', async () => {
    render(<UsersPane
      courseEditors={emptyCourseEditors}
    />);
    waitFor(async () => expect(await screen.findByTestId('test-id-user')).not.toBeInTheDocument());
    waitFor(async () => expect(await screen.getByText('All team members')).toBeInTheDocument());
  });

  it('allows editor removal', async () => {
    const mockCallback = jest.fn();
    render(<UsersPane
      courseEditors={basicCourseEditors}
      removeCourseEditor={mockCallback}
    />);
    const buttons = await screen.findAllByRole('button');
    expect(buttons).toHaveLength(3);
    fireEvent.click(buttons[1]);
    expect(mockCallback.mock.calls.length).toBe(1);
    expect(mockCallback.mock.calls[0][0]).toBe(2); // second editor's editor id
  });

  it('allows adding an editor', async () => {
    const mockCallback = jest.fn();
    const { container } = render(<UsersPane
      addCourseEditor={mockCallback}
      courseEditors={basicCourseEditors}
      organizationUsers={basicOrganizationUsers}
    />);

    const startAddButton = await screen.findByTestId('usersPane-startAdd');
    fireEvent.click(startAddButton);
    const dropDownMenu = await container.querySelector('.react-select-pane__input');
    fireEvent.focus(dropDownMenu);
    fireEvent.keyDown(dropDownMenu, { key: 'ArrowDown' });
    const selectOption = await screen.findByTestId('option-14'); // 14 is new editor's user id
    fireEvent.click(selectOption);

    const addButton = await screen.findByTestId('usersPane-add');
    fireEvent.click(addButton);
    waitFor(() => expect(mockCallback.mock.calls.length).toBe(1));
    waitFor(() => expect(mockCallback.mock.calls[0][0]).toBe(14)); // new editor's user id
  });

  it('shows PC', () => {
    render(<UsersPane
      organizationRoles={basicOrganizationRoles}
    />);
    const users = screen.findByTestId('test-id-user');
    waitFor(() => expect(users).toHaveLength(1));
    waitFor(() => expect(users.at(0).prop('name')).toEqual('PC 1'));
    waitFor(() => expect(users.at(0).prop('email')).toEqual('pc@example.com'));
  });
});
