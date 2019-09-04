import PropTypes from 'prop-types';
import React from 'react';
import { Field, FieldArray, reduxForm, stopSubmit } from 'redux-form';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Collapsible, Icon } from '@edx/paragon';

import ActionButton from '../../components/ActionButton';
import ButtonToolbar from '../../components/ButtonToolbar';
import CollapsibleCourseRuns from './CollapsibleCourseRuns';
import FieldLabel from '../FieldLabel';
import ImageUpload from '../../components/ImageUpload';
import RenderInputTextField from '../RenderInputTextField';
import RenderSelectField from '../RenderSelectField';
import RichEditor from '../../components/RichEditor';
import Pill from '../../components/Pill';

import {
  AUDIT_TRACK,
  ENTITLEMENT_TRACKS,
  PROFESSIONAL_TRACK,
  VERIFIED_TRACK,
} from '../../data/constants';
import { enrollmentHelp, titleHelp, urlSlugHelp } from '../../helpText';
import { handleCourseEditFail, editCourseValidate } from '../../utils/validation';
import store from '../../data/store';
import { courseSubmittingInfo } from '../../data/actions/courseSubmitInfo';


export class BaseEditCourseForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      collapsiblesOpen: [],
    };

    this.openCollapsible = this.openCollapsible.bind(this);
    this.setCollapsible = this.setCollapsible.bind(this);
    this.toggleCourseRun = this.toggleCourseRun.bind(this);
    this.collapseAllCourseRuns = this.collapseAllCourseRuns.bind(this);
    this.setCourseRunCollapsibles = this.setCourseRunCollapsibles.bind(this);
  }

  componentDidUpdate(prevProps) {
    const {
      change,
      courseInfo: {
        courseSaved,
      },
      courseSubmitInfo,
      currentFormValues,
      initialValues,
      initialValues: {
        course_runs: initialCourseRuns,
      },
      updateFormValuesAfterSave,
    } = this.props;

    if (initialCourseRuns.length && !this.state.collapsiblesOpen.length) {
      this.setCourseRunCollapsibles(initialCourseRuns);
    }

    // If we are transitioning off of a "submit for review" state (which means that we just
    // finished turning fields into required so that html5 can flag them during validation) open
    // the collapsible if and only if there are course-level errors.
    const stoppingRunReview = prevProps.courseSubmitInfo.isSubmittingRunReview &&
                              !courseSubmitInfo.isSubmittingRunReview;
    const hasCourseErrors = courseSubmitInfo.errors &&
                            courseSubmitInfo.errors !== {} &&
                            Object.keys(courseSubmitInfo.errors) !== ['course_runs'];
    if (stoppingRunReview && hasCourseErrors) {
      this.openCollapsible();
    }

    if (courseSaved) {
      updateFormValuesAfterSave(change, currentFormValues, initialValues);
    }
  }

  setCourseRunCollapsibles(initialCourseRuns) {
    const collapsiblesOpen = initialCourseRuns.map(() => (false));
    this.setState({ collapsiblesOpen });
  }

  setCollapsible(open) {
    this.setState({
      open,
    });
  }

  getEnrollmentTrackOptions() {
    return [
      { label: AUDIT_TRACK.name, value: AUDIT_TRACK.key },
      { label: VERIFIED_TRACK.name, value: VERIFIED_TRACK.key },
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

    return data.actions.POST;
  }

  getAddCourseRunButton(disabled, pristine, uuid) {
    /** Disabling a Link is discouraged and disabling a button within a link results
     * in a Disabled button with a link that will still underline on hover.
     * This method will remove the Link when disabling the button.
     */
    if (disabled) {
      return '';
    }

    const courseRunButton = (
      <button className="btn btn-block rounded mt-3 new-run-button" disabled={!pristine}>
        <Icon className="fa fa-plus" /> Add Course Run
      </button>);

    let buttonWrapper = (
      <Link to={`/courses/${uuid}/rerun`}>
        {courseRunButton}
      </Link>);

    if (!pristine) {
      buttonWrapper = (
        <React.Fragment>
          {courseRunButton}
        </React.Fragment>
      );
    }
    return buttonWrapper;
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

  toggleCourseRun(index, value) {
    const collapsiblesOpen = Object.assign([], this.state.collapsiblesOpen);
    collapsiblesOpen[index] = value;
    this.setState({ collapsiblesOpen });
  }

  collapseAllCourseRuns() {
    const collapsiblesOpen = this.state.collapsiblesOpen.map(() => (false));
    this.setState({ collapsiblesOpen });
  }

  openCollapsible() {
    this.setCollapsible(true);
  }

  parseOptions(choices) {
    return choices.map(choice => ({ label: choice.display_name, value: choice.value }));
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
      authentication: {
        administrator,
      },
      handleSubmit,
      number,
      entitlement,
      currentFormValues,
      submitting,
      title,
      pristine,
      uuid,
      courseInReview,
      courseStatuses,
      id,
      isSubmittingForReview,
      editable,
      courseInfo,
      reset,
    } = this.props;
    const {
      open,
    } = this.state;

    const courseOptions = this.getCourseOptions();
    const courseRunOptions = this.getCourseRunOptions();
    const levelTypeOptions = courseOptions && this.parseOptions(courseOptions.level_type.choices);
    const ofacRestrictionOptions = (courseRunOptions && courseRunOptions.has_ofac_restrictions &&
      this.parseOptions(courseRunOptions.has_ofac_restrictions.choices));
    const subjectOptions = courseOptions && this.parseOptions(courseOptions.subjects.child.choices);
    const pacingTypeOptions = (courseRunOptions &&
      this.parseOptions(courseRunOptions.pacing_type.choices));
    const languageOptions = (courseRunOptions &&
      this.parseOptions(courseRunOptions.content_language.choices));
    const programOptions = (courseRunOptions &&
      this.parseOptions(courseRunOptions.expected_program_type.choices));

    const disabled = courseInReview || !editable;

    let submitState = 'default';
    if (submitting || (courseInfo && courseInfo.isSubmittingEdit)) {
      submitState = 'pending';
    } else if (pristine) {
      submitState = 'complete';
    }

    languageOptions.unshift({ label: '--', value: '' });
    levelTypeOptions.unshift({ label: '--', value: '' });
    subjectOptions.unshift({ label: '--', value: '' });
    programOptions.unshift({ label: '--', value: '' });

    const cancelButton = (
      <button
        onClick={() => {
          this.setCollapsible(false);
          reset();
          this.collapseAllCourseRuns();
        }}
        className="btn btn-outline-primary"
      >
        Clear Edits
      </button>
    );

    return (
      <div className="edit-course-form">
        <form id={id} onSubmit={handleSubmit}>
          <FieldLabel text={title} className="mb-2 h2" />
          <Collapsible
            title={this.formatCourseTitle(title, courseStatuses)}
            key="Test Key"
            isOpen={open}
            onToggle={this.setCollapsible}
          >
            <div className="mb-3">
              <span className="text-info" aria-hidden> All fields are required for publication unless otherwise specified.</span>
            </div>
            <Field
              name="title"
              component={RenderInputTextField}
              type="text"
              label={
                <FieldLabel
                  id="title.label"
                  text="Title"
                  helpText={titleHelp}
                />
              }
              extraInput={{ onInvalid: this.openCollapsible }}
              required
              disabled={disabled}
            />
            {administrator && <Field
              name="url_slug"
              component={RenderInputTextField}
              type="text"
              label={
                <FieldLabel
                  id="slug.label"
                  text="URL slug"
                  optional
                  helpText={urlSlugHelp}
                />
              }
              disabled={disabled}
              optional
            />}
            <div>
              <FieldLabel id="number" text="Number" className="mb-2" />
              <div className="mb-3">{number}</div>
            </div>
            <Field
              name="mode"
              component={RenderSelectField}
              label={
                <FieldLabel
                  id="mode.label"
                  text="Enrollment track"
                  helpText={enrollmentHelp}
                  extraText="Cannot edit after submission"
                />
              }
              extraInput={{ onInvalid: this.openCollapsible }}
              options={this.getEnrollmentTrackOptions()}
              disabled={disabled || !!entitlement.sku}
            />
            {ENTITLEMENT_TRACKS.includes(currentFormValues.mode) && <Field
              name="price"
              component={RenderInputTextField}
              type="number"
              label={<FieldLabel text="Price" />}
              extraInput={{
                onInvalid: this.openCollapsible,
                min: 1.00,
                step: 0.01,
                max: 10000.00,
              }}
              disabled={disabled}
              required={isSubmittingForReview}
            />}
            <Field
              name="imageSrc"
              component={ImageUpload}
              label={
                <FieldLabel
                  id="image.label"
                  text="Image"
                  helpText={
                    <div>
                      <p>
                        An eye-catching, colorful image that captures the essence of your course.
                      </p>
                      <ul>
                        <li>New course images must be 1134×675 pixels in size.</li>
                        <li>The image must be a JPEG or PNG file.</li>
                        <li>Each course must have a unique image.</li>
                        <li>The image cannot include text or headlines.</li>
                        <li>
                          You must have permission to use the image. Possible image sources
                          include Flickr creative commons, Stock Vault, Stock XCHNG, and iStock
                          Photo.
                        </li>
                      </ul>
                      <p>
                        <a
                          href="https://edx.readthedocs.io/projects/edx-partner-course-staff/en/latest/set_up_course/planning_course_information/image_guidelines.html#representative-image-guidelines"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Learn more.
                        </a>
                      </p>
                    </div>
                  }
                  extraText="Image must be 1134x675 pixels in size."
                />
              }
              extraInput={{ onInvalid: this.openCollapsible }}
              maxImageSizeKilo={1000}
              requiredWidth={1134}
              requiredHeight={675}
              id="image"
              className="course-image"
              disabled={disabled}
            />
            <hr />
            <Field
              name="short_description"
              component={RichEditor}
              label={
                <FieldLabel
                  id="sdesc.label"
                  text="Short description"
                  helpText={
                    <div>
                      <p>An effective short description:</p>
                      <ul>
                        <li>Contains 25–50 words.</li>
                        <li>Functions as a tagline.</li>
                        <li>Conveys compelling reasons to take the course.</li>
                        <li>Follows SEO guidelines.</li>
                        <li>Targets a global audience.</li>
                      </ul>
                      <p>
                        <a
                          href="https://edx.readthedocs.io/projects/edx-partner-course-staff/en/latest/set_up_course/planning_course_information/description_guidelines.html#course-short-description-guidelines"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Learn more.
                        </a>
                      </p>
                      <p><b>Example:</b></p>
                      <p>
                        The first MOOC to teach positive psychology. Learn science-based
                        principles and practices for a happy, meaningful life.
                      </p>
                    </div>
                  }
                />
              }
              extraInput={{ onInvalid: this.openCollapsible }}
              maxChars={500}
              id="sdesc"
              disabled={disabled}
            />
            <Field
              name="full_description"
              component={RichEditor}
              label={
                <FieldLabel
                  id="ldesc.label"
                  text="Long description"
                  helpText={
                    <div>
                      <p>An effective long description:</p>
                      <ul>
                        <li>Contains 150–300 words.</li>
                        <li>Is easy to skim.</li>
                        <li>Uses bullet points instead of dense text paragraphs.</li>
                        <li>Follows SEO guidelines.</li>
                        <li>Targets a global audience.</li>
                      </ul>
                      <p>
                        The first four lines are visible when the About page opens. Learners can
                        select “See More” to view the full description.
                      </p>
                      <p>
                        <a
                          href="https://edx.readthedocs.io/projects/edx-partner-course-staff/en/latest/set_up_course/planning_course_information/description_guidelines.html#course-long-description-guidelines"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Learn more.
                        </a>
                      </p>
                    </div>
                  }
                />
              }
              extraInput={{ onInvalid: this.openCollapsible }}
              maxChars={2500}
              id="ldesc"
              disabled={disabled}
            />
            <Field
              name="outcome"
              component={RichEditor}
              label={
                <FieldLabel
                  id="outcome.label"
                  text="What you will learn"
                  helpText={
                    <div>
                      <p>The skills and knowledge learners will acquire in this course.</p>
                      <p>Format each item as a bullet with four to ten words.</p>
                      <p><b>Example:</b></p>
                      <ul>
                        <li>Basic R Programming</li>
                        <li>An applied understanding of linear and logistic regression</li>
                        <li>Application of text analytics</li>
                        <li>Linear and integer optimization</li>
                      </ul>
                      <p>
                        <a
                          href="https://edx.readthedocs.io/projects/edx-partner-course-staff/en/latest/set_up_course/planning_course_information/description_guidelines.html#what-you-will-learn-guidelines"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Learn more.
                        </a>
                      </p>
                    </div>
                  }
                />
              }
              extraInput={{ onInvalid: this.openCollapsible }}
              maxChars={2500}
              id="outcome"
              disabled={disabled}
            />
            <Field
              name="syllabus_raw"
              component={RichEditor}
              label={
                <FieldLabel
                  id="syllabus.label"
                  text="Syllabus"
                  helpText={
                    <div>
                      <p>
                        A review of content covered in your course, organized by week or module.
                      </p>
                      <ul>
                        <li>Focus on topics and content.</li>
                        <li>
                          Do not include detailed information about course logistics, such as
                          grading, communication policies, and reading lists.
                        </li>
                        <li>Format items as either paragraphs or a bulleted list.</li>
                      </ul>
                      <p>
                        <a
                          href="https://edx.readthedocs.io/projects/edx-partner-course-staff/en/latest/set_up_course/planning_course_information/additional_course_information.html#id3"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Learn more.
                        </a>
                      </p>
                      <p><b>Example:</b></p>
                      <ul>
                        <li>
                          <p>Week 1: From Calculator to Computer</p>
                          <p>
                            Introduction to basic programming concepts, such as values and
                            expressions, as well as making decisions when implementing algorithms
                            and developing programs.
                          </p>
                        </li>
                        <li>
                          <p>Week 2: State Transformation</p>
                          <p>
                            Introduction to state transformation, including representation of data
                            and programs as well as conditional repetition.
                          </p>
                        </li>
                      </ul>
                    </div>
                  }
                  optional
                />
              }
              extraInput={{ onInvalid: this.openCollapsible }}
              maxChars={500}
              id="syllabus"
              disabled={disabled}
            />
            <Field
              name="prerequisites_raw"
              component={RichEditor}
              label={
                <FieldLabel
                  id="prereq.label"
                  text="Prerequisites"
                  helpText={
                    <div>
                      <p>
                        Specific knowledge learners must have to be successful in the course.
                        If the course has no prerequisites, enter “None”.
                      </p>
                      <p>
                        <a
                          href="https://edx.readthedocs.io/projects/edx-partner-course-staff/en/latest/set_up_course/planning_course_information/additional_course_information.html#skill-and-knowledge-prerequisites"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Learn more.
                        </a>
                      </p>
                      <p><b>Examples:</b></p>
                      <ul>
                        <li>Secondary school (high school) algebra; basic mathematics concepts</li>
                        <li>Graduate-level understanding of Keynesian economics</li>
                        <li>Basic algebra</li>
                      </ul>
                    </div>
                  }
                  optional
                />
              }
              extraInput={{ onInvalid: this.openCollapsible }}
              maxChars={1000}
              id="prereq"
              disabled={disabled}
            />
            <Field
              name="learner_testimonials"
              component={RichEditor}
              label={
                <FieldLabel
                  id="testimonials.label"
                  text="Learner testimonials"
                  helpText={
                    <div>
                      <p>
                        A quote from a learner in the course, demonstrating the value of taking
                        the course.
                      </p>
                      <p>Should be no more than 25–50 words in length.</p>
                      <p>
                        <a
                          href="https://edx.readthedocs.io/projects/edx-partner-course-staff/en/latest/set_up_course/planning_course_information/additional_course_information.html#learner-testimonial-guidelines"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Learn more.
                        </a>
                      </p>
                      <p><b>Example:</b></p>
                      <p>
                        “Brilliant course! It’s definitely the best introduction to electronics
                        in the world! Interesting material, clean explanations, well prepared
                        quizzes, challenging homework, and fun labs.” – Previous Student
                      </p>
                    </div>
                  }
                  optional
                />
              }
              extraInput={{ onInvalid: this.openCollapsible }}
              maxChars={500}
              id="learner-testimonials"
              disabled={disabled}
            />
            <Field
              name="faq"
              component={RichEditor}
              label={
                <FieldLabel
                  id="faq.label"
                  text="Frequently asked questions"
                  helpText={
                    <div>
                      <p>Any frequently asked questions and the answers to those questions.</p>
                      <p>
                        <a
                          href="https://edx.readthedocs.io/projects/edx-partner-course-staff/en/latest/set_up_course/planning_course_information/additional_course_information.html#faq-guidelines"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Learn more.
                        </a>
                      </p>
                      <p><b>Example:</b></p>
                      <strong>Do I need to know any programming languages before I start?</strong>
                      <p>
                        No, this course is designed for beginners.
                      </p>
                      <strong>What version of Swift will I be learning?</strong>
                      <p>
                        Swift version 4.
                      </p>
                    </div>
                  }
                  optional
                />
              }
              extraInput={{ onInvalid: this.openCollapsible }}
              maxChars={2500}
              id="faq"
              disabled={disabled}
            />
            {administrator && <Field
              name="additional_information"
              component={RichEditor}
              label={
                <FieldLabel
                  id="additional-info.label"
                  text="Additional information"
                  helpText={
                    <div>
                      <p>Any additional information to be provided to learners.</p>
                    </div>
                  }
                  optional
                />
              }
              extraInput={{ onInvalid: this.openCollapsible }}
              maxChars={2500}
              id="additional-information"
              disabled={disabled}
            />}
            {administrator && <Field
              name="videoSrc"
              component={RenderInputTextField}
              type="url"
              label={
                <FieldLabel
                  id="video.label"
                  text="About video link"
                  helpText={
                    <div>
                      <p>
                        The About video should excite and entice potential students to take your
                        course. Think of it as a movie trailer or TV show promotion. The video
                        should be compelling, and exhibit the instructor’s personality.
                      </p>
                      <p>
                        The ideal length is 30–90 seconds (learners typically watch an average
                        of 30 seconds).
                      </p>
                      <p>
                        The About video should be produced and edited, using elements such as
                        graphics and stock footage.
                      </p>
                      <p>The About video should answer these key questions.</p>
                      <ul>
                        <li>Why should a learner register?</li>
                        <li>What topics and concepts are covered?</li>
                        <li>Who is teaching the course?</li>
                        <li>What institution is delivering the course?</li>
                      </ul>
                      <p>
                        <a
                          href="https://edx.readthedocs.io/projects/edx-partner-course-staff/en/latest/set_up_course/planning_course_information/image_guidelines.html#id2"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Learn more.
                        </a>
                      </p>
                      <p>
                        <span>Visit</span>
                        <a
                          href="www.youtube.com/user/EdXOnline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          edX’s YouTube channel
                        </a>
                        <span>for examples of other About videos.</span>
                      </p>
                    </div>
                  }
                  optional
                />
              }
              extraInput={{ onInvalid: this.openCollapsible }}
              disabled={disabled}
            />}
            <hr />
            <Field
              name="level_type"
              component={RenderSelectField}
              label={
                <FieldLabel
                  id="level.label"
                  text="Course level"
                  // TODO: these descriptions should come from the server -- levels are defined in
                  //       the database and are not suitable for hardcoding like this.
                  helpText={
                    <div>
                      <dl>
                        <dt>Introductory</dt>
                        <dd>
                          No prerequisites; a learner who has completed some or all secondary
                          school could complete the course.
                        </dd>
                        <dt>Intermediate</dt>
                        <dd>
                          Basic prerequisites; learners need to complete secondary school or some
                          university courses.
                        </dd>
                        <dt>Advanced</dt>
                        <dd>
                          Significant prerequisites; the course is geared to third or fourth year
                          university students or master’s degree students.
                        </dd>
                      </dl>
                    </div>
                  }
                />
              }
              extraInput={{ onInvalid: this.openCollapsible }}
              options={levelTypeOptions}
              disabled={disabled}
              required={isSubmittingForReview}
            />
            <Field
              name="subjectPrimary"
              component={RenderSelectField}
              label={
                <FieldLabel
                  id="subject1.label"
                  text="Primary subject"
                  helpText={
                    <div>
                      <p>The subject of the course.</p>
                      <p>
                        You can select up to two subjects in addition to the primary subject.
                        Only the primary subject appears on the About page.
                      </p>
                      <p>
                        <a
                          href="https://edx.readthedocs.io/projects/edx-partner-course-staff/en/latest/set_up_course/planning_course_information/description_guidelines.html#subject-guidelines"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Learn more.
                        </a>
                      </p>
                    </div>
                  }
                />
              }
              extraInput={{ onInvalid: this.openCollapsible }}
              options={subjectOptions}
              disabled={disabled}
              required={isSubmittingForReview}
            />
            <Field
              name="subjectSecondary"
              component={RenderSelectField}
              label={<FieldLabel text="Secondary subject" optional />}
              extraInput={{ onInvalid: this.openCollapsible }}
              options={subjectOptions}
              disabled={disabled}
              optional
            />
            <Field
              name="subjectTertiary"
              component={RenderSelectField}
              label={<FieldLabel text="Tertiary subject" optional />}
              extraInput={{ onInvalid: this.openCollapsible }}
              options={subjectOptions}
              disabled={disabled}
              optional
            />
          </Collapsible>
          <FieldLabel text="Course runs" className="mt-4 mb-2 h2" />
          <FieldArray
            name="course_runs"
            component={CollapsibleCourseRuns}
            languageOptions={languageOptions}
            ofacRestrictionOptions={ofacRestrictionOptions}
            programOptions={programOptions}
            pacingTypeOptions={pacingTypeOptions}
            formId={id}
            courseUuid={uuid}
            courseSubmitting={submitting}
            collapsiblesOpen={this.state.collapsiblesOpen}
            onToggle={(index, value) => this.toggleCourseRun(index, value)}
            {...this.props}
          />
          {this.getAddCourseRunButton(disabled, pristine, uuid)}
          {editable &&
            <ButtonToolbar className="mt-3">
              {submitState === 'default' ? cancelButton : null}
              <ActionButton
                disabled={disabled || submitting}
                labels={{
                  default: 'Save & Continue Editing',
                  pending: 'Saving Course',
                  complete: 'Course Saved',
                }}
                state={submitState}
                onClick={() => {
                  /* Bit of a hack used to clear old validation errors that might be around from
                   *  trying to submit for review with errors.
                   */
                  store.dispatch(stopSubmit(id));
                  store.dispatch(courseSubmittingInfo());
                }}
              />
            </ButtonToolbar>
          }
        </form>
      </div>
    );
  }
}

