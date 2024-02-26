import { connect } from 'react-redux';

import CollaboratorPage from '../../components/CollaboratorPage';
import { createCollaborator, resetCollaboratorInfo, cancelCollaboratorInfo } from '../../data/actions/collaboratorInfo';
import { withLocation, withNavigate } from '../../utils/hoc';

const mapStateToProps = state => ({
  newItemInfo: state.collaboratorInfo,
  sourceInfo: state.sourceInfo,
});

const mapDispatchToProps = {
  fetchCollaboratorInfo: resetCollaboratorInfo,
  createCollaborator,
  cancelCollaboratorInfo,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withLocation(withNavigate(CollaboratorPage)));
