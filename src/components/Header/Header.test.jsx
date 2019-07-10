import React from 'react';
import { shallow } from 'enzyme';

import Header from './index';


describe('Header', () => {
  it('renders the correct header', () => {
    const component = shallow(<Header username="test-username" />);
    expect(component).toMatchSnapshot();
  });

  it('renders the header correctly when users pass a querystring param to allow dark mode toggling', () => {
    const component = shallow(<Header username="test-username" location={{ search: '?bananas=1' }} />);
    expect(component).toMatchSnapshot();
  });

  it('renders the header correctly when toggling is allowed, and dark mode is on', () => {
    const component = shallow(<Header username="test-username" darkModeOn location={{ search: '?bananas=1' }} />);
    expect(component).toMatchSnapshot();
  });
});
