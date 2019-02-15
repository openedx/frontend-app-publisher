import React from 'react';
import { shallow } from 'enzyme';

import StatusAlert from './index';

describe('StatusAlert', () => {
  it('shows a status alert', () => {
    const component = shallow(<StatusAlert
      alertType="Test"
      message="Test Message"
    />);
    expect(component).toMatchSnapshot();
  });
});
