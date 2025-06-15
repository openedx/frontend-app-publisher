import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import User from './User';

describe('User', () => {
  const baseArguments = {
    name: 'User',
    userId: 0,
  };

  it('shows a remove button if onRemove is set', () => {
    render(<User {...baseArguments} onRemove={jest.fn()} />);
    expect(screen.getByTestId('id-remove-btn')).toBeInTheDocument();
  });

  it('does not show a remove button if onRemove is not set', () => {
    render(<User {...baseArguments} />);
    expect(screen.queryByTestId('id-remove-btn')).not.toBeInTheDocument();
  });
});
