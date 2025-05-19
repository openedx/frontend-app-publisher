import React from 'react';
import {
  render, screen, fireEvent,
} from '@testing-library/react';

import configureStore from 'redux-mock-store';
import { reduxForm } from 'redux-form';
import { Provider } from 'react-redux';
import AreasOfExpertise from './AreasOfExpertise';

const mockStore = configureStore();
const store = mockStore({});

/*
*  Disable console errors for this test file so that we don't receive warnings
*  about fields being an array rather than an object. This prop change is
*  intentional as redux-form field arrays treat fields strangely:
*  'The fields object is a "pseudo-array", in that it has many of the same
*  properties and methods as a javascript Array, providing both reading and
*  writing functionality.'
*/

const AreaOfExpertiseWrapper = reduxForm({ form: 'testForm' })(AreasOfExpertise);

jest.spyOn(global.console, 'error').mockImplementation(() => jest.fn());

describe('Areas Of Expertise', () => {
  it('renders correctly with no fields', () => {
    const { container } = render(<Provider store={store}><AreaOfExpertiseWrapper fields={[]} /></Provider>);
    expect(container).toMatchSnapshot();
  });

  it('renders correctly when given fields', () => {
    const { container } = render(<Provider store={store}><AreaOfExpertiseWrapper fields={[{}]} /></Provider>);
    expect(container).toMatchSnapshot();
  });

  it('adds fields when the add button is pushed', async () => {
    const fields = [{}];
    render(<Provider store={store}><AreaOfExpertiseWrapper fields={fields} /></Provider>);
    expect(fields.length).toEqual(1);

    const addButton = await screen.findByTestId('js-add-button');
    fireEvent.click(addButton);
    expect(fields.length).toEqual(2);
  });
});
