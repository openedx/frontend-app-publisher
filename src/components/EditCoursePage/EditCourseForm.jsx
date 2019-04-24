import PropTypes from 'prop-types';
import React from 'react';
import { Field, FieldArray, reduxForm } from 'redux-form';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Collapsible } from '@edx/paragon';

import ActionButton from '../../components/ActionButton';
import ButtonToolbar from '../../components/ButtonToolbar';
import CollapsibleCourseRunFields from './CollapsibleCourseRunFields';
import FieldLabel from '../FieldLabel';
import ImageUpload from '../../components/ImageUpload';
import RenderInputTextField from '../RenderInputTextField';
import RenderSelectField from '../RenderSelectField';
import RichEditor from '../../components/RichEditor';
import Pill from '../../components/Pill';
import { AUDIT_TRACK, VERIFIED_TRACK, PROFESSIONAL_TRACK } from '../../data/constants';


export class BaseEditCourseForm extends React.Component {
  getEnrollmentTrackOptions() {
    return [
      { label: VERIFIED_TRACK.name, value: VERIFIED_TRACK.key },
      { label: AUDIT_TRACK.name, value: AUDIT_TRACK.key },
      { label: PROFESSIONAL_TRACK.name, value: PROFESSIONAL_TRACK.key },
    ];
  }

  getCourseOptions() {
    const { courseOptions } = this.props;

    if (!courseOptions) {
      return [];
    }

    const { data } = courseOptions;

    if (!data || !data.actions) {
      return [];
    }

    return data.actions.PUT;
  }

  getCourseRunOptions() {
    const { courseRunOptions } = this.props;

    if (!courseRunOptions) {
      return [];
    }

    const { data } = courseRunOptions;

    if (!data || !data.actions) {
      return [];
    }

    return data.actions.POST;
  }

  parseOptions(inChoices) {
    return inChoices.map(choice =>
      ({ label: choice.display_name, value: choice.value }));
  }

  formatCourseTitle(title, courseStatuses) {
    // TODO: After we have a way of determining if the course has been edited, that should be
    // added into the list of statuses being passed into the Pill component.
    return (
      <React.Fragment>
        {`Course: ${title}`}
        <Pill statuses={courseStatuses} />
      </React.Fragment>
    );
  }

