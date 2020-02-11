import React from 'react';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';

import { BaseCreateCourseForm } from './CreateCourseForm';
import { courseOptions, courseRunOptions } from '../../data/constants/testData';

const organizations = [
  { name: 'edX', key: 'edx' }, { name: 'edX2', key: 'edx2' },
];

Date.now = jest.fn(() => new Date(Date.UTC(2001, 0, 1)).valueOf());

describe('CreateCourseForm', () => {
  const initialValues = {
    org: 'edx',
    title: 'Hello',
    number: 'edx101',
    type: '8a8f30e1-23ce-4ed3-a361-1325c656b67b',
    prices: {
      verified: '100.00',
    },
  };

  it('renders html correctly with no orgs', () => {
    const component = shallow(<BaseCreateCourseForm
      handleSubmit={() => {}}
      initialValues={{}}
      organizations={organizations}
      courseOptions={courseOptions}
      courseRunOptions={courseRunOptions}
    />);
    expect(shallowToJson(component)).toMatchSnapshot();
  });

  it('renders html correctly with data', () => {
    const component = shallow(<BaseCreateCourseForm
      handleSubmit={() => {}}
      initialValues={initialValues}
      currentFormValues={initialValues}
      organizations={organizations}
      courseOptions={courseOptions}
      courseRunOptions={courseRunOptions}
    />);
    expect(shallowToJson(component)).toMatchSnapshot();
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
      courseOptions={courseOptions}
      courseRunOptions={courseRunOptions}
    />);
    expect(shallowToJson(component)).toMatchSnapshot();
  });
});
