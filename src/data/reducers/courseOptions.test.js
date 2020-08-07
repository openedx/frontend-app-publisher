import * as actions from '../actions/courseOptions';

import courseOptions from './courseOptions';

describe('courseOptions reducer', () => {
  const oldState = { // overwritten as old state for actions
    data: { nope: 'bad data' },
    isFetching: true,
    error: 'error occurred',
  };

  const courseData = {
    actions: {
      POST: {
        level_type: {
          choices: [
            { display_name: 'Beginner', value: 'beginner' },
            { display_name: 'Intermediate', value: 'intermediate' },
            { display_name: 'Advanced', value: 'advanced' },
          ],
        },
        subjects: {
          child: {
            choices: [
              { display_name: 'Business', value: 'business' },
              { display_name: 'Chemistry', value: 'chemistry' },
              { display_name: 'English', value: 'english' },
              { display_name: 'Security', value: 'security' },
            ],
          },
        },
      },
    },
  };

  it('initial state is valid', () => {
    expect(courseOptions(undefined, {})).toEqual({
      data: {},
      isFetching: false,
      error: null,
    });
  });

  it('course options request works', () => {
    expect(courseOptions(oldState, actions.requestCourseOptions()))
      .toEqual({
        data: {},
        isFetching: true,
        error: null,
      });
  });

  it('course options receive works', () => {
    expect(courseOptions(oldState, actions.requestCourseOptionsSuccess(courseData)))
      .toEqual({
        data: {
          actions: {
            POST: {
              level_type: {
                choices: [
                  { display_name: 'Beginner', value: 'beginner' },
                  { display_name: 'Intermediate', value: 'intermediate' },
                  { display_name: 'Advanced', value: 'advanced' },
                ],
              },
              subjects: {
                child: {
                  choices: [
                    { display_name: 'Business', value: 'business' },
                    { display_name: 'Chemistry', value: 'chemistry' },
                    { display_name: 'English', value: 'english' },
                    { display_name: 'Security', value: 'security' },
                  ],
                },
              },
            },
          },
        },
        isFetching: false,
        error: null,
      });
  });

  it('course options fail works', () => {
    expect(courseOptions(oldState, actions.requestCourseOptionsFail('failure')))
      .toEqual({
        data: {},
        isFetching: false,
        error: 'failure',
      });
  });
});
