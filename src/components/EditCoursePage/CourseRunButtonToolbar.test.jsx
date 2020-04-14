import React from 'react';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';

import CourseRunButtonToolbar from './CourseRunButtonToolbar';
import { PUBLISHED } from '../../data/constants';

describe('Course Run Button Toolbar', () => {
  it('default parameters', () => {
    const component = shallow(<CourseRunButtonToolbar />);
    expect(shallowToJson(component)).toMatchSnapshot();
  });

  it('editable', () => {
    const component = shallow(<CourseRunButtonToolbar editable />);
    expect(shallowToJson(component)).toMatchSnapshot();
  });

  it('published pristine', () => {
    const component = shallow(<CourseRunButtonToolbar editable pristine status={PUBLISHED} />);
    expect(shallowToJson(component)).toMatchSnapshot();
  });

  it('published with changes', () => {
    const component = shallow(<CourseRunButtonToolbar editable status={PUBLISHED} />);
    expect(shallowToJson(component)).toMatchSnapshot();
  });
});
