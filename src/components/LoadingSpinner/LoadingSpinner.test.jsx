import React from 'react';
import { render, waitFor } from '@testing-library/react';

import LoadingSpinner from './index';

describe('LoadingSpinner', () => {
  it('shows a loading spinner', () => {
    const { container } = render(<LoadingSpinner />);
    waitFor(() => expect(container).toMatchSnapshot());
  });
});
