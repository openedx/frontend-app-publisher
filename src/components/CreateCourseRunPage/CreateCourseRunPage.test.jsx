import React from 'react';
import { shallow } from 'enzyme';

import CreateCourseRunPage from './index';

describe('CreateCourseRunPage', () => {
  it('renders html correctly', () => {
    const component = shallow(<CreateCourseRunPage
      id="00000000-0000-0000-0000-000000000001"
      courseInfo={{
        data: {},
        isFetching: false,
        isCreating: false,
        error: null,
      }}
    />);
    expect(component).toMatchSnapshot();
  });
  it('renders html correctly when fetching', () => {
    const component = shallow(<CreateCourseRunPage
      id="00000000-0000-0000-0000-000000000001"
      courseInfo={{
        data: {},
        isFetching: true,
        isCreating: false,
        error: null,
      }}
    />);
    expect(component).toMatchSnapshot();
  });
  it('renders html correctly when creating', () => {
    const component = shallow(<CreateCourseRunPage
      id="00000000-0000-0000-0000-000000000001"
      courseInfo={{
        data: {},
        isFetching: false,
        isCreating: true,
        error: null,
      }}
    />);
    expect(component).toMatchSnapshot();
  });
  it('renders html correctly when error', () => {
    const component = shallow(<CreateCourseRunPage
      id="00000000-0000-0000-0000-000000000001"
      courseInfo={{
        data: {},
        isFetching: false,
        isCreating: false,
        error: ['failed'],
      }}
    />);
    expect(component).toMatchSnapshot();
  });
});
