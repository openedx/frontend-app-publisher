import React from 'react';
import { waitFor, render } from '@testing-library/react';
import { reduxForm } from 'redux-form';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import PriceList from './index';

const WrappedPriceList = reduxForm({ form: 'testForm' })(PriceList);
const mockStore = configureStore();
const store = mockStore({});

describe('PriceList', () => {
  it('renders without any price labels', async () => {
    const { container } = render(<PriceList priceLabels={{}} />);
    await waitFor(() => expect(container).toMatchSnapshot());
  });

  it('renders with price labels', async () => {
    const priceLabels = { a: 'A', b: 'B' };
    const { container } = render(
      <Provider store={store}>
        <WrappedPriceList priceLabels={priceLabels} />
      </Provider>,
    );
    await waitFor(() => expect(container).toMatchSnapshot());
  });
});