BaseEditCourseForm.propTypes = {
  authentication: PropTypes.shape({
    administrator: PropTypes.bool,
  }),
  handleSubmit: PropTypes.func.isRequired,
  number: PropTypes.string.isRequired,
  currentFormValues: PropTypes.shape({}),
  title: PropTypes.string.isRequired,
  entitlement: PropTypes.shape({
    sku: PropTypes.string,
  }),
  courseOptions: PropTypes.shape({
    data: PropTypes.shape(),
    error: PropTypes.arrayOf(PropTypes.string),
    isFetching: PropTypes.bool,
  }).isRequired,
  courseRunOptions: PropTypes.shape({
    data: PropTypes.shape(),
    error: PropTypes.arrayOf(PropTypes.string),
    isFetching: PropTypes.bool,
  }).isRequired,
  submitting: PropTypes.bool,
  pristine: PropTypes.bool,
  uuid: PropTypes.string.isRequired,
  courseInReview: PropTypes.bool,
  courseStatuses: PropTypes.arrayOf(PropTypes.string),
  id: PropTypes.string.isRequired,
  isSubmittingForReview: PropTypes.bool,
  editable: PropTypes.bool,
  courseInfo: PropTypes.shape({
    isSubmittingEdit: PropTypes.bool,
  }),
  courseSubmitInfo: PropTypes.shape({
    errors: PropTypes.shape({}),
    isSubmittingRunReview: PropTypes.bool,
  }),
  initialValues: PropTypes.shape({
    course_runs: PropTypes.arrayOf(PropTypes.shape({})),
    imageSrc: PropTypes.string,
  }),
  change: PropTypes.func,
  updateFormValuesAfterSave: PropTypes.func,
  reset: PropTypes.func.isRequired,
};

