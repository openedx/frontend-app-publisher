import React from 'react';
import PropTypes from 'prop-types';

import CollapsibleCourseRun from './CollapsibleCourseRun';

const CollapsibleCourseRuns = ({
  courseRuns,
  fields,
  ...passThroughProps
}) => (
  <div>
    {fields.map((courseRun, index) => (
      <CollapsibleCourseRun
        {...passThroughProps}
        courseRun={courseRuns[index]}
        courseId={courseRun}
      />
    ))}
  </div>
);

CollapsibleCourseRuns.propTypes = {
  courseRuns: PropTypes.arrayOf(PropTypes.shape({})),
  fields: PropTypes.shape({
    remove: PropTypes.func,
  }).isRequired,
};

CollapsibleCourseRuns.defaultProps = {
  courseRuns: [],
};

export default CollapsibleCourseRuns;
