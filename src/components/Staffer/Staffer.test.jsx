import React from 'react';
import {
  fireEvent, render, waitFor,
} from '@testing-library/react';

import { MemoryRouter } from 'react-router-dom';
import { Staffer } from './index';

const defaultProps = {
  onRemove: jest.fn(),
  item: {
    uuid: '2aba6189-ad7e-45a8-b269-bea071b80391',
    given_name: 'Dave',
    family_name: 'Grohl',
    profile_image_url: '/media/people/profile_images/2aba6189-ad7e-45a8-b269-bea071b80391-11df6812f839.png',
  },
  referrer: '/course/11111111-1111-1111-1111-111111111111',
};

const StafferWrapper = () => (
  <MemoryRouter>
    <Staffer {...defaultProps} />
  </MemoryRouter>
);

describe('Staffer', () => {
  it('renders the staffer', () => {
    const { container } = render(<StafferWrapper />);
    waitFor(() => expect(container).toMatchSnapshot());
  });

  it('calls onRemove when the delete button is clicked', () => {
    const { container } = render(<StafferWrapper />);
    fireEvent.click(container);
    waitFor(() => expect(defaultProps.onRemove).toHaveBeenCalled());
  });
});
