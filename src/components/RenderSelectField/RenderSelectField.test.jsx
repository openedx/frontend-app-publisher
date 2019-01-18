import React from 'react';
import { shallow } from 'enzyme';

import RenderSelectField from './index';

describe('RenderSelectField', () => {
  it('renders html for select field', () => {
    const component = shallow(<RenderSelectField
      input={{}}
      name="Test"
      label="TestLabel"
      options={['one', 'two', 'three']}
      meta={{ touched: false, error: '' }}
    />).dive();
    expect(component).toMatchSnapshot();
  });
});
