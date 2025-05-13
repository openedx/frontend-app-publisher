import React from 'react';
import { render } from '@testing-library/react';

import CourseRunButtonToolbar from './CourseRunButtonToolbar';
import { PUBLISHED } from '../../data/constants';

describe('Course Run Button Toolbar', () => {
  it('default parameters', () => {
    const { container } = render(<CourseRunButtonToolbar />);
    expect(container).toMatchSnapshot();
  });

  it('editable', () => {
    const { container } = render(<CourseRunButtonToolbar editable />);
    expect(container).toMatchSnapshot();
  });

  it('published pristine', () => {
    const { container } = render(<CourseRunButtonToolbar editable pristine status={PUBLISHED} />);
    expect(container).toMatchSnapshot();
  });

  it('published with changes', () => {
    const { container } = render(<CourseRunButtonToolbar editable status={PUBLISHED} />);
    expect(container).toMatchSnapshot();
  });
});
