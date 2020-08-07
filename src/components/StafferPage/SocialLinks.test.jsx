import React from 'react';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';

import SocialLinks from './SocialLinks';

/*
*  Disable console errors for this test file so that we don't receive warnings
*  about fields being an array rather than an object. This prop change is
*  intentional as redux-form field arrays treat fields strangely:
*  'The fields object is a "pseudo-array", in that it has many of the same
*  properties and methods as a javascript Array, providing both reading and
*  writing functionality.'
*/
jest.spyOn(global.console, 'error').mockImplementation(() => jest.fn());

describe('Social links', () => {
  it('renders correctly with no fields', () => {
    const component = shallow(<SocialLinks fields={[]} />);
    expect(shallowToJson(component)).toMatchSnapshot();
  });

  it('renders correctly when given fields', () => {
    const component = shallow(<SocialLinks fields={[{}]} />);
    expect(shallowToJson(component)).toMatchSnapshot();
  });

  it('adds fields when the add button is pushed', () => {
    const fields = [{}];
    const component = shallow(<SocialLinks fields={fields} />);
    expect(fields.length).toEqual(1);

    component.find('.js-add-button').simulate('click');
    expect(fields.length).toEqual(2);
  });
});
