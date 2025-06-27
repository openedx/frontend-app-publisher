import { connect } from 'react-redux';
import { getFormValues } from 'redux-form';

import CreateCourseRunPage from '../../components/CreateCourseRunPage';
import {
  createCourseRun,
  fetchCourseInfo,
  clearCourseInfoErrors,
} from '../../data/actions/courseInfo';
import { fetchCourseOptions } from '../../data/actions/courseOptions';
import { fetchCourseRunOptions } from '../../data/actions/courseRunOptions';
import { withNavigate, withParams } from '../../utils/hoc';

const mapStateToProps = state => ({
  courseInfo: state.courseInfo,
  courseOptions: state.courseOptions,
  courseRunOptions: state.courseRunOptions,
  formValues: getFormValues(`create-course-run-form-${state.courseInfo.data.uuid}`)(state),
});

const mapDispatchToProps = {
  fetchCourseInfo,
  fetchCourseOptions,
  fetchCourseRunOptions,
  createCourseRun,
  clearCourseInfoErrors,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withParams(withNavigate(CreateCourseRunPage)));
