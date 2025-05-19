import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';

import User from './User';

describe('User', () => {
  it('shows a remove button iff onRemove is set', () => {
    const baseArguments = {
      name: 'User',
      userId: 0,
    };

    render(<User
      {...baseArguments}
    />);
    waitFor(() => expect(screen.findByTestId('id-remove-btn')).toHaveLength(0));

    render(<User
      {...baseArguments}
      onRemove={jest.fn()}
    />);
    waitFor(() => expect(screen.findByTestId('id-remove-btn')).toHaveLength(1));
  });
});
