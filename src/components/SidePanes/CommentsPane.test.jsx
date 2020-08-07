import React from 'react';
import { shallow } from 'enzyme';

import Comment from './Comment';
import CommentsPane from './CommentsPane';
import StatusAlert from '../StatusAlert';

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

  it('displays first and last name of user when available', () => {
    const wrapper = shallow(<CommentsPane
      comments={basicCommentThread}
      fetchComments={mockFetch}
    />);
    const comments = wrapper.find(Comment);
    expect(comments).toHaveLength(2);
    expect(comments.at(0).prop('user')).toEqual('Billy Bob');
  });

  it('displays username if first and last name is not available', () => {
    const wrapper = shallow(<CommentsPane
      comments={basicCommentThread}
      fetchComments={mockFetch}
    />);
    const comments = wrapper.find(Comment);
    expect(comments).toHaveLength(2);
    expect(comments.at(1).prop('user')).toEqual('edx@example.com');
  });

  it('has label for no comments', () => {
    const wrapper = shallow(<CommentsPane
      comments={emptyCommentThread}
      fetchComments={mockFetch}
    />);
    const comments = wrapper.find(Comment);
    expect(comments).toHaveLength(0);
    expect(wrapper.contains(<div className="text-muted">No comments</div>)).toEqual(true);
  });

  it('allows adding a comment', () => {
    const mockCallback = jest.fn();
    const wrapper = shallow(<CommentsPane
      addComment={mockCallback}
      comments={emptyCommentThread}
      fetchComments={mockFetch}
    />);
    wrapper.setState({ newCommentBody: 'Test comment' });

    const postCommentButton = wrapper.find('.btn-primary');
    postCommentButton.simulate('click');

    expect(wrapper.state().showEmptyCommentAlert).toEqual(false);
    // not sure what else to test here
  });

  it('displays status alert on empty comment body', () => {
    const mockAdd = jest.fn();
    const wrapper = shallow(<CommentsPane
      addComment={mockAdd}
      comments={emptyCommentThread}
      fetchComments={mockFetch}
    />);
    wrapper.setState({ newCommentBody: '' });

    const postCommentButton = wrapper.find('.btn-primary');
    postCommentButton.simulate('click');

    const commentAlert = wrapper.find(StatusAlert);
    expect(commentAlert);
    expect(wrapper.state().showEmptyCommentAlert).toEqual(true);
  });

  it('displays status alert on error response', () => {
    const errorCommentThread = Object.assign(emptyCommentThread, { error: 'TestErrorMessage' });

    const wrapper = shallow(<CommentsPane
      comments={errorCommentThread}
      fetchComments={mockFetch}
    />);

    const commentAlert = wrapper.find(StatusAlert);
    expect(commentAlert);
  });
});
