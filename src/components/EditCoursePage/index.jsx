/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

import EditCourseForm from './EditCourseForm';
import StatusAlert from '../StatusAlert';
import LoadingSpinner from '../LoadingSpinner';
import { getCourseNumber } from '../../utils';


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
    this.setStartedFetching();
  }

  setStartedFetching() {
    this.setState({ startedFetching: true });
  }

  handleCourseEdit(options) {
    /*
      Need to do some preprocessing before sending anything to course-discovery.
      This includes:
        1. Only including subjects that have values
        2. Putting the entitlement into an array and also adding in the sku
          (required for updating price)
        3. Renaming the image and video fields to correspond to what course-discovery is expecting
        4. Setting the uuid so we can create the url to send to course-discovery
    */
    const {
      courseInfo: {
        data: {
          key,
          uuid,
          entitlements,
        },
      },
      editCourse,
    } = this.props;
    const courseData = options;
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
    return editCourse(courseData);
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
        },
      },
      courseOptions,
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
                      }}
                      number={number}
                      courseOptions={courseOptions}
                      entitlement={!!entitlement}
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
  fetchCourseInfo: () => null,
  fetchCourseOptions: () => null,
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
  fetchCourseInfo: PropTypes.func,
  fetchCourseOptions: PropTypes.func,
  editCourse: PropTypes.func,
};

export default EditCoursePage;
