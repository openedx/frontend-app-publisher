import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

import CollaboratorForm from './CollaboratorForm';
import StatusAlert from '../StatusAlert';
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
    } = this.props;
    createCollaborator(fieldValues, referrer);
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
    } = this.props;

    const collaboratorData = { ...fieldValues, uuid };
    if (!collaboratorData.image.startsWith('data:')) {
      // Only send image if a new one is being uploaded
      delete collaboratorData.image;
    }
    editCollaborator(collaboratorData, referrer);
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
        <StatusAlert
          id="error"
          alertType="danger"
          title="Could not load page: "
          message="Direct access to collaborators not supported"
        />
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
            <StatusAlert
              id="sent-from-edit-course-info"
              alertType="info"
              message="The data you entered on the course edit screen is saved. You will return to that page when you have finished updating collaborator information."
              dismissible
            />
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
              <StatusAlert
                id="create-collaborator-error"
                alertType="danger"
                message={errorArray}
              />
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
};

export default CollaboratorPage;
