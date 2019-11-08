import React from 'react';
import { shallow } from 'enzyme';

import CreateCoursePage from './index';

const organizations = [{ name: 'edX', key: 'edx' }, { name: 'edX2', key: 'edx2' }];

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
        isCreating: false,
        data: {},
      }}
      createCourse={() => null}
    />);
    expect(component).toMatchSnapshot();
  });

  it('renders page correctly with organizations', () => {
    const component = shallow(<CreateCoursePage
      fetchOrganizations={() => null}
      publisherUserInfo={{
        organizations,
        error: null,
        isFetching: false,
      }}
      courseInfo={{
        error: null,
        isCreating: false,
        data: {},
      }}
      createCourse={() => null}
    />);
    expect(component).toMatchSnapshot();
  });
  it('renders page correctly with org error', () => {
    const component = shallow(<CreateCoursePage
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
    />);
    expect(component).toMatchSnapshot();
  });
  it('renders page correctly with no publisherUserInfo', () => {
    const component = shallow(<CreateCoursePage
      fetchOrganizations={() => null}
      courseInfo={{
        error: null,
        isCreating: false,
        data: {},
      }}
      createCourse={() => null}
      publisherUserInfo={null}
    />);
    expect(component).toMatchSnapshot();
  });
  it('renders page correctly with course create error', () => {
    const component = shallow(<CreateCoursePage
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
    />);
    expect(component).toMatchSnapshot();
  });
  it('renders page correctly with course create success', () => {
    const component = shallow(<CreateCoursePage
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
    />);
    expect(component).toMatchSnapshot();
  });
  it('renders page correctly with course create in progress', () => {
    const component = shallow(<CreateCoursePage
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
    />);
    expect(component).toMatchSnapshot();
  });
  it('isOrgWhitelisted is true with organization in Type Whitelist', () => {
    const component = shallow(<CreateCoursePage
      fetchOrganizations={() => null}
      publisherUserInfo={{
        // See src/setupTest.js for where fakeOrgX is defined in process.env.TYPE_WHITELIST
        organizations: [{ name: 'Fake Org', key: 'fakeOrgX' }],
        error: null,
        isFetching: false,
      }}
      courseInfo={{
        error: null,
        isCreating: false,
        data: {},
      }}
      createCourse={() => null}
    />);
    expect(component.instance().isOrgWhitelisted()).toEqual(true);
  });
});
