import React from 'react';
import PropTypes from 'prop-types';
import { Hyperlink } from '@edx/paragon';

import LabelledData from '../../components/LabelledData';

const CourseRun = courseRun =>
  (
    <div className="container mx-auto">
      <LabelledData
        id="title"
        label="Title"
        value={courseRun.title}
      />
      <LabelledData
        id="studio-url"
        label="Studio URL"
        value={
          <Hyperlink
            content={courseRun.marketing_url}
            destination={courseRun.marketing_url}
            target="_blank"
          />
        }
      />
      <LabelledData
        id="start-date"
        label="Start Date (time in UTC)"
        value={courseRun.start}
      />
      <LabelledData
        id="end-date"
        label="End Date (time in UTC)"
        value={courseRun.end}
      />
      <LabelledData
        id="enrollment-track"
        label="Enrollment Track"
        value={courseRun.type}
      />
      <LabelledData
        id="estimated-effort"
        label="Estimated Effort"
        value={courseRun.weeks_to_complete}
      />
    </div>
  );

CourseRun.propTypes = {
  courseRun: PropTypes.shape({
    key: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    marketing_url: PropTypes.string,
    start: PropTypes.string.isRequired,
    end: PropTypes.string,
    type: PropTypes.string.isRequired,
    staff: PropTypes.arrayOf(PropTypes.shape({})),
    weeks_to_complete: PropTypes.string,

  }).isRequired,
};

export default CourseRun;
