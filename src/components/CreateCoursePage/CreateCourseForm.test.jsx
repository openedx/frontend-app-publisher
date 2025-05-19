import React from 'react';
import { render } from '@testing-library/react';

import { reduxForm } from 'redux-form';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { BaseCreateCourseForm } from './CreateCourseForm';
import { courseOptions, courseRunOptions } from '../../data/constants/testData';

const mockStore = configureStore();
const store = mockStore({});

const organizations = [
  { name: 'edX', key: 'edx' }, { name: 'edX2', key: 'edx2' },
];

const sources = [
  { name: 'souce1', slug: 'source1' }, { name: 'source2', slug: 'source2' },
];

Date.now = jest.fn(() => new Date(Date.UTC(2001, 0, 1)).valueOf());
const WrappedCreateCourseForm = reduxForm({ form: 'testForm' })(BaseCreateCourseForm);

describe('CreateCourseForm', () => {
  const initialValues = {
    org: 'edx',
    title: 'Hello',
    number: 'edx101',
    type: '8a8f30e1-23ce-4ed3-a361-1325c656b67b',
    prices: {
      verified: '100.00',
    },
  };

  it('renders html correctly with no orgs', () => {
    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <WrappedCreateCourseForm
            handleSubmit={() => {}}
            initialValues={{}}
            organizations={organizations}
            sources={sources}
            courseOptions={courseOptions}
            courseRunOptions={courseRunOptions}
          />
        </MemoryRouter>
      </Provider>,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders html correctly with no sources', () => {
    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <WrappedCreateCourseForm
            handleSubmit={() => {}}
            initialValues={{}}
            organizations={organizations}
            sources={[]}
            courseOptions={courseOptions}
            courseRunOptions={courseRunOptions}
          />
        </MemoryRouter>
      </Provider>,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders html correctly with data', () => {
    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <WrappedCreateCourseForm
            handleSubmit={() => {}}
            initialValues={initialValues}
            currentFormValues={initialValues}
            organizations={organizations}
            sources={sources}
            courseOptions={courseOptions}
            courseRunOptions={courseRunOptions}
          />
        </MemoryRouter>
      </Provider>,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders html correctly while submitting', () => {
    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <WrappedCreateCourseForm
            submitting
            isCreating
            pristine={false}
            handleSubmit={() => {}}
            initialValues={{}}
            currentFormValues={initialValues}
            organizations={organizations}
            sources={sources}
            courseOptions={courseOptions}
            courseRunOptions={courseRunOptions}
          />
        </MemoryRouter>
      </Provider>,
    );
    expect(container).toMatchSnapshot();
  });
});
