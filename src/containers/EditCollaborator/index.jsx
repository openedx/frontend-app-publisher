import { connect } from 'react-redux';

import CollaboratorPage from '../../components/CollaboratorPage';

import { editCollaborator, cancelCollaboratorInfo } from '../../data/actions/collaboratorInfo';

const mapStateToProps = state => ({
  collaboratorInfo: state.collaboratorInfo,
  sourceInfo: state.sourceInfo,
});

const mergeProps = (stateProps, actionProps, ownProps) => ({
  ...ownProps,
  ...stateProps,
  editCollaborator: (collaboratorData, referrer = null) => actionProps.editCollaborator(collaboratorData, referrer),
  cancelStafferInfo: () => actionProps.cancelStafferInfo(),
});

const mapDispatchToProps = {
  editCollaborator,
  cancelCollaboratorInfo,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(CollaboratorPage);
