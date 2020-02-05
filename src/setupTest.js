/* eslint-disable import/no-extraneous-dependencies */

import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

// These configuration values are usually set in webpack's EnvironmentPlugin however
// Jest does not use webpack so we need to set these so for testing
process.env.DISCOVERY_API_BASE_URL = 'http://localhost:18381';

// We need this here because there is code which uses a method(s) which JSDOM has not
// implemented yet. To fix this, the following mocks matchMedia so that all tests
// execute properly. More info here:
// https://jestjs.io/docs/en/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
