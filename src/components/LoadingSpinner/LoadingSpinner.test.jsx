import React from 'react';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';

import LoadingSpinner from './index';

describe('LoadingSpinner', () => {
  it('shows a loading spinner', () => {
    const component = shallow(<LoadingSpinner />);
    expect(shallowToJson(component)).toMatchSnapshot();
  });
});
