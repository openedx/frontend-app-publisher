/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

import EditCourseForm from './EditCourseForm';
import PageContainer from '../PageContainer';
import StatusAlert from '../StatusAlert';
import LoadingSpinner from '../LoadingSpinner';
import { getCourseNumber, jsonDeepCopy } from '../../utils';
import { IN_REVIEW_STATUS, PUBLISHED, REVIEWED, UNPUBLISHED } from '../../data/constants';


class EditCoursePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startedFetching: false,
      targetRun: null,
      isSubmittingForReview: false,
    };
    this.handleCourseEdit = this.handleCourseEdit.bind(this);
    this.setStartedFetching = this.setStartedFetching.bind(this);
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

  setStartedFetching() {
    this.setState({ startedFetching: true });
  }

  getFormId() {
    return `edit-course-form-${this.props.courseInfo.data.uuid}`;
  }

  prepareCourseRuns(courseRuns) {
    /* eslint-disable no-param-reassign */
    courseRuns.forEach((courseRun) => {
      if (courseRun.staff) {
        courseRun.staff = courseRun.staff.map(staffer => staffer.uuid);
      }
    });
    const { targetRun } = this.state;
    if (targetRun) {
      // If a course run triggered the submission, mark it as not a draft
      const submittedRun = courseRuns.find(run => run.key === targetRun.key);
      submittedRun.draft = false;
    }
    /* eslint-enable no-param-reassign */
  }

  prepareCourse(courseData) {
    /* eslint-disable no-param-reassign */
    const {
      courseInfo: {
        data: {
          key,
          uuid,
          entitlements,
        },
      },
    } = this.props;

    courseData.subjects = [
      courseData.subjectPrimary,
      courseData.subjectSecondary,
      courseData.subjectTertiary,
    ].filter(subject => !!subject);
    courseData.entitlements = entitlements && entitlements[0] && [{
      mode: courseData.mode,
      price: courseData.price,
      sku: entitlements[0].sku,
    }];
    courseData.image = courseData.imageSrc;
    courseData.video = { src: courseData.videoSrc };
    courseData.key = key;
    courseData.uuid = uuid;
    /* eslint-enable no-param-reassign */
  }

  handleCourseEdit(courseData) {
    /*
      Need to do some preprocessing before sending anything to course-discovery.
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
    // Create a deep copy of course runs since we modify their properties
    let modifiedCourseRuns = jsonDeepCopy(courseData.course_runs);

    // Don't send any courses in review - backend will reject them
    modifiedCourseRuns = modifiedCourseRuns.filter(run => !IN_REVIEW_STATUS.includes(run.status));

    // Process course run info
    this.prepareCourseRuns(modifiedCourseRuns);

    // Process course info
    this.prepareCourse(courseData);

    return editCourse(courseData, modifiedCourseRuns);
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
        },
      },
      courseOptions,
      courseRunOptions,
    } = this.props;
    const { startedFetching, isSubmittingForReview, targetRun } = this.state;

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
      go_live_date: courseRun.go_live_date,
      min_effort: courseRun.min_effort,
      max_effort: courseRun.max_effort,
      pacing_type: courseRun.pacing_type,
      content_language: courseRun.content_language,
      transcript_languages: courseRun.transcript_languages,
      weeks_to_complete: courseRun.weeks_to_complete,
      staff: courseRun.staff,
      status: courseRun.status,
      draft: courseRun.draft,
      marketing_url: courseRun.marketing_url,
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
    const showSpinner = !startedFetching || courseInfo.isFetching || courseOptions.isFetching;
    const showForm = startedFetching && !courseInfo.isFetching &&
      !courseOptions.isFetching;

    return (
      <React.Fragment>
        <Helmet>
          <title>{`Course - ${title}`}</title>
        </Helmet>

        <PageContainer>
          { showSpinner && <LoadingSpinner /> }
          { showForm && (
            <div>
              <EditCourseForm
                id={this.getFormId()}
                onSubmit={this.handleCourseEdit}
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
                entitlement={!!entitlement}
                title={title}
                courseRuns={minimalCourseRuns}
                uuid={uuid}
                courseInfo={courseInfo}
                courseInReview={courseInReview}
                courseStatuses={courseStatuses}
                owners={owners}
                isSubmittingForReview={isSubmittingForReview}
                targetRun={targetRun}
                {...this.props}
              />
            </div>
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
  courseInfo: {
    data: {},
  },
  courseOptions: {},
  courseRunOptions: {},
  fetchCourseInfo: () => null,
  fetchCourseOptions: () => null,
  fetchCourseRunOptions: () => null,
  editCourse: () => null,
  courseSubmitInfo: {},
};

EditCoursePage.propTypes = {
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
  fetchCourseInfo: PropTypes.func,
  fetchCourseOptions: PropTypes.func,
  fetchCourseRunOptions: PropTypes.func,
  editCourse: PropTypes.func,
  courseSubmitInfo: PropTypes.shape({
    targetRun: PropTypes.shape({
      uuid: PropTypes.string,
      status: PropTypes.string,
    }),
  }),
};

export default EditCoursePage;
