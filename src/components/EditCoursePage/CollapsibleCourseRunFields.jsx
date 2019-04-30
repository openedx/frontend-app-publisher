import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import { Field, FieldArray } from 'redux-form';
import { Collapsible } from '@edx/paragon';

import ActionButton from '../ActionButton';
import ButtonToolbar from '../ButtonToolbar';
import FieldLabel from '../FieldLabel';
import Pill from '../Pill';
import RenderInputTextField from '../RenderInputTextField';
import RenderSelectField from '../RenderSelectField';
import StaffList from '../StaffList';
import TranscriptLanguage from './TranscriptLanguage';

import { IN_REVIEW_STATUS, PUBLISHED } from '../../data/constants';
import { endDateHelp, startDateHelp } from '../../helpText';


const formatCourseRunTitle = (courseRun) => {
  if (courseRun) {
    const labelItems = [];
    if (courseRun.start) {
      labelItems.push(moment.utc(courseRun.start).format('MMM Do YYYY'));
    }
    if (courseRun.pacing_type) {
      labelItems.push(courseRun.pacing_type.split('_').map(pacingType =>
        pacingType.charAt(0).toUpperCase() + pacingType.slice(1)).join(' '));
    }
    return (
      <div className="course-run-label">
        <span>{`Course run starting on ${labelItems.join(' - ')}`}</span>
        {/*
          TODO: After we have a way of determining if the course run has been edited, that should
          be added into the list of statuses being passed into the Pill component.
        */}
        <Pill statuses={[courseRun.status]} />
        <div className="course-run-studio-url">
          {'Studio URL - '}
          <a href={`${process.env.STUDIO_BASE_URL}/course/${courseRun.key}`}>
            {`${courseRun.key}`}
          </a>
        </div>
        {courseRun.marketing_url ?
          <div className="course-run-preview-url">
            {'Preview URL - '}
            <a href={`${courseRun.marketing_url}`}>
              {'View about page'}
            </a>
          </div> : null}
      </div>
    );
  }
  return (
    <div>
      <span>Your new course run</span>
    </div>
  );
};

const getDateString = date => (date ? moment.utc(date).format('YYYY-MM-DD') : '');

