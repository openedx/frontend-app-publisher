import React from 'react';
import { render, waitFor } from '@testing-library/react';

import { reduxForm } from 'redux-form';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { BaseStafferForm } from './StafferForm';

const mockStore = configureStore();
const store = mockStore({});

const stafferInfo = {
  data: {
    uuid: '14d7368b-51dc-42de-9952-0870bcd1f5f1',
    salutation: null,
    given_name: 'staff',
    family_name: 'er',
    bio: '<p><strong>b</strong>io<i>grapizing</i></p>',
    slug: 'staff-er',
    position: {
      title: 'señor',
      organization_name: '',
      organization_id: 1,
      organization_override: null,
      organization_marketing_url: null,
    },
    areas_of_expertise: [
      {
        id: 10,
        value: 'Experting',
      },
    ],
    profile_image: {
      medium: {
        height: 110,
        url: 'http://localhost:18381/media/media/people/profile_images/14d7368b-51dc-42de-9952-0870bcd1f5f1-1ffe0424ec10.medium.jpeg',
        width: 110,
      },
    },
    works: [],
    urls: {
      facebook: null,
      twitter: null,
      blog: null,
    },
    urls_detailed: [
      {
        title: 'Github',
        type: 'others',
        id: 10,
        url: 'https://github.com/openedx',
        display_title: 'Github',
      },
    ],
    email: null,
    profile_image_url: 'http://localhost:18381/media/media/people/profile_images/14d7368b-51dc-42de-9952-0870bcd1f5f1-1ffe0424ec10.jpeg',
    major_works: '<p><em>Workings</em></p>',
    published: true,
  },
  error: null,
  isFetching: false,
  isSaving: false,
};

const noReferrerSourceInfo = {
  referrer: null,
};

const sourceInfo = {
  referrer: 'courses/00000000-0000-0000-0000-000000000000',
};

const WrappedStafferForm = reduxForm({ form: 'testForm' })(BaseStafferForm);

describe('StafferForm', () => {
  it('renders html correctly', () => {
    const { container } = render(
      <MemoryRouter>
        <Provider store={store}>
          <WrappedStafferForm
            pristine
            submitting={false}
            isSaving={false}
            handleSubmit={() => {}}
            sourceInfo={noReferrerSourceInfo}
          />
        </Provider>
      </MemoryRouter>,
    );
    waitFor(() => expect(container).toMatchSnapshot());
  });

  it('renders html correctly when submitting', () => {
    const { container } = render(
      <MemoryRouter>
        <Provider store={store}>
          <WrappedStafferForm
            pristine={false}
            submitting
            isSaving={false}
            handleSubmit={() => {}}
            sourceInfo={noReferrerSourceInfo}
          />
        </Provider>
      </MemoryRouter>,
    );
    waitFor(() => expect(container).toMatchSnapshot());
  });

  it('renders html correctly when creating', () => {
    const { container } = render(
      <MemoryRouter>
        <Provider store={store}>
          <WrappedStafferForm
            pristine={false}
            submitting={false}
            isSaving
            handleSubmit={() => {}}
            sourceInfo={noReferrerSourceInfo}
          />
        </Provider>
      </MemoryRouter>,
    );
    waitFor(() => expect(container).toMatchSnapshot());
  });

  it('renders correctly with staffer info', () => {
    const { container } = render(
      <MemoryRouter>
        <Provider store={store}>
          <WrappedStafferForm
            pristine
            submitting={false}
            isSaving={false}
            stafferInfo={stafferInfo}
            handleSubmit={() => {}}
            sourceInfo={noReferrerSourceInfo}
          />
        </Provider>
      </MemoryRouter>,
    );
    waitFor(() => expect(container).toMatchSnapshot());
  });

  it('renders correctly when sent from the edit course page', () => {
    const { container } = render(
      <MemoryRouter>
        <Provider store={store}>
          <WrappedStafferForm
            pristine
            submitting={false}
            isSaving={false}
            handleSubmit={() => {}}
            sourceInfo={sourceInfo}
          />
        </Provider>
      </MemoryRouter>,
    );
    waitFor(() => expect(container).toMatchSnapshot());
  });
});
