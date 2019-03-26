import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

import { CreateInstructorForm } from './CreateInstructorForm';
import StatusAlert from '../StatusAlert';
import LoadingSpinner from '../LoadingSpinner';

class CreateInstructorPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startedFetching: false,
    };
    this.handleInstructorCreate = this.handleInstructorCreate.bind(this);
    this.setStartedFetching = this.setStartedFetching.bind(this);
  }

  componentDidMount() {
    this.props.fetchInstructorOptions();
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
        id: null,
      })
    ));
  }

  prepareAreasOfExpertise(areasOfExpertise) {
    if (!areasOfExpertise) {
      return [];
    }

    return areasOfExpertise.map(area => ({ id: null, value: area.value }));
  }

  preparePosition(title, organization) {
    return {
      title,
      organization,
      organization_override: null,
    };
  }

  handleInstructorCreate(fieldValues) {
    const instructorData = {
      profile_image: fieldValues.image,
      given_name: fieldValues.firstName,
      family_name: fieldValues.lastName,
      bio: fieldValues.bio,
      major_works: fieldValues.majorWorks,
      areas_of_expertise: this.prepareAreasOfExpertise(fieldValues.areasOfExpertise),
      urls_detailed: this.prepareSocialLinks(fieldValues.socialLinks),
      position: this.preparePosition(fieldValues.title, fieldValues.organization),
    };

    this.props.createInstructor(instructorData);
  }

  render() {
    const {
      instructorOptions,
      instructorInfo,
    } = this.props;

    if (!instructorOptions || !instructorInfo) {
      return (
        <StatusAlert
          id="error"
          alertType="danger"
          title="Create Instructor Form failed to load: "
          message="Instructor options information unavailable."
        />
      );
    }

    const { startedFetching } = this.state;
    const { isFetching } = instructorOptions;
    const showSpinner = !startedFetching || isFetching;
    const showForm = startedFetching && !isFetching;

    const { isCreating } = instructorInfo;

    let error = '';
    if (instructorInfo.error) {
      error = error.concat(instructorInfo.error, ' ');
    }
    if (instructorOptions.error) {
      error = error.concat(instructorOptions.error);
    }
    error = error.trim();

    return (
      <React.Fragment>
        <Helmet>
          <title>Create a New Instructor</title>
        </Helmet>
        <div className="container-fluid">
          <div className="row justify-content-md-center my-3 ">
            <div className="col-6">
              { showSpinner && <LoadingSpinner /> }
              { showForm && (
                <div>
                  <h2>Create New Instructor</h2>
                  <hr />
                  <h3>Instructor Information</h3>
                  <div className="col">
                    <CreateInstructorForm
                      id="create-instructor-form"
                      onSubmit={this.handleInstructorCreate}
                      instructorOptions={instructorOptions}
                      isCreating={isCreating}
                    />
                    { isCreating && <LoadingSpinner message="Creating Instructor" /> }
                    { error && (
                      <StatusAlert
                        id="create-instructor-error"
                        alertType="danger"
                        title="Instructor creation received an error: "
                        message={error}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

CreateInstructorPage.defaultProps = {
  createInstructor: () => {},
  fetchInstructorOptions: () => null,
  instructorOptions: null,
  instructorInfo: null,
};

CreateInstructorPage.propTypes = {
  createInstructor: PropTypes.func,
  fetchInstructorOptions: PropTypes.func,
  instructorOptions: PropTypes.shape({
    data: PropTypes.shape(),
    error: PropTypes.string,
    isFetching: PropTypes.bool,
  }),
  instructorInfo: PropTypes.shape({
    isCreating: PropTypes.bool,
    error: PropTypes.string,
  }),
};

export default CreateInstructorPage;
