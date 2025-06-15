import React from 'react';
import '@testing-library/jest-dom';
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

  it('correct toggle behavior', async () => {
    render(<CatalogInclusionPane
      courseUuid={mockUuid}
      subInclusion={mockSubInclusion}
      draftStatuses={['published']}
      orgInclusion={mockOrgInclusion}
    />);

    const title = screen.getByText('Enterprise Subscriptions');
    await waitFor(() => expect(title).toBeInTheDocument());
    const toggle = screen.getByRole('switch', { name: /included/i });
    expect(toggle).not.toBeChecked();
    fireEvent.click(toggle);
    await waitFor(() => expect(spy).toBeCalledWith(
      {
        draft: false,
        enterprise_subscription_inclusion: !mockSubInclusion,
        uuid: 'test-enterprise-id',
      },
    ));
  });

  it('allow course runs who have been reviewed', async () => {
    render(<CatalogInclusionPane
      courseUuid={mockUuid}
      subInclusion={mockSubInclusion}
      draftStatuses={['reviewed']}
      orgInclusion={mockOrgInclusion}
    />);
    const title = screen.getByText('Enterprise Subscriptions');
    await waitFor(() => expect(title).toBeInTheDocument());
    const toggle = screen.getByRole('switch', { name: /included/i });
    fireEvent.click(toggle);
    await waitFor(() => expect(spy).toBeCalledWith(
      {
        draft: false,
        enterprise_subscription_inclusion: !mockSubInclusion,
        uuid: 'test-enterprise-id',
      },
    ));
  });

  it('toggle disabled when org is false', async () => {
    render(<CatalogInclusionPane
      courseUuid={mockUuid}
      subInclusion={mockSubInclusion}
      draftStatuses={['published']}
      orgInclusion={false}
    />);
    // org not included helper text
    const helperText = screen.getByText('Organization is not currently a participating partner in the subscription catalog.');
    expect(helperText).toBeInTheDocument();
    const toggle = screen.getByRole('switch', { name: /included/i });
    expect(toggle).toBeDisabled();
  });

  it('toggle blocked in review status', async () => {
    render(<CatalogInclusionPane
      courseUuid={mockUuid}
      subInclusion={mockSubInclusion}
      draftStatuses={['review_by_internal']}
      orgInclusion={mockOrgInclusion}
    />);
    const toggle = screen.getByRole('switch', { name: /included/i });
    fireEvent.click(toggle);
    // blocked error helper text
    const errorText = screen.getByText('Edits are not allowed while all course runs are in review.');
    expect(errorText).toBeInTheDocument();
  });
});
