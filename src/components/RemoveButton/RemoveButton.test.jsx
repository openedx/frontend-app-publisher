import React from 'react';
import {
  render, waitFor, screen, fireEvent,
} from '@testing-library/react';

import RemoveButton from './index';

const mockOnRemove = jest.fn(targetFieldNumber => targetFieldNumber);

const defaultProps = {
  label: 'Test Label',
  onRemove: mockOnRemove,
  targetFieldNumber: 0,
};

describe('RemoveButton', () => {
  it('renders correctly', async () => {
    const { container } = render(<RemoveButton {...defaultProps} />);
    await waitFor(() => expect(container).toMatchSnapshot());
  });

  it('calls the `onRemove` function with the target field number when the button is clicked', async () => {
    render(<RemoveButton {...defaultProps} />);

    const btn = await screen.findByRole('button');
    fireEvent.click(btn);
    expect(mockOnRemove).toBeCalledWith(defaultProps.targetFieldNumber);
  });
});
