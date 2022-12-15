import moment from 'moment';

import store from '../data/store';
import { jsonDeepCopy } from '.';
import { courseSubmittingFailure } from '../data/actions/courseSubmitInfo';
import { PUBLISHED, DATE_FORMAT } from '../data/constants';

const requiredMessage = 'This field is required';

// Dummy Validator: every input is valid
const noValidate = () => undefined;

// ensure that input is non-empty
const requiredValidate = (value) => {
  if (value !== undefined && value !== null && value !== '') {
    return undefined;
  }
  return requiredMessage;
};

// ensure that the input is a valid datetime string in the format of DATE_FORMAT
const dateTimeValidate = value => {
  const dateTime = moment(value, DATE_FORMAT, true);
  if (dateTime.isValid()) {
    return undefined;
  }
  return 'Please enter a valid date';
};

const courseRunKeyValidate = value => {
  const pattern = /^[a-zA-Z0-9-]*$/;
  if (pattern.test(value)) {
    return undefined;
  }
  return 'Please enter a valid course key';
};

// validate a course price (price lies from 1 to 1000 and is a valid number of cents)
const priceValidate = value => {
  const pattern = /^[0-9]+(\.)?[0-9]{0,2}$/;

  if (!pattern.test(value)) {
    return 'Please enter a valid price (with at most 2 decimal digits)';
  }

  const price = parseFloat(value);

  if (Number.isNaN(price)) {
    return 'Please enter a valid price';
  }

  if (price < 1 || price > 1000) {
    return 'Price should be between 1 and 1000 (endpoints inclusive)';
  }

  return undefined;
};

// Basic validation that ensures some value was entered
const basicValidate = value => (value ? undefined : requiredMessage);

function courseTagValidate(tagValue, selectValue, options) {
  // tagValue should only contain alphabets, numbers, hyphen and underscore
  if (!/^[a-zA-Z0-9_-]+$/.test(tagValue)) { return false; }
  // disallow tags that have already been selected or are present in options(dropdown)
  return ![...selectValue, ...options].some(x => x.label.toLowerCase() === tagValue.toLowerCase());
}

/**
 * Iterates through errors on a form and returns the first field name with an error.
 *
 * @param {?object} errors - Object with keys giving the field names with errors in a form like:
 *   {
 *     short_description: "Required",
 *     outcome: "Required",
 *     course_runs: [
 *       null,
 *       {
 *         transcript_languages: {
 *           _error: "Required",
 *         },
 *         staff: "Required"
 *       }
 *     ]
 *   };
 *   The param will be null if there are no errors.
 *
 * @returns {string} - The first field name with a validation error
 */
const getFieldName = (errors) => {
  if (!errors) {
    return null;
  }

  // Get the first field name and associated info
  let [fieldName, otherInfo] = Object.entries(errors)[0];

  // Parse field arrays for nested field errors
  while (Array.isArray(otherInfo)) {
    // Deep copy otherInfo to avoid modifying it in the loop
    const otherInfoCopy = jsonDeepCopy(otherInfo);
    for (let i = 0; i < otherInfoCopy.length; i += 1) {
      const nestedErrors = otherInfoCopy[i];

      if (nestedErrors) {
        // Get the first nested field name and associated info
        const [nestedFieldName, nestedInfo] = Object.entries(nestedErrors)[0];

        // Reset otherInfo to the new nestedInfo to keep parsing further down
        otherInfo = nestedInfo;
        // Fields within field arrays have names like: course_runs[1].staff
        fieldName = `${fieldName}[${i}].${nestedFieldName}`;
      }
    }
  }

  // Handle nested redux-form field names
  if (otherInfo.constructor === Object) {
    fieldName = `${fieldName}.${getFieldName(otherInfo)}`;
  }

  return fieldName;
};

// Focus on the first element that has validation errors
const handleCourseEditFail = (errors) => {
  const fieldName = getFieldName(errors);
  if (fieldName) {
    // We use setTimeout here to avoid a race condition between React and HTML. See DISCO-992.
    // 250ms worked in my personal testing. So I doubled it to give some more elbow room on less
    // performant machines.
    setTimeout(() => {
      document.getElementsByName(fieldName)[0].focus();
    }, 500);
  }
};

const handleCourseCreateFail = (errors) => {
  const fieldName = getFieldName(errors);
  if (fieldName) {
    const node = document.getElementsByName(fieldName)[0];

    if (node) { node.scrollIntoView({ behavior: 'smooth' }); }
  }
};

const editCourseValidate = (values, props) => {
  const { targetRun, registeredFields } = props;

  if (!targetRun || targetRun.status === PUBLISHED) {
    return {};
  }

  let hasError = false;
  const errors = {};

  // Validate all the fields required for submission at the top level of the form
  const courseRequiredFields = ['short_description', 'full_description', 'outcome', 'imageSrc'];
  courseRequiredFields.forEach((fieldName) => {
    const value = values[fieldName];
    if (!value) {
      hasError = true;
      errors[fieldName] = requiredMessage;
    }
  });

  // Validate all the fields required for submission in the submitting course run
  errors.course_runs = [];
  values.course_runs.forEach((run) => {
    const { key: targetKey } = targetRun;
    const isSubmittingRun = run.key === targetKey;
    if (isSubmittingRun) {
      // naive check to deteremine if track is executive education or not
      const isExecutiveEducation = registeredFields
        && registeredFields['prices.paid-executive-education']
        && registeredFields['prices.paid-executive-education'].count;

      // naive check to deteremine if track is bootcamp or not
      const isBootcamp = registeredFields
        && registeredFields['prices.paid-bootcamp']
        && registeredFields['prices.paid-bootcamp'].count;

      const runRequiredFields = (isExecutiveEducation || isBootcamp) ? ['transcript_languages'] : ['transcript_languages', 'staff'];
      const runErrors = {};
      runRequiredFields.forEach((fieldName) => {
        const value = run[fieldName];
        if (value.length < 1) {
          if (fieldName === 'transcript_languages') {
            // redux-form field arrays expect errors to be in this shape
            runErrors[fieldName] = { _error: requiredMessage };
          } else {
            runErrors[fieldName] = requiredMessage;
          }
        }
      });
      if (Object.keys(runErrors).length > 0) {
        hasError = true;
      }
      errors.course_runs.push(runErrors);
    } else {
      errors.course_runs.push(null);
    }
  });

  // If needed, reset our state variable isSubmittingRunReview, which indicates that we are
  // validating for a submit-for-review (when we check required-for-submit properties).
  if (hasError && store.getState().courseSubmitInfo.isSubmittingRunReview) {
    store.dispatch(courseSubmittingFailure(errors));
  }

  return hasError ? errors : {};
};

export {
  requiredMessage,
  basicValidate,
  noValidate,
  requiredValidate,
  dateTimeValidate,
  courseRunKeyValidate,
  priceValidate,
  getFieldName,
  handleCourseEditFail,
  handleCourseCreateFail,
  editCourseValidate,
  courseTagValidate,
};
