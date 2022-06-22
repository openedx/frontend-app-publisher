import React from 'react';
import {
  render, screen, waitFor, waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
// eslint-disable-next-line no-unused-vars
import { toBeChecked } from '@testing-library/jest-dom';
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';

import DiscoveryDataApiService from '../../data/services/DiscoveryDataApiService';
import CatalogInclusionPane from './CatalogInclusionPane';

jest.mock('../../data/services/DiscoveryDataApiService', () => ({
  editCourse: jest.fn(),
}));

const mockUuid = 'test-enterprise-id';
const mockInclusion = false;

const response = { uuid: mockUuid, enterprise_subscription_inclusion: true };

describe('<CatalogInclusionPane />', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('renders catalog inclusion pane', () => {
    getAuthenticatedUser.mockReturnValue({ administrator: true });
    render(
      <CatalogInclusionPane
        courseUuid={mockUuid}
        subInclusion={mockInclusion}
      />,
    );
    expect(screen.getByText('Enterprise Subscriptions'));
    expect(screen.getByText('Course Inclusion Status'));
  });
  test('test toggle switch', async () => {
    DiscoveryDataApiService.editCourse.mockResolvedValue(response);
    getAuthenticatedUser.mockReturnValue({ administrator: true });
    render(
      <CatalogInclusionPane
        courseUuid={mockUuid}
        subInclusion={mockInclusion}
      />,
    );
    const toggle = screen.getByTestId('course-inclusion-switch');
    userEvent.click(toggle);
    const spinner = screen.getByTestId('course-inclusion-loading');
    expect(spinner);
    await waitForElementToBeRemoved(spinner);

    await waitFor(() => {
      expect(toggle).toBeChecked();
    });
  });
  test('test error', async () => {
    getAuthenticatedUser.mockReturnValue({ administrator: true });
    DiscoveryDataApiService.editCourse.mockRejectedValue();
    render(
      <CatalogInclusionPane
        courseUuid={mockUuid}
        subInclusion={mockInclusion}
      />,
    );
    const toggle = screen.getByTestId('course-inclusion-switch');
    userEvent.click(toggle);
    const spinner = screen.getByTestId('course-inclusion-loading');
    expect(spinner);
    await waitForElementToBeRemoved(spinner);

    await waitFor(() => {
      expect(screen.getByText('We were unable to toggle this attribute. Please try again later.'));
    });
  });
});
