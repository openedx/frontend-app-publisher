import React from 'react';
import { render } from '@testing-library/react';

import { IntlProvider } from '@edx/frontend-platform/i18n';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import StafferPage from './index';

const mockStore = configureStore();
const store = mockStore({});

describe('StafferPage', () => {
  it('renders html correctly', () => {
    const { container } = render(
      <MemoryRouter>
        <Provider store={store}>
          <StafferPage stafferInfo={{}} />
        </Provider>
      </MemoryRouter>,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders html correctly when given a referrer', () => {
    const { container } = render(
      <MemoryRouter>
        <Provider store={store}>
          <IntlProvider locale="en">
            <StafferPage
              stafferInfo={{}}
              sourceInfo={{
                referrer: '/course/11111111-1111-1111-111111111111',
              }}
            />
          </IntlProvider>
        </Provider>
      </MemoryRouter>,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders page correctly with staffer info error', () => {
    const { container } = render(
      <MemoryRouter>
        <Provider store={store}>
          <StafferPage
            createStaffer={() => null}
            stafferInfo={{
              error: ['Fail'],
              isSaving: false,
            }}
          />
        </Provider>
      </MemoryRouter>,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders page correctly with no stafferInfo', () => {
    const { container } = render(<StafferPage
      createStaffer={() => null}
    />);
    expect(container).toMatchSnapshot();
  });

  it('renders page correctly while fetching', () => {
    const { container } = render(<StafferPage
      createStaffer={() => null}
      stafferInfo={{
        error: null,
        isSaving: false,
        isFetching: true,
      }}
    />);
    expect(container).toMatchSnapshot();
  });

  it('renders page correctly while creating', () => {
    const { container } = render(
      <MemoryRouter>
        <Provider store={store}>
          <StafferPage
            createStaffer={() => null}
            stafferInfo={{
              error: null,
              isSaving: true,
            }}
          />
        </Provider>
      </MemoryRouter>,
    );
    expect(container).toMatchSnapshot();
  });
});
