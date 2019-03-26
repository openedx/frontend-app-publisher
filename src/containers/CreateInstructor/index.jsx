import { connect } from 'react-redux';

import CreateInstructorPage from '../../components/CreateInstructorPage';
import { createInstructor } from '../../data/actions/instructorInfo';
import { fetchInstructorOptions } from '../../data/actions/instructorOptions';

const mapStateToProps = state => ({
  publisherUserInfo: state.publisherUserInfo,
  instructorOptions: state.instructorOptions,
  instructorInfo: state.instructorInfo,
});

const mapDispatchToProps = {
  fetchInstructorOptions,
  createInstructor,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CreateInstructorPage);
