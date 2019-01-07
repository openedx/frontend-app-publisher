import React from 'react';
import { shallow } from 'enzyme';

import CourseTable from './index';

describe('CourseTable', () => {
  it('should render correctly in "debug" mode', () => {
    const component = shallow(<CourseTable debug />);

    expect(component).toMatchSnapshot();
  });

  it('should render with the expected "Hello Publisher" text', () => {
    const component = shallow(<CourseTable />);
    expect(component.text()).toEqual('Hello Publisher!');
  });
});
