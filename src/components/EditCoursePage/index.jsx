/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

import EditCourseForm from './EditCourseForm';
import PageContainer from '../PageContainer';
import StatusAlert from '../StatusAlert';
import LoadingSpinner from '../LoadingSpinner';
import { courseRunIsArchived, getCourseNumber, isValidDate, isNonExemptChanged,
  jsonDeepEqual } from '../../utils';
import { IN_REVIEW_STATUS, PUBLISHED, REVIEW_BY_INTERNAL, REVIEW_BY_LEGAL, REVIEWED,
  UNPUBLISHED } from '../../data/constants';
import ConfirmationModal from '../ConfirmationModal';
import SidePanes from '../SidePanes';

class EditCoursePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startedFetching: false,
      submitConfirmVisible: false,
      submitCourseData: {},
    };
    this.handleCourseSubmit = this.handleCourseSubmit.bind(this);
    this.setStartedFetching = this.setStartedFetching.bind(this);
    this.showModal = this.showModal.bind(this);
    this.cancelSubmit = this.cancelSubmit.bind(this);
    this.continueSubmit = this.continueSubmit.bind(this);
    this.dismissReviewStatusAlert = this.dismissReviewStatusAlert.bind(this);
    this.dismissCreateStatusAlert = this.dismissCreateStatusAlert.bind(this);
    this.displayReviewStatusAlert = this.displayReviewStatusAlert.bind(this);
    this.handleModalForReviewedRun = this.handleModalForReviewedRun.bind(this);
    this.buildInitialValues = this.buildInitialValues.bind(this);
    this.buildCourseRuns = this.buildCourseRuns.bind(this);
  }

  componentDidMount() {
    this.props.fetchCourseInfo();
    this.props.fetchCourseOptions();
    this.props.fetchCourseRunOptions();
    this.setStartedFetching();
  }

  componentWillUnmount() {
    this.dismissCreateStatusAlert();
    this.dismissReviewStatusAlert();
  }

  setStartedFetching() {
    this.setState({ startedFetching: true });
  }

  getFormId() {
    return `edit-course-form-${this.props.courseInfo.data.uuid}`;
  }

  prepareSendCourseRunData(courseData) {
    const {
      courseInfo: {
        data: {
          entitlements,
        },
      },
      courseSubmitInfo: {
        targetRun,
      },
    } = this.props;

    const sendCourseRuns = [];
    const initialCourseRunValues = this.buildCourseRuns();
    const entitlement = entitlements && entitlements[0];
    const initialMode = entitlement && entitlement.mode;
    const initialPrice = entitlement && entitlement.price;

    const modifiedCourseRuns = courseData.course_runs.filter((run, i) => {
      // If we are submitting a run for review or re-publishing a run, it should
      // always get through to the backend
      if (targetRun && (run.key === targetRun.key)) {
        return true;
      }

      // Don't send any courses in review - backend will reject them
      if (IN_REVIEW_STATUS.includes(run.status)) {
        return false;
      }

      // send runs if they have changed OR the course mode or price has
      // changed and the run is NOT "archived" (we care about the mode and
      // price because those are passed down to the course runs' seats)
      const runHasChanges = !jsonDeepEqual(initialCourseRunValues[i], run);
      const courseModeChanged = initialMode !== courseData.mode;
      const coursePriceChanged = initialPrice !== courseData.price;
      if (runHasChanges ||
        ((courseModeChanged || coursePriceChanged) && !courseRunIsArchived(run))) {
        return true;
      }

      return false;
    });

    modifiedCourseRuns.forEach((courseRun) => {
      let draft = true;
      if (targetRun && (courseRun.key === targetRun.key)) {
        // If a course run triggered the submission, mark it as not a draft
        draft = false;
      }

      sendCourseRuns.push({
        content_language: courseRun.content_language,
        draft,
        expected_program_type: courseRun.expected_program_type ?
          courseRun.expected_program_type : null,
        expected_program_name: courseRun.expected_program_name ?
          courseRun.expected_program_name : '',
        go_live_date: isValidDate(courseRun.go_live_date) ? courseRun.go_live_date : null,
        key: courseRun.key,
        max_effort: courseRun.max_effort ? courseRun.max_effort : null,
        min_effort: courseRun.min_effort ? courseRun.min_effort : null,
        rerun: courseRun.rerun ? courseRun.rerun : null,
        // Reduce Staff list to just the UUID
        staff: courseRun.staff ? courseRun.staff.map(staffer => staffer.uuid) : courseRun.staff,
        status: courseRun.status,
        transcript_languages: courseRun.transcript_languages,
        weeks_to_complete: courseRun.weeks_to_complete ? courseRun.weeks_to_complete : null,
      });
    });
    return sendCourseRuns;
  }

  prepareInternalReview(courseData) {
    const { courseSubmitInfo: { targetRun } } = this.props;
    const courseRun = courseData.course_runs.find(run => run.key === targetRun.key);
    const editedRun = { key: courseRun.key };

    if (targetRun.status === REVIEW_BY_LEGAL) {
      if (courseRun.has_ofac_restrictions) {
        editedRun.has_ofac_restrictions = JSON.parse(courseRun.has_ofac_restrictions);
      }
      if (courseRun.ofac_comment) {
        editedRun.ofac_comment = courseRun.ofac_comment;
      }
      editedRun.status = REVIEW_BY_INTERNAL;
    } else {
      editedRun.status = REVIEWED;
    }

    return editedRun;
  }

  prepareSendCourseData(courseData, courseRuns) {
    const {
      courseInfo: {
        data: {
          key,
          uuid,
          entitlements,
        },
      },
      courseSubmitInfo: {
        targetRun,
      },
    } = this.props;

    let updatingPublishedRun = false;
    if (targetRun) {
      const submittedRun = courseRuns.status ? courseRuns :
        courseRuns.find(run => run.key === targetRun.key);
      // If we are updating a published course run, we need to also publish the course.
      // We want to use the same indicator of draft = false for consistency.
      if (submittedRun && submittedRun.status === PUBLISHED) {
        updatingPublishedRun = true;
      }
    }

    return {
      additional_information: courseData.additional_information,
      draft: !updatingPublishedRun,
      entitlements: [{
        mode: courseData.mode,
        price: courseData.price,
        sku: entitlements && entitlements[0] && entitlements[0].sku,
      }],
      faq: courseData.faq,
      full_description: courseData.full_description,
      image: courseData.imageSrc,
      key,
      learner_testimonials: courseData.learner_testimonials,
      level_type: courseData.level_type,
      outcome: courseData.outcome,
      short_description: courseData.short_description,
      subjects: [
        courseData.subjectPrimary,
        courseData.subjectSecondary,
        courseData.subjectTertiary,
      ].filter(subject => !!subject),
      title: courseData.title,
      url_slug: courseData.url_slug,
      uuid,
      video: { src: courseData.videoSrc },
    };
  }

  continueSubmit() {
    const {
      submitCourseData,
    } = this.state;

    this.setState({
      submitCourseData: {},
      submitConfirmVisible: false,
    });

    this.handleCourseSubmit(submitCourseData);
  }

  cancelSubmit() {
    const {
      clearSubmitStatus,
    } = this.props;

    this.setState({
      submitCourseData: {},
      submitConfirmVisible: false,
    });

    return clearSubmitStatus();
  }

  dismissReviewStatusAlert() {
    const { clearCourseReviewAlert } = this.props;
    clearCourseReviewAlert();
  }

  dismissCreateStatusAlert() {
    const { clearCreateStatusAlert } = this.props;
    clearCreateStatusAlert();
  }

  handleCourseSubmit(courseData) {
    /*
      Need to do some pre-processing before sending anything to course-discovery.
      This includes:
        1. Only sending the uuid from the array of staff objects
        2. Only including subjects that have values
        3. Putting the entitlement into an array and also adding in the sku
          (required for updating price)
        4. Renaming the image and video fields to correspond to what course-discovery is expecting
        5. Setting the uuid so we can create the url to send to course-discovery
    */
    const {
      courseSubmitInfo: {
        targetRun,
      },
      editCourse,
    } = this.props;
    const isInternalReview = targetRun && IN_REVIEW_STATUS.includes(targetRun.status);
    // Process course run info from courseData
    const modifiedCourseRuns = isInternalReview ? this.prepareInternalReview(courseData) :
      this.prepareSendCourseRunData(courseData);
    // Process courseData to reduced data set
    const courseEditData = this.prepareSendCourseData(courseData, modifiedCourseRuns);
    return editCourse(courseEditData, modifiedCourseRuns, !!targetRun);
  }

  displayReviewStatusAlert(status) {
    const {
      courseInfo: { data: { course_runs } },
      courseSubmitInfo: { targetRun: { key } },
    } = this.props;
    const runFromAPI = course_runs ? course_runs.find(run => run.key === key) : {};
    switch (status) {
      case REVIEW_BY_LEGAL:
        return 'Legal Review Complete. Course Run is now awaiting PC Review.';
      case REVIEW_BY_INTERNAL:
        return 'PC Review Complete.';
      default:
        if (status === PUBLISHED || (status === REVIEWED && runFromAPI.status === REVIEWED)) {
          return 'Course Run Updated.';
        }
        return 'Course has been submitted for review. The course will be locked for the next two business days. ' +
          'You will receive an email when the review is complete.';
    }
  }

  buildCourseRuns() {
    const {
      courseInfo: {
        data: {
          course_runs,
        },
      },
    } = this.props;

    return course_runs && course_runs.map(courseRun => ({
      key: courseRun.key,
      start: courseRun.start,
      end: courseRun.end,
      expected_program_type: courseRun.expected_program_type,
      expected_program_name: courseRun.expected_program_name,
      go_live_date: courseRun.go_live_date,
      min_effort: typeof courseRun.min_effort === 'number' ? String(courseRun.min_effort) : '',
      max_effort: typeof courseRun.max_effort === 'number' ? String(courseRun.max_effort) : '',
      pacing_type: courseRun.pacing_type,
      content_language: courseRun.content_language ? courseRun.content_language : 'en-us',
      transcript_languages: courseRun.transcript_languages.length ? courseRun.transcript_languages : ['en-us'],
      weeks_to_complete: typeof courseRun.weeks_to_complete === 'number' ? String(courseRun.weeks_to_complete) : '',
      staff: courseRun.staff,
      status: courseRun.status,
      draft: courseRun.draft,
      marketing_url: courseRun.marketing_url,
      has_ofac_restrictions: courseRun.has_ofac_restrictions,
      ofac_comment: courseRun.ofac_comment,
    }));
  }

  buildInitialValues() {
    const {
      courseInfo: {
        data: {
          title,
          url_slug,
          short_description,
          full_description,
          outcome,
          subjects,
          image,
          prerequisites_raw,
          level_type,
          learner_testimonials,
          faq,
          additional_information,
          syllabus_raw,
          video,
          entitlements,
        },
      },
    } = this.props;
    const subjectMap = subjects && subjects.map(x => x.slug);
    const subjectPrimary = subjectMap && subjectMap[0];
    const subjectSecondary = subjectMap && subjectMap[1];
    const subjectTertiary = subjectMap && subjectMap[2];
    const imageSrc = image && image.src;
    const videoSrc = video && video.src;
    const entitlement = entitlements && entitlements[0];
    const mode = entitlement && entitlement.mode;
    const price = entitlement && entitlement.price;

    return {
      title,
      short_description,
      full_description,
      outcome,
      subjectPrimary,
      subjectSecondary,
      subjectTertiary,
      imageSrc,
      prerequisites_raw,
      level_type,
      learner_testimonials,
      faq,
      additional_information,
      syllabus_raw,
      videoSrc,
      mode,
      price,
      url_slug,
      course_runs: this.buildCourseRuns(),
    };
  }

  handleModalForReviewedRun(submitCourseData) {
    const {
      courseSubmitInfo: {
        targetRun: {
          key,
        },
      },
      formValues,
    } = this.props;
    const currentValues = formValues(this.getFormId());
    const initialValues = this.buildInitialValues();
    if (isNonExemptChanged(initialValues, currentValues, key) ||
      isNonExemptChanged(initialValues, currentValues)) {
      this.setState({
        submitCourseData,
        submitConfirmVisible: true, // show modal
      });
    } else {
      this.handleCourseSubmit(submitCourseData);
    }
  }

  showModal(submitCourseData) {
    const {
      courseSubmitInfo: {
        targetRun,
      },
    } = this.props;
    if (targetRun && targetRun.status === REVIEWED) {
      this.handleModalForReviewedRun(submitCourseData);
    } else if (targetRun && !(targetRun.status === PUBLISHED) &&
      !IN_REVIEW_STATUS.includes(targetRun.status)) {
      // Submitting Run for review, show modal, and temporarily store form data until
      // we have a response for how to continue.
      this.setState({
        submitCourseData,
        submitConfirmVisible: true, // show modal
      });
    } else {
      // Edit submission, no modal required.
      this.handleCourseSubmit(submitCourseData);
    }
  }

  render() {
    if (!this.props.courseInfo || !this.props.courseOptions || !this.props.courseRunOptions) {
      return (
        <StatusAlert
          id="error"
          alertType="danger"
          title="Course Edit Form failed to load: "
          message="Course information unavailable. Please try reloading the page and if the error
           persists, please contact support."
        />
      );
    }

    const {
      courseInfo,
      courseInfo: {
        data: {
          title,
          key,
          key_for_reruns,
          entitlements,
          course_runs,
          uuid,
          owners,
          editable,
        },
        showCreateStatusAlert,
      },
      courseOptions,
      courseRunOptions,
      formValues,
      courseSubmitInfo: {
        showReviewStatusAlert,
        targetRun,
      },
    } = this.props;
    const {
      startedFetching,
      submitConfirmVisible,
    } = this.state;
    const currentFormValues = formValues(this.getFormId());
    const courseStatuses = [];
    const courseInReview = course_runs && course_runs.some(courseRun =>
      IN_REVIEW_STATUS.includes(courseRun.status));

    if (courseInReview) {
      courseStatuses.push(IN_REVIEW_STATUS[0]);
    }
    if (course_runs && course_runs.some(courseRun => PUBLISHED === courseRun.status)) {
      courseStatuses.push(PUBLISHED);
    }
    if (course_runs && !courseStatuses.includes(PUBLISHED) &&
      course_runs.some(courseRun => REVIEWED === courseRun.status)) {
      courseStatuses.push(REVIEWED);
    }
    if (course_runs && !courseStatuses.includes(PUBLISHED) &&
      !courseStatuses.includes(IN_REVIEW_STATUS[0]) && !courseStatuses.includes(REVIEWED) &&
      course_runs.some(courseRun => UNPUBLISHED === courseRun.status)) {
      courseStatuses.push(UNPUBLISHED);
    }

    const numberKey = key_for_reruns || key;
    const number = numberKey && getCourseNumber(numberKey);
    const entitlement = entitlements && entitlements[0];

    const errorArray = [];
    if (courseInfo.error) {
      courseInfo.error.forEach((error, index) => {
        errorArray.push(error);
        if (index < courseInfo.error.length) {
          errorArray.push(<br />);
        }
      });
    }
    if (courseOptions.error) {
      courseOptions.error.forEach((error, index) => {
        errorArray.push(error);
        if (index < courseOptions.error.length) {
          errorArray.push(<br />);
        }
      });
    }
    if (courseRunOptions.error) {
      courseRunOptions.error.forEach((error, index) => {
        errorArray.push(error);
        if (index < courseRunOptions.error.length) {
          errorArray.push(<br />);
        }
      });
    }
    const showSpinner = !startedFetching || courseInfo.isFetching || courseOptions.isFetching ||
      courseRunOptions.isFetching;
    const showForm = !showSpinner;

    return (
      <React.Fragment>
        <Helmet>
          <title>{`Course - ${title}`}</title>
        </Helmet>

        <ConfirmationModal
          title="Submit for Review?"
          body="You will not be able to make edits while the course is in review, which can take up to 2 business days. Confirm your edits are complete."
          buttonLabel="Submit"
          open={submitConfirmVisible}
          onSubmit={this.continueSubmit}
          onClose={this.cancelSubmit}
        />
        <div className="container my-3">
          { showReviewStatusAlert && <StatusAlert
            onClose={this.dismissReviewStatusAlert}
            dismissible
            alertType="success"
            message={targetRun && this.displayReviewStatusAlert(targetRun.status)}
          /> }

          { showCreateStatusAlert && <StatusAlert
            onClose={this.dismissCreateStatusAlert}
            dismissible
            alertType="success"
            message="Course run has been created in studio. See link below."
          /> }
        </div>
        { showSpinner && <LoadingSpinner /> }
        <PageContainer
          sidePanes={showForm && <SidePanes
            courseUuid={uuid}
            hidden={!showForm}
            addCourseEditor={editable && this.props.addCourseEditor}
            courseEditors={this.props.courseEditors}
            fetchCourseEditors={this.props.fetchCourseEditors}
            fetchOrganizationRoles={!owners ? null : role => (
              this.props.fetchOrganizationRoles(owners.map(owner => owner.uuid), role)
            )}
            fetchOrganizationUsers={!owners ? null : () => (
              this.props.fetchOrganizationUsers(owners.map(owner => owner.uuid))
            )}
            organizationRoles={this.props.organizationRoles}
            organizationUsers={this.props.organizationUsers}
            removeCourseEditor={editable && this.props.removeCourseEditor}
            addComment={this.props.addComment}
            comments={this.props.comments}
            fetchComments={this.props.fetchComments}
          />}
        >
          { showForm && !editable && <StatusAlert
            alertType="secondary"
            message="You have permission to view this course, but not edit. If you would like to edit the course, please contact a course editor."
          /> }
          { showForm && (
            <EditCourseForm
              id={this.getFormId()}
              onSubmit={this.showModal}
              initialValues={this.buildInitialValues()}
              number={number}
              entitlement={entitlement || {}}
              title={title}
              courseRuns={this.buildCourseRuns()}
              uuid={uuid}
              currentFormValues={currentFormValues}
              courseInfo={courseInfo}
              courseInReview={courseInReview}
              courseStatuses={courseStatuses}
              owners={owners}
              isSubmittingForReview={targetRun && targetRun.status !== PUBLISHED}
              targetRun={targetRun}
              editable={editable}
              {...this.props}
            />
          )}
          { errorArray.length > 0 && (
            <StatusAlert
              id="error"
              alertType="danger"
              message={errorArray}
            />
          )}
        </PageContainer>
      </React.Fragment>
    );
  }
}

