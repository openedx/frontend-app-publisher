import React from 'react';
import { shallow } from 'enzyme';

import { BaseCollapsibleCourseRunFields } from './CollapsibleCourseRunFields';

/*
*  Disable console errors for this test file so that we don't receive warnings
*  about fields being an array rather than an object. This prop change is
*  intentional as redux-form field arrays treat fields strangely:
*  'The fields object is a "pseudo-array", in that it has many of the same
*  properties and methods as a javascript Array, providing both reading and
*  writing functionality.'
*/
jest.spyOn(global.console, 'error').mockImplementation(() => jest.fn());

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
  end: '2010/01/01',
  pacing_type: 'self_paced',
  min_effort: 1,
  max_effort: 1,
  content_language: languageOptions[0].value,
  transcript_languages: [languageOptions[0].value],
  weeks_to_complete: 1,
  status: 'published',
};

const unpublishedCourseRun = Object.assign({}, publishedCourseRun, { status: 'unpublished' });

const getMockForm = valid => ({
  checkValidity: jest.fn(() => valid),
  reportValidity: jest.fn(() => {}),
});

const mockCourseRunSubmit = jest.fn();

describe('Collapsible Course Run Fields', () => {
  it('renders correctly with no fields', () => {
    const component = shallow(<BaseCollapsibleCourseRunFields
      fields={[]}
      languageOptions={[]}
      pacingTypeOptions={[]}
      courseRuns={[]}
      formId="test-form"
      handleCourseRunSubmit={mockCourseRunSubmit}
    />);
    expect(component).toMatchSnapshot();
  });

  it('renders correctly when given a published course run', () => {
    const component = shallow(<BaseCollapsibleCourseRunFields
      fields={[{}]}
      languageOptions={languageOptions}
      pacingTypeOptions={pacingTypeOptions}
      courseRuns={[publishedCourseRun]}
      formId="test-form"
      handleCourseRunSubmit={mockCourseRunSubmit}
    />);
    expect(component).toMatchSnapshot();
  });

  it('renders correctly when given an unpublished course run', () => {
    const component = shallow(<BaseCollapsibleCourseRunFields
      fields={[{}]}
      languageOptions={languageOptions}
      pacingTypeOptions={pacingTypeOptions}
      courseRuns={[unpublishedCourseRun]}
      formId="test-form"
      handleCourseRunSubmit={mockCourseRunSubmit}
    />);
    expect(component).toMatchSnapshot();
  });

  it('renders fields as disabled when course is in review', () => {
    const component = shallow(<BaseCollapsibleCourseRunFields
      fields={[]}
      languageOptions={[]}
      pacingTypeOptions={[]}
      courseRuns={[]}
      courseInReview
      formId="test-form"
      handleCourseRunSubmit={mockCourseRunSubmit}
    />);
    const childFields = component.find('input');
    childFields.forEach((field) => {
      expect(field.prop('disabled')).toBeTrue();
    });
  });

  it('reports validity when submitted from course run and there are invalid fields', () => {
    const component = shallow(<BaseCollapsibleCourseRunFields
      fields={[{}]}
      languageOptions={languageOptions}
      pacingTypeOptions={pacingTypeOptions}
      courseRuns={[unpublishedCourseRun]}
      formId="test-form"
      handleCourseRunSubmit={mockCourseRunSubmit}
    />);

    const mockInvalidForm = getMockForm(false);
    jest.spyOn(document, 'getElementById').mockImplementation(() => mockInvalidForm);
    component.find('button').simulate(
      'click',
      { preventDefault: () => {} },
    );
    expect(mockCourseRunSubmit).not.toHaveBeenCalled();
    expect(mockInvalidForm.reportValidity).toHaveBeenCalled();
  });

  it('handles submission when submitted from courseRun with no invalid fields', () => {
    const component = shallow(<BaseCollapsibleCourseRunFields
      fields={[{}]}
      languageOptions={languageOptions}
      pacingTypeOptions={pacingTypeOptions}
      courseRuns={[unpublishedCourseRun]}
      formId="test-form"
      handleCourseRunSubmit={mockCourseRunSubmit}
    />);

    const mockValidForm = getMockForm(true);
    jest.spyOn(document, 'getElementById').mockImplementation(() => mockValidForm);
    component.find('button').simulate(
      'click',
      { preventDefault: () => {} },
    );

    expect(mockCourseRunSubmit).toHaveBeenCalled();
    expect(mockValidForm.reportValidity).not.toHaveBeenCalled();
  });
});
