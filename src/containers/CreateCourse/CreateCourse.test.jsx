import configureStore from 'redux-mock-store';
import React from 'react';
import { mount, shallow } from 'enzyme';
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
let mockOnSubmit;
let store;

const createWrapper = (state) => {
  store = mockStore(state);
  mockOnSubmit = jest.fn();
  return shallow(<CreateCoursePage
    store={store}
    createCourse={mockOnSubmit}
  />);
};

describe('Create Course View', () => {
  it('shows spinner while loading', () => {
    const testState = jsonDeepCopy(initialState);
    testState.publisherUserInfo.isFetching = true;
    const wrapper = createWrapper(testState).find('CreateCoursePage').dive();
    expect(wrapper.find('LoadingSpinner').dive()).toHaveLength(1);
  });

  it('shows error when fails to retrieve organizations', () => {
    const testState = jsonDeepCopy(initialState);
    const errorMessage = ['organization failure'];
    testState.publisherUserInfo.isFetching = false;
    testState.publisherUserInfo.error = errorMessage;
    testState.courseOptions.isFetching = false;
    testState.courseRunOptions.isFetching = false;
    const wrapper = createWrapper(testState).find('CreateCoursePage').dive();
    expect(wrapper.find('#create-error')).toHaveLength(1);
    expect(wrapper.find('#create-error').props().message).toEqual(errorMessage.concat(<br />));
  });

  it('Shows confirmation modal on form submission', () => {
    const testState = jsonDeepCopy(initialState);
    testState.publisherUserInfo.isFetching = false;
    testState.publisherUserInfo.error = null;
    testState.courseOptions.isFetching = false;
    testState.courseOptions = courseOptions;
    testState.courseRunOptions.isFetching = false;
    testState.courseRunOptions = courseRunOptions;

    store = mockStore(testState);
    const CourseCreatePageWrapper = props => (
      <MemoryRouter>
        <Provider store={store}>
          <CreateCoursePage
            {...props}
            initialValues={courseData}
          />
        </Provider>
      </MemoryRouter>
    );

    const wrapper = mount(<CourseCreatePageWrapper />);
    const instance = (wrapper.find('CreateCoursePage')).instance();
    const spy = jest.spyOn(instance, 'showModal');
    instance.forceUpdate();

    // Submit
    const formWrapper = wrapper.find('#create-course-form');
    formWrapper.find('ActionButton').simulate('submit');
    expect(spy).toBeCalledTimes(1);
    expect(wrapper.find('ConfirmationModal'));
  });

  it('Submits the form with correct data', () => {
    const testState = jsonDeepCopy(initialState);
    testState.publisherUserInfo.isFetching = false;
    testState.publisherUserInfo.error = null;
    testState.courseOptions.isFetching = false;
    testState.courseOptions = courseOptions;
    testState.courseRunOptions.isFetching = false;
    testState.courseRunOptions = courseRunOptions;

    store = mockStore(testState);
    const CourseCreatePageWrapper = props => (
      <MemoryRouter>
        <Provider store={store}>
          <CreateCoursePage
            {...props}
            initialValues={courseData}
          />
        </Provider>
      </MemoryRouter>
    );

    const wrapper = mount(<CourseCreatePageWrapper />);
    const instance = (wrapper.find('CreateCoursePage')).instance();
    const spy = jest.spyOn(instance, 'handleCourseCreate');
    instance.forceUpdate();
    instance.showModal(courseData);
    instance.continueCreate(courseData);

    expect(spy).toBeCalledTimes(1);
  });
});
