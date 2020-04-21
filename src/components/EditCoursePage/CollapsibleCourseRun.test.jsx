import React from 'react';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';

import CollapsibleCourseRun from './CollapsibleCourseRun';
import { courseSubmitRun } from '../../data/actions/courseSubmitInfo';
import { AUDIT_TRACK, MASTERS_TRACK, VERIFIED_TRACK } from '../../data/constants';

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

const courseRunTypeOptions = {
  '8a8f30e1-23ce-4ed3-a361-1325c656b67b': [
    { label: 'Select enrollment track', value: '' },
    { label: 'Verified and Audit', value: '4e260c57-24ef-46c1-9a0d-5ec3a30f6b0c' },
    { label: 'Audit Only', value: 'cfacfc62-54bd-4e1b-939a-5a94f12fbd8d' },
    { label: 'Masters, Verified, and Audit', value: '00000000-0000-4000-0000-000000000000' },
  ],
};

const publishedCourseRun = {
  start: '2000-01-01T12:00:00Z', // Different format to be transformed
  end: '2010-01-01T00:00:00Z',
  external_key: null,
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
  seats: [],
  run_type: '00000000-0000-4000-0000-000000000000',
};

const unpublishedCourseRun = { ...publishedCourseRun, status: 'unpublished' };

const currentFormValues = {
  course_runs: [publishedCourseRun, unpublishedCourseRun],
  type: '8a8f30e1-23ce-4ed3-a361-1325c656b67b',
};

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
    expect(shallowToJson(component)).toMatchSnapshot();
  });

  it('renders correctly when given a published course run', () => {
    const component = shallow(<CollapsibleCourseRun
      languageOptions={languageOptions}
      pacingTypeOptions={pacingTypeOptions}
      courseRun={publishedCourseRun}
      courseId="test-course"
      courseUuid="11111111-1111-1111-1111-111111111111"
      index={0}
    />);
    expect(shallowToJson(component)).toMatchSnapshot();
  });

  it('renders correctly when given an unpublished course run', () => {
    const component = shallow(<CollapsibleCourseRun
      languageOptions={languageOptions}
      pacingTypeOptions={pacingTypeOptions}
      courseRun={unpublishedCourseRun}
      courseId="test-course"
      courseUuid="11111111-1111-1111-1111-111111111111"
      index={1}
    />);
    expect(shallowToJson(component)).toMatchSnapshot();
  });

  it('renders correctly with a course run type', () => {
    const component = shallow(<CollapsibleCourseRun
      languageOptions={languageOptions}
      pacingTypeOptions={pacingTypeOptions}
      courseRun={unpublishedCourseRun}
      courseId="test-course"
      courseUuid="11111111-1111-1111-1111-111111111111"
      type="8a8f30e1-23ce-4ed3-a361-1325c656b67b"
      currentFormValues={currentFormValues}
      courseRunTypeOptions={courseRunTypeOptions}
      index={1}
    />);
    expect(shallowToJson(component)).toMatchSnapshot();
  });

  it('renders correctly with external key field enabled', () => {
    const runTypeModes = {
      '00000000-0000-4000-0000-000000000000': [
        AUDIT_TRACK.key, MASTERS_TRACK.key, VERIFIED_TRACK.key,
      ],
    };
    const component = shallow(<CollapsibleCourseRun
      languageOptions={languageOptions}
      pacingTypeOptions={pacingTypeOptions}
      courseRun={unpublishedCourseRun}
      courseId="test-course"
      courseUuid="11111111-1111-1111-1111-111111111111"
      type="8a8f30e1-23ce-4ed3-a361-1325c656b67b"
      currentFormValues={currentFormValues}
      courseRunTypeOptions={courseRunTypeOptions}
      runTypeModes={runTypeModes}
      index={1}
    />);
    // Triggers an update so hasExternalKey is set
    component.setProps({});
    expect(shallowToJson(component)).toMatchSnapshot();
  });

  it('renders correctly when submitting for review', () => {
    const component = shallow(<CollapsibleCourseRun
      languageOptions={languageOptions}
      pacingTypeOptions={pacingTypeOptions}
      courseRun={unpublishedCourseRun}
      courseId="test-course"
      courseUuid="11111111-1111-1111-1111-111111111111"
      isSubmittingForReview
      index={1}
    />);
    expect(shallowToJson(component)).toMatchSnapshot();
  });

  it('renders correctly when submitting for review and given a matching target run', () => {
    const component = shallow(<CollapsibleCourseRun
      languageOptions={languageOptions}
      pacingTypeOptions={pacingTypeOptions}
      courseRun={publishedCourseRun}
      courseId="test-course"
      courseUuid="11111111-1111-1111-1111-111111111111"
      isSubmittingForReview
      index={0}
    />);
    expect(shallowToJson(component)).toMatchSnapshot();
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

  it('renders with run type disabled once a sku exists', () => {
    const seat = {
      type: 'verified',
      price: '149.00',
      sku: '',
    };
    const updatedCourseRun = { ...publishedCourseRun, seats: [seat] };
    const componentNoSku = shallow(<CollapsibleCourseRun
      languageOptions={[]}
      pacingTypeOptions={[]}
      courseRun={updatedCourseRun}
      courseId="test-course"
      courseUuid="11111111-1111-1111-1111-111111111111"
      type="8a8f30e1-23ce-4ed3-a361-1325c656b67b"
      currentFormValues={currentFormValues}
      courseRunTypeOptions={courseRunTypeOptions}
      index={0}
      editable
    />);

    let disabledFields = componentNoSku.find({ name: 'test-course.run_type', disabled: true });
    expect(disabledFields).toHaveLength(0);

    updatedCourseRun.seats[0].sku = 'ABCDEF';
    const componentWithSku = shallow(<CollapsibleCourseRun
      languageOptions={[]}
      pacingTypeOptions={[]}
      courseRun={updatedCourseRun}
      courseId="test-course"
      courseUuid="11111111-1111-1111-1111-111111111111"
      type="8a8f30e1-23ce-4ed3-a361-1325c656b67b"
      currentFormValues={currentFormValues}
      courseRunTypeOptions={courseRunTypeOptions}
      index={0}
      editable
    />);

    disabledFields = componentWithSku.find({ name: 'test-course.run_type', disabled: true });
    expect(disabledFields).toHaveLength(1);
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
      index={1}
    />);

    const mockDispatch = jest.spyOn(store, 'dispatch');
    component.find('CourseRunButtonToolbar').simulate('submit');
    expect(mockDispatch).toHaveBeenCalledWith(courseSubmitRun(unpublishedCourseRun));
  });
});
