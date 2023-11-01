import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { Alert } from '@edx/paragon';

import StafferForm from './StafferForm';
import LoadingSpinner from '../LoadingSpinner';
import PageContainer from '../PageContainer';

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
    this.props.fetchStafferInfo();
    this.props.fetchOrganizations();
    this.setStartedFetching();
  }

  handleStafferCreate(fieldValues) {
    const {
      createStaffer,
      sourceInfo: { referrer },
      navigate,
    } = this.props;

    const stafferData = this.prepareStafferData(fieldValues);
    createStaffer(stafferData, navigate, referrer);
  }

  handleStafferEdit(fieldValues) {
    const {
      editStaffer,
      sourceInfo: { referrer },
      navigate,
    } = this.props;

    const stafferData = this.prepareStafferData(fieldValues);
    if (!stafferData.profile_image.startsWith('data:')) {
      // Only send profile_image if a new one is being uploaded
      delete stafferData.profile_image;
    }
    editStaffer(stafferData, navigate, referrer);
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
        title: link.title || '',
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
    // If they add an override, we will null out any potential foreign key they used to have
    // so we avoid the situation of a mismatch between having a foreign key to edX, but an
    // override to "New OrgX" and both are present for the person.
    const orgId = position.organization_override ? null : position.organization_id;
    return {
      title: position.title,
      organization: orgId,
      organization_override: position.organization_override.value,
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

  render() {
    const {
      stafferInfo,
      sourceInfo,
      publisherUserInfo,
    } = this.props;

    if (!stafferInfo) {
      return (
        <Alert
          id="error"
          variant="danger"
          title=""
          message=""
        >
          <Alert.Heading>Could not load page</Alert.Heading>
          <p>Could not get instructor information</p>
        </Alert>
      );
    }

    const { startedFetching } = this.state;
    const showForm = (startedFetching && !stafferInfo.isFetching);
    const showSpinner = !showForm;
    const isCreateForm = !this.props.editStaffer;

    const titleText = isCreateForm ? 'Create New Instructor' : 'Edit Instructor';
    const handleSubmit = (isCreateForm
      ? this.handleStafferCreate
      : this.handleStafferEdit);

    const { data, isSaving } = stafferInfo;
    const orgOverrideString = data?.position?.organization_override;
    const orgOverrideSelectValue = orgOverrideString
      ? { label: orgOverrideString, value: orgOverrideString }
      : null;

    const errorArray = [];

    if (stafferInfo.error) {
      stafferInfo.error.forEach((error, index) => {
        errorArray.push(error);
        if (index < stafferInfo.error.length) {
          errorArray.push(<br />);
        }
      });
    }
    const { referrer } = sourceInfo;
    const organizationName = (data && data.position && data.position.organization_name) || '';

    return (
      <>
        <Helmet>
          <title>{titleText}</title>
        </Helmet>
        <PageContainer>
          { showSpinner && <LoadingSpinner /> }
          { referrer
            && (
            <Alert
              id="sent-from-edit-course-info"
              variant="info"
              dismissible
            >
              The data you entered on the course edit screen is saved. You will return to that
              page when you have finished updating instructor information.
            </Alert>
            )}
          { showForm && (
            <div>
              <h2>{titleText}</h2>
              <hr />
              <StafferForm
                id="create-staffer-form"
                onSubmit={handleSubmit}
                isSaving={isSaving}
                isCreateForm={isCreateForm}
                initialValues={{
                  ...data,
                  position: {
                    ...data?.position, organization_override: orgOverrideSelectValue,
                  },
                }}
                organizationName={organizationName}
                publisherOrganizations={publisherUserInfo.organizations}
                {...this.props}
              />
              { errorArray.length > 1 && (
                <Alert
                  id="create-staffer-error"
                  variant="danger"
                >
                  {errorArray}
                </Alert>
              )}
            </div>
          )}
        </PageContainer>
      </>
    );
  }
}

StafferPage.defaultProps = {
  createStaffer: () => {},
  editStaffer: null,
  fetchStafferInfo: () => null,
  fetchOrganizations: () => null,
  publisherUserInfo: {
    organizations: [],
  },
  stafferInfo: null,
  sourceInfo: {},
};

StafferPage.propTypes = {
  createStaffer: PropTypes.func,
  editStaffer: PropTypes.func,
  fetchStafferInfo: PropTypes.func,
  fetchOrganizations: PropTypes.func,
  publisherUserInfo: PropTypes.shape({
    organizations: PropTypes.arrayOf(PropTypes.shape({})),
    error: PropTypes.arrayOf(PropTypes.string),
    isFetching: PropTypes.bool,
  }),
  stafferInfo: PropTypes.shape({
    isFetching: PropTypes.bool,
    isSaving: PropTypes.bool,
    data: PropTypes.shape(),
    error: PropTypes.arrayOf(PropTypes.string),
  }),
  sourceInfo: PropTypes.shape({
    referrer: PropTypes.string,
  }),
  navigate: PropTypes.func.isRequired,
};

export default StafferPage;
