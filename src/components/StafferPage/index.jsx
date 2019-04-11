import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Redirect } from 'react-router-dom';

import StafferForm from './StafferForm';
import StatusAlert from '../StatusAlert';
import LoadingSpinner from '../LoadingSpinner';
import PageContainer from '../PageContainer';


// Returns the url for sending the user back to the previous edit course page
export const getPreviousCourseEditUrl = courseUuid => `/courses/${courseUuid}/edit`;

class StafferPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startedFetching: false,
    };
    this.handleStafferCreate = this.handleStafferCreate.bind(this);
    this.handleStafferEdit = this.handleStafferEdit.bind(this);
    this.setStartedFetching = this.setStartedFetching.bind(this);
    this.prepareStafferData = this.prepareStafferData.bind(this);
  }

  componentDidMount() {
    this.props.fetchStafferOptions();
    this.props.fetchStafferInfo();
    this.setStartedFetching();
  }

  setStartedFetching() {
    this.setState({ startedFetching: true });
  }

  prepareSocialLinks(links) {
    if (!links) {
      return [];
    }

    return links.map(link => (
      ({
        ...link,
        id: link.id || null,
      })
    ));
  }

  prepareAreasOfExpertise(areasOfExpertise) {
    if (!areasOfExpertise) {
      return [];
    }

    return areasOfExpertise.map(area => ({
      ...area,
      id: area.id || null,
    }));
  }

  preparePosition(position) {
    return {
      title: position.title,
      organization: position.organization_id,
      organization_override: null,
    };
  }

  prepareStafferData(fieldValues) {
    return {
      ...fieldValues,
      profile_image: fieldValues.profile_image.medium.url,
      areas_of_expertise: this.prepareAreasOfExpertise(fieldValues.areas_of_expertise),
      urls_detailed: this.prepareSocialLinks(fieldValues.urls_detailed),
      position: this.preparePosition(fieldValues.position),
    };
  }

  handleStafferCreate(fieldValues) {
    const stafferData = this.prepareStafferData(fieldValues);
    this.props.createStaffer(stafferData);
  }

  handleStafferEdit(fieldValues) {
    const stafferData = this.prepareStafferData(fieldValues);
    if (!stafferData.profile_image.startsWith('data:')) {
      // Only send profile_image if a new one is being uploaded
      delete stafferData.profile_image;
    }
    this.props.editStaffer(stafferData);
  }

  render() {
    const {
      stafferOptions,
      stafferInfo,
      fromEditCourse,
    } = this.props;

    if (!stafferOptions || !stafferInfo) {
      return (
        <StatusAlert
          id="error"
          alertType="danger"
          title="Could not load page"
          message="Could not get instructor information"
        />
      );
    }

    // Redirect users back to the previous edit course page on successful submission
    if (fromEditCourse.fromEditCourse && stafferInfo.wasEditSuccessful) {
      return (
        <Redirect push to={getPreviousCourseEditUrl(fromEditCourse.courseUuid)} />
      );
    }

    const { startedFetching } = this.state;
    const showForm = (startedFetching
      && !stafferOptions.isFetching
      && !stafferInfo.isFetching);
    const showSpinner = !showForm;
    const isCreateForm = !this.props.editStaffer;

    const titleText = isCreateForm ? 'Create New Instructor' : 'Edit Instructor';
    const handleSubmit = (isCreateForm
      ? this.handleStafferCreate
      : this.handleStafferEdit);

    const { data, isSaving } = stafferInfo;

    let error = '';
    if (stafferInfo.error) {
      error = error.concat(stafferInfo.error, ' ');
    }
    if (stafferOptions.error) {
      error = error.concat(stafferOptions.error);
    }
    error = error.trim();

    return (
      <React.Fragment>
        <Helmet>
          <title>{titleText}</title>
        </Helmet>

        <PageContainer>
          { showSpinner && <LoadingSpinner /> }
          { showForm && (
            <div>
              <h2>{titleText}</h2>
              { fromEditCourse.fromEditCourse &&
                <div className="alert alert-primary my-3" role="alert">
                The data you entered on the course edit screen is saved. You will return
                to that page when you have finished updating instructor information.
                </div>
              }
              <hr />
              <StafferForm
                id="create-staffer-form"
                onSubmit={handleSubmit}
                stafferOptions={stafferOptions}
                isSaving={isSaving}
                isCreateForm={isCreateForm}
                initialValues={data}
                fromEditCourse={fromEditCourse}
              />
              { isSaving && <LoadingSpinner message="Saving instructor" /> }
              { error && (
                <StatusAlert
                  id="create-staffer-error"
                  alertType="danger"
                  title="Could not save instructor"
                  message={error}
                />
              )}
            </div>
          )}
        </PageContainer>
      </React.Fragment>
    );
  }
}

StafferPage.defaultProps = {
  createStaffer: () => {},
  editStaffer: null,
  fetchStafferOptions: () => null,
  fetchStafferInfo: () => null,
  stafferOptions: null,
  stafferInfo: null,
  fromEditCourse: {},
};

StafferPage.propTypes = {
  createStaffer: PropTypes.func,
  editStaffer: PropTypes.func,
  fetchStafferOptions: PropTypes.func,
  fetchStafferInfo: PropTypes.func,
  stafferOptions: PropTypes.shape({
    data: PropTypes.shape(),
    error: PropTypes.string,
    isFetching: PropTypes.bool,
  }),
  stafferInfo: PropTypes.shape({
    isFetching: PropTypes.bool,
    isSaving: PropTypes.bool,
    data: PropTypes.shape(),
    error: PropTypes.string,
    wasEditSuccessful: PropTypes.bool,
  }),
  fromEditCourse: PropTypes.shape({
    fromEditCourse: PropTypes.bool,
    courseUuid: PropTypes.string,
  }),
};

export default StafferPage;
