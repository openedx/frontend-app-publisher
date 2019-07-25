import React from 'react';
import { shallow } from 'enzyme';

import StafferPage from './index';

describe('StafferPage', () => {
  it('renders html correctly', () => {
    const component = shallow(<StafferPage stafferInfo={{}} />);
    expect(component).toMatchSnapshot();
  });

  it('renders html correctly when given a referrer', () => {
    const component = shallow(<StafferPage
      stafferInfo={{}}
      sourceInfo={{
        referrer: '/course/11111111-1111-1111-111111111111',
      }}
    />);
    expect(component).toMatchSnapshot();
  });

  it('renders page correctly with staffer info error', () => {
    const component = shallow(<StafferPage
      createStaffer={() => null}
      stafferInfo={{
        error: ['Fail'],
        isSaving: false,
      }}
    />);
    expect(component).toMatchSnapshot();
  });

  it('renders page correctly with no stafferInfo', () => {
    const component = shallow(<StafferPage
      createStaffer={() => null}
    />);
    expect(component).toMatchSnapshot();
  });

  it('renders page correctly while fetching', () => {
    const component = shallow(<StafferPage
      createStaffer={() => null}
      stafferInfo={{
        error: null,
        isSaving: false,
        isFetching: true,
      }}
    />);
    expect(component).toMatchSnapshot();
  });

  it('renders page correctly while creating', () => {
    const component = shallow(<StafferPage
      createStaffer={() => null}
      stafferInfo={{
        error: null,
        isSaving: true,
      }}
    />);
    expect(component).toMatchSnapshot();
  });
});
