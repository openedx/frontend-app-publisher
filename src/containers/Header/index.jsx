import { connect } from 'react-redux';

import Header from '../../components/Header';


const mapStateToProps = state => ({
  username: state.authentication.username,
});

export default connect(mapStateToProps)(Header);
