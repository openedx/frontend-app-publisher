import React from 'react';
import { render, waitFor } from '@testing-library/react';

import CourseRunButtonToolbar from './CourseRunButtonToolbar';
import { PUBLISHED } from '../../data/constants';

describe('Course Run Button Toolbar', () => {
  it('default parameters', () => {
    const { container } = render(<CourseRunButtonToolbar />);
    waitFor(() => expect(container).toMatchSnapshot());
  });

  it('editable', () => {
    const { container } = render(<CourseRunButtonToolbar editable />);
    waitFor(() => expect(container).toMatchSnapshot());
  });

  it('published pristine', () => {
    const { container } = render(<CourseRunButtonToolbar editable pristine status={PUBLISHED} />);
    waitFor(() => expect(container).toMatchSnapshot());
  });

  it('published with changes', () => {
    const { container } = render(<CourseRunButtonToolbar editable status={PUBLISHED} />);
    waitFor(() => expect(container).toMatchSnapshot());
  });
});
