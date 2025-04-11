import React from 'react';
import { render, screen } from '@testing-library/react';
import CourseTable from './index';
import { MemoryRouter } from "react-router-dom";

describe('CourseTable', () => {
  it('shows a table', () => {
    render(<MemoryRouter><CourseTable /></MemoryRouter>);
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('hides table and button when blacklisted', () => {
    const publisherUserInfo = { organizations: [{ key: 'fake1', name: 'fake_name1' }] };
    render(<CourseTable publisherUserInfo={publisherUserInfo} />);

    expect(screen.queryByRole('table')).not.toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('displays table and button when not blacklisted', () => {
    const publisherUserInfo = { organizations: [{ key: 'fake2', name: 'fake_name2' }] };
    render(<CourseTable publisherUserInfo={publisherUserInfo} />);

    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('displays table and button when user has no orgs', () => {
    const publisherUserInfo = { organizations: [] };
    render(<CourseTable publisherUserInfo={publisherUserInfo} />);

    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
