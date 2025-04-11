import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';

import Pill from './index';

const PillWrapper = (props) => (
  <IntlProvider locale="en">
    <Pill {...props} />
  </IntlProvider>
);

describe('Pill', () => {
  it('renders without any statuses', () => {
    const { container } = render(<PillWrapper statuses={[]} />);
    waitFor(() => expect(container).toMatchSnapshot());
  });

  it('renders with invalid statuses', () => {
    const statuses = [undefined, null, 'fnjdsahf'];
    const { container } = render(<PillWrapper statuses={statuses} />);
    waitFor(() => expect(container).toMatchSnapshot());
  });

  it('renders with a single status', () => {
    const statuses = ['review_by_legal'];
    const { container } = render(<PillWrapper statuses={statuses} />);
    waitFor(() => expect(container).toMatchSnapshot());
  });

  it('renders with multiple statuses', () => {
    const statuses = ['review_by_internal', 'published'];
    const { container } = render(<PillWrapper statuses={statuses} />);
    waitFor(() => expect(container).toMatchSnapshot());
  });
});
