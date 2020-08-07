import toggleDarkMode from './darkMode';
import TOGGLE_DARK_MODE from '../constants/darkMode';

describe('darkMode actions', () => {
  it('gives the expected action with the correct type', () => {
    const expectedAction = { type: TOGGLE_DARK_MODE };

    expect(toggleDarkMode()).toEqual(expectedAction);
  });
});
