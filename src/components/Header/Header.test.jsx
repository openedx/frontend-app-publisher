import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { mount } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import { AppContext } from '@edx/frontend-platform/react';

import Header from './index';

describe('Header', () => {
  const HeaderWrapper = props => (
    mount(
      <AppContext.Provider
        value={{
          authenticatedUser: {
            username: 'test-username',
          },
        }}
      >
        <MemoryRouter>
          <Header {...props} />
        </MemoryRouter>
      </AppContext.Provider>,
    ).find('header')
  );

  it('renders the correct header', () => {
    const component = HeaderWrapper({});
    expect(shallowToJson(component)).toMatchSnapshot();
  });

  it('renders the header correctly when users pass a querystring param to allow dark mode toggling', () => {
    const component = HeaderWrapper({ location: { search: '?bananas=1' } });
    expect(shallowToJson(component)).toMatchSnapshot();
  });

  it('renders the header correctly when toggling is allowed, and dark mode is on', () => {
    const component = HeaderWrapper({ darkModeOn: true, location: { search: '?bananas=1' } });
    expect(shallowToJson(component)).toMatchSnapshot();
  });
});
