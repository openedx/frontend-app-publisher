import React from 'react';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';

import CreateCoursePage from './index';

const organizations = [{ name: 'edX', key: 'edx' }, { name: 'edX2', key: 'edx2' }];

describe('CreateCoursePage', () => {
  it('renders html correctly', () => {
    const component = shallow(<CreateCoursePage />);
    expect(shallowToJson(component)).toMatchSnapshot();
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
    expect(shallowToJson(component)).toMatchSnapshot();
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
    expect(shallowToJson(component)).toMatchSnapshot();
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
    expect(shallowToJson(component)).toMatchSnapshot();
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
    expect(shallowToJson(component)).toMatchSnapshot();
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
    expect(shallowToJson(component)).toMatchSnapshot();
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
    expect(shallowToJson(component)).toMatchSnapshot();
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
    expect(shallowToJson(component)).toMatchSnapshot();
  });
});
