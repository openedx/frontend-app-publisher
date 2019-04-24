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

    return (
      <React.Fragment>
        <Helmet>
          Create Course Run
        </Helmet>

        <PageContainer>
          { courseInfo.isFetching && <LoadingSpinner /> }
          { !courseInfo.isFetching &&
          (
            <div>
              <CreateCourseRunForm
                onSubmit={this.handleCourseCreate}
                title={title}
                uuid={uuid}
                isCreating={courseInfo.isCreating}
              />
              {courseInfo.error && (
                <StatusAlert
                  id="create-error"
                  alertType="danger"
                  message={courseInfo.error}
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
