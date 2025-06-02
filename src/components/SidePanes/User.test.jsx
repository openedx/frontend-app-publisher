import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';

import User from './User';

describe('User', () => {
  it('shows a remove button iff onRemove is set', async () => {
    const baseArguments = {
      name: 'User',
      userId: 0,
    };

    render(<User
      {...baseArguments}
    />);
    await waitFor(() => expect(screen.findByTestId('id-remove-btn')).toHaveLength(0));

    render(<User
      {...baseArguments}
      onRemove={jest.fn()}
    />);
    await waitFor(() => expect(screen.findByTestId('id-remove-btn')).toHaveLength(1));
  });
});
