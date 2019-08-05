/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

import EditCourseForm from './EditCourseForm';
import PageContainer from '../PageContainer';
import StatusAlert from '../StatusAlert';
import LoadingSpinner from '../LoadingSpinner';
import { getCourseNumber, isValidDate } from '../../utils';
import { IN_REVIEW_STATUS, PUBLISHED, REVIEWED, UNPUBLISHED } from '../../data/constants';
import ConfirmationModal from '../ConfirmationModal';
import SidePanes from '../SidePanes';

class EditCoursePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startedFetching: false,
      targetRun: null,
      isSubmittingForReview: false,
      submitConfirmVisible: false,
      submitCourseData: {},
    };
    this.handleCourseSubmit = this.handleCourseSubmit.bind(this);
    this.setStartedFetching = this.setStartedFetching.bind(this);
    this.showModal = this.showModal.bind(this);
    this.cancelSubmit = this.cancelSubmit.bind(this);
    this.continueSubmit = this.continueSubmit.bind(this);
    this.dismissAlert = this.dismissAlert.bind(this);
  }

  componentDidMount() {
    this.props.fetchCourseInfo();
    this.props.fetchCourseOptions();
    this.props.fetchCourseRunOptions();
    this.setStartedFetching();
  }

  componentDidUpdate(prevProps) {
    /* eslint-disable react/no-did-update-set-state */
    const { courseSubmitInfo: { targetRun } } = this.props;
    const { key } = targetRun || {};

    const { courseSubmitInfo: { targetRun: prevRun } } = prevProps;
    const { key: prevKey } = prevRun || {};

    if (key !== prevKey) {
      /* We can safely update state here since we are comparing the current props against previous
      *  props, ensuring that we won't end up in a continuous re-render loop.
      */
      this.setState({
        targetRun,
        isSubmittingForReview: targetRun && targetRun.status !== PUBLISHED,
      });
    }
  }

  componentWillUnmount() {
    this.dismissAlert();
  }

  setStartedFetching() {
    this.setState({ startedFetching: true });
  }

  getFormId() {
    return `edit-course-form-${this.props.courseInfo.data.uuid}`;
  }

  prepareSendCourseRunData(courseData, targetRun) {
    const sendCourseRuns = [];
    // Don't send any courses in review - backend will reject them
    const modifiedCourseRuns =
      courseData.course_runs.filter(run => !IN_REVIEW_STATUS.includes(run.status));
    modifiedCourseRuns.forEach((courseRun) => {
      let draft = true;
      if (targetRun && (courseRun.key === targetRun.key)) {
        // If a course run triggered the submission, mark it as not a draft
        draft = false;
      }
      sendCourseRuns.push({
        content_language: courseRun.content_language,
        draft,
        end: isValidDate(courseRun.end) ? courseRun.end : null,
        expected_program_type: courseRun.expected_program_type ?
          courseRun.expected_program_type : null,
        expected_program_name: courseRun.expected_program_name ?
          courseRun.expected_program_name : '',
        go_live_date: isValidDate(courseRun.go_live_date) ? courseRun.go_live_date : null,
        key: courseRun.key,
        max_effort: courseRun.max_effort ? courseRun.max_effort : null,
        min_effort: courseRun.min_effort ? courseRun.min_effort : null,
        pacing_type: courseRun.pacing_type,
        rerun: courseRun.rerun ? courseRun.rerun : null,
        // Reduce Staff list to just the UUID
        staff: courseRun.staff ? courseRun.staff.map(staffer => staffer.uuid) : courseRun.staff,
        start: isValidDate(courseRun.start) ? courseRun.start : null,
        status: courseRun.status,
        transcript_languages: courseRun.transcript_languages,
        weeks_to_complete: courseRun.weeks_to_complete ? courseRun.weeks_to_complete : null,
      });
    });
    return sendCourseRuns;
  }

  prepareSendCourseData(courseData, courseRuns, targetRun) {
    const {
      courseInfo: {
        data: {
          key,
          uuid,
          entitlements,
        },
      },
    } = this.props;

    let updatingPublishedRun = false;
    if (targetRun) {
      const submittedRun = courseRuns.find(run => run.key === targetRun.key);
      // If we are updating a published course run, we need to also publish the course.
      // We want to use the same indicator of draft = false for consistency.
      if (submittedRun.status === PUBLISHED) {
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
      uuid,
      video: { src: courseData.videoSrc },
    };
  }

  showModal(submitCourseData) {
    const {
      targetRun,
    } = this.state;

    if (targetRun && !(targetRun.status === PUBLISHED)) {
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

  dismissAlert() {
    const {
      clearCourseReviewAlert,
      clearCreateStatusAlert,
    } = this.props;

    clearCourseReviewAlert();
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
      editCourse,
    } = this.props;
    const { targetRun } = this.state;
    // Process course run info from courseData
    const modifiedCourseRuns = this.prepareSendCourseRunData(courseData, targetRun);

    // Process courseData to reduced data set
    const courseEditData =
      this.prepareSendCourseData(courseData, modifiedCourseRuns, targetRun);
    return editCourse(courseEditData, modifiedCourseRuns, !!targetRun);
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
      },
    } = this.props;
    const {
      isSubmittingForReview,
      startedFetching,
      submitConfirmVisible,
      targetRun,
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

    const minimalCourseRuns = course_runs && course_runs.map(courseRun => ({
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
    }));


    // If we want to keep a lot of the logic in the lower return,
    // we have to do all this '&&' logic to make sure the data is there.
    const number = key && getCourseNumber(key);
    const subjectMap = subjects && subjects.map(x => x.slug);
    const subjectPrimary = subjectMap && subjectMap[0];
    const subjectSecondary = subjectMap && subjectMap[1];
    const subjectTertiary = subjectMap && subjectMap[2];
    const imageSrc = image && image.src;
    const videoSrc = video && video.src;
    const entitlement = entitlements && entitlements[0];
    const mode = entitlement && entitlement.mode;
    const price = entitlement && entitlement.price;

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
            onClose={this.dismissAlert}
            dismissible
            alertType="success"
            message="Course has been submitted for review. The course will be locked for the next two business days. You will receive an email when the review is complete."
          /> }

          { showCreateStatusAlert && <StatusAlert
            onClose={this.dismissAlert}
            dismissible
            alertType="success"
            message="Course run has been created in studio. See link below."
          /> }
        </div>
        { showSpinner && <LoadingSpinner /> }
        <PageContainer
          sidePanes={<SidePanes
            hidden={!showForm}
            addCourseEditor={editable && this.props.addCourseEditor}
            courseEditors={this.props.courseEditors}
            fetchCourseEditors={this.props.fetchCourseEditors}
            fetchOrganizationUsers={!owners ? null : () => (
              this.props.fetchOrganizationUsers(owners.map(owner => owner.uuid))
            )}
            organizationUsers={this.props.organizationUsers}
            removeCourseEditor={editable && this.props.removeCourseEditor}
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
              initialValues={{
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
                course_runs: minimalCourseRuns,
              }}
              number={number}
              entitlement={entitlement || {}}
              title={title}
              courseRuns={minimalCourseRuns}
              uuid={uuid}
              currentFormValues={currentFormValues}
              courseInfo={courseInfo}
              courseInReview={courseInReview}
              courseStatuses={courseStatuses}
              owners={owners}
              isSubmittingForReview={isSubmittingForReview}
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
  addCourseEditor: () => null,
  courseEditors: {
    data: [],
  },
  courseInfo: {
    data: {},
  },
  courseOptions: {},
  courseRunOptions: {},
  fetchCourseEditors: () => null,
  fetchCourseInfo: () => null,
  fetchCourseOptions: () => null,
  fetchCourseRunOptions: () => null,
  fetchOrganizationUsers: () => null,
  editCourse: () => null,
  clearSubmitStatus: () => {},
  clearCourseReviewAlert: () => {},
  clearCreateStatusAlert: () => {},
  courseSubmitInfo: {},
  formValues: () => {},
  organizationUsers: {
    data: [],
  },
  removeCourseEditor: () => null,
};

EditCoursePage.propTypes = {
  addCourseEditor: PropTypes.func,
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
  fetchCourseEditors: PropTypes.func,
  fetchCourseInfo: PropTypes.func,
  fetchCourseOptions: PropTypes.func,
  fetchCourseRunOptions: PropTypes.func,
  fetchOrganizationUsers: PropTypes.func,
  editCourse: PropTypes.func,
  clearSubmitStatus: PropTypes.func,
  clearCourseReviewAlert: PropTypes.func,
  clearCreateStatusAlert: PropTypes.func,
  courseSubmitInfo: PropTypes.shape({
    targetRun: PropTypes.shape({
      uuid: PropTypes.string,
      status: PropTypes.string,
    }),
  }),
  formValues: PropTypes.func,
  organizationUsers: PropTypes.shape({
    data: PropTypes.array,
    isFetching: PropTypes.bool,
  }),
  removeCourseEditor: PropTypes.func,
};

export default EditCoursePage;
