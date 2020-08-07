import React from 'react';
import PropTypes from 'prop-types';

function Comment(props) {
  return (
    <div className="card overflow-auto m-0 border-0">
      <div className="card-body p-2 mb-0">
        <div className="card-title comment-info mb-0 font-weight-bold">{props.user} <small className="text-muted"> {props.timestamp}</small></div>
        <small className="text-muted">{props.courseRunKey ? `${props.courseRunKey}` : null}</small>
        <p className="card-text comment-body">
          {props.commentBody.replace(/<[^>]*>?/gm, '') /* We want to strip any HTMl that is in the comment body */}
        </p>
      </div>
    </div>
  );
}

Comment.defaultProps = {
  courseRunKey: null,
};

Comment.propTypes = {
  user: PropTypes.string.isRequired,
  timestamp: PropTypes.string.isRequired,
  commentBody: PropTypes.string.isRequired,
  courseRunKey: PropTypes.string,
};

export default Comment;
