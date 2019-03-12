import configureStore from 'redux-mock-store';
import React from 'react';
import { mount, shallow } from 'enzyme';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

import CreateCoursePage from './index';
import { jsonDeepCopy } from '../../utils';


const initialState = {
  courseInfo: {},
  publisherUserInfo: {
    organizations: [],
    isFetching: true,
    error: null,
  },
};
const middlewares = [thunk];
const mockStore = configureStore(middlewares);
let mockOnSubmit;
let wrapper;
let store;

const createWrapper = (state) => {
  store = mockStore(state);
  mockOnSubmit = jest.fn();
  return shallow(<CreateCoursePage store={store} createCourse={mockOnSubmit} />);
};


describe('Create Course View', () => {
  it('shows spinner while loading', () => {
    const testState = jsonDeepCopy(initialState);
    testState.publisherUserInfo.isFetching = true;
    wrapper = createWrapper(testState).dive();
    expect(wrapper.find('LoadingSpinner').dive()).toHaveLength(1);
  });

  it('shows error when fails to retrieve organizations', () => {
    const testState = jsonDeepCopy(initialState);
    const errorMessage = 'organization failure';
    testState.publisherUserInfo.isFetching = false;
    testState.publisherUserInfo.error = errorMessage;
    wrapper = createWrapper(testState).dive();
    expect(wrapper.find('#error')).toHaveLength(1);
    expect(wrapper.find('#error').props().message).toEqual(errorMessage);
  });

  it('Submits the form with correct data', () => {
    const testState = jsonDeepCopy(initialState);
    testState.publisherUserInfo.isFetching = false;
    testState.publisherUserInfo.error = null;

    store = mockStore(testState);

    const CourseCreatePageWrapper = props => (
      <MemoryRouter>
        <Provider store={store} >
          <CreateCoursePage
            {...props}
          />
        </Provider>
      </MemoryRouter>

    );

    wrapper = mount(<CourseCreatePageWrapper />);
    const instance = (wrapper.find('CreateCoursePage')).instance();
    const spy = jest.spyOn(instance, 'handleCourseCreate');
    instance.forceUpdate();

    // Submit
    const formWrapper = wrapper.find('#create-course-form');
    formWrapper.find('.form-submit-btn').simulate('submit');

    expect(spy).toBeCalledTimes(1);
  });
});
