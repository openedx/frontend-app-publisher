import React from 'react';
import {
  fireEvent, render, screen,
} from '@testing-library/react';
import { reduxForm } from 'redux-form';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import SocialLinks from './SocialLinks';
/*
*  Disable console errors for this test file so that we don't receive warnings
*  about fields being an array rather than an object. This prop change is
*  intentional as redux-form field arrays treat fields strangely:
*  'The fields object is a "pseudo-array", in that it has many of the same
*  properties and methods as a javascript Array, providing both reading and
*  writing functionality.'
*/
jest.spyOn(global.console, 'error').mockImplementation(() => jest.fn());
const mockStore = configureStore();
const store = mockStore({});

const WrappedSocialLinks = reduxForm({ form: 'testForm' })(SocialLinks);

describe('Social links', () => {
  it('renders correctly with no fields', () => {
    const { container } = render(<SocialLinks fields={[]} />);
    expect(container).toMatchSnapshot();
  });

  it('renders correctly when given fields', () => {
    const { container } = render(<SocialLinks fields={[]} />);
    expect(container).toMatchSnapshot();
  });

  it('adds fields when the add button is pushed', async () => {
    const fields = [{}];
    render(
      <Provider store={store}>
        <WrappedSocialLinks fields={fields} />
      </Provider>,
    );
    expect(fields.length).toEqual(1);

    const addButton = screen.getByTestId('js-add-button');
    fireEvent.click(addButton);
    expect(fields.length).toEqual(2);
  });
});
