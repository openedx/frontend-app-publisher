import React from 'react';
import { shallow } from 'enzyme';

import StafferPage from './index';

describe('StafferPage', () => {
  it('renders html correctly', () => {
    const component = shallow(<StafferPage stafferInfo={{}} stafferOptions={{}} />);
    expect(component).toMatchSnapshot();
  });

  it('renders html correctly when given a referrer', () => {
    const component = shallow(<StafferPage
      stafferInfo={{}}
      stafferOptions={{}}
      sourceInfo={{
        referrer: '/course/11111111-1111-1111-111111111111/edit',
      }}
    />);
    expect(component).toMatchSnapshot();
  });

  it('renders page correctly with staffer options error', () => {
    const component = shallow(<StafferPage
      createStaffer={() => null}
      fetchStafferOptions={() => null}
      stafferOptions={{
        data: {},
        error: ['Fail'],
        isFetching: false,
      }}
      stafferInfo={{
        error: null,
        isSaving: false,
      }}
    />);
    expect(component).toMatchSnapshot();
  });

  it('renders page correctly with staffer info error', () => {
    const component = shallow(<StafferPage
      createStaffer={() => null}
      fetchStafferOptions={() => null}
      stafferOptions={{
        data: {},
        error: null,
        isFetching: false,
      }}
      stafferInfo={{
        error: ['Fail'],
        isSaving: false,
      }}
    />);
    expect(component).toMatchSnapshot();
  });

  it('renders page correctly with staffer info error and staffer options error', () => {
    const component = shallow(<StafferPage
      createStaffer={() => null}
      fetchStafferOptions={() => null}
      stafferOptions={{
        data: {},
        error: ['Fail'],
        isFetching: false,
      }}
      stafferInfo={{
        error: ['Fail here too'],
        isSaving: false,
      }}
    />);
    expect(component).toMatchSnapshot();
  });

  it('renders page correctly with no stafferOptions', () => {
    const component = shallow(<StafferPage
      createStaffer={() => null}
      fetchStafferOptions={() => null}
      stafferInfo={{
        error: null,
        isSaving: false,
      }}
    />);
    expect(component).toMatchSnapshot();
  });

  it('renders page correctly with no stafferInfo', () => {
    const component = shallow(<StafferPage
      createStaffer={() => null}
      fetchStafferOptions={() => null}
      stafferOptions={{
        data: {},
        error: null,
        isFetching: false,
      }}
    />);
    expect(component).toMatchSnapshot();
  });

  it('renders page correctly while fetching', () => {
    const component = shallow(<StafferPage
      createStaffer={() => null}
      fetchStafferOptions={() => null}
      stafferOptions={{
        data: {},
        error: null,
        isFetching: true,
      }}
      stafferInfo={{
        error: null,
        isSaving: false,
      }}
    />);
    expect(component).toMatchSnapshot();
  });

  it('renders page correctly while creating', () => {
    const component = shallow(<StafferPage
      createStaffer={() => null}
      fetchStafferOptions={() => null}
      stafferOptions={{
        data: {},
        error: null,
        isFetching: false,
      }}
      stafferInfo={{
        error: null,
        isSaving: true,
      }}
    />);
    expect(component).toMatchSnapshot();
  });
});