  render() {
    const {
      handleSubmit,
      number,
      entitlement,
      submitting,
      title,
      pristine,
      uuid,
      courseInReview,
      courseStatuses,
      id,
      isSubmittingForReview,
    } = this.props;
    const courseOptions = this.getCourseOptions();
    const courseRunOptions = this.getCourseRunOptions();
    const levelTypeOptions = courseOptions && this.parseOptions(courseOptions.level_type.choices);
    const subjectOptions = courseOptions && this.parseOptions(courseOptions.subjects.child.choices);
    const pacingTypeOptions = (courseRunOptions &&
      this.parseOptions(courseRunOptions.pacing_type.choices));
    const languageOptions = (courseRunOptions &&
      this.parseOptions(courseRunOptions.content_language.choices));

    let submitState = 'default';
    if (submitting) {
      submitState = 'pending';
    } else if (pristine) {
      // FIXME: Once this form is correctly reset to a pristine state after a successful submit,
      //        re-enable this code.
      // submitState = 'complete';
    }

    languageOptions.unshift({ label: '--', value: '' });
    levelTypeOptions.unshift({ label: '--', value: '' });
    subjectOptions.unshift({ label: '--', value: '' });

    return (
      <div className="edit-course-form">
        <form id={id}>
          <FieldLabel text="Course" className="mt-4 mb-2" />
          <Collapsible
            title={this.formatCourseTitle(title, courseStatuses)}
            key="Test Key"
            isOpen
          >
            <Field
              name="title"
              component={RenderInputTextField}
              type="text"
              label={
                <FieldLabel
                  id="title-label"
                  text="Title"
                  required
                  requiredForSubmit
                  helpText={
                    <div>
                      <p>Maximum 70 characters. Recommended 50 or fewer characters.</p>
                      <p>An effective course title:</p>
                      <ul>
                        <li>Clearly indicates the course subject matter.</li>
                        <li>Follows search engine optimization (SEO) guidelines.</li>
                        <li>Targets a global audience.</li>
                      </ul>
                      <p>
                        If the course is part of a sequence, include both sequence and course
                        information as “Sequence: Course”.
                      </p>
                      <p><b>Single Course Example</b></p>
                      <ul>
                        <li>English Grammar and Essay Writing</li>
                      </ul>
                      <p><b>Sequential Course Examples</b></p>
                      <ul>
                        <li>Statistics: Inference</li>
                        <li>Statistics: Probability</li>
                      </ul>
                    </div>
                  }
                />
              }
              required
              disabled={courseInReview}
            />
            <div>
              <FieldLabel id="number" text="Number" className="mb-2" />
              <div className="mb-3">{number}</div>
            </div>
            <Field
              name="short_description"
              component={RichEditor}
              label={<FieldLabel text="Short description" requiredForSubmit />}
              maxChars={500}
              id="sdesc"
              disabled={courseInReview}
              required={isSubmittingForReview}
            />
            <Field
              name="full_description"
              component={RichEditor}
              label={<FieldLabel text="Long description" requiredForSubmit />}
              maxChars={2500}
              disabled={courseInReview}
              required={isSubmittingForReview}
            />
            <Field
              name="outcome"
              component={RichEditor}
              label={<FieldLabel text="What you will learn" requiredForSubmit />}
              maxChars={2500}
              id="outcome"
              disabled={courseInReview}
              required={isSubmittingForReview}
            />
            <Field
              name="subjectPrimary"
              component={RenderSelectField}
              label={<FieldLabel text="Primary subject" requiredForSubmit />}
              options={subjectOptions}
              disabled={courseInReview}
              required={isSubmittingForReview}
            />
            <Field
              name="subjectSecondary"
              component={RenderSelectField}
              label={<FieldLabel text="Secondary subject" />}
              options={subjectOptions}
              disabled={courseInReview}
            />
            <Field
              name="subjectTertiary"
              component={RenderSelectField}
              label={<FieldLabel text="Tertiary subject" />}
              options={subjectOptions}
              disabled={courseInReview}
            />
            <Field
              name="imageSrc"
              component={ImageUpload}
              label={<FieldLabel text="Image" requiredForSubmit />}
              id="image"
              className="course-image"
              disabled={courseInReview}
              required={isSubmittingForReview}
            />
            <Field
              name="prerequisites_raw"
              component={RichEditor}
              label={<FieldLabel text="Prerequisites" />}
              maxChars={1000}
              id="prereq"
              disabled={courseInReview}
            />
            <Field
              name="level_type"
              component={RenderSelectField}
              label={<FieldLabel text="Course level" requiredForSubmit />}
              options={levelTypeOptions}
              disabled={courseInReview}
              required={isSubmittingForReview}
            />
            <Field
              name="learner_testimonials"
              component={RichEditor}
              label={<FieldLabel text="Learner testimonials" />}
              maxChars={500}
              id="learner-testimonials"
              disabled={courseInReview}
            />
            <Field
              name="faq"
              component={RichEditor}
              label={<FieldLabel text="Frequently asked questions" />}
              maxChars={2500}
              id="faq"
              disabled={courseInReview}
            />
            <Field
              name="additional_information"
              component={RichEditor}
              label={<FieldLabel text="Additional information" />}
              maxChars={2500}
              id="additional-information"
              disabled={courseInReview}
            />
            <Field
              name="syllabus_raw"
              component={RichEditor}
              label={<FieldLabel text="Syllabus" />}
              maxChars={500}
              id="syllabus"
              disabled={courseInReview}
            />
            <Field
              name="videoSrc"
              component={RenderInputTextField}
              type="url"
              label={<FieldLabel text="About video link" />}
              disabled={courseInReview}
            />
            {entitlement && (
              <React.Fragment>
                <Field
                  name="mode"
                  component={RenderSelectField}
                  label={<FieldLabel text="Enrollment track" />}
                  options={this.getEnrollmentTrackOptions()}
                  disabled={courseInReview}
                />
                <Field
                  name="price"
                  component={RenderInputTextField}
                  input={{
                    min: 0.01,
                    step: 0.01,
                  }}
                  type="number"
                  label={<FieldLabel text="Price" required requiredForSubmit />}
                  disabled={courseInReview}
                  required={isSubmittingForReview}
                />
              </React.Fragment>
            )}
          </Collapsible>
          <FieldLabel text="Course runs" className="mt-4 mb-2" />
          <FieldArray
            name="course_runs"
            component={CollapsibleCourseRunFields}
            languageOptions={languageOptions}
            pacingTypeOptions={pacingTypeOptions}
            formId={id}
            courseUuid={uuid}
            {...this.props}
          />
          <ButtonToolbar className="mt-3">
            <Link to={`/courses/${uuid}/course_runs/new`}>
              <button
                className="btn btn-outline-primary"
                disabled={!pristine || courseInReview}
              >
                Re-run Course
              </button>
            </Link>
            <ActionButton
              disabled={courseInReview || submitting}
              labels={{
                default: 'Save Course',
                pending: 'Saving Course',
                complete: 'Course Saved',
              }}
              state={submitState}
              onClick={(event) => {
                /*
                *  Prevent default submission and pass the targeted course run up through the
                *  handler to manually validate fields based off the run status.
                */
                event.preventDefault();
                handleSubmit();
              }}
            />
          </ButtonToolbar>
        </form>
      </div>
    );
  }
}

BaseEditCourseForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  number: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  entitlement: PropTypes.bool,
  courseOptions: PropTypes.shape({
    data: PropTypes.shape(),
    error: PropTypes.string,
    isFetching: PropTypes.bool,
  }).isRequired,
  courseRunOptions: PropTypes.shape({
    data: PropTypes.shape(),
    error: PropTypes.string,
    isFetching: PropTypes.bool,
  }).isRequired,
  submitting: PropTypes.bool,
  pristine: PropTypes.bool,
  uuid: PropTypes.string.isRequired,
  courseInReview: PropTypes.bool,
  courseStatuses: PropTypes.arrayOf(PropTypes.string),
  id: PropTypes.string.isRequired,
  isSubmittingForReview: PropTypes.bool,
};

BaseEditCourseForm.defaultProps = {
  submitting: false,
  pristine: true,
  courseInReview: false,
  courseStatuses: [],
  isSubmittingForReview: false,
  entitlement: false,
};

const EditCourseForm = compose(
  connect((state, props) => ({
    // Give form a unique id so that values from one course form don't overwrite others
    form: props.id,
  })),
  reduxForm({
    enableReinitialize: true, // Reload staff changes when returning from editing /creating staffers
    keepDirtyOnReinitialize: true, // Don't wipe out changes on reinitialization
    destroyOnUnmount: false, // Keep the form state in redux when editing / creating staffers
  }),
)(BaseEditCourseForm);

export default EditCourseForm;
