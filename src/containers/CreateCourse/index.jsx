import { connect } from 'react-redux';

import CreateCoursePage from '../../components/CreateCoursePage';
import { fetchOrganizations } from '../../data/actions/publisherUserInfo';
import { createCourse } from '../../data/actions/courseInfo';

const mapStateToProps = state => ({
  publisherUserInfo: state.publisherUserInfo,
  courseInfo: state.courseInfo,
});

function mapDispatchToProps(dispatch) {
  return {
    fetchOrganizations: () => {
      dispatch(fetchOrganizations());
    },
    createCourse: (courseData) => {
      dispatch(createCourse(courseData));
    },
  };
}

// const mergeProps = (stateProps, actionProps) => ({
//   ...stateProps,
//   fetchOrganizations: () => actionProps.fetchOrganizations(),
//   createCourse: (courseData) => { actionProps.createCourse(courseData); },
// });

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  // mergeProps,
)(CreateCoursePage);
