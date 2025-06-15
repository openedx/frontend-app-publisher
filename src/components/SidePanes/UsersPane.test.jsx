import React from 'react';
import '@testing-library/jest-dom';
import { screen, render, fireEvent } from '@testing-library/react';

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
    const users = screen.getAllByTestId('test-id-user');
    expect(users).toHaveLength(3);

    expect(users[0].getAttribute('data-name')).toEqual('Editor 1');
    expect(users[0].getAttribute('data-email')).toEqual('one@example.com');
    expect(users[0].getAttribute('data-user-id')).toEqual('1');

    expect(users[1].getAttribute('data-name')).toEqual('No Email');
    expect(users[1].getAttribute('data-email')).toBeNull();
    expect(users[1].getAttribute('data-user-id')).toEqual('2');

    expect(users[2].getAttribute('data-name')).toEqual('Editor 3');
    expect(users[2].getAttribute('data-email')).toEqual('three@example.com');
    expect(users[2].getAttribute('data-user-id')).toEqual('3');
  });

  it('has label for no editors', () => {
    render(<UsersPane
      courseEditors={emptyCourseEditors}
    />);

    expect(screen.queryByTestId('test-id-user')).not.toBeInTheDocument();
    expect(screen.getByText('All team members')).toBeInTheDocument();
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

    const startAddButton = screen.getByTestId('usersPane-startAdd');
    fireEvent.click(startAddButton);

    const dropDownMenu = container.querySelector('.react-select-pane__input');
    fireEvent.focus(dropDownMenu);
    fireEvent.keyDown(dropDownMenu, { key: 'ArrowDown' });

    const selectOption = screen.getByTestId('option-14'); // 14 is new editor's user id
    fireEvent.click(selectOption);

    const addButton = screen.getByTestId('usersPane-add');
    fireEvent.click(addButton);

    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith(14); // new editor's user id
  });

  it('shows PC', () => {
    render(<UsersPane
      organizationRoles={basicOrganizationRoles}
    />);
    const users = screen.getAllByTestId('test-id-user');
    expect(users).toHaveLength(1);
    expect(users[0].getAttribute('data-name')).toEqual('PC 1');
    expect(users[0].getAttribute('data-email')).toEqual('pc@example.com');
  });
});
