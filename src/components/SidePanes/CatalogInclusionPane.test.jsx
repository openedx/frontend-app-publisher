import React from 'react';
import {
  render, screen, waitFor, waitForElementToBeRemoved
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toHaveFormValues } from '@testing-library/jest-dom'


import DiscoveryDataApiService from '../../data/services/DiscoveryDataApiService';
import CatalogInclusionPane from './CatalogInclusionPane';

jest.mock('../../data/services/DiscoveryDataApiService', () => ({
  editCourse: jest.fn(),
}));

const mockUuid = "test-enterprise-id";
const mockInclusion = false;

const response = { uuid: mockUuid, enterprise_subscription_inclusion: true };
const errorResponse = { uuid: 'badUuid', enterprise_subscription_inclusion: true };

describe('<CatalogInclusionPane />', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('renders catalog inclusion pane', () => {
    render(
      <CatalogInclusionPane
        courseUuid={mockUuid}
        subInclusion={mockInclusion}
      />,
    );
    expect(screen.getByText('Enterprise Subscriptions'))
    expect(screen.getByText('Course Inclusion Status'))
  });
  test('test toggle switch', async () => {
    DiscoveryDataApiService.editCourse.mockResolvedValue(response);
    render(
      <CatalogInclusionPane
        courseUuid={mockUuid}
        subInclusion={mockInclusion}
      />,
    );

    const toggle = screen.getByTestId('course-inclusion-switch')
    expect(toggle).not.toBeChecked();

    userEvent.click(toggle);
    expect(DiscoveryDataApiService.editCourse).toBeCalledWith(response);
    const spinner = screen.getByTestId('course-inclusion-loading');
    expect(spinner);
    await waitForElementToBeRemoved(spinner);

    await waitFor (() => {
      expect(toggle).toBeChecked()
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
    const toggle = screen.getByTestId('course-inclusion-switch')
    userEvent.click(toggle);
    const spinner = screen.getByTestId('course-inclusion-loading');
    await waitForElementToBeRemoved(spinner);

    await waitFor (() => {
      expect(screen.getByText('We were unable to toggle this attribute. Please try again later.'))
    });
  });

});