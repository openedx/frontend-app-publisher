import React from 'react';
import '@testing-library/jest-dom';
import { render, waitFor, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import configureStore from 'redux-mock-store';
import { createStore } from 'redux';
import CreateCourseRunPage from './index';
import { courseOptions } from '../../data/constants/testData';
import createRootReducer from '../../data/reducers';

const mockStore = configureStore();
const store = mockStore({});
const courseRunOptions = {
  data: {
    actions: {
      POST: {
        pacing_type: {
          choices: [],
        },
      },
    },
  },
};

describe('CreateCourseRunPage', () => {
  it('renders html correctly', () => {
    const { container } = render(
      <MemoryRouter>
        <Provider store={store}>
          <CreateCourseRunPage
            id="00000000-0000-0000-0000-000000000001"
            courseInfo={{
              data: {},
              isFetching: false,
              isCreating: false,
              error: null,
            }}
            courseRunOptions={courseRunOptions}
            courseOptions={courseOptions}
          />
        </Provider>
      </MemoryRouter>,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders html correctly with Course Type', () => {
    const { container } = render(
      <MemoryRouter>
        <Provider store={store}>
          <CreateCourseRunPage
            id="00000000-0000-0000-0000-000000000001"
            courseInfo={{
              data: {
                type: '8a8f30e1-23ce-4ed3-a361-1325c656b67b',
              },
              isFetching: false,
              isCreating: false,
              error: null,
            }}
            courseRunOptions={courseRunOptions}
            courseOptions={courseOptions}
          />
        </Provider>
      </MemoryRouter>,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders html correctly when fetching', () => {
    const { container } = render(<CreateCourseRunPage
      id="00000000-0000-0000-0000-000000000001"
      courseInfo={{
        data: {},
        isFetching: true,
        isCreating: false,
        error: null,
      }}
    />);
    expect(container).toMatchSnapshot();
  });

  it('renders html correctly when creating', () => {
    const { container } = render(
      <MemoryRouter>
        <Provider store={store}>
          <CreateCourseRunPage
            id="00000000-0000-0000-0000-000000000001"
            courseInfo={{
              data: {},
              isFetching: false,
              isCreating: true,
              error: null,
            }}
            courseRunOptions={courseRunOptions}
          />
        </Provider>
      </MemoryRouter>,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders html correctly when error', () => {
    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <CreateCourseRunPage
            id="00000000-0000-0000-0000-000000000001"
            courseInfo={{
              data: {},
              isFetching: false,
              isCreating: false,
              error: ['failed'],
            }}
            courseRunOptions={courseRunOptions}
          />
        </MemoryRouter>
      </Provider>,
    );
    expect(container).toMatchSnapshot();
  });

  it('refuses access to form when course is under review', async () => {
    render(
      <IntlProvider locale="en">
        <CreateCourseRunPage
          id="00000000-0000-0000-0000-000000000001"
          courseInfo={{
            data: {
              course_runs: [{
                status: 'review_by_legal',
                key: 'course-v1:edX+cs101+2T2019',
              }],
              title: 'Test Course',
            },
            isFetching: false,
            isCreating: false,
            error: null,
          }}
        />
      </IntlProvider>,
    );

    await waitFor(() => expect(
      screen.getByText(/Test Course has been submitted for review. No course runs can be added right now./i),
    ).toBeInTheDocument());

    await waitFor(() => expect(screen.queryByTestId('create-course-run-form')).not.toBeInTheDocument());
  });

  it.each(['instructor_paced', 'self_paced'])('default pacing options match last run: %s', async (pacing) => {
    const realStore = createStore(createRootReducer());
    render(
      <MemoryRouter>
        <Provider store={realStore}>
          <IntlProvider locale="en">
            <CreateCourseRunPage
              id="00000000-0000-0000-0000-000000000001"
              courseInfo={{
                data: {
                  course_runs: [{
                    status: 'unpublished',
                    key: 'course-v1:edX+cs101+2T2019',
                    pacing_type: pacing,
                  }],
                  title: 'Test Course',
                },
                isFetching: false,
                isCreating: false,
                error: null,
              }}
              courseRunOptions={{
                data: {
                  actions: {
                    POST: {
                      pacing_type: {
                        choices: [
                          { value: 'instructor_paced', display_name: 'Instructor-paced' },
                          { value: 'self_paced', display_name: 'Self-paced' },
                        ],
                      },
                    },
                  },
                },
              }}
            />
          </IntlProvider>
        </Provider>
      </MemoryRouter>,
    );

    const pacingSelect = screen.getByRole('combobox', { name: /pacing/i });
    await waitFor(() => expect(pacingSelect.value).toBe(pacing));
  });
});
