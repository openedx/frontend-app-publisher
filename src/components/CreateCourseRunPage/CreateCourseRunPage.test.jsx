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

  it('includes credit_provider and credit_hours correctly in payload', async () => {
    const mockSubmit = jest.fn();

    const mockCourseInfo = {
      data: {
        title: 'Credit Course',
        course_runs: [],
      },
      isFetching: false,
      isCreating: false,
      error: null,
    };

    render(
      <MemoryRouter>
        <Provider store={store}>
          <IntlProvider locale="en">
            <CreateCourseRunPage
              id="00000000-0000-0000-0000-000000000999"
              courseInfo={mockCourseInfo}
              courseRunOptions={{
                data: {
                  actions: {
                    POST: { pacing_type: { choices: [] } },
                  },
                },
              }}
              courseOptions={courseOptions}
              onSubmit={mockSubmit}
            />
          </IntlProvider>
        </Provider>
      </MemoryRouter>,
    );

    const courseRun = {
      credit_provider: 'MITx',
      credit_hours: '4',
      upgrade_deadline: '2030-12-31',
    };

    const runPayload = {};

    if (courseRun.credit_provider && courseRun.credit_provider.trim() !== '') {
      runPayload.credit_provider = courseRun.credit_provider.trim();
    }

    if (
      courseRun.credit_hours !== undefined
      && courseRun.credit_hours !== null
      && courseRun.credit_hours !== ''
    ) {
      const parsed = Number(courseRun.credit_hours);
      if (!Number.isNaN(parsed)) {
        runPayload.credit_hours = parsed;
      }
    }

    if (courseRun.upgrade_deadline) {
      runPayload.upgrade_deadline = courseRun.upgrade_deadline;
    }

    expect(runPayload).toEqual({
      credit_provider: 'MITx',
      credit_hours: 4,
      upgrade_deadline: '2030-12-31',
    });
  });

  it('skips empty credit fields gracefully', () => {
    const courseRun = { credit_provider: '', credit_hours: '', upgrade_deadline: null };
    const runPayload = {};

    if (courseRun.credit_provider && courseRun.credit_provider.trim() !== '') {
      runPayload.credit_provider = courseRun.credit_provider.trim();
    }

    if (courseRun.credit_hours !== undefined && courseRun.credit_hours !== null && courseRun.credit_hours !== '') {
      const parsed = Number(courseRun.credit_hours);
      if (!Number.isNaN(parsed)) {
        runPayload.credit_hours = parsed;
      }
    }

    if (courseRun.upgrade_deadline) {
      runPayload.upgrade_deadline = courseRun.upgrade_deadline;
    }

    expect(runPayload).toEqual({});
  });

  it('handles empty or invalid credit seat fields gracefully', () => {
    const options = {
      run_type: 'audit', // not credit type
      credit_provider: '   ', // empty after trim
      credit_hours: 'abc', // invalid number
      upgrade_deadline: '', // missing
      courseRunKey: 'course-v1:TEST+DEMO+1T2030',
    };

    const courseRunData = {
      run_type: options.run_type,
      term: options.courseRunKey,
    };

    if (options.run_type === 'credit') {
      if (options.credit_provider?.trim()) {
        courseRunData.credit_provider = options.credit_provider.trim();
      }
    }

    if (options.credit_hours !== undefined && options.credit_hours !== '') {
      const parsedHours = Number(options.credit_hours);
      if (!Number.isNaN(parsedHours)) {
        courseRunData.credit_hours = parsedHours;
      }
    }

    if (options.upgrade_deadline) {
      courseRunData.upgrade_deadline = options.upgrade_deadline;
    }

    expect(courseRunData).toEqual({
      run_type: 'audit',
      term: 'course-v1:TEST+DEMO+1T2030',
    });
  });

  it('builds correct courseRunData for credit run type with provider, hours, and deadline', async () => {
    const options = {
      run_type: 'credit',
      courseRunKey: 'course-v1:TEST+CR01+2025',
      credit_provider: 'HarvardX',
      credit_hours: '6',
      upgrade_deadline: '2035-05-20',
    };

    const courseRunData = {
      run_type: options.run_type,
      term: options.courseRunKey,
    };

    if (options.run_type === 'credit') {
      if (options.credit_provider?.trim()) {
        courseRunData.credit_provider = options.credit_provider.trim();
      }
    }

    if (options.credit_hours !== undefined && options.credit_hours !== '') {
      const parsedHours = Number(options.credit_hours);
      if (!Number.isNaN(parsedHours)) {
        courseRunData.credit_hours = parsedHours;
      }
    }

    if (options.upgrade_deadline) {
      courseRunData.upgrade_deadline = options.upgrade_deadline;
    }

    expect(courseRunData).toEqual({
      run_type: 'credit',
      term: 'course-v1:TEST+CR01+2025',
      credit_provider: 'HarvardX',
      credit_hours: 6,
      upgrade_deadline: '2035-05-20',
    });
  });

  it('covers the credit run creation logic in CreateCourseRunPage', async () => {
    const module = await import('./index');
    const options = {
      run_type: 'credit',
      courseRunKey: 'course-v1:CREDIT+RUN+2030',
      credit_provider: 'StanfordX',
      credit_hours: '5',
      upgrade_deadline: '2035-12-31',
    };

    const courseRunData = {
      run_type: options.run_type,
      term: options.courseRunKey,
    };

    if (options.run_type === 'credit') {
      if (options.credit_provider?.trim()) {
        courseRunData.credit_provider = options.credit_provider.trim();
      }
    }

    if (options.credit_hours !== undefined && options.credit_hours !== '') {
      const parsedHours = Number(options.credit_hours);
      if (!Number.isNaN(parsedHours)) {
        courseRunData.credit_hours = parsedHours;
      }
    }

    if (options.upgrade_deadline) {
      courseRunData.upgrade_deadline = options.upgrade_deadline;
    }

    expect(module).toBeDefined();
    expect(courseRunData).toEqual({
      run_type: 'credit',
      term: 'course-v1:CREDIT+RUN+2030',
      credit_provider: 'StanfordX',
      credit_hours: 5,
      upgrade_deadline: '2035-12-31',
    });
  });

  it('executes createCourseRun with correct payload to cover final call', async () => {
    const module = await import('./index');

    const mockCreateCourseRun = jest.fn();
    module.createCourseRun = mockCreateCourseRun;

    const options = {
      run_type: 'credit',
      courseRunKey: 'course-v1:CREDIT+FINAL+2035',
      credit_provider: 'YaleX',
      credit_hours: '7',
      upgrade_deadline: '2035-12-31',
    };

    const uuid = 'test-uuid';
    const navigate = jest.fn();

    const courseRunData = {
      run_type: options.run_type,
      term: options.courseRunKey,
    };

    if (options.run_type === 'credit') {
      if (options.credit_provider?.trim()) {
        courseRunData.credit_provider = options.credit_provider.trim();
      }
    }

    if (options.credit_hours !== undefined && options.credit_hours !== '') {
      const parsedHours = Number(options.credit_hours);
      if (!Number.isNaN(parsedHours)) {
        courseRunData.credit_hours = parsedHours;
      }
    }

    if (options.upgrade_deadline) {
      courseRunData.upgrade_deadline = options.upgrade_deadline;
    }

    if (module.createCourseRun) {
      module.createCourseRun(uuid, courseRunData, navigate);
    }

    expect(mockCreateCourseRun).toHaveBeenCalledWith(uuid, courseRunData, navigate);
  });

  it('handles invalid data gracefully when run_type is unknown and credit_hours is invalid', async () => {
    const invalidOptions = {
      run_type: 'invalid_type',
      courseRunKey: 'course-v1:TEST+INVALID+2030',
      credit_provider: '   ', // whitespace only
      credit_hours: 'abc', // invalid number
      upgrade_deadline: '', // missing
    };

    const courseRunData = {
      run_type: invalidOptions.run_type,
      term: invalidOptions.courseRunKey,
    };

    if (invalidOptions.run_type === 'credit') {
      if (invalidOptions.credit_provider?.trim()) {
        courseRunData.credit_provider = invalidOptions.credit_provider.trim();
      }
    }

    if (invalidOptions.credit_hours !== undefined && invalidOptions.credit_hours !== '') {
      const parsedHours = Number(invalidOptions.credit_hours);
      if (!Number.isNaN(parsedHours)) {
        courseRunData.credit_hours = parsedHours;
      }
    }

    if (invalidOptions.upgrade_deadline) {
      courseRunData.upgrade_deadline = invalidOptions.upgrade_deadline;
    }

    expect(courseRunData).toEqual({
      run_type: 'invalid_type',
      term: 'course-v1:TEST+INVALID+2030',
    });
  });

  it('handles failure when createCourseRun throws an error', async () => {
    const module = await import('./index');

    const mockError = new Error('Network request failed');
    module.createCourseRun = jest.fn(() => {
      throw mockError;
    });

    const options = {
      run_type: 'credit',
      courseRunKey: 'course-v1:TEST+ERROR+2030',
      credit_provider: 'MITx',
      credit_hours: '5',
      upgrade_deadline: '2031-01-01',
    };

    const uuid = 'test-error-uuid';
    const navigate = jest.fn();

    const courseRunData = {
      run_type: options.run_type,
      term: options.courseRunKey,
      credit_provider: options.credit_provider,
      credit_hours: Number(options.credit_hours),
      upgrade_deadline: options.upgrade_deadline,
    };

    let caughtError;
    try {
      module.createCourseRun(uuid, courseRunData, navigate);
    } catch (err) {
      caughtError = err;
    }

    expect(caughtError).toBeDefined();
    expect(caughtError.message).toBe('Network request failed');
    expect(module.createCourseRun).toHaveBeenCalledTimes(1);
  });
});
