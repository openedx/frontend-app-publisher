import React from 'react';
import PropTypes from 'prop-types';

import { Icon, TextArea } from '@edx/paragon';
import { formatDate } from '../../utils/index';

import Comment from './Comment';
import FieldLabel from '../FieldLabel';
import Pane from './Pane';
import StatusAlert from '../StatusAlert';

class CommentsPane extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newCommentBody: '',
      showEmptyCommentAlert: false,
    };

    this.dismissEmptyCommentAlert = this.dismissEmptyCommentAlert.bind(this);
    this.handleUpdateCommentBody = this.handleUpdateCommentBody.bind(this);
    this.handleAddComment = this.handleAddComment.bind(this);
  }

  componentDidMount() {
    this.props.fetchComments(this.props.courseUuid);
  }

  componentDidUpdate(prevProps) {
    // Reload the comment thread when a new comment has been added
    if (!this.props.comments.error) {
      if (prevProps.comments.isCreating && !this.props.comments.isCreating) {
        this.props.fetchComments(this.props.courseUuid);
      }
    }
    // Scroll to the most recent comments on load
    if (prevProps.comments.isFetching && !this.props.comments.isFetching) {
      this.scrollToBottom();
    }
  }

  dismissEmptyCommentAlert() {
    this.setState({ showEmptyCommentAlert: false });
  }

  scrollToBottom() {
    const element = document.getElementById('endOfCommentThread');
    element.scrollIntoView({ behavior: 'auto', block: 'end' });
  }

  handleUpdateCommentBody(value) {
    this.setState({ newCommentBody: value });
  }

  handleAddComment() {
    const { newCommentBody } = this.state;
    const { courseUuid } = this.props;

    if (!newCommentBody) {
      this.setState({ showEmptyCommentAlert: true });
    } else {
      const newComment = {
        course_uuid: courseUuid,
        comment: newCommentBody,
      };

      this.props.addComment(newComment);
      this.setState({ newCommentBody: '', showEmptyCommentAlert: false });
    }
  }

  parseComments(comments) {
    return (
      comments.map(comment => (
        <Comment
          user={(comment.user.first_name && comment.user.last_name)
            ? `${comment.user.first_name} ${comment.user.last_name}` : comment.user.username}
          timestamp={formatDate(comment.created)}
          commentBody={comment.comment}
          courseRunKey={comment.course_run_key}
        />
      )));
  }

  render() {
    const {
      comments,
    } = this.props;
    const {
      showEmptyCommentAlert,
    } = this.state;

    const showSpinner = comments.isFetching;
    const hasComments = comments.data.length > 0;
    const showComments = !showSpinner && hasComments;
    const commentThread = !comments.isFetching && hasComments
      && this.parseComments(comments.data);

    return (
      <Pane className="mt-1" title="Comments">
        {showSpinner && <Icon className="fa fa-circle-o-notch fa-spin fa-fw" />}
        {!showSpinner
        && (
        <div className="scroll-comments mb-1 overflow-auto border-top border-bottom border-light">
          {!hasComments && !showSpinner && <div className="text-muted">No comments</div>}
          {showComments && commentThread}
          {!!comments.error && (
          <StatusAlert
            alertType="danger"
            message={comments.error}
            dismissible
          />
          )}
          <div
            id="endOfCommentThread"
            style={{ float: 'left', clear: 'both' }}
          />
        </div>
        )}
        <div className="leave-comment m-0">
          <div className="row">
            <div className="col align-center">
              <TextArea
                name="leave-comment"
                label={<FieldLabel text="Post a comment" />}
                value={this.state.newCommentBody}
                onChange={v => this.handleUpdateCommentBody(v)}
              />
            </div>
          </div>
          <div className="row">
            <div className="col align-left">
              <button
                type="button"
                className="btn btn-primary btn-sm mt-0 float-right"
                onClick={this.handleAddComment}
                disabled={this.state.disabled}
              >
                Post
              </button>
            </div>
          </div>
          {showEmptyCommentAlert
          && (
          <div className="mt-3">
            <StatusAlert
              alertType="danger"
              onClose={this.dismissEmptyCommentAlert}
              dismissible
              message="Comment cannot be blank."
            />
          </div>
          )}
        </div>
      </Pane>
    );
  }
}

CommentsPane.defaultProps = {
  addComment: null,
  comments: {
    data: [],
    isFetching: false,
  },
  courseUuid: '',
  fetchComments: null,
};

CommentsPane.propTypes = {
  addComment: PropTypes.func,
  comments: PropTypes.shape(),
  courseUuid: PropTypes.string,
  fetchComments: PropTypes.func,
};

export default CommentsPane;
