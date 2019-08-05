import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import { Field, FieldArray } from 'redux-form';
import { Collapsible, Hyperlink } from '@edx/paragon';

import ActionButton from '../ActionButton';
import ButtonToolbar from '../ButtonToolbar';
import { courseSubmittingInfo } from '../../data/actions/courseSubmitInfo';
import FieldLabel from '../FieldLabel';
import { getDateString, localTimeZone, formatDate } from '../../utils/index';
import Pill from '../Pill';
import RenderInputTextField from '../RenderInputTextField';
import RenderSelectField from '../RenderSelectField';
import StaffList from '../StaffList';
import DateTimeField from '../DateTimeField';
import store from '../../data/store';
import TranscriptLanguage from './TranscriptLanguage';

import { DATE_FORMAT, IN_REVIEW_STATUS, REVIEW_BY_INTERNAL, REVIEW_BY_LEGAL,
  PUBLISHED } from '../../data/constants';
import { endDateHelp, startDateHelp, pacingHelp } from '../../helpText';
import RichEditor from '../RichEditor';

const determineStatus = courseRun => (courseRun.status === 'unpublished' && moment().isAfter(courseRun.end) ?
  'archived' : courseRun.status);

const formatCourseRunTitle = (courseRun) => {
  if (courseRun) {
    const labelItems = [];
    let publishDate = '';
    if (courseRun.start) {
      labelItems.push(formatDate(courseRun.start));
    }
    if (courseRun.pacing_type) {
      labelItems.push(courseRun.pacing_type.split('_').map(pacingType =>
        pacingType.charAt(0).toUpperCase() + pacingType.slice(1)).join(' '));
    }
    if (courseRun.status !== PUBLISHED && courseRun.go_live_date) {
      const formattedDate = formatDate(courseRun.go_live_date);
      publishDate = `Publish date is ${formattedDate}`;
    }
    return (
      <div className="course-run-label">
        <span>{`Course run starting on ${labelItems.join(' - ')}`}</span>
        {/*
          TODO: After we have a way of determining if the course run has been edited, that should
          be added into the list of statuses being passed into the Pill component.
        */}
        <Pill statuses={[determineStatus(courseRun)]} />
        <div className="course-run-label">
          <span>{`${publishDate}`}</span>
        </div>
        <div className="course-run-studio-url">
          <React.Fragment>
            Studio URL -&nbsp;
            <Hyperlink
              destination={`${process.env.STUDIO_BASE_URL}/course/${courseRun.key}`}
              target="_blank"
            >
              {courseRun.key}
            </Hyperlink>
          </React.Fragment>
        </div>
        {courseRun.marketing_url && determineStatus(courseRun) !== 'archived' ?
          <div className="course-run-preview-url">
            <React.Fragment>
              <Hyperlink
                destination={`${courseRun.marketing_url}`}
                target="_blank"
              >
                View Live Page
              </Hyperlink>
            </React.Fragment>
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
      returnFromStaffPage: false,
    };

    this.openCollapsible = this.openCollapsible.bind(this);
    this.setCollapsible = this.setCollapsible.bind(this);
    this.scrollToStaffPosition = this.scrollToStaffPosition.bind(this);
    this.displayOfacRestriction = this.displayOfacRestriction.bind(this);
    this.displayDefaultButtonLabel = this.displayDefaultButtonLabel.bind(this);
  }

  componentDidMount() {
    const {
      stafferInfo: { returnToEditCourse },
      sourceInfo: { referringRun },
      courseRun: { key },
    } = this.props;

    if (returnToEditCourse && referringRun === key) {
      this.openCollapsible();
      this.scrollToStaffPosition(returnToEditCourse);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      open,
      returnFromStaffPage,
    } = this.state;
    const {
      courseId,
    } = this.props;
    const {
      returnFromStaffPage: wasReturnedFromStaff,
    } = prevState;

    if (open && returnFromStaffPage) {
      this.scrollToStaffPosition(false);
    }
    if (wasReturnedFromStaff && !returnFromStaffPage) {
      const element = document.getElementById(`${courseId}.staff.label`);
      element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
    }
  }

  setCollapsible(open) {
    this.setState({
      open,
    });
  }

  scrollToStaffPosition(focus) {
    this.setState({
      returnFromStaffPage: focus,
    });
  }

  openCollapsible() {
    this.setCollapsible(true);
  }

  displayOfacRestriction(restriction) {
    switch (restriction) {
      case false:
        return 'No';
      case true:
        return 'Yes';
      default:
        return '--';
    }
  }

  displayDefaultButtonLabel(status, isAdmin) {
    if (isAdmin) {
      switch (status) {
        case REVIEW_BY_LEGAL:
          return 'Save & Send to PC Review';
        case REVIEW_BY_INTERNAL:
          return 'PC Review Complete';
        default:
          break;
      }
    }
    if (status === PUBLISHED) {
      return 'Publish Run';
    }
    return 'Submit Run for Review';
  }

  render() {
    const {
      courseId,
      courseInReview,
      courseRun,
      courseSubmitting,
      editable,
      isSubmittingForReview,
      languageOptions,
      ofacRestrictionOptions,
      programOptions,
      pacingTypeOptions,
      targetRun,
      owners,
      courseUuid,
      stafferInfo,
      sourceInfo,
      courseSubmitInfo,
      authentication: {
        administrator,
      },
    } = this.props;

    const courseRunInReview = IN_REVIEW_STATUS.includes(courseRun.status);
    // Checks if the current course run is the one triggering submission for review
    const courseRunSubmitting = !courseRunInReview && isSubmittingForReview && targetRun &&
      (targetRun.key === courseRun.key);

    const disabled = courseInReview || !editable;

    return (
      <Collapsible
        title={formatCourseRunTitle(courseRun)}
        iconId={`collapsible-icon-${courseId}`}
        isOpen={this.props.isOpen}
        onToggle={this.props.onToggle}
      >
        <div className="mb-3">
          <span className="text-info" aria-hidden> All fields are required for publication unless otherwise specified.</span>
        </div>
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
            min: moment(courseRun.go_live_date).isBefore(moment()) ?
              getDateString(courseRun.go_live_date) : getDateString(moment()),
          }}
          placeholder="mm/dd/yyyy"
          disabled={disabled || courseRun.status === PUBLISHED}
          required={courseRunSubmitting}
        />
        <Field
          name={`${courseId}.start`}
          component={DateTimeField}
          dateLabel="Start date"
          timeLabel={`Start time (${localTimeZone})`}
          helpText={startDateHelp}
          disabled={disabled}
          required
          minDate={moment(courseRun.start).isBefore(moment()) ?
            getDateString(courseRun.start) : getDateString(moment())}
          onInvalid={this.openCollapsible}
        />
        <Field
          name={`${courseId}.end`}
          component={DateTimeField}
          dateLabel="End date"
          timeLabel={`End time (${localTimeZone})`}
          helpText={endDateHelp}
          disabled={disabled}
          required
          minDate={getDateString(moment(courseRun.start).add(1, 'd') || moment())}
          onInvalid={this.openCollapsible}
        />
        <hr />
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
          disabled={disabled}
          required={courseRunSubmitting}
        />
        <FieldLabel
          id={`${courseId}.staff.label`}
          text="Staff"
          className="mb-2"
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
          disabled={disabled}
          courseRunKey={courseRun.key}
          owners={owners}
          courseUuid={courseUuid}
          sourceInfo={sourceInfo}
          stafferInfo={stafferInfo}
        />
        <div className="row">
          <div className="col-6">
            <Field
              name={`${courseId}.min_effort`}
              type="number"
              component={RenderInputTextField}
              label={
                <FieldLabel
                  id={`${courseId}.min_effort.label`}
                  text="Minimum effort"
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
              disabled={disabled}
              required={courseRunSubmitting}
            />
          </div>
          <div className="col-6">
            <Field
              name={`${courseId}.max_effort`}
              type="number"
              component={RenderInputTextField}
              label={
                <FieldLabel
                  id={`${courseId}.max_effort.label`}
                  text="Maximum effort"
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
              disabled={disabled}
              required={courseRunSubmitting}
            />
          </div>
        </div>
        <Field
          name={`${courseId}.weeks_to_complete`}
          type="number"
          component={RenderInputTextField}
          label={
            <FieldLabel
              id={`${courseId}.weeks_to_complete.label`}
              text="Length"
              helpText={
                <div>
                  <p>
                    The estimated number of weeks the learner should expect to spend on the course,
                    rounded to the nearest whole number.
                  </p>
                </div>
              }
            />
          }
          extraInput={{ onInvalid: this.openCollapsible }}
          disabled={disabled}
          required={courseRunSubmitting}
        />
        <Field
          name={`${courseId}.content_language`}
          type="text"
          component={RenderSelectField}
          options={languageOptions}
          label={<FieldLabel text="Content language" />}
          extraInput={{ onInvalid: this.openCollapsible }}
          disabled={disabled}
          required={courseRunSubmitting}
        />
        <FieldLabel text="Transcript languages" className="mb-2" />
        <FieldArray
          name={`${courseId}.transcript_languages`}
          component={TranscriptLanguage}
          languageOptions={languageOptions}
          extraInput={{ onInvalid: this.openCollapsible }}
          disabled={disabled}
        />
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
                    If this Course Run will potentially be part of a Program, please set the
                    expected program type here.
                  </p>
                </div>
              }
              optional
            />
          }
          extraInput={{ onInvalid: this.openCollapsible }}
          disabled={disabled}
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
                    If this Course Run will potentially be part of a Program, please set the
                    expected program name here.
                  </p>
                </div>
              }
              optional
            />
          }
          extraInput={{ onInvalid: this.openCollapsible }}
          disabled={disabled}
        />
        {(!administrator || !IN_REVIEW_STATUS.includes(courseRun.status)) &&
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
            <div className="mb-3">
              {this.displayOfacRestriction(courseRun.has_ofac_restrictions)}
            </div>
          </div>
        }
        {administrator && IN_REVIEW_STATUS.includes(courseRun.status) &&
          <div>
            Status: {courseRun.status === REVIEW_BY_LEGAL ? 'Legal Review' : 'PC Review'}
            <div>
              <Field
                name={`${courseId}.has_ofac_restrictions`}
                disabled={courseRun.status === REVIEW_BY_INTERNAL}
                type="text"
                component={RenderSelectField}
                options={ofacRestrictionOptions}
                label={<FieldLabel text="OFAC status" />}
                extraInput={{ onInvalid: this.openCollapsible }}
                required
              />
              <Field
                name={`${courseId}.ofac_comment`}
                disabled={courseRun.status === REVIEW_BY_INTERNAL}
                component={RichEditor}
                label={<FieldLabel text="Countries or additional notes" />}
                extraInput={{ onInvalid: this.openCollapsible }}
                maxChars={500}
                id="sdesc"
              />
            </div>
          </div>
        }
        {editable &&
          <ButtonToolbar>
            <ActionButton
              // only disable if *this run* is in review
              disabled={courseSubmitting || (courseRunInReview && !administrator)}
              // Pass the submitting course run up to validate different fields based on status
              onClick={() => store.dispatch(courseSubmittingInfo(courseRun))}
              labels={{
                default: this.displayDefaultButtonLabel(courseRun.status, administrator),
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
        }
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
  editable: PropTypes.bool,
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
  isOpen: PropTypes.bool,
  onToggle: PropTypes.func.isRequired,
  ofacRestrictionOptions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  })).isRequired,
  authentication: PropTypes.shape({}),
};

CollapsibleCourseRun.defaultProps = {
  courseInReview: false,
  courseSubmitting: false,
  courseSubmitInfo: {
    isSubmittingRunReview: false,
  },
  editable: false,
  isSubmittingForReview: false,
  owners: [],
  sourceInfo: {},
  stafferInfo: {},
  targetRun: null,
  isOpen: false,
  authentication: {},
};

export default CollapsibleCourseRun;
