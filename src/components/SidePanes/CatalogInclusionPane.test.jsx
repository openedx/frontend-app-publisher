import React from 'react';
import { mount } from 'enzyme';

import CatalogInclusionPane from './CatalogInclusionPane';
import DiscoveryDataApiService from '../../data/services/DiscoveryDataApiService';

describe('CatalogInclusionPane', () => {
  const mockUuid = 'test-enterprise-id';
  const mockSubInclusion = false;
  const mockOrgInclusion = true;
  const spy = jest.spyOn(DiscoveryDataApiService, 'editCourse');

  it('correct toggle behavior', () => {
    const wrapper = mount(<CatalogInclusionPane
      courseUuid={mockUuid}
      subInclusion={mockSubInclusion}
      draftStatuses={['published']}
      orgInclusion={mockOrgInclusion}
    />);
    wrapper.find(CatalogInclusionPane);
    const title = wrapper.find('Enterprise Subscriptions');
    expect(title);
    const toggle = wrapper.find('.pgn__form-switch-input');
    toggle.simulate('change', { target: { checked: false } });
    expect(spy).toBeCalledWith(
      {
        draft: false,
        enterprise_subscription_inclusion: !mockSubInclusion,
        uuid: 'test-enterprise-id',
      },
    );
  });

  it('allow course runs who have been reviewed', () => {
    const wrapper = mount(<CatalogInclusionPane
      courseUuid={mockUuid}
      subInclusion={mockSubInclusion}
      draftStatuses={['reviewed']}
      orgInclusion={mockOrgInclusion}
    />);
    wrapper.find(CatalogInclusionPane);
    const title = wrapper.find('Enterprise Subscriptions');
    expect(title);
    const toggle = wrapper.find('.pgn__form-switch-input');
    toggle.simulate('change', { target: { checked: false } });
    expect(spy).toBeCalledWith(
      {
        draft: false,
        enterprise_subscription_inclusion: !mockSubInclusion,
        uuid: 'test-enterprise-id',
      },
    );
  });
  it('toggle disabled when org is false', () => {
    const wrapper = mount(<CatalogInclusionPane
      courseUuid={mockUuid}
      subInclusion={mockSubInclusion}
      draftStatuses={['published']}
      orgInclusion={false}
    />);
    // org not included helper text
    expect(wrapper.find('.text-gray-300')).toHaveLength(1);
  });
  it('toggle blocked in review status', () => {
    const wrapper = mount(<CatalogInclusionPane
      courseUuid={mockUuid}
      subInclusion={mockSubInclusion}
      draftStatuses={['review_by_internal']}
      orgInclusion={mockOrgInclusion}
    />);
    const toggle = wrapper.find('.pgn__form-switch-input');
    toggle.simulate('change', { target: { checked: false } });
    // blocked error helper text
    expect(wrapper.find('.pgn__form-switch-helper-text')).toHaveLength(1);
  });
});
