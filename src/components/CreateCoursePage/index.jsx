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
      org: options.org,
      title: options.title,
      number: options.number,
      mode: options.enrollmentTrack,
      price: options.price,
    };
    const courseRunData = {
      start: options.start,
      end: options.end,
    };
    return this.props.createCourse(courseData, courseRunData);
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
      initialValues,
      courseInfo,
      publisherUserInfo,
    } = this.props;

    const showCreatingCourseSpinner = !publisherUserInfo.isFetching &&
      courseInfo.isCreating &&
      !courseInfo.error;
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
                  id="user-info-error"
                  alertType="danger"
                  title="Course Create Form failed to load: "
                  message={publisherUserInfo.error}
                />
              )}
              { !publisherUserInfo.isFetching &&
              (
                <div>
                  <h2>Create New Course</h2>
                  <div className="col">
                    <CreateCourseForm
                      id="create-course-form"
                      onSubmit={this.handleCourseCreate}
                      initialValues={initialValues}
                      organizations={organizations}
                      isCreating={courseInfo.isCreating}
                    />
                    { showCreatingCourseSpinner &&
                    <LoadingSpinner
                      message="Creating Course and Course Run"
                    />
                    }
                    {courseInfo.error && (
                      <StatusAlert
                        id="create-error"
                        alertType="danger"
                        title="Course create failed: "
                        message={courseInfo.error}
                      />
                    ) }
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
  initialValues: {},
  publisherUserInfo: {},
  fetchOrganizations: () => {},
  courseInfo: {},
  createCourse: () => {},
};

CreateCoursePage.propTypes = {
  initialValues: PropTypes.shape({ // eslint-disable-line react/no-unused-prop-types
    org: PropTypes.string,
    title: PropTypes.string,
    number: PropTypes.string,
    enrollmentTrack: PropTypes.string,
    price: PropTypes.number,
    start: PropTypes.string,
    end: PropTypes.string,
  }),
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
