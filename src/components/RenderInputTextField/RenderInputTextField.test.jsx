import React from 'react';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';

import RenderInputTextField from './index';

describe('RenderInputTextField', () => {
  it('renders html for text', () => {
    const component = shallow(<RenderInputTextField
      input={{}}
      type="text"
      name="Test"
      label="TestLabel"
      meta={{ touched: false, error: '' }}
    />).dive();
    expect(shallowToJson(component)).toMatchSnapshot();
  });
  it('renders html for number type', () => {
    const component = shallow(<RenderInputTextField
      input={{}}
      type="number"
      name="Test"
      label="TestLabel"
      meta={{ touched: false, error: '' }}
    />).dive();
    expect(shallowToJson(component)).toMatchSnapshot();
  });
});
