import React from 'react';
import { shallow } from 'enzyme';

import CreateCourseForm from './CreateCourseForm';

describe('CreateCourseForm', () => {
  it('renders html correctly with no orgs', () => {
    const component = shallow(<CreateCourseForm />);
    expect(component).toMatchSnapshot();
  });
  it('renders html correctly with data', () => {
    const organizations = [{ name: 'edX', key: 'edx' }, { name: 'edX2', key: 'edx2' }];
    const component = shallow(<CreateCourseForm
      pristine
      handleSubmit={() => null}
      initialValues={{
        courseOrg: 'edx',
        courseTitle: 'Hello',
        courseNumber: 'edx101',
        courseEnrollmentTrack: 'verified',
        coursePrice: 100.00,
      }}
      organizations={organizations}
    />);
    expect(component).toMatchSnapshot();
  });
  it('renders html correctly while submitting', () => {
    const organizations = [{ name: 'edX', key: 'edx' }, { name: 'edX2', key: 'edx2' }];
    const component = shallow(<CreateCourseForm
      submitting
      handleSubmit={() => null}
      initialValues={{
        courseOrg: '',
        courseTitle: '',
        courseNumber: '',
        courseEnrollmentTrack: '',
        coursePrice: '',
      }}
      organizations={organizations}
    />);
    expect(component).toMatchSnapshot();
  });
});
