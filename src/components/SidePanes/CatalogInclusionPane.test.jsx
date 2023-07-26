import React from 'react';
import { mount } from 'enzyme';

import CatalogInclusionPane from './CatalogInclusionPane';

describe('CatalogInclusionPane', () => {
  const mockUuid = 'test-enterprise-id';
  const mockInclusion = false;

  it('correct toggle behavior', () => {
    const wrapper = mount(<CatalogInclusionPane
      courseUuid={mockUuid}
      subInclusion={mockInclusion}
      draftStatuses={['published']}
      orgInclusion
    />);
    wrapper.find(CatalogInclusionPane);
    const title = wrapper.find('Enterprise Subscriptions');
    expect(title);
    const toggle = wrapper.find('.pgn__form-switch-input');
    toggle.simulate('change', { target: { checked: false } });
    expect(toggle.props().checked).toBe(false);
  });

  it('toggle disabled when org is false', () => {
    const wrapper = mount(<CatalogInclusionPane
      courseUuid={mockUuid}
      subInclusion={mockInclusion}
      draftStatuses={['published']}
    />);
    // org not included helper text
    expect(wrapper.find('.text-gray-300')).toHaveLength(1);
  });
  it('toggle blocked in review status', () => {
    const wrapper = mount(<CatalogInclusionPane
      courseUuid={mockUuid}
      subInclusion={mockInclusion}
      draftStatuses={['review_by_internal']}
      orgInclusion
    />);
    const toggle = wrapper.find('.pgn__form-switch-input');
    toggle.simulate('change', { target: { checked: false } });
    // blocked error helper text
    expect(wrapper.find('.pgn__form-switch-helper-text')).toHaveLength(1);
  });
});
