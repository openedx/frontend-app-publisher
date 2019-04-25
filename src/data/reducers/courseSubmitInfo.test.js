import courseSubmitInfoReducer from './courseSubmitInfo';
import courseSubmitInfo from '../actions/courseSubmitInfo';


describe('courseSubmitInfo reducer', () => {
  let initalState;

  beforeEach(() => {
    initalState = {
      targetRun: null,
    };
  });

  it('initial state is valid', () => {
    expect(courseSubmitInfoReducer(undefined, {})).toEqual({ targetRun: null });
  });

  it('courseSubmitInfo action works', () => {
    const targetRun = {
      key: 'edX101+DemoX',
    };

    expect(courseSubmitInfoReducer(initalState, courseSubmitInfo(targetRun)))
      .toEqual({ targetRun });
  });
});
