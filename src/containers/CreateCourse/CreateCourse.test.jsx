import configureStore from 'redux-mock-store';
import React from 'react';
import { mount, shallow } from 'enzyme';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

import CreateCoursePage from './index';
import { jsonDeepCopy } from '../../utils';

const courseRunData = {
  data: {
    actions: {
      POST: {
        pacing_type: {
          type: 'choice',
          required: false,
          read_only: false,
          label: 'Pacing type',
          choices: [{
            display_name: 'Instructor-paced',
            value: 'instructor_paced',
          }, {
            display_name: 'Self-paced',
            value: 'self_paced',
          }],
        },
        content_language: {
          type: 'field',
          required: false,
          read_only: false,
          label: 'Content language',
          help_text: 'Language in which the course is administered',
          choices: [{
            display_name: 'Afrikaans',
            value: 'af',
          }, {
            display_name: 'Arabic - United Arab Emirates',
            value: 'ar-ae',
          }],
        },
      },
    },
  },
  isFetching: false,
  error: null,
};

const initialState = {
  courseInfo: {},
  publisherUserInfo: {
    organizations: [],
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
      initial: {
        org: 'edx',
        title: 'Test Course',
        number: 'test101',
        enrollmentTrack: 'verified',
        price: 100.00,
        start: '2019-03-04',
        end: '2019-03-19',
        pacing_type: 'instructor_paced',
      },
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
    const wrapper = createWrapper(testState).dive();
    expect(wrapper.find('LoadingSpinner').dive()).toHaveLength(1);
  });

  it('shows error when fails to retrieve organizations', () => {
    const testState = jsonDeepCopy(initialState);
    const errorMessage = ['organization failure'];
    testState.publisherUserInfo.isFetching = false;
    testState.publisherUserInfo.error = errorMessage;
    testState.courseRunOptions.isFetching = false;
    const wrapper = createWrapper(testState).dive();
    expect(wrapper.find('#create-error')).toHaveLength(1);
    expect(wrapper.find('#create-error').props().message).toEqual(errorMessage.concat(<br />));
  });

  it('Submits the form with correct data', () => {
    const testState = jsonDeepCopy(initialState);
    testState.publisherUserInfo.isFetching = false;
    testState.publisherUserInfo.error = null;
    testState.courseRunOptions.isFetching = false;
    testState.courseRunOptions = courseRunData;

    store = mockStore(testState);
    const CourseCreatePageWrapper = props => (
      <MemoryRouter>
        <Provider store={store} >
          <CreateCoursePage
            {...props}
            initialValues={{
              org: 'edx',
              title: 'Test Course',
              number: 'test101',
              enrollmentTrack: 'verified',
              price: 100.00,
              start: '2019-03-04',
              end: '2020-03-04',
              pacing_type: 'instructor_paced',
            }}
          />
        </Provider>
      </MemoryRouter>
    );

    const wrapper = mount(<CourseCreatePageWrapper />);
    const instance = (wrapper.find('CreateCoursePage')).instance();
    const spy = jest.spyOn(instance, 'handleCourseCreate');
    instance.forceUpdate();

    // Submit
    const formWrapper = wrapper.find('#create-course-form');
    formWrapper.find('ActionButton').simulate('submit');
    expect(spy).toBeCalledTimes(1);
  });
});
