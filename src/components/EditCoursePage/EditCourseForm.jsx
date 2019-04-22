import PropTypes from 'prop-types';
import React from 'react';
import { Field, FieldArray, reduxForm } from 'redux-form';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Collapsible } from '@edx/paragon';

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
    } = this.props;
    const courseOptions = this.getCourseOptions();
    const courseRunOptions = this.getCourseRunOptions();
    const levelTypeOptions = courseOptions && this.parseOptions(courseOptions.level_type.choices);
    const subjectOptions = courseOptions && this.parseOptions(courseOptions.subjects.child.choices);
    const pacingTypeOptions = (courseRunOptions &&
      this.parseOptions(courseRunOptions.pacing_type.choices));
    const languageOptions = (courseRunOptions &&
      this.parseOptions(courseRunOptions.content_language.choices));

    languageOptions.unshift({ label: '--', value: '' });
    levelTypeOptions.unshift({ label: '--', value: '' });
    subjectOptions.unshift({ label: '--', value: '' });

    return (
      <div className="edit-course-form">
        <form onSubmit={handleSubmit} id={id}>
          <FieldLabel text="Course" className="mt-4 mb-2" />
          <Collapsible
            title={this.formatCourseTitle(title, courseStatuses)}
            key="Test Key"
          >
            <Field
              name="title"
              component={RenderInputTextField}
              type="text"
              label={<FieldLabel text="Title" required requiredForSubmit />}
              required
              disabled={courseInReview}
            />
            <div>
              <FieldLabel id="number" text="Number" className="mb-2" requiredForSubmit />
              <div className="mb-3">{number}</div>
            </div>
            <Field
              name="short_description"
              component={RichEditor}
              label={<FieldLabel text="Short description" requiredForSubmit />}
              maxChars={500}
              id="sdesc"
              disabled={courseInReview}
            />
            <Field
              name="full_description"
              component={RichEditor}
              label={<FieldLabel text="Long description" requiredForSubmit />}
              maxChars={2500}
              id="ldesc"
              disabled={courseInReview}
            />
            <Field
              name="outcome"
              component={RichEditor}
              label={<FieldLabel text="What you will learn" requiredForSubmit />}
              maxChars={2500}
              id="outcome"
              disabled={courseInReview}
            />
            <Field
              name="subjectPrimary"
              component={RenderSelectField}
              label={<FieldLabel text="Primary subject" requiredForSubmit />}
              options={subjectOptions}
              disabled={courseInReview}
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
              disabled={courseInReview}
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
              type="text"
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
                  type="number"
                  label={<FieldLabel text="Price" required requiredForSubmit />}
                  disabled={courseInReview}
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
            <button
              type="submit"
              className="btn btn-primary form-submit-btn"
              disabled={submitting || courseInReview}
            >
              Save Course
            </button>
          </ButtonToolbar>
        </form>
      </div>
    );
  }
}

BaseEditCourseForm.defaultProps = {
  entitlement: false,
};

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
};

BaseEditCourseForm.defaultProps = {
  submitting: false,
  pristine: true,
  courseInReview: false,
  courseStatuses: [],
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
