import React from 'react';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';

import { CreateCourseRunForm } from './CreateCourseRunForm';
import CreateCourseRunPage from './index';
import StatusAlert from '../StatusAlert';
import { courseOptions } from '../../data/constants/testData';

describe('CreateCourseRunPage', () => {
  it('renders html correctly', () => {
    const component = shallow(<CreateCourseRunPage
      id="00000000-0000-0000-0000-000000000001"
      courseInfo={{
        data: {},
        isFetching: false,
        isCreating: false,
        error: null,
      }}
      courseOptions={courseOptions}
    />);
    expect(shallowToJson(component)).toMatchSnapshot();
  });
  it('renders html correctly with Course Type', () => {
    const component = shallow(<CreateCourseRunPage
      id="00000000-0000-0000-0000-000000000001"
      courseInfo={{
        data: {
          type: '8a8f30e1-23ce-4ed3-a361-1325c656b67b',
        },
        isFetching: false,
        isCreating: false,
        error: null,
      }}
      courseOptions={courseOptions}
    />);
    expect(shallowToJson(component)).toMatchSnapshot();
  });
  it('renders html correctly when fetching', () => {
    const component = shallow(<CreateCourseRunPage
      id="00000000-0000-0000-0000-000000000001"
      courseInfo={{
        data: {},
        isFetching: true,
        isCreating: false,
        error: null,
      }}
    />);
    expect(shallowToJson(component)).toMatchSnapshot();
  });
  it('renders html correctly when creating', () => {
    const component = shallow(<CreateCourseRunPage
      id="00000000-0000-0000-0000-000000000001"
      courseInfo={{
        data: {},
        isFetching: false,
        isCreating: true,
        error: null,
      }}
    />);
    expect(shallowToJson(component)).toMatchSnapshot();
  });
  it('renders html correctly when error', () => {
    const component = shallow(<CreateCourseRunPage
      id="00000000-0000-0000-0000-000000000001"
      courseInfo={{
        data: {},
        isFetching: false,
        isCreating: false,
        error: ['failed'],
      }}
    />);
    expect(shallowToJson(component)).toMatchSnapshot();
  });

  it('refuses access to form when course is under review', () => {
    const component = shallow(<CreateCourseRunPage
      id="00000000-0000-0000-0000-000000000001"
      courseInfo={{
        data: {
          course_runs: [{
            status: 'review_by_legal',
            key: 'course-v1:edX+cs101+2T2019',
          }],
          title: 'Test Course',
        },
        isFetching: false,
        isCreating: false,
        error: null,
      }}
    />);

    // Confirm message is shown
    const reviewAlert = component.find(StatusAlert);
    const reviewMessage = 'Test Course has been submitted for review. No course runs can be added right now.';
    expect(reviewAlert.props().message).toEqual(reviewMessage);

    // And confirm that we don't show form
    const form = component.find(CreateCourseRunForm);
    expect(form).toHaveLength(0);
  });
});
