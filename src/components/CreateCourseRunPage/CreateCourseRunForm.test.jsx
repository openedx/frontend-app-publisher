import React from 'react';
import { shallow } from 'enzyme';

import { BaseCreateCourseRunForm } from './CreateCourseRunForm';

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

describe('CreateCourseRunForm', () => {
  it('renders html correctly', () => {
    const component = shallow(<BaseCreateCourseRunForm
      handleSubmit={() => {}}
      initialValues={{
        course: 'edx+test101',
      }}
      title="Test Course"
      uuid="00000000-0000-0000-0000-000000000001"
      pristine
      isCreating={false}
      getCourseRunOptions={() => courseRunOptionsReturn}
      parseOptions={() => parseOptionsReturn}
    />);
    expect(component).toMatchSnapshot();
  });
  it('renders html correctly when creating', () => {
    const component = shallow(<BaseCreateCourseRunForm
      handleSubmit={() => {}}
      initialValues={{
        course: 'edx+test101',
      }}
      title="Test Course"
      uuid="00000000-0000-0000-0000-000000000001"
      pristine={false}
      isCreating
      getCourseRunOptions={() => courseRunOptionsReturn}
      parseOptions={() => parseOptionsReturn}
    />);
    expect(component).toMatchSnapshot();
  });
});
