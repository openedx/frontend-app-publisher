import configureStore from 'redux-mock-store';
import React from 'react';
import {
  render, screen, fireEvent, waitFor, within,
} from '@testing-library/react';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

import '@testing-library/jest-dom';
import CreateCoursePage from './index';
import CreateCoursePageComponent from '../../components/CreateCoursePage';
import { jsonDeepCopy } from '../../utils';
import { courseOptions, courseRunOptions } from '../../data/constants/testData';

const courseData = {
  org: { label: 'edx', value: 'edx' },
  title: 'Test Course',
  number: 'test101',
  type: '8a8f30e1-23ce-4ed3-a361-1325c656b67b',
  prices: {
    verified: '100.00',
  },
  start: '2019-03-04',
  end: '2020-03-04',
  pacing_type: 'instructor_paced',
  run_type: '4e260c57-24ef-46c1-9a0d-5ec3a30f6b0c',
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
      values: courseData,
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
  it('shows spinner while loading', async () => {
    const testState = jsonDeepCopy(initialState);
    testState.publisherUserInfo.isFetching = true;

    const { container } = createWrapper(testState);
    await waitFor(() => expect(container.querySelector('.loading-spinner')).toBeInTheDocument());
  });

  it('shows error when fails to retrieve organizations', async () => {
    const testState = jsonDeepCopy(initialState);
    const errorMessage = ['organization failure'];
    testState.publisherUserInfo.isFetching = false;
    testState.publisherUserInfo.error = errorMessage;
    testState.courseOptions.isFetching = false;
    testState.courseOptions = courseOptions;
    testState.courseRunOptions.isFetching = false;
    testState.courseRunOptions = courseRunOptions;

    createWrapper(testState);

    await waitFor(() => expect(screen.getByText(errorMessage[0])).toBeInTheDocument());
  });

  it('Shows confirmation modal on form submission', async () => {
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

    let submitText = await screen.queryByText('Create a New Course?');
    expect(submitText).not.toBeInTheDocument();

    const submitButton = screen.getByText('Create');
    fireEvent.click(submitButton);
    submitText = await screen.queryByText('Create a New Course?');
    expect(submitText).toBeInTheDocument();
  });

  it('Submits the form with correct data', async () => {
    const handleCourseCreateSpy = jest.spyOn(CreateCoursePageComponent.prototype, 'handleCourseCreate');

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
    const finalConfirmModal = screen.getByRole('dialog');
    expect(handleCourseCreateSpy).toBeCalledTimes(0);

    const finalSubmitButton = within(finalConfirmModal).getByText('Create');
    fireEvent.click(finalSubmitButton);
    expect(handleCourseCreateSpy).toBeCalledTimes(1);
  });
});
