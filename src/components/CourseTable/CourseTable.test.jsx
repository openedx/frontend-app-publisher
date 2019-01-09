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
    expect(component.find('h2').text()).toEqual('Hello, welcome to Publisher! You are logged in.');
  });
});
