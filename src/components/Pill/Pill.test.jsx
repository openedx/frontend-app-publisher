import React from 'react';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';

import Pill from './index';

describe('Pill', () => {
  it('renders without any statuses', () => {
    const component = shallow(<Pill statuses={[]} />);
    expect(shallowToJson(component)).toMatchSnapshot();
  });

  it('renders with invalid statuses', () => {
    const statuses = [undefined, null, 'fnjdsahf'];
    const component = shallow(<Pill statuses={statuses} />);
    expect(shallowToJson(component)).toMatchSnapshot();
  });

  it('renders with a single status', () => {
    const statuses = ['review_by_legal'];
    const component = shallow(<Pill statuses={statuses} />);
    expect(shallowToJson(component)).toMatchSnapshot();
  });

  it('renders with multiple statuses', () => {
    const statuses = ['review_by_internal', 'published'];
    const component = shallow(<Pill statuses={statuses} />);
    expect(shallowToJson(component)).toMatchSnapshot();
  });
});
