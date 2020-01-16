import { BROWSER_DEFAULT, UPDATE_FORM_LANGUAGE } from '../constants/formOptions';

const initialState = {
  language: {},
};

export function getLanguageforEditor(state, editorId) {
  return (state.formOptions.language[editorId] ?
    state.formOptions.language[editorId] : BROWSER_DEFAULT);
}

function formOptions(state = initialState, action) {
  const newLanguage = {};
  switch (action.type) {
    case UPDATE_FORM_LANGUAGE:
      newLanguage[action.editorId] = action.language;
      return Object.assign({}, state, {
        language: Object.assign(state.language, newLanguage),
      });
    default:
      return state;
  }
}

export default formOptions;
