import React from 'react';
import PropTypes from 'prop-types';

import CollapsibleCourseRun from './CollapsibleCourseRun';

const CollapsibleCourseRuns = ({
  courseRuns,
  fields,
  collapsiblesOpen,
  onToggle,
  ...passThroughProps
}) => (
  <div className="course-run-collapsible">
    {fields.map((courseRun, index) => (
      <CollapsibleCourseRun
        {...passThroughProps}
        courseRun={courseRuns[index]}
        courseId={courseRun}
        index={index}
        key={courseRuns[index].key}
        isOpen={collapsiblesOpen[index]}
        onToggle={value => onToggle(index, value)}
      />
    ))}
  </div>
);

CollapsibleCourseRuns.propTypes = {
  courseRuns: PropTypes.arrayOf(PropTypes.shape({})),
  fields: PropTypes.shape({
    remove: PropTypes.func,
  }).isRequired,
  collapsiblesOpen: PropTypes.arrayOf(PropTypes.bool),
  onToggle: PropTypes.func.isRequired,
};

CollapsibleCourseRuns.defaultProps = {
  courseRuns: [],
  collapsiblesOpen: [],
};

export default CollapsibleCourseRuns;
