import TOGGLE_DARK_MODE from '../constants/darkMode';


const initialState = {
  darkModeOn: false,
};

function darkMode(state = initialState, action) {
  switch (action.type) {
    case TOGGLE_DARK_MODE:
      return Object.assign({}, state, {
        darkModeOn: !state.darkModeOn,
      });
    default:
      return state;
  }
}

export default darkMode;
