import { UPDATE_FORM_LANGUAGE } from '../constants/formOptions';

export default function updateFormLanguage(language, editorId) {
  return { type: UPDATE_FORM_LANGUAGE, language, editorId };
}
