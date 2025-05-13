import configureStore from 'redux-mock-store';
import React from 'react';
import {
  render, screen, fireEvent, waitFor,
} from '@testing-library/react';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

import CreateCoursePage from './index';
import { jsonDeepCopy } from '../../utils';
import { courseOptions, courseRunOptions } from '../../data/constants/testData';

const courseData = {
  org: 'edx',
  title: 'Test Course',
  number: 'test101',
  type: '8a8f30e1-23ce-4ed3-a361-1325c656b67b',
  prices: {
    verified: '100.00',
  },
  start: '2019-03-04',
  end: '2020-03-04',
  pacing_type: 'instructor_paced',
};

const initialState = {
  courseInfo: {},
  publisherUserInfo: {
    organizations: [],
    isFetching: true,
    error: null,
  },
  courseOptions: {
    data: {},
    isFetching: true,
    error: null,
  },
  courseRunOptions: {
    data: {},
    isFetching: true,
    error: null,
  },
  form: {
    'create-course-form': {
      initial: { courseData },
    },
  },
};

const middlewares = [thunk];
const mockStore = configureStore(middlewares);
let store;

const createWrapper = (state) => {
  store = mockStore(state);

  return render(
    <MemoryRouter>
      <Provider store={store}>
        <CreateCoursePage />
      </Provider>
    </MemoryRouter>,
  );
};

describe('Create Course View', () => {
  it('shows spinner while loading', () => {
    const testState = jsonDeepCopy(initialState);
    testState.publisherUserInfo.isFetching = true;

    const { container } = createWrapper(testState);
    waitFor(() => expect(container.querySelector('.loading-spinner')).toBeInTheDocument());
  });

  it('shows error when fails to retrieve organizations', () => {
    const testState = jsonDeepCopy(initialState);
    const errorMessage = ['organization failure'];
    testState.publisherUserInfo.isFetching = false;
    testState.publisherUserInfo.error = errorMessage;
    testState.courseOptions.isFetching = false;
    testState.courseOptions = courseOptions;
    testState.courseRunOptions.isFetching = false;
    testState.courseRunOptions = courseRunOptions;

    createWrapper(testState);

    waitFor(() => expect(screen.getByText(errorMessage[0])).toBeInTheDocument());
  });

  it.skip('Shows confirmation modal on form submission', async () => {
    // Todo: add proper assertions
    const testState = jsonDeepCopy(initialState);
    testState.publisherUserInfo.isFetching = false;
    testState.publisherUserInfo.error = null;
    testState.courseOptions.isFetching = false;
    testState.courseOptions = courseOptions;
    testState.courseRunOptions.isFetching = false;
    testState.courseRunOptions = courseRunOptions;

    store = mockStore(testState);

    render(
      <MemoryRouter>
        <Provider store={store}>
          <CreateCoursePage initialValues={courseData} />
        </Provider>
      </MemoryRouter>,
    );

    const submitButton = screen.getByText('Create');
    fireEvent.click(submitButton);
  });

  it.skip('Submits the form with correct data', async () => {
    // Todo: add proper assertions
    const testState = jsonDeepCopy(initialState);
    testState.publisherUserInfo.isFetching = false;
    testState.publisherUserInfo.error = null;
    testState.courseOptions.isFetching = false;
    testState.courseOptions = courseOptions;
    testState.courseRunOptions.isFetching = false;
    testState.courseRunOptions = courseRunOptions;

    store = mockStore(testState);

    render(
      <MemoryRouter>
        <Provider store={store}>
          <CreateCoursePage initialValues={courseData} />
        </Provider>
      </MemoryRouter>,
    );

    const confirmButton = screen.getByText('Create');
    fireEvent.click(confirmButton);
  });
});
