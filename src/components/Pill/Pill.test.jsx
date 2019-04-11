import React from 'react';
import { shallow } from 'enzyme';

import Pill from './index';


describe('Pill', () => {
  it('renders without any statuses', () => {
    const component = shallow(<Pill statuses={[]} />);
    expect(component).toMatchSnapshot();
  });

  it('renders with invalid statuses', () => {
    const statuses = [undefined, false, 'fnjdsahf'];
    const component = shallow(<Pill statuses={statuses} />);
    expect(component).toMatchSnapshot();
  });

  it('renders with a single status', () => {
    const statuses = ['review_by_legal'];
    const component = shallow(<Pill statuses={statuses} />);
    expect(component).toMatchSnapshot();
  });

  it('renders with multiple statuses', () => {
    const statuses = ['review_by_internal', 'published'];
    const component = shallow(<Pill statuses={statuses} />);
    expect(component).toMatchSnapshot();
  });
});
