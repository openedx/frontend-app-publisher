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
    this.getCourseRunOptions = this.getCourseRunOptions.bind(this);
    this.parseOptions = this.parseOptions.bind(this);
    this.state = {
      startedFetching: false,
    };

    if (props.courseInfo.error) {
      props.clearCourseInfoErrors();
    }
  }

  componentDidMount() {
    this.props.fetchOrganizations();
    this.props.fetchCourseRunOptions();
    this.setStartedFetching();
  }

  setStartedFetching() {
    this.setState({ startedFetching: true });
  }

  getCourseRunOptions() {
    const { courseRunOptions } = this.props;

    if (!courseRunOptions) {
      return [];
    }
    const { data } = courseRunOptions;

    if (!data || !data.actions) {
      return [];
    }

    return data.actions.POST;
  }

  handleCourseCreate(options) {
    const courseData = {
      org: options.org,
      title: options.title,
      number: options.number,
      mode: options.enrollmentTrack,
      price: options.price,
      course_run: {
        start: options.start,
        end: options.end,
        pacing_type: options.pacing_type,
      },
    };
    return this.props.createCourse(courseData);
  }

  parseOptions(inChoices) {
    return inChoices.map(choice =>
      ({ label: choice.display_name, value: choice.value }));
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
      courseRunOptions,
    } = this.props;
    const {
      startedFetching,
    } = this.state;

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

    const showSpinner = !startedFetching || publisherUserInfo.isFetching ||
      courseRunOptions.isFetching;
    const showForm = startedFetching && !publisherUserInfo.isFetching &&
      !courseRunOptions.isFetching;

    return (
      <React.Fragment>
        <Helmet>
          <title>Create a New Course</title>
        </Helmet>

        <PageContainer>
          { showSpinner && <LoadingSpinner /> }
          { showForm &&
          (
            <div>
              <CreateCourseForm
                id="create-course-form"
                onSubmit={this.handleCourseCreate}
                initialValues={initialValues}
                currentFormValues={formValues}
                organizations={organizations}
                isCreating={courseInfo.isCreating}
                getCourseRunOptions={this.getCourseRunOptions}
                parseOptions={this.parseOptions}
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
  fetchCourseRunOptions: () => null,
  courseRunOptions: {},
  courseInfo: {},
  createCourse: () => {},
  formValues: {},
  clearCourseInfoErrors: () => null,
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
    pacing_type: PropTypes.string,
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
  fetchCourseRunOptions: PropTypes.func,
  courseRunOptions: PropTypes.shape({
    data: PropTypes.shape(),
    error: PropTypes.arrayOf(PropTypes.string),
    isFetching: PropTypes.bool,
  }),
  createCourse: PropTypes.func,
  formValues: PropTypes.shape({}),
  clearCourseInfoErrors: PropTypes.func,
};

export default CreateCoursePage;