BaseEditCourseForm.defaultProps = {
  authentication: {
    administrator: false,
  },
  currentFormValues: {},
  entitlement: { sku: null },
  submitting: false,
  pristine: true,
  courseInReview: false,
  courseStatuses: [],
  isSubmittingForReview: false,
  editable: false,
  courseInfo: {},
  courseSubmitInfo: {},
  initialValues: {
    course_runs: [],
    imageSrc: '',
  },
  change: () => null,
  updateFormValuesAfterSave: () => null,
};

const EditCourseForm = compose(
  connect((state, props) => ({
    // Give form a unique id so that values from one course form don't overwrite others
    form: props.id,
  })),
  reduxForm({
    enableReinitialize: true, // Reload staff changes when returning from editing /creating staffers
    keepDirtyOnReinitialize: true, // Don't wipe out changes on reinitialization
    updateUnregisteredFields: true,
    destroyOnUnmount: false, // Keep the form state in redux when editing / creating staffers
    onSubmitFail: handleCourseEditFail, // Send focus to first non-input field with errors
    // Run the sync validation when a run is submitting for review and regular submission process
    shouldError: (params) => {
      const { nextProps, props } = params;
      return (
        props.submitting ||
        (nextProps && nextProps.submitting) ||
        props.targetRun ||
        (nextProps && nextProps.targetRun)
      );
    },
    validate: editCourseValidate,
  }),
)(BaseEditCourseForm);

export default EditCourseForm;
