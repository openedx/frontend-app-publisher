import PropTypes from 'prop-types';
import React from 'react';
import { Redirect } from 'react-router';

import DiscoveryDataApiService from '../../data/services/DiscoveryDataApiService';
import LoadingSpinner from '../LoadingSpinner';

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
    return this.state.path ? <Redirect to={this.state.path} /> : <LoadingSpinner />;
  }
}

CourseRunRedirectComponent.propTypes = {
  courseRunKey: PropTypes.string.isRequired,
};

export default CourseRunRedirectComponent;
