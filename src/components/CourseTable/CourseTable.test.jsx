import React from 'react';
import { shallow } from 'enzyme';

import CourseTable from './index';

describe('CourseTable', () => {
  it('shows a table', () => {
    const component = shallow(<CourseTable />);
    expect(component).toMatchSnapshot();
  });
});
