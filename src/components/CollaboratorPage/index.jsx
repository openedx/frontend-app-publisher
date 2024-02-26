import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { Alert } from '@edx/paragon';

import CollaboratorForm from './CollaboratorForm';
import PageContainer from '../PageContainer';

class CollaboratorPage extends React.Component {
  constructor(props) {
    super(props);
    this.handleCollaboratorCreate = this.handleCollaboratorCreate.bind(this);
    this.handleCollaboratorEdit = this.handleCollaboratorEdit.bind(this);
  }

  handleCollaboratorCreate(fieldValues) {
    const {
      createCollaborator,
      sourceInfo: { referrer },
      navigate,
    } = this.props;
    createCollaborator(fieldValues, navigate, referrer);
  }

  handleCollaboratorEdit(fieldValues) {
    const {
      editCollaborator,
      sourceInfo: { referrer },
      location: {
        state: {
          uuid,
        },
      },
      navigate,
    } = this.props;

    const collaboratorData = { ...fieldValues, uuid };
    if (!collaboratorData.image.startsWith('data:')) {
      // Only send image if a new one is being uploaded
      delete collaboratorData.image;
    }
    editCollaborator(collaboratorData, navigate, referrer);
  }

  render() {
    const {
      sourceInfo,
      location,
      collaboratorInfo,
    } = this.props;

    const isCreateForm = !this.props.editCollaborator;

    if (!isCreateForm && (!location.state || !location.state.uuid)) {
      return (
        <Alert
          id="error"
          variant="danger"
        >
          <Alert.Heading>Could not load page: </Alert.Heading>
          <p>Direct access to collaborators not supported</p>
        </Alert>
      );
    }

    const titleText = isCreateForm ? 'Create New Collaborator' : 'Edit Collaborator';
    const handleSubmit = (isCreateForm
      ? this.handleCollaboratorCreate
      : this.handleCollaboratorEdit);

    const { isSaving = false, error: collabError } = collaboratorInfo;

    const errorArray = [];

    if (collabError) {
      collabError.forEach((error, index) => {
        errorArray.push(error);
        if (index < collabError.length) {
          errorArray.push(<br />);
        }
      });
    }
    const { referrer } = sourceInfo;

    return (
      <>
        <Helmet>
          <title>{titleText}</title>
        </Helmet>
        <PageContainer>
          { referrer
          && (
            <Alert
              id="sent-from-edit-course-info"
              variant="info"
              dismissible
            >
              The data you entered on the course edit screen is saved. You will return to that page
              when you have finished updating collaborator information.
            </Alert>
          )}
          <div>
            <h2>{titleText}</h2>
            <hr />
            <CollaboratorForm
              id="create-collaborator-form"
              onSubmit={handleSubmit}
              isSaving={isSaving}
              isCreateForm={isCreateForm}
              initialValues={{
                name: (location && location.state) ? location.state.name : null,
                image: (location && location.state) ? location.state.imageUrl : null,
              }}
              {...this.props}
            />
            { errorArray.length > 0 && (
              <Alert
                id="create-collaborator-error"
                variant="danger"
              >
                {errorArray}
              </Alert>
            )}
          </div>
        </PageContainer>
      </>
    );
  }
}

CollaboratorPage.defaultProps = {
  createCollaborator: () => {},
  editCollaborator: null,
  collaboratorInfo: {
    isFetching: false,
    isSaving: false,
    error: [],
  },
  sourceInfo: {},
  location: {
    state: {
      name: null,
      url: null,
      uuid: null,
    },
  },
};

CollaboratorPage.propTypes = {
  createCollaborator: PropTypes.func,
  editCollaborator: PropTypes.func,
  collaboratorInfo: PropTypes.shape({
    isFetching: PropTypes.bool,
    isSaving: PropTypes.bool,
    data: PropTypes.shape(),
    error: PropTypes.arrayOf(PropTypes.string),
  }),
  sourceInfo: PropTypes.shape({
    referrer: PropTypes.string,
  }),
  location: PropTypes.shape({
    state: PropTypes.shape({
      name: PropTypes.string.isRequired,
      imageUrl: PropTypes.string.isRequired,
      uuid: PropTypes.string.isRequired,
    }),
  }),
  navigate: PropTypes.func.isRequired,
};

export default CollaboratorPage;
