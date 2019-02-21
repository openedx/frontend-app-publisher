import React from 'react';
import { shallow } from 'enzyme';

import LoadingSpinner from './index';

describe('LoadingSpinner', () => {
  it('shows a loading spinner', () => {
    const component = shallow(<LoadingSpinner />);
    expect(component).toMatchSnapshot();
  });
});
