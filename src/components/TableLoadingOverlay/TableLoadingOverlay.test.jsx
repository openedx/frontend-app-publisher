import React from 'react';
import { shallow } from 'enzyme';

import TableLoadingOverlay from './index';

describe('TableLoadingOverlay', () => {
  it('shows an overlay', () => {
    const component = shallow(<TableLoadingOverlay />);
    expect(component).toMatchSnapshot();
  });
  it('accepts a className', () => {
    const component = shallow(<TableLoadingOverlay
      className="Test"
    />);
    expect(component).toMatchSnapshot();
  });
});
