import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import { Field, FieldArray } from 'redux-form';
import { Collapsible } from '@edx/paragon';

import ActionButton from '../ActionButton';
import ButtonToolbar from '../ButtonToolbar';
import { courseSubmittingInfo } from '../../data/actions/courseSubmitInfo';
import FieldLabel from '../FieldLabel';
import { getDateString } from '../../utils/index';
import Pill from '../Pill';
import RenderInputTextField from '../RenderInputTextField';
import RenderSelectField from '../RenderSelectField';
import StaffList from '../StaffList';
import DateTimeField from '../DateTimeField';
import store from '../../data/store';
import TranscriptLanguage from './TranscriptLanguage';

import { DATE_FORMAT, IN_REVIEW_STATUS, PUBLISHED } from '../../data/constants';
import { endDateHelp, startDateHelp, pacingHelp } from '../../helpText';

const formatCourseRunTitle = (courseRun) => {
  if (courseRun) {
    const labelItems = [];
    let publishDate = '';
    if (courseRun.start) {
      labelItems.push(moment.utc(courseRun.start).format('MMM Do YYYY'));
    }
    if (courseRun.pacing_type) {
      labelItems.push(courseRun.pacing_type.split('_').map(pacingType =>
        pacingType.charAt(0).toUpperCase() + pacingType.slice(1)).join(' '));
    }
    if (courseRun.go_live_date) {
      const formattedDate = moment.utc(courseRun.go_live_date).format('MMM Do YYYY');
      publishDate = `Publish date is ${formattedDate}`;
    } else {
      publishDate = 'Unknown publish date';
    }
    return (
      <div className="course-run-label">
        <span>{`Course run starting on ${labelItems.join(' - ')}`}</span>
        {/*
          TODO: After we have a way of determining if the course run has been edited, that should
          be added into the list of statuses being passed into the Pill component.
        */}
        <Pill statuses={[courseRun.status]} />
        <div className="course-run-label">
          <span>{`${publishDate}`}</span>
        </div>
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
      isSubmittingForReview,
      languageOptions,
      programOptions,
      pacingTypeOptions,
      targetRun,
      owners,
      courseUuid,
      stafferInfo,
      sourceInfo,
      courseSubmitInfo,
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
        iconId={`collapsible-icon-${courseId}`}
        isOpen={open}
        onToggle={this.setCollapsible}
      >
        <Field
          name={`${courseId}.start`}
          component={DateTimeField}
          dateLabel="Start date"
          timeLabel="Start time"
          helpText={startDateHelp}
          disabled={courseInReview}
          required
          minDate={getDateString(moment(courseRun.start))}
          onInvalid={this.openCollapsible}
        />
        <Field
          name={`${courseId}.end`}
          component={DateTimeField}
          dateLabel="End date"
          timeLabel="End time"
          helpText={endDateHelp}
          disabled={courseInReview}
          required
          minDate={getDateString(moment(courseRun.start).add(1, 'd') || moment())}
          onInvalid={this.openCollapsible}
        />
        <Field
          name={`${courseId}.go_live_date`}
          type="date"
          component={RenderInputTextField}
          format={value => getDateString(value)}
          normalize={value => moment.utc(value).format(DATE_FORMAT)}
          label={
            <FieldLabel
              id={`${courseId}.go_live_date.label`}
              text="Publish date"
              requiredForSubmit
              helpText={
                <div>
                  <p>The scheduled date for when the course run will be live and published.</p>
                  <p>
                    To publish as soon as possible, set the publish date to today.
                    Please note that changes may take 48 hours to go live.
                  </p>
                  <p>
                    If you don’t have a publish date yet, set to 1 year in the future.
                  </p>
                </div>
              }
            />
          }
          extraInput={{
            onInvalid: this.openCollapsible,
            min: getDateString((moment(courseRun.go_live_date) || moment())),
          }}
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
          extraInput={{
            onInvalid: this.openCollapsible,
            min: 0,
            max: 168,
          }}
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
          extraInput={{
            onInvalid: this.openCollapsible,
            min: 1,
            max: 168,
          }}
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
              helpText={pacingHelp}
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
        <div>
          <FieldLabel
            id="number"
            text="Course Embargo (OFAC) Restriction text added to the FAQ section"
            className="mb-2"
            helpText={
              <div>
                <p>
                  Course embargo status for OFAC is managed internally, please contact
                  support with questions.
                </p>
              </div>
            }
          />
          <div className="mb-3">{courseRun.has_ofac_restrictions ? 'Yes' : 'No'}</div>
        </div>
        <Field
          name={`${courseId}.expected_program_type`}
          type="text"
          component={RenderSelectField}
          options={programOptions}
          label={
            <FieldLabel
              id={`${courseId}.expected_program_type.label`}
              text="Expected Program Type"
              helpText={
                <div>
                  <p>
                    If this Course Run will potentially be part of a Program please set the
                    expected program type here.
                  </p>
                </div>
              }
            />
          }
          extraInput={{ onInvalid: this.openCollapsible }}
          disabled={courseInReview}
        />
        <Field
          name={`${courseId}.expected_program_name`}
          component={RenderInputTextField}
          type="text"
          label={
            <FieldLabel
              id={`${courseId}.expected_program_name.label`}
              text="Expected Program Name"
              helpText={
                <div>
                  <p>
                    If this Course Run will potentially be part of a Program please set the
                    expected program name here.
                  </p>
                </div>
              }
            />
          }
          extraInput={{ onInvalid: this.openCollapsible }}
          disabled={courseInReview}
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
          owners={owners}
          courseUuid={courseUuid}
          sourceInfo={sourceInfo}
          stafferInfo={stafferInfo}
        />
        <ButtonToolbar>
          <ActionButton
            // only disable if *this run* is in review
            disabled={courseSubmitting || courseRunInReview}
            // Pass the submitting course run up to validate different fields based on status
            onClick={() => store.dispatch(courseSubmittingInfo(courseRun))}
            labels={{
              default: courseRun.status === PUBLISHED ? 'Publish Run' : 'Submit Run for Review',
              pending: courseRun.status === PUBLISHED ? 'Publishing Run' : 'Submitting Run for Review',
            }}
            state={
              (
                courseSubmitting ||
                (courseSubmitInfo && courseSubmitInfo.isSubmittingRunReview)
              ) ? 'pending' : 'default'
            }
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
  courseSubmitInfo: PropTypes.shape({
    isSubmittingRunReview: PropTypes.bool,
  }),
  courseUuid: PropTypes.string.isRequired,
  isSubmittingForReview: PropTypes.bool,
  languageOptions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  })).isRequired,
  programOptions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  })).isRequired,
  owners: PropTypes.arrayOf(PropTypes.shape({})),
  pacingTypeOptions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  })).isRequired,
  sourceInfo: PropTypes.shape({}),
  stafferInfo: PropTypes.shape({}),
  targetRun: PropTypes.shape({}),
};

CollapsibleCourseRun.defaultProps = {
  courseInReview: false,
  courseSubmitting: false,
  courseSubmitInfo: {
    isSubmittingRunReview: false,
  },
  isSubmittingForReview: false,
  owners: [],
  sourceInfo: {},
  stafferInfo: {},
  targetRun: null,
};

export default CollapsibleCourseRun;
