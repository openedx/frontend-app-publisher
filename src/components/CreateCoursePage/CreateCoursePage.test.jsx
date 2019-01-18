import React from 'react';
import { shallow } from 'enzyme';

import CreateCoursePage from './index';

describe('CreateCoursePage', () => {
  it('renders html correctly', () => {
    const component = shallow(<CreateCoursePage />);
    expect(component).toMatchSnapshot();
  });
  it('renders page correctly while fetching', () => {
    const component = shallow(<CreateCoursePage
      fetchOrganizations={() => null}
      publisherUserInfo={{
        organizations: [],
        error: null,
        isFetching: true,
      }}
      courseInfo={{
        error: null,
        courseCreated: false,
        data: {},
      }}
      createCourse={() => null}
    />);
    expect(component).toMatchSnapshot();
  });

  it('renders page correctly with organizations', () => {
    const organizations = [{ name: 'edX', key: 'edx' }, { name: 'edX2', key: 'edx2' }];
    const component = shallow(<CreateCoursePage
      fetchOrganizations={() => null}
      publisherUserInfo={{
        organizations,
        error: null,
        isFetching: false,
      }}
      courseInfo={{
        error: null,
        courseCreated: false,
        data: {},
      }}
      createCourse={() => null}
    />);
    expect(component).toMatchSnapshot();
  });
  it('renders page correctly with org error', () => {
    const organizations = [{ name: 'edX', key: 'edx' }, { name: 'edX2', key: 'edx2' }];
    const component = shallow(<CreateCoursePage
      fetchOrganizations={() => null}
      publisherUserInfo={{
        organizations,
        error: 'Fail',
        isFetching: false,
      }}
      courseInfo={{
        error: null,
        courseCreated: false,
        data: {},
      }}
      createCourse={() => null}
    />);
    expect(component).toMatchSnapshot();
  });
  it('renders page correctly with no publisherUserInfo', () => {
    const component = shallow(<CreateCoursePage
      fetchOrganizations={() => null}
      courseInfo={{
        error: null,
        courseCreated: false,
        data: {},
      }}
      createCourse={() => null}
    />);
    expect(component).toMatchSnapshot();
  });
  it('renders page correctly with course create error', () => {
    const organizations = [{ name: 'edX', key: 'edx' }, { name: 'edX2', key: 'edx2' }];
    const component = shallow(<CreateCoursePage
      fetchOrganizations={() => null}
      publisherUserInfo={{
        organizations,
        error: null,
        isFetching: false,
      }}
      courseInfo={{
        error: 'Fail',
        courseCreated: false,
        data: {},
      }}
      createCourse={() => null}
    />);
    expect(component).toMatchSnapshot();
  });
  it('renders page correctly with course create success', () => {
    const organizations = [{ name: 'edX', key: 'edx' }, { name: 'edX2', key: 'edx2' }];
    const component = shallow(<CreateCoursePage
      fetchOrganizations={() => null}
      publisherUserInfo={{
        organizations,
        error: null,
        isFetching: false,
      }}
      courseInfo={{
        error: null,
        courseCreated: true,
        data: {
          uuid: '11111111-1111-1111-1111-111111111111',
        },
      }}
      createCourse={() => null}
    />);
    expect(component).toMatchSnapshot();
  });
});
