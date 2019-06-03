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
  }

  handleCourseCreate(options) {
    const {
      courseInfo: {
        data: {
          key,
          entitlements,
          uuid,
        },
      },
      createCourseRun,
    } = this.props;

    const courseRunData = {
      course: key,
      start: options.start,
      end: options.end,
      mode: entitlements && entitlements[0] && entitlements[0].mode,
      price: entitlements && entitlements[0] && entitlements[0].price,
    };
    return createCourseRun(uuid, courseRunData);
  }

  render() {
    const {
      courseInfo,
    } = this.props;
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
  courseInfo: null,
  createCourseRun: () => {},
  clearCourseInfoErrors: () => null,
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
  id: PropTypes.string.isRequired,
  createCourseRun: PropTypes.func,
  clearCourseInfoErrors: PropTypes.func,
};

export default CreateCourseRunPage;
