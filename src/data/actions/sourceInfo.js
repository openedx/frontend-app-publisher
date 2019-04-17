import SEND_FROM_EDIT_PAGE from '../constants/sourceInfo';

export default function sourceInfo(referrer, referringRun = null) {
  return { type: SEND_FROM_EDIT_PAGE, referrer, referringRun };
}
