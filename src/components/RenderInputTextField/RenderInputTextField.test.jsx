import React from 'react';
import { render } from '@testing-library/react';

import RenderInputTextField from './index';

describe('RenderInputTextField', () => {
  it('renders html for text', () => {
    const { container } = render(<RenderInputTextField
      input={{}}
      type="text"
      name="Test"
      label="TestLabel"
      meta={{ touched: false, error: '' }}
    />);
    expect(container).toMatchSnapshot();
  });
  it('renders html for number type', () => {
    const { container } = render(<RenderInputTextField
      input={{}}
      type="number"
      name="Test"
      label="TestLabel"
      meta={{ touched: false, error: '' }}
    />);
    expect(container).toMatchSnapshot();
  });
});
