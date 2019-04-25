import { jsonDeepCopy } from '.';
import { PUBLISHED } from '../data/constants';


const requiredMessage = 'This field is required';

// Basic validation that ensures some value was entered
const basicValidate = value => (value ? undefined : requiredMessage);

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
  if (errors) {
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

    return fieldName;
  }

  return null;
};

// Focus on the first element that has validation errors
const handleCourseEditFail = (errors) => {
  const fieldName = getFieldName(errors);
  if (fieldName) {
    document.getElementsByName(fieldName)[0].focus();
  }
};

const editCourseValidate = (values, props) => {
  const { targetRun } = props;

  if (targetRun && targetRun.status !== PUBLISHED) {
    const errors = {};

    // Validate all the fields required for submission at the top level of the form
    const courseRequiredFields = ['short_description', 'full_description', 'outcome'];
    courseRequiredFields.forEach((fieldName) => {
      const value = values[fieldName];
      if (!value) {
        errors[fieldName] = requiredMessage;
      }
    });

    // Validate all the fields required for submission in the submitting course run
    errors.course_runs = [];
    values.course_runs.forEach((run) => {
      const { key: targetKey } = targetRun || {};
      const isSubmittingRun = run.key === targetKey;
      if (isSubmittingRun) {
        const runRequiredFields = ['transcript_languages', 'staff'];
        const runErrors = {};
        runRequiredFields.forEach((fieldName) => {
          const value = run[fieldName];
          if (value.length < 1) {
            if (fieldName === 'transcript_languages') {
              // redux-form field arrays expect errors to be in this shape
              runErrors[fieldName] = { _error: requiredMessage };
            } else {
              runErrors[fieldName] = 'This field is required';
            }
          }
        });

        errors.course_runs.push(runErrors);
      } else {
        errors.course_runs.push(null);
      }
    });

    return errors;
  }

  return undefined;
};


export {
  requiredMessage,
  basicValidate,
  getFieldName,
  handleCourseEditFail,
  editCourseValidate,
};
