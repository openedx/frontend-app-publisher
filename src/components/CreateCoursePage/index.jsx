import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Icon, StatusAlert } from '@edx/paragon';
import { push } from 'connected-react-router';

import CreateCourseForm from './CreateCourseForm';
import store from '../../data/store';

class CreateCoursePage extends React.Component {
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

  showErrorStatus(error) {
    return (
      <StatusAlert
        id="error"
        alertType="danger"
        dismissible={false}
        open
        dialog={error}
        className={['text-center', 'mx-auto', 'w-50']}
      />
    );
  }

  render() {
    if (!this.props.publisherUserInfo) {
      return this.showErrorStatus('Unable to load course creation form, please contact support');
    }

    if (this.props.courseInfo && this.props.courseInfo.courseCreated) {
      store.dispatch(push(`/courses/${this.props.courseInfo.data.uuid}/`));
    }

    const {
      courseOrg,
      courseTitle,
      courseNumber,
      courseEnrollmentTrack,
      coursePrice,
      publisherUserInfo,
      courseInfo,
    } = this.props;

    if (publisherUserInfo.error) {
      return this.showErrorStatus(publisherUserInfo.error);
    }

    if (publisherUserInfo.isFetching) {
      return (
        <div className="mx-auto text-center">
          <Icon
            id="spinner"
            className={['fa', 'fa-circle-o-notch', 'fa-spin', 'fa-3x', 'fa-fw']}
          />
        </div>
      );
    }

    const organizations = publisherUserInfo.organizations ? publisherUserInfo.organizations : [];

    return (
      <React.Fragment>
        <Helmet>
          <title>Create a New Course</title>
        </Helmet>

        <div className="container-fluid">
          <div className="row justify-content-md-center my-3 ">
            <div className="col-6">
              <h2>Create New Course</h2>
              <hr />
              <h3>Course Information</h3>
              <div className="col">
                {courseInfo.error ? this.showErrorStatus(courseInfo.error) : ''}
                <CreateCourseForm
                  id="create-course-form"
                  onSubmit={options => (
                    this.handleCourseCreate(options)
                  )}
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
    courseCreated: PropTypes.bool,
    data: PropTypes.shape({
      uuid: PropTypes.string,
    }),
  }),
  fetchOrganizations: PropTypes.func,
  createCourse: PropTypes.func,
};

export default CreateCoursePage;
