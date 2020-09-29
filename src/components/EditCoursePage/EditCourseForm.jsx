import PropTypes from 'prop-types';
import React from 'react';
import {
  Field, FieldArray, reduxForm, stopSubmit,
} from 'redux-form';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';
import { Icon, Hyperlink } from '@edx/paragon';

import CollapsibleCourseRuns from './CollapsibleCourseRuns';
import CourseButtonToolbar from './CourseButtonToolbar';
import FieldLabel from '../FieldLabel';
import ImageUpload from '../ImageUpload';
import RenderInputTextField from '../RenderInputTextField';
import RenderSelectField from '../RenderSelectField';
import RichEditor from '../RichEditor';
import Pill from '../Pill';
import Collapsible from '../Collapsible';
import PriceList from '../PriceList';

import { PUBLISHED, REVIEWED } from '../../data/constants';
import { titleHelp, typeHelp, urlSlugHelp } from '../../helpText';
import { handleCourseEditFail, editCourseValidate } from '../../utils/validation';
import {
  formatCollaboratorOptions,
  getOptionsData, isPristine, parseCourseTypeOptions, parseOptions,
} from '../../utils';
import store from '../../data/store';
import { courseSubmitRun } from '../../data/actions/courseSubmitInfo';
import ListField from '../ListField';
import { Collaborator } from '../Collaborator';
import renderSuggestion from '../Collaborator/renderSuggestion';
import fetchCollabSuggestions from '../Collaborator/fetchCollabSuggestions';

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
    const stoppingRunReview = prevProps.courseSubmitInfo.isSubmittingRunReview
                              && !courseSubmitInfo.isSubmittingRunReview;
    const hasCourseErrors = courseSubmitInfo.errors
                            && Object.keys(courseSubmitInfo.errors).length
                            && Object.keys(courseSubmitInfo.errors) !== ['course_runs'];
    if (stoppingRunReview && hasCourseErrors) {
      this.openCollapsible();
    }

    if (courseSaved) {
      updateFormValuesAfterSave(change, currentFormValues, initialValues);
    }
  }

  setCourseRunCollapsibles(initialCourseRuns) {
    const collapsiblesOpen = initialCourseRuns.map(() => false);
    this.setState({ collapsiblesOpen });
  }

  setCollapsible(open) {
    this.setState({
      open,
    });
  }

  getAddCourseRunButton(disabled, uuid) {
    let courseRunButton = (
      <button
        type="button"
        className="btn btn-block rounded mt-3 new-run-button"
        disabled={disabled}
      >
        <Icon className="fa fa-plus" /> Add Course Run
      </button>
    );

    /** Disabling a Link is discouraged and disabling a button within a link results
     * in a Disabled button with a link that will still underline on hover.
     * So only add the Link if the button is enabled.
     */
    if (!disabled) {
      courseRunButton = (
        <Link to={`/courses/${uuid}/rerun`}>
          {courseRunButton}
        </Link>
      );
    }

    return courseRunButton;
  }

  getLinkComponent(courseStatuses, courseInfo) {
    if (courseStatuses.length === 1 && courseStatuses[0] === REVIEWED && courseInfo.data && courseInfo.data.url_slug) {
      return (
        <>
          <Hyperlink
            destination={`https://www.edx.org/preview/course/${courseInfo.data.url_slug}`}
            target="_blank"
          >
            View Preview Page
          </Hyperlink>
          <span className="d-block">Any changes will go live when the website next builds</span>
        </>
      );
    }
    if (courseStatuses.includes(PUBLISHED) && courseInfo.data && courseInfo.data.marketing_url) {
      return (
        <div>
          Already published -&nbsp;
          <Hyperlink
            destination={courseInfo.data.marketing_url}
            target="_blank"
          >
            View Live Page
          </Hyperlink>
        </div>
      );
    }
    return 'No Preview Link Available';
  }

  formatCourseTitle(title, courseStatuses, courseInfo) {
    // TODO: After we have a way of determining if the course has been edited, that should be
    // added into the list of statuses being passed into the Pill component.
    return (
      <>
        {`Course: ${title}`}
        <Pill statuses={courseStatuses} />
        <div className="course-preview-url">
          { this.getLinkComponent(courseStatuses, courseInfo) }
        </div>
      </>
    );
  }

  toggleCourseRun(index, value) {
    this.setState(prevState => {
      const collapsiblesOpen = [...prevState.collapsiblesOpen];
      collapsiblesOpen[index] = value;
      return { collapsiblesOpen };
    });
  }

  collapseAllCourseRuns() {
    this.setState(prevState => ({
      collapsiblesOpen: prevState.collapsiblesOpen.map(() => false),
    }));
  }

  openCollapsible() {
    this.setCollapsible(true);
  }

  render() {
    const {
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
      courseOptions,
      courseRunOptions,
      initialValues,
      collaboratorOptions,
      collaboratorInfo,
    } = this.props;
    const {
      open,
    } = this.state;
    const { administrator } = getAuthenticatedUser();

    const courseOptionsData = getOptionsData(courseOptions);
    const courseRunOptionsData = getOptionsData(courseRunOptions);
    const levelTypeOptions = courseOptionsData
      && parseOptions(courseOptionsData.level_type.choices);
    const ofacRestrictionOptions = (courseRunOptionsData
      && courseRunOptionsData.has_ofac_restrictions
      && parseOptions(courseRunOptionsData.has_ofac_restrictions.choices));
    const subjectOptions = courseOptionsData
      && parseOptions(courseOptionsData.subjects.child.choices);
    const pacingTypeOptions = (courseRunOptionsData
      && parseOptions(courseRunOptionsData.pacing_type.choices));
    const languageOptions = (courseRunOptionsData
      && parseOptions(courseRunOptionsData.content_language.choices));
    const programOptions = (courseRunOptionsData
      && parseOptions(courseRunOptionsData.expected_program_type.choices));

    const {
      data: {
        results: allResults,
      },
    } = collaboratorOptions;

    const allCollaborators = formatCollaboratorOptions(allResults);

    const parsedTypeOptions = courseOptionsData
      && parseCourseTypeOptions(courseOptionsData.type.type_options);
    const {
      courseTypeOptions,
      courseRunTypeOptions,
      courseTypes,
      priceLabels,
      runTypeModes,
    } = parsedTypeOptions;
    const disabled = courseInReview || !editable;
    const showMarketingFields = !currentFormValues.type || !courseTypes[currentFormValues.type]
      || courseTypes[currentFormValues.type].course_run_types.some(crt => crt.is_marketable);

    const courseIsPristine = isPristine(initialValues, currentFormValues);
    const publishedContentChanged = initialValues.course_runs
      && initialValues.course_runs.some(run => (run.status === PUBLISHED
        && (!courseIsPristine || !isPristine(initialValues, currentFormValues, run.key))));

    languageOptions.unshift({ label: '--', value: '' });
    levelTypeOptions.unshift({ label: '--', value: '' });
    subjectOptions.unshift({ label: '--', value: '' });
    programOptions.unshift({ label: '--', value: '' });

    return (
      <div className="edit-course-form">
        <form id={id} onSubmit={handleSubmit}>
          <FieldLabel text={title} className="mb-2 h2" />
          <Collapsible
            title={this.formatCourseTitle(title, courseStatuses, courseInfo)}
            key="Test Key"
            open={open}
            onToggle={this.setCollapsible}
          >
            <div className="mb-3">
              <span className="text-info" aria-hidden> All fields are required for publication unless otherwise specified.</span>
            </div>
            <Field
              name="title"
              component={RenderInputTextField}
              type="text"
              label={(
                <FieldLabel
                  id="title.label"
                  text="Title"
                  helpText={titleHelp}
                />
              )}
              extraInput={{ onInvalid: this.openCollapsible }}
              required
              disabled={disabled}
            />
            <Field
              name="url_slug"
              component={RenderInputTextField}
              type="text"
              label={(
                <FieldLabel
                  id="slug.label"
                  text="URL slug"
                  optional
                  helpText={urlSlugHelp}
                />
              )}
              disabled={disabled || !administrator}
              optional
            />
            <div>
              <FieldLabel id="number" text="Number" className="mb-2" />
              <div className="mb-3">{number}</div>
            </div>
            <Field
              name="type"
              component={RenderSelectField}
              options={courseTypeOptions}
              label={(
                <FieldLabel
                  id="type.label"
                  text="Course enrollment track"
                  helpText={typeHelp}
                  extraText="Cannot edit after submission"
                />
              )}
              extraInput={{ onInvalid: this.openCollapsible }}
              disabled={disabled || !!entitlement.sku}
            />
            <PriceList
              priceLabels={currentFormValues.type ? priceLabels[currentFormValues.type] : {}}
              extraInput={{ onInvalid: this.openCollapsible }}
              disabled={disabled}
              required={isSubmittingForReview}
            />
            <FieldLabel
              id="collaborators.label"
              text="Collaborators"
              helpText={(
                <div>
                  <p>
                    Course teams are responsible for securing any necessary permissions for use of third-party logos.
                  </p>
                  <p>
                    To elaborate on the support, please include additional information in the “About this course”
                    section. Please avoid including statements that the course is jointly offered or that the 3rd party
                    is collaborating or partnering with edX.
                  </p>
                </div>
              )}
              optional
            />
            <Field
              name="collaborators"
              component={ListField}
              fetchSuggestions={fetchCollabSuggestions(allCollaborators)}
              createNewUrl="/collaborators/new"
              referrer={`/courses/${uuid}`}
              itemType="collaborator"
              renderItemComponent={Collaborator}
              renderSuggestion={renderSuggestion}
              disabled={disabled}
              newItemText="Add New Collaborator"
              newItemInfo={collaboratorInfo}
            />
            <Field
              name="imageSrc"
              component={ImageUpload}
              label={(
                <FieldLabel
                  id="image.label"
                  text="Image"
                  helpText={(
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
                  )}
                  extraText="Image must be 1134x675 pixels in size."
                />
              )}
              extraInput={{ onInvalid: this.openCollapsible }}
              maxImageSizeKilo={1000}
              requiredWidth={1134}
              requiredHeight={675}
              id="image"
              className="course-image"
              disabled={disabled}
            />
            {showMarketingFields
            && (
              <>
                <hr />
                <Field
                  name="short_description"
                  component={RichEditor}
                  label={(
                    <FieldLabel
                      id="sdesc.label"
                      text="Short description"
                      helpText={(
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
                      )}
                    />
                )}
                  extraInput={{ onInvalid: this.openCollapsible }}
                  maxChars={500}
                  id="sdesc"
                  disabled={disabled}
                />
                <Field
                  name="full_description"
                  component={RichEditor}
                  label={(
                    <FieldLabel
                      id="ldesc.label"
                      text="Long description"
                      helpText={(
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
                      )}
                    />
                )}
                  extraInput={{ onInvalid: this.openCollapsible }}
                  maxChars={2500}
                  id="ldesc"
                  disabled={disabled}
                />
                <Field
                  name="outcome"
                  component={RichEditor}
                  label={(
                    <FieldLabel
                      id="outcome.label"
                      text="What you will learn"
                      helpText={(
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
                    )}
                    />
                )}
                  extraInput={{ onInvalid: this.openCollapsible }}
                  maxChars={2500}
                  id="outcome"
                  disabled={disabled}
                />
                <Field
                  name="syllabus_raw"
                  component={RichEditor}
                  label={(
                    <FieldLabel
                      id="syllabus.label"
                      text="Syllabus"
                      helpText={(
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
                    )}
                      optional
                    />
                )}
                  extraInput={{ onInvalid: this.openCollapsible }}
                  maxChars={500}
                  id="syllabus"
                  disabled={disabled}
                />
                <Field
                  name="prerequisites_raw"
                  component={RichEditor}
                  label={(
                    <FieldLabel
                      id="prereq.label"
                      text="Prerequisites"
                      helpText={(
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
                            <li>
                              Secondary school (high school) algebra;
                              basic mathematics concepts
                            </li>
                            <li>Graduate-level understanding of Keynesian economics</li>
                            <li>Basic algebra</li>
                          </ul>
                        </div>
                    )}
                      optional
                    />
                )}
                  extraInput={{ onInvalid: this.openCollapsible }}
                  maxChars={1000}
                  id="prereq"
                  disabled={disabled}
                />
                <Field
                  name="learner_testimonials"
                  component={RichEditor}
                  label={(
                    <FieldLabel
                      id="testimonials.label"
                      text="Learner testimonials"
                      helpText={(
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
                    )}
                      optional
                    />
                )}
                  extraInput={{ onInvalid: this.openCollapsible }}
                  maxChars={500}
                  id="learner-testimonials"
                  disabled={disabled}
                />
                <Field
                  name="faq"
                  component={RichEditor}
                  label={(
                    <FieldLabel
                      id="faq.label"
                      text="Frequently asked questions"
                      helpText={(
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
                    )}
                      optional
                    />
                )}
                  extraInput={{ onInvalid: this.openCollapsible }}
                  maxChars={2500}
                  id="faq"
                  disabled={disabled}
                />
                {/*
                Do not open up access to additional_information. It is not validated like the other
                HTML fields and should not be directly edited by course teams.
              */}
                {administrator
                && (
                <Field
                  name="additional_information"
                  component={RichEditor}
                  label={(
                    <FieldLabel
                      id="additional-info.label"
                      text="Additional information"
                      helpText={(
                        <div>
                          <p>Any additional information to be provided to learners.</p>
                        </div>
                      )}
                      optional
                    />
                  )}
                  extraInput={{ onInvalid: this.openCollapsible }}
                  maxChars={2500}
                  id="additional-information"
                  disabled={disabled}
                />
                )}
                {administrator
                && (
                <Field
                  name="videoSrc"
                  component={RenderInputTextField}
                  type="url"
                  label={(
                    <FieldLabel
                      id="video.label"
                      text="About video link"
                      helpText={(
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
                      )}
                      optional
                    />
                  )}
                  extraInput={{ onInvalid: this.openCollapsible }}
                  disabled={disabled}
                />
                )}
              </>
            )}
            <hr />
            <Field
              name="level_type"
              component={RenderSelectField}
              label={(
                <FieldLabel
                  id="level.label"
                  text="Course level"
                  // TODO: these descriptions should come from the server -- levels are defined in
                  //       the database and are not suitable for hardcoding like this.
                  helpText={(
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
                  )}
                />
              )}
              extraInput={{ onInvalid: this.openCollapsible }}
              options={levelTypeOptions}
              disabled={disabled}
              required={isSubmittingForReview}
            />
            <Field
              name="subjectPrimary"
              component={RenderSelectField}
              label={(
                <FieldLabel
                  id="subject1.label"
                  text="Primary subject"
                  helpText={(
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
                  )}
                />
              )}
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
            courseRunTypeOptions={courseRunTypeOptions}
            runTypeModes={runTypeModes}
            {...this.props}
            validate={() => {}} // override method from our props, we don't want to pass it down
          />
          {this.getAddCourseRunButton(disabled || !pristine, uuid)}
          <CourseButtonToolbar
            className="mt-3"
            disabled={disabled || submitting}
            editable={editable}
            onClear={() => {
              this.setCollapsible(false);
              reset();
              this.collapseAllCourseRuns();
            }}
            onSave={() => {
              /* Bit of a hack used to clear old validation errors that might be around from
               *  trying to submit for review with errors.
               */
              store.dispatch(stopSubmit(id));
              store.dispatch(courseSubmitRun());
            }}
            pristine={pristine}
            publishedContentChanged={publishedContentChanged}
            submitting={submitting || (courseInfo && courseInfo.isSubmittingEdit)}
          />
        </form>
      </div>
    );
  }
}

BaseEditCourseForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  number: PropTypes.string.isRequired,
  currentFormValues: PropTypes.shape({
    type: PropTypes.string,
  }),
  title: PropTypes.string.isRequired,
  entitlement: PropTypes.shape({
    sku: PropTypes.string,
  }),
  courseOptions: PropTypes.shape({
    data: PropTypes.shape(),
    error: PropTypes.arrayOf(PropTypes.string),
    isFetching: PropTypes.bool,
  }).isRequired,
  collaboratorOptions: PropTypes.shape({
    data: PropTypes.shape(),
    error: PropTypes.arrayOf(PropTypes.string),
    isFetching: PropTypes.bool,
  }),
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
    courseSaved: PropTypes.bool,
    isSubmittingEdit: PropTypes.bool,
  }),
  courseSubmitInfo: PropTypes.shape({
    errors: PropTypes.shape({}),
    isSubmittingRunReview: PropTypes.bool,
  }),
  initialValues: PropTypes.shape({
    course_runs: PropTypes.arrayOf(PropTypes.shape({})),
    imageSrc: PropTypes.string,
    collaborators: PropTypes.arrayOf(PropTypes.shape(
      {
        uuid: PropTypes.string.isRequired,
      },
    )),
  }),
  change: PropTypes.func,
  updateFormValuesAfterSave: PropTypes.func,
  reset: PropTypes.func.isRequired,
  type: PropTypes.string,
  collaboratorInfo: PropTypes.shape({
    returnToEditCourse: PropTypes.bool,
  }),
};

BaseEditCourseForm.defaultProps = {
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
  type: '',
  change: () => null,
  updateFormValuesAfterSave: () => null,
  collaboratorInfo: {},
  collaboratorOptions: {
    data: {
      results: [],
    },
    error: [],
    isFetching: false,
  },
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
        props.submitting
        || (nextProps && nextProps.submitting)
        || props.targetRun
        || (nextProps && nextProps.targetRun)
      );
    },
    validate: editCourseValidate,
  }),
)(BaseEditCourseForm);

export default EditCourseForm;
