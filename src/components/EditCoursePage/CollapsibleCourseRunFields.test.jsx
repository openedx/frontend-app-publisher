import React from 'react';
import { shallow } from 'enzyme';

import CollapsibleCourseRunFields from './CollapsibleCourseRunFields';

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

const initialvalues = [
  {
    start: '2000-01-01T12:00:00Z', // Different format to be transformed
    end: '2010/01/01',
    pacing_type: 'self_paced',
    min_effort: 1,
    max_effort: 1,
    content_language: languageOptions[0].value,
    transcript_languages: [languageOptions[0].value],
    weeks_to_complete: 1,
  },
];

describe('Collapsible Course Run Fields', () => {
  it('renders correctly with no fields', () => {
    const component = shallow(<CollapsibleCourseRunFields
      fields={[]}
      languageOptions={[]}
      pacingTypeOptions={[]}
      courseRuns={[]}
    />);
    expect(component).toMatchSnapshot();
  });

  it('renders correctly when given fields', () => {
    const component = shallow(<CollapsibleCourseRunFields
      fields={[{}, {}]}
      languageOptions={languageOptions}
      pacingTypeOptions={pacingTypeOptions}
      courseRuns={initialvalues}
    />);
    expect(component).toMatchSnapshot();
  });

  it('adds fields when the add button is pushed', () => {
    const fields = [{}];
    const component = shallow(<CollapsibleCourseRunFields
      fields={fields}
      languageOptions={languageOptions}
      pacingTypeOptions={pacingTypeOptions}
      courseRuns={initialvalues}
    />);
    expect(fields.length).toEqual(1);

    component.find('.js-add-button').simulate('click');
    expect(fields.length).toEqual(2);
  });
});
