import React from 'react';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';

import { BaseCreateCourseRunForm } from './CreateCourseRunForm';
import { courseOptions, courseRunOptions } from '../../data/constants/testData';
import { getOptionsData, parseCourseTypeOptions } from '../../utils';

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
      courseRunOptions={courseRunOptions}
    />);
    expect(shallowToJson(component)).toMatchSnapshot();
  });
  it('renders html correctly with Course Type', () => {
    const courseTypeUuid = '8a8f30e1-23ce-4ed3-a361-1325c656b67b';
    const courseOptionsData = getOptionsData(courseOptions);
    const parsedTypeOptions = parseCourseTypeOptions(courseOptionsData.type.type_options);
    const { courseRunTypeOptions } = parsedTypeOptions;
    const component = shallow(<BaseCreateCourseRunForm
      handleSubmit={() => {}}
      initialValues={{
        course: 'edx+test101',
      }}
      title="Test Course"
      uuid="00000000-0000-0000-0000-000000000001"
      pristine
      isCreating={false}
      courseRunTypeOptions={courseRunTypeOptions[courseTypeUuid]}
      courseRunOptions={courseRunOptions}
      courseTypeUuid={courseTypeUuid}
    />);
    expect(shallowToJson(component)).toMatchSnapshot();
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
      courseRunOptions={courseRunOptions}
    />);
    expect(shallowToJson(component)).toMatchSnapshot();
  });
});
