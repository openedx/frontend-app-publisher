import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { CreateCourseRunForm } from './CreateCourseRunForm';
import LoadingSpinner from '../LoadingSpinner';
import StatusAlert from '../StatusAlert';

class CreateCourseRunPage extends React.Component {
  constructor(props) {
    super(props);
    this.handleCourseCreate = this.handleCourseCreate.bind(this);
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
  }

  handleCourseCreate(options) {
    const {
      courseInfo,
    } = this.props;
    return this.props.createCourseRun(courseInfo.data, options);
  }

  render() {
    const {
      courseInfo,
    } = this.props;
    const title = courseInfo.data && courseInfo.data.title ? courseInfo.data.title : '';
    const uuid = courseInfo.data && courseInfo.data.uuid ? courseInfo.data.uuid : '';
    const showCreatingCourseRunSpinner = !courseInfo.isFetching &&
      courseInfo.isCreating &&
      !courseInfo.error;

    return (
      <React.Fragment>
        <Helmet>
          Create Course Run
        </Helmet>
        <div className="container-fluid">
          <div className="row justify-content-md-center my-3 ">
            <div className="col-6">
              <div>
                { courseInfo.isFetching && <LoadingSpinner /> }
                { !courseInfo.isFetching &&
                (
                  <div>
                    <CreateCourseRunForm
                      onSubmit={this.handleCourseCreate}
                      title={title}
                      uuid={uuid}
                    />
                    { showCreatingCourseRunSpinner &&
                      <LoadingSpinner message="Creating Course Run" />
                    }
                    {courseInfo.error && (
                      <StatusAlert
                        id="create-error"
                        alertType="danger"
                        title="Course Run create failed: "
                        message={courseInfo.error}
                      />
                    ) }
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

      </React.Fragment>
    );
  }
}

CreateCourseRunPage.defaultProps = {
  initialValues: {},
  fetchCourseInfo: () => null,
  courseInfo: null,
  createCourseRun: () => {},
};

CreateCourseRunPage.propTypes = {
  initialValues: PropTypes.shape({ // eslint-disable-line react/no-unused-prop-types
    course: PropTypes.string,
  }),
  fetchCourseInfo: PropTypes.func,
  courseInfo: PropTypes.shape({
    data: PropTypes.shape(),
    error: PropTypes.string,
    isFetching: PropTypes.bool,
  }),
  id: PropTypes.string.isRequired,
  createCourseRun: PropTypes.func,
};

export default CreateCourseRunPage;
