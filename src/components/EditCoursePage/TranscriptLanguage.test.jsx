import React from 'react';
import {
  fireEvent, render, screen, waitFor,
} from '@testing-library/react';
import { reduxForm } from 'redux-form';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import TranscriptLanguage from './TranscriptLanguage';

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

const WrappedTranscriptLanguage = reduxForm({ form: 'testForm' })(TranscriptLanguage);

const languageOptions = [{
  label: 'Arabic - United Arab Emirates',
  value: 'ar-ae',
}];

const meta = {
  submitFailed: false,
  error: '',
};

const metaFailed = {
  submitFailed: true,
  error: 'This field is required',
};

describe('Transcript Language', () => {
  it('renders correctly with no fields', async () => {
    const { container } = render(<TranscriptLanguage
      fields={[]}
      languageOptions={languageOptions}
      meta={meta}
    />);
    await waitFor(() => expect(container).toMatchSnapshot());
  });

  it('renders correctly when given fields', async () => {
    const { container } = render(
      <Provider store={store}>
        <WrappedTranscriptLanguage
          fields={[{}]}
          languageOptions={languageOptions}
          meta={meta}
        />
      </Provider>,
    );
    await waitFor(() => expect(container).toMatchSnapshot());
  });

  it('renders correctly with an error after failed submission', async () => {
    const { container } = render(
      <Provider store={store}>
        <WrappedTranscriptLanguage
          fields={[{}]}
          languageOptions={languageOptions}
          meta={metaFailed}
        />
      </Provider>,
    );
    await waitFor(() => expect(container).toMatchSnapshot());
  });

  it('adds fields when the add button is pushed', async () => {
    const fields = [{}];
    render(
      <Provider store={store}>
        <WrappedTranscriptLanguage
          fields={fields}
          languageOptions={languageOptions}
          meta={meta}
        />
      </Provider>,
    );
    await waitFor(() => expect(fields.length).toEqual(1));
    const addBtn = await screen.findByTestId('test-js-add-btn');
    fireEvent.click(addBtn);
    expect(fields.length).toEqual(2);
  });
});
