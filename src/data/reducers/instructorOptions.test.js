import * as actions from '../actions/instructorOptions';

import instructorOptions from './instructorOptions';


describe('instructor options reducer', () => {
  const oldState = { // overwritten as old state for actions
    data: { nope: 'bad data' },
    isFetching: true,
    error: 'error occurred',
  };

  const instructorData = {
    actions: {
      POST: {
        position: {
          children: {
            organization: {
              choices: [
                { display_name: 'edX', value: 1 },
                { display_name: 'bananasX', value: 2 },
              ],
            },
          },
        },
      },
    },
  };

  it('initial state is valid', () => {
    expect(instructorOptions(undefined, {})).toEqual({
      data: {},
      isFetching: false,
      error: null,
    });
  });

  it('instructor options request works', () => {
    expect(instructorOptions(oldState, actions.requestInstructorOptions()))
      .toEqual({
        data: {},
        isFetching: true,
        error: null,
      });
  });

  it('instructor options receive works', () => {
    expect(instructorOptions(oldState, actions.requestInstructorOptionsSuccess(instructorData)))
      .toEqual({
        data: {
          actions: {
            POST: {
              position: {
                children: {
                  organization: {
                    choices: [
                      { display_name: 'edX', value: 1 },
                      { display_name: 'bananasX', value: 2 },
                    ],
                  },
                },
              },
            },
          },
        },
        isFetching: false,
        error: null,
      });
  });

  it('instructor options fail works', () => {
    expect(instructorOptions(oldState, actions.requestInstructorOptionsFail('failure')))
      .toEqual({
        data: {},
        isFetching: false,
        error: 'failure',
      });
  });
});