const CollapsibleCourseRunFields = ({
  fields,
  courseRuns,
  languageOptions,
  pacingTypeOptions,
  courseInReview,
  handleSubmit,
  formId,
  isSubmittingForReview,
  targetRun,
  courseSubmitting,
  ...passedProps
}) => (
  <div>
    {fields.map((courseRun, index) => {
      const courseRunInReview = IN_REVIEW_STATUS.includes(courseRuns[index].status);
      // Checks if the current course run is the one triggering submission for review
      const courseRunSubmitting = !courseRunInReview && isSubmittingForReview && targetRun &&
        (targetRun.key === courseRuns[index].key);

      return (
        <Collapsible
          title={formatCourseRunTitle(courseRuns[index])}
          key={`collapsible-run-${courseRun}`}
          iconId={`collapsible-icon-${courseRun}`}
        >
          <Field
            name={`${courseRun}.start`}
            type="date"
            component={RenderInputTextField}
            format={value => getDateString(value)}
            label={
              <FieldLabel
                id={`${courseRun}.start.label`}
                text="Start date"
                required
                requiredForSubmit
                helpText={startDateHelp}
              />
            }
            placeholder="mm/dd/yyyy"
            required
            disabled={courseInReview}
          />
          <Field
            name={`${courseRun}.end`}
            type="date"
            component={RenderInputTextField}
            format={value => getDateString(value)}
            normalize={value => moment.utc(value).toISOString()}
            label={
              <FieldLabel
                id={`${courseRun}.end.label`}
                text="End date"
                required
                requiredForSubmit
                helpText={endDateHelp}
              />
            }
            placeholder="mm/dd/yyyy"
            required
            disabled={courseInReview}
          />
          <Field
            name={`${courseRun}.go_live_date`}
            type="date"
            component={RenderInputTextField}
            format={value => getDateString(value)}
            normalize={value => moment.utc(value).toISOString()}
            label={
              <FieldLabel
                id={`${courseRun}.go_live_date.label`}
                text="Publish date"
                helpText={
                  <div>
                    <p>The scheduled date for when the course run will be live and published.</p>
                    <p>
                      If you would like the run to be published as soon as possible, do not set a
                      publish date.
                    </p>
                  </div>
                }
              />
            }
            placeholder="mm/dd/yyyy"
            disabled={courseInReview}
          />
          <Field
            name={`${courseRun}.min_effort`}
            type="number"
            component={RenderInputTextField}
            label={
              <FieldLabel
                id={`${courseRun}.min_effort.label`}
                text="Minimum effort"
                requiredForSubmit
                helpText={
                  <div>
                    <p>
                      The minimum number of hours per week the learner should expect to spend
                      on the course.
                    </p>
                  </div>
                }
              />
            }
            disabled={courseInReview}
            required={courseRunSubmitting}
          />
          <Field
            name={`${courseRun}.max_effort`}
            type="number"
            component={RenderInputTextField}
            label={
              <FieldLabel
                id={`${courseRun}.max_effort.label`}
                text="Maximum effort"
                requiredForSubmit
                helpText={
                  <div>
                    <p>
                      The maximum number of hours per week the learner should expect to spend
                      on the course.
                    </p>
                  </div>
                }
              />
            }
            disabled={courseInReview}
            required={courseRunSubmitting}
          />
          <Field
            name={`${courseRun}.pacing_type`}
            type="text"
            component={RenderSelectField}
            options={pacingTypeOptions}
            label={
              <FieldLabel
                id={`${courseRun}.pacing_type.label`}
                text="Course pacing"
                helpText={
                  <div>
                    <p>
                      Instructor-paced courses include individual assignments that have specific
                      due dates before the course end date.
                    </p>
                    <p>
                      Self-paced courses do not have individual assignments that have specific
                      due dates before the course end date. All assignments are due on the course
                      end date.
                    </p>
                  </div>
                }
              />
            }
            disabled={courseInReview}
            required={courseRunSubmitting}
          />
          <Field
            name={`${courseRun}.content_language`}
            type="text"
            component={RenderSelectField}
            options={languageOptions}
            label={<FieldLabel text="Content language" requiredForSubmit />}
            disabled={courseInReview}
            required={courseRunSubmitting}
          />
          <FieldLabel text="Transcript languages" className="mb-2" requiredForSubmit />
          <FieldArray
            name={`${courseRun}.transcript_languages`}
            component={TranscriptLanguage}
            languageOptions={languageOptions}
            disabled={courseInReview}
            required={courseRunSubmitting}
          />
          <Field
            name={`${courseRun}.weeks_to_complete`}
            type="number"
            component={RenderInputTextField}
            label={
              <FieldLabel
                id={`${courseRun}.weeks_to_complete.label`}
                text="Length"
                requiredForSubmit
                helpText={
                  <div>
                    <p>The length of the course, in weeks, rounded to the nearest whole number.</p>
                  </div>
                }
              />
            }
            disabled={courseInReview}
            required={courseRunSubmitting}
          />
          <FieldLabel
            id={`${courseRun}.staff.label`}
            text="Staff"
            className="mb-2"
            requiredForSubmit
            helpText={
              <div>
                <p>The primary instructor or instructors for the course.</p>
                <p>
                  The order that instructors are listed here is the same order they will be
                  displayed on course pages. You can drag and drop to reorder instructors.
                </p>
              </div>
            }
          />
          <Field
            name={`${courseRun}.staff`}
            component={StaffList}
            disabled={courseInReview}
            courseRunKey={courseRuns[index].key}
            required={courseRunSubmitting}
            {...passedProps}
          />
          <ButtonToolbar>
            <ActionButton
              // only disable if *this run* is in review
              disabled={courseSubmitting || courseRunInReview}
              onClick={(event) => {
                /*
                *  Prevent default submission and pass the targeted course run up through the
                *  handler to manually validate fields based off the run status.
                */
                event.preventDefault();
                handleSubmit(courseRuns[index]);
              }}
              labels={{
                default: courseRuns[index].status === PUBLISHED ? 'Publish' : 'Submit for Review',
                pending: courseRuns[index].status === PUBLISHED ? 'Publishing' : 'Submitting for Review',
              }}
              state={courseRunSubmitting ? 'pending' : 'default'}
            />
          </ButtonToolbar>
        </Collapsible>
      );
    })}
  </div>
);

CollapsibleCourseRunFields.propTypes = {
  fields: PropTypes.shape({
    remove: PropTypes.func,
  }).isRequired,
  languageOptions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  })).isRequired,
  pacingTypeOptions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  })).isRequired,
  courseRuns: PropTypes.arrayOf(PropTypes.shape({})),
  courseInReview: PropTypes.bool,
  courseSubmitting: PropTypes.bool,
  handleSubmit: PropTypes.func.isRequired,
  formId: PropTypes.string.isRequired,
  passedProps: PropTypes.shape({}),
  isSubmittingForReview: PropTypes.bool,
  targetRun: PropTypes.shape({}),
};

CollapsibleCourseRunFields.defaultProps = {
  courseRuns: [],
  courseInReview: false,
  courseSubmitting: false,
  passedProps: {},
  isSubmittingForReview: false,
  targetRun: null,
};

export default CollapsibleCourseRunFields;