EditCoursePage.defaultProps = {
  addComment: () => null,
  addCourseEditor: () => null,
  comments: {
    data: [],
  },
  courseEditors: {
    data: [],
  },
  courseInfo: {
    data: {},
  },
  courseOptions: {},
  courseRunOptions: {},
  fetchComments: () => null,
  fetchCourseEditors: () => null,
  fetchCourseInfo: () => null,
  fetchCourseOptions: () => null,
  fetchCourseRunOptions: () => null,
  fetchOrganizationRoles: () => null,
  fetchOrganizationUsers: () => null,
  editCourse: () => null,
  clearSubmitStatus: () => {},
  clearCourseReviewAlert: () => {},
  clearCreateStatusAlert: () => {},
  courseSubmitInfo: {},
  formValues: () => {},
  organizationRoles: {
    data: [],
  },
  organizationUsers: {
    data: [],
  },
  removeCourseEditor: () => null,
};

EditCoursePage.propTypes = {
  addComment: PropTypes.func,
  addCourseEditor: PropTypes.func,
  comments: PropTypes.shape({
    data: PropTypes.arrayOf(PropTypes.shape()),
    isFetching: PropTypes.bool,
    isCreating: PropTypes.bool,
    error: PropTypes.arrayOf(PropTypes.string),
  }),
  courseEditors: PropTypes.shape({
    data: PropTypes.array,
    isFetching: PropTypes.bool,
  }),
  courseInfo: PropTypes.shape({
    data: PropTypes.shape(),
    error: PropTypes.arrayOf(PropTypes.string),
    isFetching: PropTypes.bool,
  }),
  courseOptions: PropTypes.shape({
    data: PropTypes.shape(),
    error: PropTypes.arrayOf(PropTypes.string),
    isFetching: PropTypes.bool,
  }),
  courseRunOptions: PropTypes.shape({
    data: PropTypes.shape(),
    error: PropTypes.arrayOf(PropTypes.string),
    isFetching: PropTypes.bool,
  }),
  fetchComments: PropTypes.func,
  fetchCourseEditors: PropTypes.func,
  fetchCourseInfo: PropTypes.func,
  fetchCourseOptions: PropTypes.func,
  fetchCourseRunOptions: PropTypes.func,
  fetchOrganizationRoles: PropTypes.func,
  fetchOrganizationUsers: PropTypes.func,
  editCourse: PropTypes.func,
  clearSubmitStatus: PropTypes.func,
  clearCourseReviewAlert: PropTypes.func,
  clearCreateStatusAlert: PropTypes.func,
  courseSubmitInfo: PropTypes.shape({
    targetRun: PropTypes.shape({
      key: PropTypes.string,
      uuid: PropTypes.string,
      status: PropTypes.string,
    }),
  }),
  formValues: PropTypes.func,
  organizationRoles: PropTypes.shape({
    data: PropTypes.array,
  }),
  organizationUsers: PropTypes.shape({
    data: PropTypes.array,
  }),
  removeCourseEditor: PropTypes.func,
};

export default EditCoursePage;
