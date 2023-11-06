import PropTypes from 'prop-types';
import React from 'react';
import { Navigate } from 'react-router-dom';

import DiscoveryDataApiService from '../../data/services/DiscoveryDataApiService';
import LoadingSpinner from '../LoadingSpinner';
import { withParams } from '../../utils/hoc';

class CourseRunRedirectComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { path: null };
  }

  async componentDidMount() {
    try {
      const response = await DiscoveryDataApiService
        .fetchCourseRun(this.props.courseRunKey, { fields: 'course_uuid' });
      const uuid = response.data.course_uuid;
      this.setState({ path: `/courses/${uuid}` }); // eslint-disable-line react/no-did-mount-set-state
    } catch (e) {
      this.setState({ path: '/' }); // eslint-disable-line react/no-did-mount-set-state
    }
  }

  render() {
    return this.state.path ? <Navigate to={this.state.path} replace /> : <LoadingSpinner />;
  }
}

CourseRunRedirectComponent.propTypes = {
  courseRunKey: PropTypes.string.isRequired,
};

export default withParams(CourseRunRedirectComponent);
