import React from 'react';
import '@testing-library/jest-dom';
import {
  render, screen, fireEvent, waitFor,
} from '@testing-library/react';
import { withLocation, withNavigate, withParams } from './hoc';

const mockedNavigator = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockedNavigator,
  useLocation: () => ({ pathname: '/current-location' }),
  useParams: () => ({ someParameter: 'some-parameter' }),
}));

// eslint-disable-next-line react/prop-types
const MockComponent = ({ navigate, location, someParameter }) => (
  // eslint-disable-next-line react/button-has-type
  <button data-testid="btn" onClick={() => navigate('/some-route')}>
    {/* eslint-disable-next-line react/prop-types */}
    {`${location.pathname}/${someParameter}`}
  </button>
);

const WrappedComponent = withNavigate(withLocation(withParams(MockComponent)));

test('Provides Navigation to Component', () => {
  render(<WrappedComponent />);
  const btn = screen.getByTestId('btn');

  fireEvent.click(btn);
  expect(mockedNavigator).toHaveBeenCalledWith('/some-route');
});

test('Provides Location object to Component', async () => {
  render(<WrappedComponent />);
  await waitFor(() => expect(screen.getByTestId('btn')).toHaveTextContent('/current-location'));
});

test('Provides Params object to Component', async () => {
  render(<WrappedComponent />);
  await waitFor(() => expect(screen.getByTestId('btn')).toHaveTextContent('some-parameter'));
});
