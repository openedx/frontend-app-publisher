import { connect } from 'react-redux';

import Header from '../../components/Header';
import toggleDarkMode from '../../data/actions/darkMode';

const mapStateToProps = state => ({
  darkModeOn: state.darkMode.darkModeOn,
});

const mapDispatchToProps = {
  toggleDarkMode,
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
