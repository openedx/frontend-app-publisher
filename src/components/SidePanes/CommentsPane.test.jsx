import React from 'react';
import {
  render, screen, waitFor, fireEvent,
} from '@testing-library/react';

import { IntlProvider } from '@edx/frontend-platform/i18n';
import CommentsPane from './CommentsPane';

describe('CommentsPane', () => {
  const mockFetch = jest.fn();
  const basicCommentThread = {
    data: [
      {
        comment: 'Test comment body',
        course_run_key: 'course-v1:edX+DemoX+Demo_Course',
        user: {
          last_name: 'Bob',
          first_name: 'Billy',
          email: '',
          username: 'billybob@example.com',
        },
        created: '2019-08-09T17:15:09.000+0000',
      },
      {
        comment: 'Another test comment',
        course_run_key: 'course-v1:edX+DemoX+Demo_Course',
        user: {
          last_name: '',
          first_name: '',
          email: '',
          username: 'edx@example.com',
        },
        created: '2019-08-09T19:15:09.000+0000',
      },
    ],
    error: null,
    isFetching: false,
  };
  const emptyCommentThread = {
    data: [],
    error: null,
    isFetching: false,
  };

  it('displays first and last name of user when available', async () => {
    render(<CommentsPane
      comments={basicCommentThread}
      fetchComments={mockFetch}
    />);
    const comments = await screen.findAllByTestId('comment-card');
    expect(comments).toHaveLength(2);
    waitFor(() => expect(comments[0]).toHaveTextContent('Billy Bob'));
  });

  it('displays username if first and last name is not available', async () => {
    render(<CommentsPane
      comments={basicCommentThread}
      fetchComments={mockFetch}
    />);
    const comments = await screen.findAllByTestId('comment-card');
    expect(comments).toHaveLength(2);
    waitFor(() => expect(comments[1]).toHaveTextContent('edx@example.com'));
  });

  it('has label for no comments', async () => {
    render(<CommentsPane
      comments={emptyCommentThread}
      fetchComments={mockFetch}
    />);
    waitFor(() => expect(screen.getByText('No comments')).toHaveClass('text-muted'));
  });

  it('allows adding a comment', async () => {
    const mockCallback = jest.fn();
    render(<CommentsPane
      addComment={mockCallback}
      comments={emptyCommentThread}
      fetchComments={mockFetch}
    />);
    const input = screen.getByLabelText(/Post a comment/i);
    fireEvent.change(input, { target: { value: 'Test comment' } });
    fireEvent.click(screen.getByRole('button', { name: /post/i }));
    expect(mockCallback).toHaveBeenCalledWith({ comment: 'Test comment', course_uuid: '' });
  });

  it('displays status alert on empty comment body', async () => {
    const mockAdd = jest.fn();
    render(
      <IntlProvider locale="en">
        <CommentsPane
          addComment={mockAdd}
          comments={emptyCommentThread}
          fetchComments={mockFetch}
        />
      </IntlProvider>,
    );
    const postCommentButton = screen.getByRole('button', { name: /post/i });
    fireEvent.click(postCommentButton);
    waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument());
  });

  it('displays status alert on error response', async () => {
    const errorCommentThread = { ...emptyCommentThread, error: 'TestErrorMessage' };

    render(
      <IntlProvider locale="en">
        <CommentsPane
          comments={errorCommentThread}
          fetchComments={mockFetch}
        />
      </IntlProvider>,
    );
    waitFor(() => expect(screen.getByText('TestErrorMessage')).toBeInTheDocument());
  });
});
