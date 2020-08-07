import React from 'react';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';

import PriceList from './index';

describe('PriceList', () => {
  it('renders without any price labels', () => {
    const component = shallow(<PriceList priceLabels={{}} />);
    expect(shallowToJson(component)).toMatchSnapshot();
  });

  it('renders with price labels', () => {
    const priceLabels = { a: 'A', b: 'B' };
    const component = shallow(<PriceList priceLabels={priceLabels} />);
    expect(shallowToJson(component)).toMatchSnapshot();
  });
});
