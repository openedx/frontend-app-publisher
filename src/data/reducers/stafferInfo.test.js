import * as actions from '../actions/stafferInfo';

import stafferInfo from './stafferInfo';


describe('stafferInfo reducer', () => {
  let initalState;
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
    initalState = {
      data: {},
      isSaving: false,
      error: null,
      wasEditSuccessful: false,
    };
  });

  it('initial state is valid', () => {
    expect(stafferInfo(undefined, {})).toEqual({
      data: {},
      isSaving: false,
      isFetching: false,
      error: null,
      wasEditSuccessful: false,
    });
  });

  // Create
  it('staffer create request works', () => {
    expect(stafferInfo(initalState, actions.createNewStaffer(stafferData)))
      .toEqual({
        data: {},
        isSaving: true,
        error: null,
        wasEditSuccessful: false,
      });
  });

  it('staffer create receive works', () => {
    expect(stafferInfo(initalState, actions.stafferCreateSuccess(stafferData)))
      .toEqual({
        data: stafferData,
        isSaving: false,
        error: null,
        wasEditSuccessful: false,
      });
  });

  it('staffer create fail works', () => {
    expect(stafferInfo(initalState, actions.stafferCreateFail('failure')))
      .toEqual({
        data: {},
        isSaving: false,
        error: 'failure',
        wasEditSuccessful: false,
      });
  });

  // Request
  it('request staffer info works', () => {
    expect(stafferInfo(initalState, actions.requestStafferInfo()))
      .toEqual({
        data: {},
        isSaving: false,
        isFetching: true,
        error: null,
        wasEditSuccessful: false,
      });
  });

  it('request staffer info success works', () => {
    expect(stafferInfo(initalState, actions.requestStafferInfoSuccess(stafferData)))
      .toEqual({
        data: stafferData,
        isSaving: false,
        isFetching: false,
        error: null,
        wasEditSuccessful: false,
      });
  });

  it('request staffer info fail works', () => {
    expect(stafferInfo(initalState, actions.requestStafferInfoFail('failure')))
      .toEqual({
        data: {},
        isSaving: false,
        isFetching: false,
        error: 'failure',
        wasEditSuccessful: false,
      });
  });

  // Edit
  it('staffer edit works', () => {
    expect(stafferInfo(initalState, actions.editStafferInfo(stafferData)))
      .toEqual({
        data: {},
        isSaving: true,
        error: null,
        wasEditSuccessful: false,
      });
  });

  it('staffer edit success works', () => {
    expect(stafferInfo(initalState, actions.editStafferInfoSuccess(stafferData)))
      .toEqual({
        data: stafferData,
        isSaving: false,
        error: null,
        wasEditSuccessful: true,
      });
  });

  it('staffer edit fail works', () => {
    expect(stafferInfo(initalState, actions.editStafferInfoFail('failure')))
      .toEqual({
        data: {},
        isSaving: false,
        error: 'failure',
        wasEditSuccessful: false,
      });
  });

  it('staffer info finish works', () => {
    expect(stafferInfo(initalState, actions.editStafferInfoFinish()))
      .toEqual({
        data: {},
        isSaving: false,
        error: null,
        wasEditSuccessful: false,
      });
  });
});
