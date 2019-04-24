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
      isCreating={false}
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
    />);
    expect(component).toMatchSnapshot();
  });
});
