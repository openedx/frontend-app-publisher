import darkMode from './darkMode';
import toggleDarkMode from '../actions/darkMode';

describe('darkMode reducer', () => {
  let initalState;

  beforeEach(() => {
    initalState = {
      darkModeOn: false,
    };
  });

  it('initial state is valid', () => {
    expect(darkMode(undefined, {})).toEqual({ darkModeOn: false });
  });

  it('toggle dark mode action works from initial state', () => {
    expect(darkMode(initalState, toggleDarkMode())).toEqual({ darkModeOn: true });
  });

  it('toggle dark mode action works from on state', () => {
    const onState = {
      darkModeOn: true,
    };

    expect(darkMode(onState, toggleDarkMode())).toEqual({ darkModeOn: false });
  });
});
