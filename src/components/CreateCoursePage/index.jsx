import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

import CreateCourseForm from './CreateCourseForm';
import StatusAlert from '../StatusAlert';
import LoadingSpinner from '../LoadingSpinner';

class CreateCoursePage extends React.Component {
  constructor(props) {
    super(props);
    this.handleCourseCreate = this.handleCourseCreate.bind(this);
  }

  componentDidMount() {
    this.props.fetchOrganizations();
  }

  handleCourseCreate(options) {
    const courseData = {
      org: options.courseOrg,
      title: options.courseTitle,
      number: options.courseNumber,
      mode: options.courseEnrollmentTrack,
      price: options.coursePrice,
    };
    this.props.createCourse(courseData);
  }

  render() {
    if (!this.props.publisherUserInfo) {
      return (
        <StatusAlert
          id="error"
          alertType="danger"
          title="Course Create Form failed to load: "
          message="User information unavailable"
        />
      );
    }

    const {
      courseOrg,
      courseTitle,
      courseNumber,
      courseEnrollmentTrack,
      coursePrice,
      courseInfo,
      publisherUserInfo,
    } = this.props;

    const organizations = publisherUserInfo.organizations ? publisherUserInfo.organizations : [];

    return (
      <React.Fragment>
        <Helmet>
          <title>Create a New Course</title>
        </Helmet>

        <div className="container-fluid">
          <div className="row justify-content-md-center my-3 ">
            <div className="col-6">
              { publisherUserInfo.isFetching && <LoadingSpinner /> }
              { publisherUserInfo.error && (
                <StatusAlert
                  id="error"
                  alertType="danger"
                  title="Course Create Form failed to load: "
                  message={publisherUserInfo.error}
                />
              )}
              { !publisherUserInfo.isFetching && (
                <div>
                  <h2>Create New Course</h2>
                  <hr />
                  <h3>Course Information</h3>
                  <div className="col">
                    {courseInfo.error ? (
                      <StatusAlert
                        id="error"
                        alertType="danger"
                        title="Course Create Form failed to load: "
                        message={courseInfo.error}
                      />
                    ) : ''}
                    <CreateCourseForm
                      id="create-course-form"
                      onSubmit={this.handleCourseCreate}
                      initialValues={{
                        courseOrg,
                        courseTitle,
                        courseNumber,
                        courseEnrollmentTrack,
                        coursePrice,
                      }}
                      organizations={organizations}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

CreateCoursePage.defaultProps = {
  courseOrg: '',
  courseTitle: '',
  courseNumber: '',
  courseEnrollmentTrack: '',
  coursePrice: 0.0,
  publisherUserInfo: {},
  fetchOrganizations: () => {},
  courseInfo: {},
  createCourse: () => {},
};

CreateCoursePage.propTypes = {
  courseOrg: PropTypes.string,
  courseTitle: PropTypes.string,
  courseNumber: PropTypes.string,
  courseEnrollmentTrack: PropTypes.string,
  coursePrice: PropTypes.number,
  publisherUserInfo: PropTypes.shape({
    organizations: PropTypes.array,
    error: PropTypes.string,
    isFetching: PropTypes.bool,
  }),
  courseInfo: PropTypes.shape({
    error: PropTypes.string,
    data: PropTypes.shape({
      uuid: PropTypes.string,
    }),
  }),
  fetchOrganizations: PropTypes.func,
  createCourse: PropTypes.func,
};

export default CreateCoursePage;
