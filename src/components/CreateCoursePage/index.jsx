import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

import CreateCourseForm from './CreateCourseForm';
import LoadingSpinner from '../LoadingSpinner';
import PageContainer from '../PageContainer';
import StatusAlert from '../StatusAlert';
import ConfirmationModal from '../ConfirmationModal';

import { formatPriceData } from '../../utils';

class CreateCoursePage extends React.Component {
  constructor(props) {
    super(props);
    this.handleCourseCreate = this.handleCourseCreate.bind(this);
    this.showModal = this.showModal.bind(this);
    this.cancelCreate = this.cancelCreate.bind(this);
    this.continueCreate = this.continueCreate.bind(this);
    this.state = {
      startedFetching: false,
      createConfirmVisible: false,
      createCourseData: {},
    };

    if (props.courseInfo.error) {
      props.clearCourseInfoErrors();
    }
  }

  componentDidMount() {
    this.props.fetchOrganizations();
    this.props.fetchCourseOptions();
    this.props.fetchCourseRunOptions();
    this.setStartedFetching();
  }

  setStartedFetching() {
    this.setState({ startedFetching: true });
  }

  handleCourseCreate(options) {
    const priceData = formatPriceData(options, this.props.courseOptions);
    const courseData = {
      ...priceData,
      org: options.org,
      title: options.title,
      number: options.number,
      type: options.type,
      course_run: {
        ...priceData, // might be sending more than we need to, but :shrug:
        start: options.start,
        end: options.end,
        pacing_type: options.pacing_type,
        run_type: options.run_type,
        term: options.courseRunKey,
      },
    };
    return this.props.createCourse(courseData);
  }

  showModal(options) {
    this.setState({
      createCourseData: options,
      createConfirmVisible: true,
    });
  }

  continueCreate() {
    const {
      createCourseData,
    } = this.state;

    this.setState({
      createCourseData: {},
      createConfirmVisible: false,
    });

    this.handleCourseCreate(createCourseData);
  }

  cancelCreate() {
    const {
      clearCreateCourseStatus,
    } = this.props;

    this.setState({
      createCourseData: {},
      createConfirmVisible: false,
    });
    return clearCreateCourseStatus();
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
      courseOptions,
      courseRunOptions,
    } = this.props;
    const {
      startedFetching,
      createConfirmVisible,
    } = this.state;

    const organizations = publisherUserInfo.organizations ? publisherUserInfo.organizations : [];
    if (organizations.length === 1) { initialValues.org = organizations[0].key; }

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

    const showSpinner = !startedFetching || publisherUserInfo.isFetching
      || courseOptions.isFetching || courseRunOptions.isFetching;
    const showForm = startedFetching && !publisherUserInfo.isFetching
      && !courseOptions.isFetching && !courseRunOptions.isFetching;

    return (
      <>
        <Helmet>
          <title>Create a New Course</title>
        </Helmet>

        <ConfirmationModal
          title="Create a New Course?"
          body="This will create a new course in studio. Confirm that your course number is correct, as it cannot be changed later."
          buttonLabel="Create"
          open={createConfirmVisible}
          onSubmit={this.continueCreate}
          onClose={this.cancelCreate}
        />

        <PageContainer>
          { showSpinner && <LoadingSpinner /> }
          { showForm
          && (
            <div>
              <CreateCourseForm
                id="create-course-form"
                onSubmit={this.showModal}
                initialValues={initialValues}
                currentFormValues={formValues}
                organizations={organizations}
                isCreating={courseInfo.isCreating}
                courseOptions={courseOptions}
                courseRunOptions={courseRunOptions}
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
      </>
    );
  }
}

CreateCoursePage.defaultProps = {
  initialValues: {},
  publisherUserInfo: {
    organizations: [],
  },
  fetchOrganizations: () => {},
  fetchCourseOptions: () => {},
  fetchCourseRunOptions: () => {},
  courseOptions: {},
  courseRunOptions: {},
  courseInfo: {},
  createCourse: () => {},
  formValues: {},
  clearCourseInfoErrors: () => null,
  clearCreateCourseStatus: () => {},
};

CreateCoursePage.propTypes = {
  initialValues: PropTypes.shape({ // eslint-disable-line react/no-unused-prop-types
    org: PropTypes.string,
    title: PropTypes.string,
    number: PropTypes.string,
    type: PropTypes.string,
    prices: PropTypes.shape(),
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
    isCreating: PropTypes.bool,
  }),
  fetchOrganizations: PropTypes.func,
  fetchCourseOptions: PropTypes.func,
  fetchCourseRunOptions: PropTypes.func,
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
  createCourse: PropTypes.func,
  formValues: PropTypes.shape({}),
  clearCourseInfoErrors: PropTypes.func,
  clearCreateCourseStatus: PropTypes.func,
};

export default CreateCoursePage;
