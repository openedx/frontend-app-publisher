import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Hyperlink, Icon, StatusAlert } from '@edx/paragon';

import LabelledData from '../../components/LabelledData';
import StaffGrid from '../../components/StaffGrid';

import { fetchCourseInfo } from '../../data/actions/courseInfo';


class CourseView extends React.Component {
  static propTypes = {
    courseInfo: PropTypes.shape({
      data: PropTypes.shape(),
      error: PropTypes.string,
      isFetching: PropTypes.bool,
    }),
    fetchCourseInfo: PropTypes.func,
  };

  static defaultProps = {
    courseInfo: {},
    fetchCourseInfo: () => null,
  };

  componentDidMount() {
    this.props.fetchCourseInfo();
  }

  render() {
    if (!this.props.courseInfo) {
      return null;
    }

    const {
      data, error, isFetching,
    } = this.props.courseInfo;

    if (error) {
      return (
        <StatusAlert
          id="error"
          alertType="danger"
          dismissible={false}
          open
          dialog={error}
          className={['text-center', 'mx-auto', 'w-50']}
        />
      );
    }

    if (isFetching) {
      return (
        <div className="mx-auto text-center">
          <Icon
            id="spinner"
            className={['fa', 'fa-circle-o-notch', 'fa-spin', 'fa-3x', 'fa-fw']}
          />
        </div>
      );
    }

    if (!data || !data.key) {
      return null;
    }

    const keyParts = data.key.split(/\+|\//);
    const number = keyParts[keyParts.length - 1];
    const subjects = data.subjects.map(x => x.name);

    return (
      <div className="container mx-auto">
        <LabelledData id="title" label="Title" value={data.title} />
        <LabelledData id="number" label="Number" value={number} />
        <LabelledData id="sdesc" label="Short Description" value={data.short_description} html />
        <LabelledData id="ldesc" label="Long Description" value={data.full_description} html />
        <LabelledData id="outcome" label="What You Will Learn" value={data.outcome} html />
        <LabelledData id="subjects" label="Subjects" value={subjects.join(', ')} />
        <LabelledData
          id="image"
          label="Course Image"
          value={
            data.image && data.image.src &&
            <img src={data.image.src} alt="" />
          }
        />
        <LabelledData id="prereq" label="Prerequisites" value={data.prerequisites_raw} html />
        <LabelledData id="level" label="Course Level" value={data.level_type || ''} />
        <LabelledData
          id="testimonials"
          label="Learner Testimonials"
          value={data.learner_testimonials}
          html
        />
        <LabelledData id="faq" label="FAQ" value={data.faq} html />
        <LabelledData
          id="info"
          label="Additional Information"
          value={data.additional_information}
          html
        />
        <LabelledData id="syllabus" label="Syllabus" value={data.syllabus_raw} html />
        <LabelledData
          id="video"
          label="About Video Link"
          value={
            data.video && data.video.src &&
            <Hyperlink content={data.video.src} destination={data.video.src} target="_blank" />
          }
        />
      </div>
    );
  }
}

export { CourseView as CourseViewBasic }; // used in tests


// *** Redux routing ***

const mapStateToProps = state => ({
  courseInfo: state.courseInfo,
});

const mapDispatchToProps = {
  fetchCourseInfo,
};

const mergeProps = (stateProps, actionProps, { id }) => ({
  ...stateProps,
  fetchCourseInfo: () => actionProps.fetchCourseInfo(id),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(CourseView);
