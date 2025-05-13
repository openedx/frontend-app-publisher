import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import { AppContext } from '@edx/frontend-platform/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import Header from './index';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: '/',
    search: '?bananas=1',
  }),
}));

const HeaderWrapperContext = ({ props }) => {
  const contextValue = useMemo(() => ({
    authenticatedUser: {
      username: 'test-username',
    },
  }), []);

  return (
    <AppContext.Provider
      value={contextValue}
    >
      <MemoryRouter>
        <IntlProvider locale="en">
          <Header {...props} />
        </IntlProvider>
      </MemoryRouter>
    </AppContext.Provider>
  );
};

HeaderWrapperContext.propTypes = {
  props: PropTypes.shape({}).isRequired,
};

describe('Header', () => {
  const HeaderWrapper = props => {
    const { container } = render(<HeaderWrapperContext props={props} />);
    return container;
  };

  it('renders the correct header', () => {
    const component = HeaderWrapper({});
    expect(component).toMatchSnapshot();
  });

  it('renders the header correctly when users pass a querystring param to allow dark mode toggling', () => {
    const component = HeaderWrapper({});
    expect(component).toMatchSnapshot();
  });

  it('renders the header correctly when toggling is allowed, and dark mode is on', () => {
    const component = HeaderWrapper({ darkModeOn: true });
    expect(component).toMatchSnapshot();
  });
});
