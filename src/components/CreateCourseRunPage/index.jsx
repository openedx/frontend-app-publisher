/* eslint-disable camelcase */
import moment from 'moment';
import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

import { IN_REVIEW_STATUS } from '../../data/constants';
import { CreateCourseRunForm } from './CreateCourseRunForm';
import LoadingSpinner from '../LoadingSpinner';
import StatusAlert from '../StatusAlert';
import PageContainer from '../PageContainer';
import {
  buildInitialPrices, formatDate, getOptionsData, parseCourseTypeOptions,
} from '../../utils';

class CreateCourseRunPage extends React.Component {
  constructor(props) {
    super(props);
    this.handleCourseCreate = this.handleCourseCreate.bind(this);
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
      courseOptions,
      courseRunOptions,
      fetchCourseInfo,
      fetchCourseOptions,
      fetchCourseRunOptions,
      uuid,
    } = this.props;
    if (!courseInfo.data || (courseInfo.data
        && (Object.keys(courseInfo.data).length === 0
        || courseInfo.data.uuid !== uuid))) {
      // We need to request Course data
      fetchCourseInfo(uuid);
    }
    if (!courseOptions.data || (courseOptions.data
        && Object.keys(courseOptions.data).length === 0)) {
      fetchCourseOptions();
    }
    if (!courseRunOptions.data || (courseRunOptions.data
        && Object.keys(courseRunOptions.data).length === 0)) {
      fetchCourseRunOptions();
    }
    this.setStartedFetching();
  }

  setStartedFetching() {
    this.setState({ startedFetching: true });
  }

  handleCourseCreate(options) {
    const {
      courseInfo: {
        data: {
          key,
          uuid,
          entitlements,
          course_runs,
        },
      },
      createCourseRun,
    } = this.props;

    const prices = buildInitialPrices(entitlements, course_runs);
    const courseRunData = {
      course: key,
      start: options.start,
      end: options.end,
      pacing_type: options.pacing_type,
      prices,
      rerun: options.rerun,
      run_type: options.run_type,
      term: options.courseRunKey,
    };
    return createCourseRun(uuid, courseRunData);
  }

  parseCourseRunLabels(courseRuns) {
    // Sort course runs by descending start dates
    const sortedCourseRuns = courseRuns.sort((run1, run2) => moment(run2.start).diff(moment(run1.start)));
    return sortedCourseRuns.map((run) => {
      const runTerm = run.key.split(/\+|\//).pop();
      return ({ label: `Run starting ${formatDate(run.start)} (${runTerm})`, value: run.key });
    });
  }

  render() {
    const {
      courseInfo,
      courseInfo: {
        data: {
          course_runs,
          type,
        },
      },
      courseOptions,
      courseRunOptions,
      formValues,
    } = this.props;
    const {
      startedFetching,
    } = this.state;
    const title = courseInfo.data && courseInfo.data.title ? courseInfo.data.title : '';
    const uuid = courseInfo.data && courseInfo.data.uuid ? courseInfo.data.uuid : '';
    const canSetRunKey = courseInfo.data && courseInfo.data.owners
      && !courseInfo.data.owners.some(o => o.auto_generate_course_run_keys);

    const errorArray = [];
    if (courseInfo.error) {
      courseInfo.error.forEach((error, index) => {
        errorArray.push(error);
        if (index < courseInfo.error.length) {
          errorArray.push(<br />);
        }
      });
    }

    const courseInReview = course_runs && course_runs.some(courseRun => IN_REVIEW_STATUS.includes(courseRun.status));

    const showSpinner = !startedFetching || courseInfo.isFetching || courseOptions.isFetching
      || courseRunOptions.isFetching;
    const showForm = startedFetching && !courseInfo.isFetching && !courseOptions.isFetching
      && !courseRunOptions.isFetching && !courseInReview;
    const sortedRunLabels = (showForm
      && (course_runs ? this.parseCourseRunLabels(course_runs) : []));
    const defaultRun = (showForm && (sortedRunLabels.length ? sortedRunLabels[0].value : ''));

    const courseOptionsData = showForm && getOptionsData(courseOptions);
    const parsedTypeOptions = courseOptionsData && courseOptionsData.type
      && parseCourseTypeOptions(courseOptionsData.type.type_options);
    const courseRunTypeOptions = parsedTypeOptions && parsedTypeOptions.courseRunTypeOptions;
    const defaultRunType = courseRunTypeOptions && courseRunTypeOptions[type]
      && courseRunTypeOptions[type][1] && courseRunTypeOptions[type][1].value;

    return (
      <>
        <Helmet>
          Create Course Run
        </Helmet>

        <PageContainer>
          { showSpinner && <LoadingSpinner /> }
          { courseInReview
            && (
            <StatusAlert
              alertType="warning"
              message={`${title} has been submitted for review. No course runs can be added right now.`}
            />
            )}
          { showForm
          && (
            <div>
              <CreateCourseRunForm
                onSubmit={this.handleCourseCreate}
                title={title}
                uuid={uuid}
                isCreating={courseInfo.isCreating}
                currentFormValues={formValues}
                courseRunLabels={sortedRunLabels}
                courseOptions={courseOptions}
                courseRunOptions={courseRunOptions}
                courseRunTypeOptions={courseRunTypeOptions ? courseRunTypeOptions[type] : []}
                initialValues={{
                  rerun: defaultRun,
                  run_type: defaultRunType,
                }}
                courseTypeUuid={type}
                canSetRunKey={canSetRunKey}
              />
              {errorArray.length > 1 && (
                <StatusAlert
                  id="create-error"
                  alertType="danger"
                  className="mt-3"
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

CreateCourseRunPage.defaultProps = {
  initialValues: {},
  fetchCourseInfo: () => {},
  fetchCourseOptions: () => {},
  fetchCourseRunOptions: () => {},
  courseInfo: {},
  courseOptions: {},
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
    isCreating: PropTypes.bool,
    isFetching: PropTypes.bool,
  }),
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
  uuid: PropTypes.string.isRequired,
  createCourseRun: PropTypes.func,
  clearCourseInfoErrors: PropTypes.func,
  formValues: PropTypes.shape({}),
};

export default CreateCourseRunPage;
