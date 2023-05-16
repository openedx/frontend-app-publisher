import React from 'react';
import { render } from 'enzyme';
import { renderToJson } from 'enzyme-to-json';
import { IntlProvider } from '@edx/frontend-platform/i18n';

import Pill from './index';

const PillWrapper = (props) => (
  <IntlProvider locale="en">
    <Pill {...props} />
  </IntlProvider>
);

describe('Pill', () => {
  it('renders without any statuses', () => {
    const component = render(<PillWrapper statuses={[]} />);
    expect(renderToJson(component)).toMatchSnapshot();
  });

  it('renders with invalid statuses', () => {
    const statuses = [undefined, null, 'fnjdsahf'];
    const component = render(<PillWrapper statuses={statuses} />);
    expect(renderToJson(component)).toMatchSnapshot();
  });

  it('renders with a single status', () => {
    const statuses = ['review_by_legal'];
    const component = render(<PillWrapper statuses={statuses} />);
    expect(renderToJson(component)).toMatchSnapshot();
  });

  it('renders with multiple statuses', () => {
    const statuses = ['review_by_internal', 'published'];
    const component = render(<PillWrapper statuses={statuses} />);
    expect(renderToJson(component)).toMatchSnapshot();
  });
});
