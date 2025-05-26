import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { MemoryRouter } from 'react-router-dom';
import CreateCoursePage from './index';
import { courseOptions, courseRunOptions } from '../../data/constants/testData';

const organizations = [{ name: 'edX', key: 'edx' }, { name: 'edX2', key: 'edx2' }];
const sources = [{ name: 'souce1', slug: 'source1' }, { name: 'source2', slug: 'source2' }];
const mockStore = configureStore();
const store = mockStore({});

describe('CreateCoursePage', () => {
  it('renders html correctly', () => {
    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <CreateCoursePage courseOptions={courseOptions} courseRunOptions={courseRunOptions} />
        </MemoryRouter>
      </Provider>,
    );

    expect(container).toMatchSnapshot();
  });

  it('renders page correctly while fetching', () => {
    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <CreateCoursePage
            courseOptions={courseOptions}
            courseRunOptions={courseRunOptions}
            fetchOrganizations={() => null}
            publisherUserInfo={{
              organizations: [],
              error: null,
              isFetching: true,
            }}
            productSourceOptions={{
              productSources: [],
              error: null,
              isFetching: true,
            }}
            courseInfo={{
              error: null,
              isCreating: false,
              data: {},
            }}
            createCourse={() => null}
          />
        </MemoryRouter>
      </Provider>,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders page correctly with organizations', () => {
    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <CreateCoursePage
            courseOptions={courseOptions}
            courseRunOptions={courseRunOptions}
            fetchOrganizations={() => null}
            publisherUserInfo={{
              organizations,
              error: null,
              isFetching: false,
            }}
            productSourceOptions={{
              productSources: sources,
              error: null,
              isFetching: false,
            }}
            courseInfo={{
              error: null,
              isCreating: false,
              data: {},
            }}
            createCourse={() => null}
          />
        </MemoryRouter>
      </Provider>,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders page correctly with org error', () => {
    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <CreateCoursePage
            courseOptions={courseOptions}
            courseRunOptions={courseRunOptions}
            fetchOrganizations={() => null}
            publisherUserInfo={{
              organizations,
              error: ['Fail'],
              isFetching: false,
            }}
            courseInfo={{
              error: null,
              isCreating: false,
              data: {},
            }}
            createCourse={() => null}
          />
        </MemoryRouter>
      </Provider>,
    );
    expect(container).toMatchSnapshot();
  });
  it('renders page correctly with no publisherUserInfo', () => {
    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <CreateCoursePage
            courseOptions={courseOptions}
            courseRunOptions={courseRunOptions}
            fetchOrganizations={() => null}
            courseInfo={{
              error: null,
              isCreating: false,
              data: {},
            }}
            createCourse={() => null}
            publisherUserInfo={null}
          />
        </MemoryRouter>
      </Provider>,
    );
    expect(container).toMatchSnapshot();
  });
  it('renders page correctly with course create error', () => {
    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <CreateCoursePage
            courseOptions={courseOptions}
            courseRunOptions={courseRunOptions}
            fetchOrganizations={() => null}
            publisherUserInfo={{
              organizations,
              error: null,
              isFetching: false,
            }}
            courseInfo={{
              error: ['Fail'],
              isCreating: false,
              data: {},
            }}
            createCourse={() => null}
          />
        </MemoryRouter>
      </Provider>,
    );
    expect(container).toMatchSnapshot();
  });
  it('renders page correctly with course create success', () => {
    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <CreateCoursePage
            courseOptions={courseOptions}
            courseRunOptions={courseRunOptions}
            fetchOrganizations={() => null}
            publisherUserInfo={{
              organizations,
              error: null,
              isFetching: false,
            }}
            courseInfo={{
              error: null,
              isCreating: false,
              data: {
                uuid: '11111111-1111-1111-1111-111111111111',
              },
            }}
            createCourse={() => null}
          />
        </MemoryRouter>
      </Provider>,
    );
    expect(container).toMatchSnapshot();
  });
  it('renders page correctly with course create in progress', () => {
    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <CreateCoursePage
            courseOptions={courseOptions}
            courseRunOptions={courseRunOptions}
            fetchOrganizations={() => null}
            publisherUserInfo={{
              organizations,
              error: null,
              isFetching: false,
            }}
            courseInfo={{
              error: null,
              isCreating: true,
              data: {
                uuid: '11111111-1111-1111-1111-111111111111',
              },
            }}
            createCourse={() => null}
          />
        </MemoryRouter>
      </Provider>,
    );
    expect(container).toMatchSnapshot();
  });
});
