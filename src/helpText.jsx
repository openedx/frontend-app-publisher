import React from 'react';

/**
 * This file holds a few jsx constants to share helpText between different components.
 * Please keep it sorted for ease of use.
 */

const endDateHelp = (
  <div>
    <p>
      If you are unsure of the exact date, specify a day that is close to the
      estimated end date. For example, if your course will end near the end
      of March, specify March 31.
    </p>
  </div>
);

const enrollmentHelp = (
  <div>
    <p>
      The enrollment track determines whether a course offers a paid
      certificate and what sort of verification is required.
    </p>
    <p>
      <a
        href="https://edx.readthedocs.io/projects/edx-partner-course-staff/en/latest/glossary.html#enrollment-track-g"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn more.
      </a>
    </p>
  </div>
);

const startDateHelp = (
  <div>
    <p>Start on a Tuesday, Wednesday, or Thursday.</p>
    <p>Avoid major U.S. holidays.</p>
    <p>
      If you are unsure of the exact date, specify a day that is close to the
      estimated start date. For example, if your course will start near the end
      of March, specify March 31.
    </p>
  </div>
);

const titleHelp = (
  <div>
    <p>Maximum 70 characters. Recommended 50 or fewer characters.</p>
    <p>An effective course title:</p>
    <ul>
      <li>Clearly indicates the course subject matter.</li>
      <li>Follows search engine optimization (SEO) guidelines.</li>
      <li>Targets a global audience.</li>
    </ul>
    <p>
      <a
        href="https://edx.readthedocs.io/projects/edx-partner-course-staff/en/latest/set_up_course/planning_course_information/title_number_guidelines.html#course-title-guidelines"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn more.
      </a>
    </p>
    <p><b>Example:</b></p>
    <p>English Grammar and Essay Writing</p>
  </div>
);

export {
  endDateHelp,
  enrollmentHelp,
  startDateHelp,
  titleHelp,
};
