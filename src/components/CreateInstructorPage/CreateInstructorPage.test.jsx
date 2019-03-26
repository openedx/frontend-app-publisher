import React from 'react';
import { shallow } from 'enzyme';

import CreateInstructorPage from './index';

describe('CreateInstructorPage', () => {
  it('renders html correctly', () => {
    const component = shallow(<CreateInstructorPage instructorInfo={{}} instructorOptions={{}} />);
    expect(component).toMatchSnapshot();
  });

  it('renders page correctly with instructor options error', () => {
    const component = shallow(<CreateInstructorPage
      createInstructor={() => null}
      fetchInstructorOptions={() => null}
      instructorOptions={{
        data: {},
        error: 'Fail',
        isFetching: false,
      }}
      instructorInfo={{
        error: null,
        isCreating: false,
      }}
    />);
    expect(component).toMatchSnapshot();
  });

  it('renders page correctly with instructor info error', () => {
    const component = shallow(<CreateInstructorPage
      createInstructor={() => null}
      fetchInstructorOptions={() => null}
      instructorOptions={{
        data: {},
        error: null,
        isFetching: false,
      }}
      instructorInfo={{
        error: 'Fail',
        isCreating: false,
      }}
    />);
    expect(component).toMatchSnapshot();
  });

  it('renders page correctly with instructor info error and instructor options error', () => {
    const component = shallow(<CreateInstructorPage
      createInstructor={() => null}
      fetchInstructorOptions={() => null}
      instructorOptions={{
        data: {},
        error: 'Fail',
        isFetching: false,
      }}
      instructorInfo={{
        error: 'Fail here too',
        isCreating: false,
      }}
    />);
    expect(component).toMatchSnapshot();
  });

  it('renders page correctly with no instructorOptions', () => {
    const component = shallow(<CreateInstructorPage
      createInstructor={() => null}
      fetchInstructorOptions={() => null}
      instructorInfo={{
        error: null,
        isCreating: false,
      }}
    />);
    expect(component).toMatchSnapshot();
  });

  it('renders page correctly with no instructorInfo', () => {
    const component = shallow(<CreateInstructorPage
      createInstructor={() => null}
      fetchInstructorOptions={() => null}
      instructorOptions={{
        data: {},
        error: null,
        isFetching: false,
      }}
    />);
    expect(component).toMatchSnapshot();
  });

  it('renders page correctly while fetching', () => {
    const component = shallow(<CreateInstructorPage
      createInstructor={() => null}
      fetchInstructorOptions={() => null}
      instructorOptions={{
        data: {},
        error: null,
        isFetching: true,
      }}
      instructorInfo={{
        error: null,
        isCreating: false,
      }}
    />);
    expect(component).toMatchSnapshot();
  });

  it('renders page correctly while creating', () => {
    const component = shallow(<CreateInstructorPage
      createInstructor={() => null}
      fetchInstructorOptions={() => null}
      instructorOptions={{
        data: {},
        error: null,
        isFetching: false,
      }}
      instructorInfo={{
        error: null,
        isCreating: true,
      }}
    />);
    expect(component).toMatchSnapshot();
  });
});
