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

class CollapsibleCourseRun extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
    };

    this.openCollapsible = this.openCollapsible.bind(this);
    this.setCollapsible = this.setCollapsible.bind(this);
  }

  setCollapsible(open) {
    this.setState({
      open,
    });
  }

  openCollapsible() {
    this.setCollapsible(true);
  }

  render() {
    const {
      courseId,
      courseInReview,
      courseRun,
      courseSubmitting,
      handleSubmit,
      isSubmittingForReview,
      languageOptions,
      pacingTypeOptions,
      targetRun,
      ...passThroughProps
    } = this.props;
    const {
      open,
    } = this.state;

    const courseRunInReview = IN_REVIEW_STATUS.includes(courseRun.status);
    // Checks if the current course run is the one triggering submission for review
    const courseRunSubmitting = !courseRunInReview && isSubmittingForReview && targetRun &&
      (targetRun.key === courseRun.key);

    return (
      <Collapsible
        title={formatCourseRunTitle(courseRun)}
        key={`collapsible-run-${courseId}`}
        iconId={`collapsible-icon-${courseId}`}
        isOpen={open}
        onToggle={this.setCollapsible}
      >
        <Field
          name={`${courseId}.start`}
          type="date"
          component={RenderInputTextField}
          format={value => getDateString(value)}
          label={
            <FieldLabel
              id={`${courseId}.start.label`}
              text="Start date"
              required
              requiredForSubmit
              helpText={startDateHelp}
            />
          }
          extraInput={{ onInvalid: this.openCollapsible }}
          placeholder="mm/dd/yyyy"
          required
          disabled={courseInReview}
        />
        <Field
          name={`${courseId}.end`}
          type="date"
          component={RenderInputTextField}
          format={value => getDateString(value)}
          normalize={value => moment.utc(value)
          .toISOString()}
          label={
            <FieldLabel
              id={`${courseId}.end.label`}
              text="End date"
              required
              requiredForSubmit
              helpText={endDateHelp}
            />
          }
          extraInput={{ onInvalid: this.openCollapsible }}
          placeholder="mm/dd/yyyy"
          required
          disabled={courseInReview}
        />
        <Field
          name={`${courseId}.go_live_date`}
          type="date"
          component={RenderInputTextField}
          format={value => getDateString(value)}
          normalize={value => moment.utc(value)
          .toISOString()}
          label={
            <FieldLabel
              id={`${courseId}.go_live_date.label`}
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
          extraInput={{ onInvalid: this.openCollapsible }}
          placeholder="mm/dd/yyyy"
          disabled={courseInReview}
        />
        <Field
          name={`${courseId}.min_effort`}
          type="number"
          component={RenderInputTextField}
          label={
            <FieldLabel
              id={`${courseId}.min_effort.label`}
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
          extraInput={{ onInvalid: this.openCollapsible }}
          disabled={courseInReview}
          required={courseRunSubmitting}
        />
        <Field
          name={`${courseId}.max_effort`}
          type="number"
          component={RenderInputTextField}
          label={
            <FieldLabel
              id={`${courseId}.max_effort.label`}
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
          extraInput={{ onInvalid: this.openCollapsible }}
          disabled={courseInReview}
          required={courseRunSubmitting}
        />
        <Field
          name={`${courseId}.pacing_type`}
          type="text"
          component={RenderSelectField}
          options={pacingTypeOptions}
          label={
            <FieldLabel
              id={`${courseId}.pacing_type.label`}
              text="Course pacing"
              helpText={
                <div>
                  <p>
                    Instructor-paced courses include individual assignments that have specific
                    due dates before the course end date.
                  </p>
                  <p>
                    Self-paced courses do not have individual assignments that have specific
                    due dates before the course end date. All assignments are due on the
                    course
                    end date.
                  </p>
                </div>
              }
            />
          }
          extraInput={{ onInvalid: this.openCollapsible }}
          disabled={courseInReview}
          required={courseRunSubmitting}
        />
        <Field
          name={`${courseId}.content_language`}
          type="text"
          component={RenderSelectField}
          options={languageOptions}
          label={<FieldLabel text="Content language" requiredForSubmit />}
          extraInput={{ onInvalid: this.openCollapsible }}
          disabled={courseInReview}
          required={courseRunSubmitting}
        />
        <FieldLabel text="Transcript languages" className="mb-2" requiredForSubmit />
        <FieldArray
          name={`${courseId}.transcript_languages`}
          component={TranscriptLanguage}
          languageOptions={languageOptions}
          extraInput={{ onInvalid: this.openCollapsible }}
          disabled={courseInReview}
          required={courseRunSubmitting}
        />
        <Field
          name={`${courseId}.weeks_to_complete`}
          type="number"
          component={RenderInputTextField}
          label={
            <FieldLabel
              id={`${courseId}.weeks_to_complete.label`}
              text="Length"
              requiredForSubmit
              helpText={
                <div>
                  <p>The length of the course, in weeks, rounded to the nearest whole number.</p>
                </div>
              }
            />
          }
          extraInput={{ onInvalid: this.openCollapsible }}
          disabled={courseInReview}
          required={courseRunSubmitting}
        />
        <FieldLabel
          id={`${courseId}.staff.label`}
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
          name={`${courseId}.staff`}
          component={StaffList}
          extraInput={{ onInvalid: this.openCollapsible }}
          disabled={courseInReview}
          courseRunKey={courseRun.key}
          required={courseRunSubmitting}
          {...passThroughProps}
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
              handleSubmit(courseRun);
            }}
            labels={{
              default: courseRun.status === PUBLISHED ? 'Publish' : 'Submit for Review',
              pending: courseRun.status === PUBLISHED ? 'Publishing' : 'Submitting for Review',
            }}
            state={courseRunSubmitting ? 'pending' : 'default'}
          />
        </ButtonToolbar>
      </Collapsible>
    );
  }
}

CollapsibleCourseRun.propTypes = {
  courseId: PropTypes.string.isRequired,
  courseInReview: PropTypes.bool,
  courseRun: PropTypes.shape({}).isRequired,
  courseSubmitting: PropTypes.bool,
  handleSubmit: PropTypes.func.isRequired,
  isSubmittingForReview: PropTypes.bool,
  languageOptions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  })).isRequired,
  pacingTypeOptions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  })).isRequired,
  targetRun: PropTypes.shape({}),
};

CollapsibleCourseRun.defaultProps = {
  courseInReview: false,
  courseSubmitting: false,
  isSubmittingForReview: false,
  targetRun: null,
};

export default CollapsibleCourseRun;
