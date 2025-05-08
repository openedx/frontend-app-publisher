import React from 'react';
import { render, waitFor } from '@testing-library/react';

import RenderSelectField from './index';

describe('RenderSelectField', () => {
  it('renders html for select field', () => {
    const { container } = render(<RenderSelectField
      input={{}}
      name="Test"
      label="TestLabel"
      options={['one', 'two', 'three']}
      meta={{ touched: false, error: '' }}
    />);
    waitFor(() => expect(container).toMatchSnapshot());
  });
});
