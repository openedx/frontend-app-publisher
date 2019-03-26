import * as actions from '../actions/instructorInfo';

import instructorInfo from './instructorInfo';


describe('instructorInfo reducer', () => {
  let initalState;
  const instructorData = {
    profile_image: 'blue.png',
    given_name: 'Fake',
    family_name: 'Person',
    bio: 'Did stuff',
    position: {
      title: 'Professor',
      organization: 1,
      organization_override: null,
    },
    major_works: 'Major work',
    areas_of_expertise: {
      id: null,
      value: 'Arachnids',
    },
    urls_detailed: [
      {
        id: null,
        type: 'blog',
        title: 'Law Blog',
        url: 'www.example.com',
      },
    ],
  };

  beforeEach(() => {
    initalState = {
      data: {},
      isCreating: false,
      error: null,
    };
  });

  it('initial state is valid', () => {
    expect(instructorInfo(undefined, {})).toEqual({
      data: {},
      isCreating: false,
      error: null,
    });
  });

  it('instructor create request works', () => {
    expect(instructorInfo(initalState, actions.createNewInstructor(instructorData)))
      .toEqual({
        data: {},
        isCreating: true,
        error: null,
      });
  });

  it('instructor create receive works', () => {
    expect(instructorInfo(initalState, actions.instructorCreateSuccess(instructorData)))
      .toEqual({
        data: instructorData,
        isCreating: false,
        error: null,
      });
  });

  it('instructor create fail works', () => {
    expect(instructorInfo(initalState, actions.instructorCreateFail('failure')))
      .toEqual({
        data: {},
        isCreating: false,
        error: 'failure',
      });
  });
});
