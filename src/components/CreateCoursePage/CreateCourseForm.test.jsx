import React from 'react';
import { shallow } from 'enzyme';

import { BaseCreateCourseForm } from './CreateCourseForm';

const organizations = [
  { name: 'edX', key: 'edx' }, { name: 'edX2', key: 'edx2' },
];

const courseRunOptionsReturn = {
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
};
const parseOptionsReturn = [{ label: 'Instructor-paced', value: 'instructor_paced' },
  { label: 'Self-paced', value: 'self_paced' }];

Date.now = jest.fn(() => new Date(Date.UTC(2001, 0, 1)).valueOf());

describe('CreateCourseForm', () => {
  const initialValues = {
    org: 'edx',
    title: 'Hello',
    number: 'edx101',
    enrollmentTrack: 'verified',
    price: 100.00,
  };

  it('renders html correctly with no orgs', () => {
    const component = shallow(<BaseCreateCourseForm
      handleSubmit={() => {}}
      initialValues={{}}
      organizations={organizations}
      getCourseRunOptions={() => courseRunOptionsReturn}
      parseOptions={() => parseOptionsReturn}
    />);
    expect(component).toMatchSnapshot();
  });

  it('renders html correctly with data', () => {
    const component = shallow(<BaseCreateCourseForm
      handleSubmit={() => {}}
      initialValues={initialValues}
      currentFormValues={initialValues}
      organizations={organizations}
      getCourseRunOptions={() => courseRunOptionsReturn}
      parseOptions={() => parseOptionsReturn}
    />);
    expect(component).toMatchSnapshot();
  });

  it('renders html correctly while submitting', () => {
    const component = shallow(<BaseCreateCourseForm
      submitting
      isCreating
      pristine={false}
      handleSubmit={() => {}}
      initialValues={{}}
      currentFormValues={initialValues}
      organizations={organizations}
      getCourseRunOptions={() => courseRunOptionsReturn}
      parseOptions={() => parseOptionsReturn}
    />);
    expect(component).toMatchSnapshot();
  });
});
