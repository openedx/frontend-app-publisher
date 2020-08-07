import SEND_FROM_EDIT_PAGE from '../constants/sourceInfo';

const initialState = {
  referrer: null,
  referringRun: null,
};

function sourceInfo(state = initialState, action) {
  switch (action.type) {
    case SEND_FROM_EDIT_PAGE:
      return {
        ...state,
        referrer: action.referrer,
        referringRun: action.referringRun,
      };
    default:
      return state;
  }
}

export default sourceInfo;
