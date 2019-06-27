import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

import { CreateCourseRunForm } from './CreateCourseRunForm';
import LoadingSpinner from '../LoadingSpinner';
import StatusAlert from '../StatusAlert';
import PageContainer from '../PageContainer';

class CreateCourseRunPage extends React.Component {
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
    const {
      courseInfo,
      id,
    } = this.props;
    if (!courseInfo ||
        Object.entries(courseInfo.data).length === 0 ||
        courseInfo.data.uuid !== id) {
      // We need to request Course data
      this.props.fetchCourseInfo(id);
    }
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
    const {
      courseInfo: {
        data: {
          key,
          uuid,
        },
      },
      createCourseRun,
    } = this.props;

    const courseRunData = {
      course: key,
      start: options.start,
      end: options.end,
      pacing_type: options.pacing_type,
    };
    return createCourseRun(uuid, courseRunData);
  }

  parseOptions(inChoices) {
    return inChoices.map(choice =>
      ({ label: choice.display_name, value: choice.value }));
  }

  render() {
    const {
      courseInfo,
      courseRunOptions,
      formValues,
    } = this.props;
    const {
      startedFetching,
    } = this.state;
    const title = courseInfo.data && courseInfo.data.title ? courseInfo.data.title : '';
    const uuid = courseInfo.data && courseInfo.data.uuid ? courseInfo.data.uuid : '';

    const errorArray = [];
    if (courseInfo.error) {
      courseInfo.error.forEach((error, index) => {
        errorArray.push(error);
        if (index < courseInfo.error.length) {
          errorArray.push(<br />);
        }
      });
    }

    const showSpinner = !startedFetching || courseInfo.isFetching ||
      courseRunOptions.isFetching;
    const showForm = startedFetching && !courseInfo.isFetching &&
      !courseRunOptions.isFetching;

    return (
      <React.Fragment>
        <Helmet>
          Create Course Run
        </Helmet>

        <PageContainer>
          { showSpinner && <LoadingSpinner /> }
          { showForm &&
          (
            <div>
              <CreateCourseRunForm
                onSubmit={this.handleCourseCreate}
                title={title}
                uuid={uuid}
                isCreating={courseInfo.isCreating}
                getCourseRunOptions={this.getCourseRunOptions}
                parseOptions={this.parseOptions}
                currentFormValues={formValues}
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

CreateCourseRunPage.defaultProps = {
  initialValues: {},
  fetchCourseInfo: () => null,
  fetchCourseRunOptions: () => null,
  courseInfo: null,
  courseRunOptions: {},
  createCourseRun: () => {},
  clearCourseInfoErrors: () => null,
  formValues: {},
};

CreateCourseRunPage.propTypes = {
  initialValues: PropTypes.shape({ // eslint-disable-line react/no-unused-prop-types
    course: PropTypes.string,
  }),
  fetchCourseInfo: PropTypes.func,
  courseInfo: PropTypes.shape({
    data: PropTypes.shape(),
    error: PropTypes.arrayOf(PropTypes.string),
    isFetching: PropTypes.bool,
  }),
  fetchCourseRunOptions: PropTypes.func,
  courseRunOptions: PropTypes.shape({
    data: PropTypes.shape(),
    error: PropTypes.arrayOf(PropTypes.string),
    isFetching: PropTypes.bool,
  }),
  id: PropTypes.string.isRequired,
  createCourseRun: PropTypes.func,
  clearCourseInfoErrors: PropTypes.func,
  formValues: PropTypes.shape({}),
};

export default CreateCourseRunPage;
