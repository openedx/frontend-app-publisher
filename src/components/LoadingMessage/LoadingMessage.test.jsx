import React from 'react';
import { shallow } from 'enzyme';

import LoadingMessage from './index';

describe('LoadingMessage', () => {
  it('shows a loading message', () => {
    const component = shallow(<LoadingMessage
      className="Test"
    />);
    expect(component).toMatchSnapshot();
  });
});
