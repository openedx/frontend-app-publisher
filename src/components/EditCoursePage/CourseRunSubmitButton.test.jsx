import React from 'react';
import { render } from '@testing-library/react';
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';

import CourseRunSubmitButton from './CourseRunSubmitButton';
import { REVIEW_BY_INTERNAL, REVIEW_BY_LEGAL, REVIEWED } from '../../data/constants';

describe('Course Run Submit Button', () => {
  beforeEach(() => {
    getAuthenticatedUser.mockReturnValue({ administrator: false });
  });

  it('default parameters', () => {
    const { container } = render(<CourseRunSubmitButton />);
    expect(container).toMatchSnapshot();
  });

  it('disabled', () => {
    const { container } = render(<CourseRunSubmitButton disabled />);
    expect(container).toMatchSnapshot();
  });

  it('submitting', () => {
    const { container } = render(<CourseRunSubmitButton submitting />);
    expect(container).toMatchSnapshot();
  });

  it('reviewed with exempt changes', () => {
    const { container } = render(<CourseRunSubmitButton status={REVIEWED} />);
    expect(container).toMatchSnapshot();
  });

  it('reviewed without exempt changes', () => {
    const { container } = render(<CourseRunSubmitButton status={REVIEWED} hasNonExemptChanges />);
    expect(container).toMatchSnapshot();
  });

  it('legal review', () => {
    getAuthenticatedUser.mockReturnValue({ administrator: true });
    const { container } = render(<CourseRunSubmitButton status={REVIEW_BY_LEGAL} />);
    expect(container).toMatchSnapshot();
  });

  it('internal review', () => {
    getAuthenticatedUser.mockReturnValue({ administrator: true });
    const { container } = render(<CourseRunSubmitButton status={REVIEW_BY_INTERNAL} />);
    expect(container).toMatchSnapshot();
  });
});
