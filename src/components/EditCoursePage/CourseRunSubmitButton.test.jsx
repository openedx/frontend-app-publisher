import React from 'react';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';

import CourseRunSubmitButton from './CourseRunSubmitButton';
import { REVIEW_BY_INTERNAL, REVIEW_BY_LEGAL, REVIEWED } from '../../data/constants';

describe('Course Run Submit Button', () => {
  beforeEach(() => {
    getAuthenticatedUser.mockReturnValue({ administrator: false });
  });

  it('default parameters', () => {
    const component = shallow(<CourseRunSubmitButton />);
    expect(shallowToJson(component)).toMatchSnapshot();
  });

  it('disabled', () => {
    const component = shallow(<CourseRunSubmitButton disabled />);
    expect(shallowToJson(component)).toMatchSnapshot();
  });

  it('submitting', () => {
    const component = shallow(<CourseRunSubmitButton submitting />);
    expect(shallowToJson(component)).toMatchSnapshot();
  });

  it('reviewed with exempt changes', () => {
    const component = shallow(<CourseRunSubmitButton status={REVIEWED} />);
    expect(shallowToJson(component)).toMatchSnapshot();
  });

  it('reviewed without exempt changes', () => {
    const component = shallow(<CourseRunSubmitButton status={REVIEWED} hasNonExemptChanges />);
    expect(shallowToJson(component)).toMatchSnapshot();
  });

  it('legal review', () => {
    getAuthenticatedUser.mockReturnValue({ administrator: true });
    const component = shallow(<CourseRunSubmitButton status={REVIEW_BY_LEGAL} />);
    expect(shallowToJson(component)).toMatchSnapshot();
  });

  it('internal review', () => {
    getAuthenticatedUser.mockReturnValue({ administrator: true });
    const component = shallow(<CourseRunSubmitButton status={REVIEW_BY_INTERNAL} />);
    expect(shallowToJson(component)).toMatchSnapshot();
  });
});
