import React from 'react';
import { render } from '@testing-library/react';

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
    expect(container).toMatchSnapshot();
  });
});
