import React from 'react';
import { shallow } from 'enzyme';

import { BaseCreateCourseRunForm } from './CreateCourseRunForm';
import { courseOptions, courseRunOptions } from '../../data/constants/testData';

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
      courseOptions={courseOptions}
      courseRunOptions={courseRunOptions}
    />);
    expect(component).toMatchSnapshot();
  });
  it('renders html correctly with Course Type', () => {
    const component = shallow(<BaseCreateCourseRunForm
      handleSubmit={() => {}}
      initialValues={{
        course: 'edx+test101',
      }}
      title="Test Course"
      uuid="00000000-0000-0000-0000-000000000001"
      pristine
      isCreating={false}
      courseOptions={courseOptions}
      courseRunOptions={courseRunOptions}
      courseTypeUuid="8a8f30e1-23ce-4ed3-a361-1325c656b67b"
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
      courseOptions={courseOptions}
      courseRunOptions={courseRunOptions}
    />);
    expect(component).toMatchSnapshot();
  });
});
