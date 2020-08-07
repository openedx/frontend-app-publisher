import * as actions from '../actions/stafferInfo';

import stafferInfo from './stafferInfo';

describe('stafferInfo reducer', () => {
  let initialState;
  const stafferData = {
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
    initialState = {
      data: {},
      isSaving: false,
      error: null,
      returnToEditCourse: false,
    };
  });

  it('initial state is valid', () => {
    expect(stafferInfo(undefined, {})).toEqual({
      data: {},
      isSaving: false,
      isFetching: false,
      error: null,
      returnToEditCourse: false,
    });
  });

  // Create
  it('staffer create request works', () => {
    expect(stafferInfo(initialState, actions.createNewStaffer(stafferData)))
      .toEqual({
        data: {},
        isSaving: true,
        error: null,
        returnToEditCourse: false,
      });
  });

  it('staffer create receive works', () => {
    expect(stafferInfo(initialState, actions.stafferCreateSuccess(stafferData)))
      .toEqual({
        data: stafferData,
        isSaving: false,
        error: null,
        returnToEditCourse: true,
      });
  });

  it('staffer create fail works', () => {
    expect(stafferInfo(initialState, actions.stafferCreateFail('failure')))
      .toEqual({
        data: {},
        isSaving: false,
        error: 'failure',
        returnToEditCourse: false,
      });
  });

  // Request
  it('request staffer info works', () => {
    expect(stafferInfo(initialState, actions.requestStafferInfo()))
      .toEqual({
        data: {},
        isSaving: false,
        isFetching: true,
        error: null,
        returnToEditCourse: false,
      });
  });

  it('request staffer info success works', () => {
    expect(stafferInfo(initialState, actions.requestStafferInfoSuccess(stafferData)))
      .toEqual({
        data: stafferData,
        isSaving: false,
        isFetching: false,
        error: null,
        returnToEditCourse: false,
      });
  });

  it('request staffer info fail works', () => {
    expect(stafferInfo(initialState, actions.requestStafferInfoFail('failure')))
      .toEqual({
        data: {},
        isSaving: false,
        isFetching: false,
        error: 'failure',
        returnToEditCourse: false,
      });
  });

  // Edit
  it('staffer edit works', () => {
    expect(stafferInfo(initialState, actions.editStafferInfo(stafferData)))
      .toEqual({
        data: {},
        isSaving: true,
        error: null,
        returnToEditCourse: false,
      });
  });

  it('staffer edit success works', () => {
    expect(stafferInfo(initialState, actions.editStafferInfoSuccess(stafferData)))
      .toEqual({
        data: stafferData,
        isSaving: false,
        error: null,
        returnToEditCourse: true,
      });
  });

  it('staffer edit fail works', () => {
    expect(stafferInfo(initialState, actions.editStafferInfoFail('failure')))
      .toEqual({
        data: {},
        isSaving: false,
        error: 'failure',
        returnToEditCourse: false,
      });
  });

  // Reset
  it('staffer reset works', () => {
    expect(stafferInfo(initialState, actions.resetStafferInfo()))
      .toEqual({
        data: {},
        isSaving: false,
        isFetching: false,
        error: null,
        returnToEditCourse: false,
      });
  });

  // Cancel
  it('cancel edit works', () => {
    expect(stafferInfo(initialState, actions.cancelStafferInfo()))
      .toEqual({
        data: {},
        isSaving: false,
        error: null,
        returnToEditCourse: true,
      });
  });
});
