import React from 'react';
import { shallow } from 'enzyme';

import LabelledData from './index';

describe('LabelledData', () => {
  it('accepts elements', () => {
    const component = shallow(<LabelledData label={<i>Hello</i>} value={<b>Goodbye</b>} />);
    expect(component).toMatchSnapshot();
  });

  it('escapes html by default', () => {
    const component = shallow(<LabelledData label="<i>1</i>" value="<b>2</b>" />);
    expect(component).toMatchSnapshot();
  });

  it('renders html if asked', () => {
    const component = shallow(<LabelledData label="<i>1</i>" value="<b>2</b>" html />);
    expect(component).toMatchSnapshot();
  });
});
