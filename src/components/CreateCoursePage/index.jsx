import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

import CreateCourseForm from './CreateCourseForm';
import LoadingSpinner from '../LoadingSpinner';
import PageContainer from '../PageContainer';
import StatusAlert from '../StatusAlert';

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
      formValues,
    } = this.props;

    const organizations = publisherUserInfo.organizations ? publisherUserInfo.organizations : [];

    const errorArray = [];
    if (courseInfo.error) {
      courseInfo.error.forEach((error, index) => {
        errorArray.push(error);
        if (index < courseInfo.error.length) {
          errorArray.push(<br />);
        }
      });
    }

    if (publisherUserInfo.error) {
      publisherUserInfo.error.forEach((error, index) => {
        errorArray.push(error);
        if (index < publisherUserInfo.error.length) {
          errorArray.push(<br />);
        }
      });
    }

    return (
      <React.Fragment>
        <Helmet>
          <title>Create a New Course</title>
        </Helmet>

        <PageContainer>
          { publisherUserInfo.isFetching && <LoadingSpinner /> }
          { !publisherUserInfo.isFetching &&
          (
            <div>
              <CreateCourseForm
                id="create-course-form"
                onSubmit={this.handleCourseCreate}
                initialValues={initialValues}
                currentValues={formValues}
                organizations={organizations}
                isCreating={courseInfo.isCreating}
              />
              {errorArray.length > 1 && (
                <StatusAlert
                  id="create-error"
                  alertType="danger"
                  message={errorArray}
                />
              ) }
            </div>
          )}
        </PageContainer>
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
  formValues: {},
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
    error: PropTypes.arrayOf(PropTypes.string),
    isFetching: PropTypes.bool,
  }),
  courseInfo: PropTypes.shape({
    error: PropTypes.arrayOf(PropTypes.string),
    data: PropTypes.shape({
      uuid: PropTypes.string,
    }),
  }),
  fetchOrganizations: PropTypes.func,
  createCourse: PropTypes.func,
  formValues: PropTypes.shape({}),
};

export default CreateCoursePage;
