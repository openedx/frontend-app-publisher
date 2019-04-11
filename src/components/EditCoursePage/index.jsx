/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

import EditCourseForm from './EditCourseForm';
import PageContainer from '../PageContainer';
import StatusAlert from '../StatusAlert';
import LoadingSpinner from '../LoadingSpinner';
import { getCourseNumber, jsonDeepCopy } from '../../utils';
import { IN_REVIEW_STATUS } from '../../data/constants';

class EditCoursePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startedFetching: false,
      targetRun: null,
    };
    this.handleCourseEdit = this.handleCourseEdit.bind(this);
    this.setStartedFetching = this.setStartedFetching.bind(this);
    this.handleCourseRunSubmit = this.handleCourseRunSubmit.bind(this);
  }

  componentDidMount() {
    this.props.fetchCourseInfo();
    this.props.fetchCourseOptions();
    this.props.fetchCourseRunOptions();
    this.setStartedFetching();
  }

  setStartedFetching() {
    this.setState({ startedFetching: true });
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
      const submittedRun = courseRuns.find(run => run.uuid === targetRun.uuid);
      submittedRun.draft = false;
    }
    /* eslint-enable no-param-reassign */

    // Reset the target run after we handle setting it as not a draft
    this.setState({ targetRun: null });
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
    const modifiedCourseRuns = jsonDeepCopy(courseData.course_runs);

    // Process course run info
    this.prepareCourseRuns(modifiedCourseRuns);

    // Process course info
    this.prepareCourse(courseData);

    return editCourse(courseData, modifiedCourseRuns);
  }

  handleCourseRunSubmit(targetRun) {
    this.setState({ targetRun });
  }

  render() {
    if (!this.props.courseInfo || !this.props.courseOptions) {
      return (
        <StatusAlert
          id="error"
          alertType="danger"
          title="Course Edit Form failed to load: "
          message="Course information unavailable."
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
        },
      },
      courseOptions,
      courseRunOptions,
    } = this.props;
    const { startedFetching } = this.state;

    const courseInReview = course_runs && course_runs.some(courseRun =>
      IN_REVIEW_STATUS.includes(courseRun.status));
    const minimalCourseRuns = course_runs && course_runs.map(courseRun => ({
      key: courseRun.key,
      start: courseRun.start,
      end: courseRun.end,
      min_effort: courseRun.min_effort,
      max_effort: courseRun.max_effort,
      pacing_type: courseRun.pacing_type,
      content_language: courseRun.content_language,
      transcript_languages: courseRun.transcript_languages,
      weeks_to_complete: courseRun.weeks_to_complete,
      staff: courseRun.staff,
      status: courseRun.status,
      draft: courseRun.draft,
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

    let error = '';
    if (courseInfo.error) {
      error = error.concat(courseInfo.error, ' ');
    }
    if (courseOptions.error) {
      error = error.concat(courseOptions.error);
    }
    error = error.trim();
    const showSpinner = !startedFetching || courseInfo.isFetching || courseOptions.isFetching;
    const showForm = startedFetching && !courseInfo.isFetching && !courseOptions.isFetching;

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
                id={`edit-course-form-${uuid}`}
                onSubmit={this.handleCourseEdit}
                handleCourseRunSubmit={this.handleCourseRunSubmit}
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
                courseOptions={courseOptions}
                entitlement={!!entitlement}
                courseRunOptions={courseRunOptions}
                title={title}
                courseRuns={minimalCourseRuns}
                uuid={uuid}
                courseInfo={courseInfo}
                courseInReview={courseInReview}
              />
            </div>
          )}
          { error && (
            <StatusAlert
              id="error"
              alertType="danger"
              title="Course Edit Form failed to load: "
              message={error}
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
};

EditCoursePage.propTypes = {
  courseInfo: PropTypes.shape({
    data: PropTypes.shape(),
    error: PropTypes.string,
    isFetching: PropTypes.bool,
  }),
  courseOptions: PropTypes.shape({
    data: PropTypes.shape(),
    error: PropTypes.string,
    isFetching: PropTypes.bool,
  }),
  courseRunOptions: PropTypes.shape({
    data: PropTypes.shape(),
    error: PropTypes.string,
    isFetching: PropTypes.bool,
  }),
  fetchCourseInfo: PropTypes.func,
  fetchCourseOptions: PropTypes.func,
  fetchCourseRunOptions: PropTypes.func,
  editCourse: PropTypes.func,
};

export default EditCoursePage;
