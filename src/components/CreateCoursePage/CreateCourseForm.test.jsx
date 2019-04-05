import React from 'react';
import { shallow } from 'enzyme';

import { BaseCreateCourseForm } from './CreateCourseForm';

const organizations = [
  { name: 'edX', key: 'edx' }, { name: 'edX2', key: 'edx2' },
];

describe('CreateCourseForm', () => {
  it('renders html correctly with no orgs', () => {
    const component = shallow(<BaseCreateCourseForm
      handleSubmit={() => {}}
      initialValues={{}}
      organizations={organizations}
    />);
    expect(component).toMatchSnapshot();
  });
  it('renders html correctly with data', () => {
    const component = shallow(<BaseCreateCourseForm
      handleSubmit={() => {}}
      initialValues={{
        org: 'edx',
        title: 'Hello',
        number: 'edx101',
        enrollmentTrack: 'verified',
        price: 100.00,
      }}
      organizations={organizations}
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
      organizations={organizations}
    />);
    expect(component).toMatchSnapshot();
  });
});
