import React from 'react';
import {
  fireEvent, render, screen, waitFor,
} from '@testing-library/react';

import CatalogInclusionPane from './CatalogInclusionPane';
import DiscoveryDataApiService from '../../data/services/DiscoveryDataApiService';

describe('CatalogInclusionPane', () => {
  const mockUuid = 'test-enterprise-id';
  const mockSubInclusion = false;
  const mockOrgInclusion = true;
  const spy = jest.spyOn(DiscoveryDataApiService, 'editCourse');

  it('correct toggle behavior', () => {
    const { container } = render(<CatalogInclusionPane
      courseUuid={mockUuid}
      subInclusion={mockSubInclusion}
      draftStatuses={['published']}
      orgInclusion={mockOrgInclusion}
    />);
    screen.findByTestId('catalog-inclusion-pane');
    const title = screen.findByText('Enterprise Subscriptions');
    waitFor(() => expect(title).toBeInTheDocument());
    const toggle = container.querySelector('.pgn__form-switch-input');
    fireEvent.change(toggle, { target: { checked: false } });
    waitFor(() => expect(spy).toBeCalledWith(
      {
        draft: false,
        enterprise_subscription_inclusion: !mockSubInclusion,
        uuid: 'test-enterprise-id',
      },
    ));
  });

  it('allow course runs who have been reviewed', () => {
    const { container } = render(<CatalogInclusionPane
      courseUuid={mockUuid}
      subInclusion={mockSubInclusion}
      draftStatuses={['reviewed']}
      orgInclusion={mockOrgInclusion}
    />);
    screen.findByTestId('catalog-inclusion-pane');
    const title = screen.findByText('Enterprise Subscriptions');
    waitFor(() => expect(title).toBeInTheDocument());
    const toggle = container.querySelector('.pgn__form-switch-input');
    fireEvent.change(toggle, { target: { checked: false } });
    waitFor(() => expect(spy).toBeCalledWith(
      {
        draft: false,
        enterprise_subscription_inclusion: !mockSubInclusion,
        uuid: 'test-enterprise-id',
      },
    ));
  });
  it('toggle disabled when org is false', () => {
    const { container } = render(<CatalogInclusionPane
      courseUuid={mockUuid}
      subInclusion={mockSubInclusion}
      draftStatuses={['published']}
      orgInclusion={false}
    />);
    // org not included helper text
    const helperText = container.querySelector('.text-gray-300');
    waitFor(() => expect(helperText).toHaveLength(1));
  });
  it('toggle blocked in review status', () => {
    const { container } = render(<CatalogInclusionPane
      courseUuid={mockUuid}
      subInclusion={mockSubInclusion}
      draftStatuses={['review_by_internal']}
      orgInclusion={mockOrgInclusion}
    />);
    const toggle = container.querySelector('.pgn__form-switch-input');
    fireEvent.change(toggle, { target: { checked: false } });
    // blocked error helper text
    waitFor(() => expect(container.querySelector('.pgn__form-switch-helper-text')).toHaveLength(1));
  });
});
