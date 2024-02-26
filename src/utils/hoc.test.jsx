import React from 'react';
import { mount } from 'enzyme';

import { withLocation, withNavigate, withParams } from './hoc';

const mockedNavigator = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockedNavigator,
  useLocation: () => ({
    pathname: '/current-location',
  }),
  useParams: () => ({
    someParameter: 'some-parameter',
  }),
}));

// eslint-disable-next-line react/prop-types
const MockComponent = ({ navigate, location, someParameter }) => (
  // eslint-disable-next-line react/button-has-type
  <button id="btn" onClick={() => navigate('/some-route')}>
    {/* eslint-disable-next-line react/prop-types */}
    {`${location.pathname}/${someParameter}`}
  </button>
);
const WrappedComponent = withNavigate(withLocation(withParams(MockComponent)));

test('Provide Navigation to Component', () => {
  const wrapper = mount(
    <WrappedComponent />,
  );
  const btn = wrapper.find('#btn');
  btn.simulate('click');

  expect(mockedNavigator).toHaveBeenCalledWith('/some-route');
});

test('Provide Location object to Component', () => {
  const wrapper = mount(
    <WrappedComponent />,
  );

  expect(wrapper.find('#btn').text()).toContain('/current-location');
});

test('Provide Params object to Component', () => {
  const wrapper = mount(
    <WrappedComponent />,
  );

  expect(wrapper.find('#btn').text()).toContain('some-parameter');
});
