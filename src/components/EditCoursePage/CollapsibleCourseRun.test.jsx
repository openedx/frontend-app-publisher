import React from 'react';
import { shallow } from 'enzyme';

import CollapsibleCourseRun from './CollapsibleCourseRun';
import { courseSubmittingInfo } from '../../data/actions/courseSubmitInfo';

import store from '../../data/store';

const languageOptions = [
  {
    label: 'Arabic - United Arab Emirates',
    value: 'ar-ae',
  },
];

const pacingTypeOptions = [
  {
    label: 'Self-paced',
    value: 'self_paced',
  },
];

const publishedCourseRun = {
  start: '2000-01-01T12:00:00Z', // Different format to be transformed
  end: '2010-01-01T00:00:00Z',
  go_live_date: '1999-12-31T00:00:00Z',
  pacing_type: 'self_paced',
  min_effort: 1,
  max_effort: 1,
  content_language: languageOptions[0].value,
  transcript_languages: [languageOptions[0].value],
  weeks_to_complete: 1,
  status: 'published',
  key: 'edX101+DemoX',
  has_ofac_restrictions: false,
};

const unpublishedCourseRun = Object.assign({}, publishedCourseRun, { status: 'unpublished' });

Date.now = jest.fn(() => new Date(Date.UTC(2001, 0, 1)).valueOf());

describe('Collapsible Course Run', () => {
  it('renders correctly with no fields', () => {
    const component = shallow(<CollapsibleCourseRun
      languageOptions={[]}
      pacingTypeOptions={[]}
      courseRun={{}}
      courseId="test-course"
      courseUuid="11111111-1111-1111-1111-111111111111"
    />);
    expect(component).toMatchSnapshot();
  });

  it('renders correctly when given a published course run', () => {
    const component = shallow(<CollapsibleCourseRun
      languageOptions={languageOptions}
      pacingTypeOptions={pacingTypeOptions}
      courseRun={publishedCourseRun}
      courseId="test-course"
      courseUuid="11111111-1111-1111-1111-111111111111"
    />);
    expect(component).toMatchSnapshot();
  });

  it('renders correctly when given an unpublished course run', () => {
    const component = shallow(<CollapsibleCourseRun
      languageOptions={languageOptions}
      pacingTypeOptions={pacingTypeOptions}
      courseRun={unpublishedCourseRun}
      courseId="test-course"
      courseUuid="11111111-1111-1111-1111-111111111111"
    />);
    expect(component).toMatchSnapshot();
  });

  it('renders correctly when submitting for review', () => {
    const component = shallow(<CollapsibleCourseRun
      languageOptions={languageOptions}
      pacingTypeOptions={pacingTypeOptions}
      courseRun={unpublishedCourseRun}
      courseId="test-course"
      courseUuid="11111111-1111-1111-1111-111111111111"
      isSubmittingForReview
    />);
    expect(component).toMatchSnapshot();
  });

  it('renders correctly when submitting for review and given a matching target run', () => {
    const component = shallow(<CollapsibleCourseRun
      languageOptions={languageOptions}
      pacingTypeOptions={pacingTypeOptions}
      courseRun={publishedCourseRun}
      courseId="test-course"
      courseUuid="11111111-1111-1111-1111-111111111111"
      isSubmittingForReview
    />);
    expect(component).toMatchSnapshot();
  });

  it('renders fields as disabled when course is in review', () => {
    const component = shallow(<CollapsibleCourseRun
      languageOptions={[]}
      pacingTypeOptions={[]}
      courseRun={{}}
      courseInReview
      courseId="test-course"
      courseUuid="11111111-1111-1111-1111-111111111111"
    />);
    const childFields = component.find('input');
    childFields.forEach((field) => {
      expect(field.prop('disabled')).toBeTrue();
    });
  });

  it('handles submission when called from a course run', () => {
    const component = shallow(<CollapsibleCourseRun
      languageOptions={languageOptions}
      pacingTypeOptions={pacingTypeOptions}
      courseRun={unpublishedCourseRun}
      courseId="test-course"
      courseUuid="11111111-1111-1111-1111-111111111111"
      currentFormValues={{}}
      initialValues={{}}
      editable
    />);

    const mockDispatch = jest.spyOn(store, 'dispatch');
    component.find('ActionButton').simulate('click');
    expect(mockDispatch).toHaveBeenCalledWith(courseSubmittingInfo(unpublishedCourseRun));
  });
});
