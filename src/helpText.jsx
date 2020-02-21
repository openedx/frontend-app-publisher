import React from 'react';
import { isSafari } from './utils';

/**
 * This file holds a few jsx constants to share helpText between different components.
 * Please keep it sorted for ease of use.
 */

const publishDateHelp = (
  <div>
    { isSafari && <p>Required Format: yyyy/mm/dd</p> }
    <p>The scheduled date for when the course run will be live and published.</p>
    <p>
      To publish as soon as possible, set the publish date to today.
      Please note that changes may take 48 hours to go live.
    </p>
    <p>
      If you don’t have a publish date yet, set to 1 year in the future.
    </p>
  </div>
);

function dateEditHelp(courseRun) {
  return (
    <div>
      <p>Course run dates are editable in Studio.</p>
      <p>
        Please note that changes in Studio may take up to a business day to be reflected here.
        For questions, contact your project coordinator.
      </p>
      <p>
        <a
          href={`${process.env.STUDIO_BASE_URL}/settings/details/${courseRun.key}#schedule`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Edit dates.
        </a>.
      </p>
    </div>
  );
}

const endDateHelp = (
  <div>
    { isSafari && <p>Required Format: yyyy/mm/dd</p> }
    <p>
      If you are unsure of the exact date, specify a day that is close to the
      estimated end date. For example, if your course will end near the end
      of March, specify March 31.
    </p>
  </div>
);

const runTypeHelp = (
  <div>
    <p>
      The enrollment track determines whether a course run offers a paid
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

function pacingEditHelp(courseRun) {
  return (
    <div>
      <p>Course pacing is editable in Studio.</p>
      <p>
        Please note that changes in Studio may take up to a business day to be reflected here.
        For questions, contact your project coordinator.
      </p>
      <p>
        <a
          href={`${process.env.STUDIO_BASE_URL}/settings/details/${courseRun.key}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Edit course pacing.
        </a>.
      </p>
    </div>
  );
}

const keyHelp = (
  <div>
    <p>
      The Run Key refers to the term in each Course ID.
    </p>
    <p>Example:</p>
    <ul>
      <li> If your course ID is course-v1:edX+DemoX+1T2020, then ‘1T2020’ is the Run Key.</li>
    </ul>
    <p>
      If this field is left blank, the Run Key value will be based on the start
      date of the course.
    </p>
    <p>Letters and Numbers only, please.</p>
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

const startDateHelp = (
  <div>
    { isSafari && <p>Required Format: yyyy/mm/dd</p> }
    <p>Start on a Tuesday, Wednesday, or Thursday.</p>
    <p>Avoid major holidays.</p>
    <p>
      Dates are editable in Studio after the course is created, rounded to the nearest term.
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

const typeHelp = (
  <div>
    <p>
      The Course enrollment track determines what enrollment tracks are eligible
      for the course runs.
    </p>
    <p><b>Example:</b></p>
    <p>
      The Verified and Audit selection will allow course runs to either be
      Verified and Audit or Audit only.
    </p>
  </div>
);

const urlSlugHelp = (
  <div>
    <p>
      This field is optional. If left blank, edX will automatically
      create a URL slug based on the course title.
    </p>
    <p>
      If you find that a given URL slug is already in use, we recommend adding your
      school or institution name to the slug to ensure uniqueness.
    </p>
    <p>
      This URL slug can be changed, and learners who visit an older
      URL will be redirected to the current URL.
    </p>
    <p><b>What is a URL slug?</b></p>
    <p>
      In the example URL www.edx.org/course/math-101, the URL slug is “math-101.”
      Using URL slugs that are short and easily understandable helps learners find and
      remember course pages, and also drives higher rankings in search engine results.
    </p>
  </div>
);

export {
  dateEditHelp,
  endDateHelp,
  runTypeHelp,
  startDateHelp,
  pacingEditHelp,
  pacingHelp,
  publishDateHelp,
  titleHelp,
  typeHelp,
  urlSlugHelp,
  keyHelp,
};
