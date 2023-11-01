import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { MemoryRouter } from 'react-router-dom';
import { mount } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import { AppContext } from '@edx/frontend-platform/react';

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
        <Header {...props} />
      </MemoryRouter>
    </AppContext.Provider>
  );
};

HeaderWrapperContext.propTypes = {
  props: PropTypes.shape({}).isRequired,
};

describe('Header', () => {
  const HeaderWrapper = props => (
    mount(<HeaderWrapperContext props={props} />).find('header')
  );

  it('renders the correct header', () => {
    const component = HeaderWrapper({});
    expect(shallowToJson(component)).toMatchSnapshot();
  });

  it('renders the header correctly when users pass a querystring param to allow dark mode toggling', () => {
    const component = HeaderWrapper({});
    expect(shallowToJson(component)).toMatchSnapshot();
  });

  it('renders the header correctly when toggling is allowed, and dark mode is on', () => {
    const component = HeaderWrapper({ darkModeOn: true });
    expect(shallowToJson(component)).toMatchSnapshot();
  });
});
