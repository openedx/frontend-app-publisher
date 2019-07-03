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
    <p>Avoid major holidays.</p>
    <p>
      Dates are editable after the course is created, rounded to the nearest term.
      If your courses start on January - May 2020, the URL will end in 1T2020.
    </p>
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

const pacingHelp = (
  <div>
    <p>
      Instructor-paced courses include individual assignments that have specific
      due dates before the course end date.
    </p>
    <p>
      Self-paced courses do not have individual assignments that have specific
      due dates before the course end date. All assignments are due on the
      course end date.
    </p>
  </div>
);

export {
  endDateHelp,
  enrollmentHelp,
  startDateHelp,
  titleHelp,
  pacingHelp,
};
