import React from 'react';
import { mount, shallow } from 'enzyme';
import ReactTooltip from 'react-tooltip';
import FieldHelp from './index';

jest.mock('react-tooltip');

describe('FieldHelp', () => {
  it('can toggle tooltip', () => {
    const wrapper = mount(<FieldHelp id="jest" tip={<p>Hello World</p>} />);

    expect(ReactTooltip.show.mock.calls.length).toBe(0);
    expect(ReactTooltip.hide.mock.calls.length).toBe(0);

    wrapper.find('button').simulate('click');
    expect(ReactTooltip.show.mock.calls.length).toBe(1);

    wrapper.find('button').simulate('click');
    expect(ReactTooltip.hide.mock.calls.length).toBe(1);
  });

  it('node gets converted to string', () => {
    const wrapper = shallow(<FieldHelp id="jest" tip={<p>Hello World</p>} />);

    const data = wrapper.find('.field-help-data');
    expect(data.prop('data-tip')).toMatch(/<p>\s*Hello World\s*<\/p>/);
  });
});
