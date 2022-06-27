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
  fetchCourses: jest.fn(),
  fetchUsersForCurrentUser: jest.fn(),
}));

const mockUuid = 'test-enterprise-id';
const mockInclusion = false;

const response = { uuid: mockUuid, enterprise_subscription_inclusion: true };

describe('<CatalogInclusionPane />', () => {
  beforeEach(() => {
    getAuthenticatedUser.mockReturnValue({ administrator: true });
  });
  test('renders catalog inclusion pane', () => {
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
    render(
      <CatalogInclusionPane
        courseUuid={mockUuid}
        subInclusion={mockInclusion}
      />,
    );
    const toggle = screen.getByTestId('course-inclusion-switch');
    expect(toggle).not.toBeChecked();
    userEvent.click(toggle);
    expect(DiscoveryDataApiService.editCourse).toBeCalledWith(response);

    await waitFor(() => {
      expect(toggle).toBeChecked();
    });
  });
  test('test error', async () => {
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
