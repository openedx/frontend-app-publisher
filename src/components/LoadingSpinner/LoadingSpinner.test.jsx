import React from 'react';
import { render, waitFor } from '@testing-library/react';

import LoadingSpinner from './index';

describe('LoadingSpinner', () => {
  it('shows a loading spinner', async () => {
    const { container } = render(<LoadingSpinner />);
    await waitFor(() => expect(container).toMatchSnapshot());
  });
});
