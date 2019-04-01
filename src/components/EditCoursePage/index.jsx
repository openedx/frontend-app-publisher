/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

import EditCourseForm from './EditCourseForm';
import StatusAlert from '../StatusAlert';
import LoadingSpinner from '../LoadingSpinner';
import { getCourseNumber, jsonDeepCopy } from '../../utils';


class EditCoursePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startedFetching: false,
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

  setStartedFetching() {
    this.setState({ startedFetching: true });
  }

  prepareStaff(courseRuns) {
    /* eslint-disable no-param-reassign */
    courseRuns.forEach((courseRun) => {
      courseRun.staff = courseRun.staff.map(staffer => staffer.uuid);
    });
    /* eslint-enable no-param-reassign */
  }

  handleCourseEdit(options) {
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
      courseInfo: {
        data: {
          key,
          uuid,
          entitlements,
          course_runs: initialCourseRuns,
        },
      },
      editCourse,
    } = this.props;
    const courseData = options;
    const modifiedCourseRuns = [];
    const newCourseRuns = [];
    courseData.course_runs.forEach((modifiedCourseRun) => {
      const found = initialCourseRuns.some(initialCourseRun => (
        initialCourseRun.key === modifiedCourseRun.key &&
        JSON.stringify(initialCourseRun) !== JSON.stringify(modifiedCourseRun)
      ));
      if (found) {
        modifiedCourseRuns.push(jsonDeepCopy(modifiedCourseRun));
      } else {
        newCourseRuns.push(jsonDeepCopy(modifiedCourseRun));
      }
    });

    this.prepareStaff(modifiedCourseRuns);
    this.prepareStaff(newCourseRuns);
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
    return editCourse(courseData, modifiedCourseRuns, newCourseRuns);
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
        },
      },
      courseOptions,
      courseRunOptions,
    } = this.props;
    const { startedFetching } = this.state;

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

        <div className="container-fluid">
          <div className="row justify-content-md-center my-3 ">
            <div className="col-6">
              { showSpinner && <LoadingSpinner /> }
              { showForm && (
                <div>
                  <h2>Course</h2>
                  <hr />
                  <div className="col">
                    <EditCourseForm
                      id="edit-course-form"
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
                        course_runs,
                      }}
                      number={number}
                      courseOptions={courseOptions}
                      entitlement={!!entitlement}
                      courseRunOptions={courseRunOptions}
                      courseRuns={course_runs}
                    />
                  </div>
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
            </div>
          </div>
        </div>
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
