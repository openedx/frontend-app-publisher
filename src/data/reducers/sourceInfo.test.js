import sourceInfo from './sourceInfo';
import sourceInfoAction from '../actions/sourceInfo';

describe('sourceInfo reducer', () => {
  let initalState;

  beforeEach(() => {
    initalState = {
      referrer: null,
      referringRun: null,
    };
  });

  it('initial state is valid', () => {
    expect(sourceInfo(undefined, {})).toEqual({ referrer: null, referringRun: null });
  });

  it('from edit course action works', () => {
    const courseUuid = '00000000-0000-0000-0000-000000000000';
    const referrer = `courses/${courseUuid}/edit`;
    const referringRun = 'DemoX+TestCourse';

    expect(sourceInfo(initalState, sourceInfoAction(referrer, referringRun)))
      .toEqual({ referrer, referringRun });
  });
});
