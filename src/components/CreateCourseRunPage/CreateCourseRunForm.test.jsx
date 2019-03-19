import React from 'react';
import { shallow } from 'enzyme';

import { BaseCreateCourseRunForm } from './CreateCourseRunForm';

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
      submitting={false}
    />);
    expect(component).toMatchSnapshot();
  });
  it('renders html correctly when submitting and creating', () => {
    const component = shallow(<BaseCreateCourseRunForm
      handleSubmit={() => {}}
      initialValues={{
        course: 'edx+test101',
      }}
      title="Test Course"
      uuid="00000000-0000-0000-0000-000000000001"
      pristine={false}
      submitting
    />);
    expect(component).toMatchSnapshot();
  });
});
