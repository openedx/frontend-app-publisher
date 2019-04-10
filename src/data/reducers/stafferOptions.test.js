import * as actions from '../actions/stafferOptions';

import stafferOptions from './stafferOptions';


describe('staffer options reducer', () => {
  const oldState = { // overwritten as old state for actions
    data: { nope: 'bad data' },
    isFetching: true,
    error: 'error occurred',
  };

  const stafferData = {
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
    expect(stafferOptions(undefined, {})).toEqual({
      data: {},
      isFetching: false,
      error: null,
    });
  });

  it('staffer options request works', () => {
    expect(stafferOptions(oldState, actions.requestStafferOptions()))
      .toEqual({
        data: {},
        isFetching: true,
        error: null,
      });
  });

  it('staffer options receive works', () => {
    expect(stafferOptions(oldState, actions.requestStafferOptionsSuccess(stafferData)))
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

  it('staffer options fail works', () => {
    expect(stafferOptions(oldState, actions.requestStafferOptionsFail('failure')))
      .toEqual({
        data: {},
        isFetching: false,
        error: 'failure',
      });
  });
});
