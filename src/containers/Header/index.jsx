import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import Header from '../../components/Header';
import toggleDarkMode from '../../data/actions/darkMode';


const mapStateToProps = state => ({
  username: state.authentication.username,
  darkModeOn: state.darkMode.darkModeOn,
});

const mapDispatchToProps = {
  toggleDarkMode,
};

const HeaderContainer = connect(mapStateToProps, mapDispatchToProps)(Header);
export default withRouter(HeaderContainer);
