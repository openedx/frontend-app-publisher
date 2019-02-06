import React from 'react';
import { Field, reduxForm } from 'redux-form';
import PropTypes from 'prop-types';

import RenderInputTextField from '../RenderInputTextField';
import RenderSelectField from '../RenderSelectField';
import ImageUpload from '../../components/ImageUpload';
import RichEditor from '../../components/RichEditor';
import { AUDIT_TRACK, VERIFIED_TRACK, PROFESSIONAL_TRACK } from '../../data/constants';


class EditCourseForm extends React.Component {
  getEnrollmentTrackOptions() {
    return [
      { label: VERIFIED_TRACK.name, value: VERIFIED_TRACK.key },
      { label: AUDIT_TRACK.name, value: AUDIT_TRACK.key },
      { label: PROFESSIONAL_TRACK.name, value: PROFESSIONAL_TRACK.key },
    ];
  }

  getOptions() {
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

  parseOptions(inChoices) {
    return inChoices.map(choice =>
      ({ label: choice.display_name, value: choice.value }));
  }

  render() {
    const {
      handleSubmit,
      number,
      submitting,
    } = this.props;

    const options = this.getOptions();
    const levelTypeOptions = options && this.parseOptions(options.level_type.choices);
    const subjectOptions = options && this.parseOptions(options.subjects.child.choices);

    levelTypeOptions.unshift({ label: '--', value: '' });
    subjectOptions.unshift({ label: '--', value: '' });

    return (
      <div className="edit-course-form row">
        <div className="col">
          <form onSubmit={handleSubmit}>
            <Field
              name="title"
              component={RenderInputTextField}
              type="text"
              label={<strong>Title: *</strong>}
              required
            />
            <div className="row">
              <div id="number" className="col-12">
                <strong>Number: *</strong>
              </div>
              <div className="col-12">{number}</div>
            </div>
            <Field
              name="short_description"
              component={RichEditor}
              label={<strong>Short Description: *</strong>}
              maxChars={500}
              id="sdesc"
            />
            <Field
              name="full_description"
              component={RichEditor}
              label={<strong>Long Description: *</strong>}
              maxChars={2500}
              id="ldesc"
            />
            <Field
              name="outcome"
              component={RichEditor}
              label={<strong>What you will learn: *</strong>}
              maxChars={2500}
              id="outcome"
            />
            <Field
              name="subjectPrimary"
              component={RenderSelectField}
              label={<strong>Primary Subject: *</strong>}
              options={subjectOptions}
              required
            />
            <Field
              name="subjectSecondary"
              component={RenderSelectField}
              label={<strong>Secondary Subject:</strong>}
              options={subjectOptions}
            />
            <Field
              name="subjectTertiary"
              component={RenderSelectField}
              label={<strong>Tertiary Subject:</strong>}
              options={subjectOptions}
            />
            <Field
              name="imageSrc"
              component={ImageUpload}
              label={<strong>Image: *</strong>}
              id="image"
            />
            <Field
              name="prerequisites_raw"
              component={RichEditor}
              label={<strong>Prerequisites:</strong>}
              maxChars={1000}
              id="prereq"
            />
            <Field
              name="level_type"
              component={RenderSelectField}
              label={<strong>Course Level: *</strong>}
              options={levelTypeOptions}
              required
            />
            <Field
              name="learner_testimonials"
              component={RichEditor}
              label={<strong>Learner Testimonials:</strong>}
              maxChars={500}
              id="learner-testimonials"
            />
            <Field
              name="faq"
              component={RichEditor}
              label={<strong>Frequently Asked Questions:</strong>}
              maxChars={2500}
              id="faq"
            />
            <Field
              name="additional_information"
              component={RichEditor}
              label={<strong>Additional Information:</strong>}
              maxChars={2500}
              id="additional-information"
            />
            <Field
              name="syllabus_raw"
              component={RichEditor}
              label={<strong>Syllabus:</strong>}
              maxChars={500}
              id="syllabus"
            />
            <Field
              name="videoSrc"
              component={RenderInputTextField}
              type="text"
              label={<strong>About Video Link: *</strong>}
              required
            />
            <Field
              name="mode"
              component={RenderSelectField}
              label={<strong>Enrollment Track:</strong>}
              options={this.getEnrollmentTrackOptions()}
            />
            <Field
              name="price"
              component={RenderInputTextField}
              type="number"
              label={<strong>Price: *</strong>}
            />
            <div className="row justify-content-end">
              <button type="submit" className="btn btn-outline-primary form-submit-btn" disabled={submitting}>
                Save Course
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

EditCourseForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  number: PropTypes.string.isRequired,
  courseOptions: PropTypes.shape({
    data: PropTypes.shape(),
    error: PropTypes.string,
    isFetching: PropTypes.bool,
  }).isRequired,
  submitting: PropTypes.bool.isRequired,
};

export default reduxForm({ form: 'edit-course-form' })(EditCourseForm);
