import React from 'react';
import { Field, FieldArray, reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Collapsible } from '@edx/paragon';

import CollapsibleCourseRunFields from './CollapsibleCourseRunFields';
import RenderInputTextField from '../RenderInputTextField';
import RenderSelectField from '../RenderSelectField';
import ButtonToolbar from '../../components/ButtonToolbar';
import ImageUpload from '../../components/ImageUpload';
import RichEditor from '../../components/RichEditor';
import { AUDIT_TRACK, VERIFIED_TRACK, PROFESSIONAL_TRACK } from '../../data/constants';
import FieldLabel from '../FieldLabel';


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

  render() {
    const {
      handleSubmit,
      number,
      entitlement,
      submitting,
      title,
      pristine,
      courseRuns,
      uuid,
      courseInReview,
    } = this.props;
    const courseOptions = this.getCourseOptions();
    const courseRunOptions = this.getCourseRunOptions();
    const levelTypeOptions = courseOptions && this.parseOptions(courseOptions.level_type.choices);
    const subjectOptions = courseOptions && this.parseOptions(courseOptions.subjects.child.choices);
    const pacingTypeOptions = (courseRunOptions &&
      this.parseOptions(courseRunOptions.pacing_type.choices));
    const languageOptions = (courseRunOptions &&
      [{
        label: '--', // Add a default null language for the dropdown
        value: '',
      }].concat(this.parseOptions(courseRunOptions.content_language.choices)));

    levelTypeOptions.unshift({ label: '--', value: '' });
    subjectOptions.unshift({ label: '--', value: '' });

    return (
      <div className="edit-course-form">
        <form onSubmit={handleSubmit}>
          <Collapsible
            title={`Course: ${title}`}
            key="Test Key"
            isOpen
          >
            <Field
              name="title"
              component={RenderInputTextField}
              type="text"
              label={<FieldLabel text="Title" required />}
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
              label={<FieldLabel text="Short description" />}
              maxChars={500}
              id="sdesc"
              disabled={courseInReview}
            />
            <Field
              name="full_description"
              component={RichEditor}
              label={<FieldLabel text="Long description" />}
              maxChars={2500}
              id="ldesc"
              disabled={courseInReview}
            />
            <Field
              name="outcome"
              component={RichEditor}
              label={<FieldLabel text="What you will learn" />}
              maxChars={2500}
              id="outcome"
              disabled={courseInReview}
            />
            <Field
              name="subjectPrimary"
              component={RenderSelectField}
              label={<FieldLabel text="Primary subject" />}
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
              label={<FieldLabel text="Image" />}
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
              label={<FieldLabel text="Course level" />}
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
                  label={<FieldLabel text="Price" />}
                  disabled={courseInReview}
                />
              </React.Fragment>
            )}
          </Collapsible>
          <FieldLabel text="Course runs" className="mt-4 mb-2" />
          <FieldArray
            name="course_runs"
            component={CollapsibleCourseRunFields}
            courseRuns={courseRuns}
            languageOptions={languageOptions}
            pacingTypeOptions={pacingTypeOptions}
            courseInReview={courseInReview}
          />
          <ButtonToolbar className="mt-3">
            <Link to={`/courses/${uuid}/course_runs/new`}>
              <button
                className="btn btn-outline-primary"
                disabled={!pristine}
              >
                Re-run Course
              </button>
            </Link>
            <button type="submit" className="btn btn-primary form-submit-btn" disabled={submitting}>
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
  courseRuns: PropTypes.arrayOf(PropTypes.shape({})),
  uuid: PropTypes.string.isRequired,
  courseInReview: PropTypes.bool,
};

BaseEditCourseForm.defaultProps = {
  submitting: false,
  pristine: true,
  courseRuns: [],
  courseInReview: false,
};

const EditCourseForm = compose(
  connect((state, props) => ({
    // Give form a unique id so that values from one course form don't overwrite others
    form: props.id,
  })),
  reduxForm({
    destroyOnUnmount: false, // Keep the form state in redux when editing / creating instructors
  }),
)(BaseEditCourseForm);

export default EditCourseForm;
