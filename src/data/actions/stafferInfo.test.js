import {
  stafferCreateFail,
  stafferCreateSuccess,
  createNewStaffer,
  editStafferInfoFail,
  editStafferInfoSuccess,
  editStafferInfo,
  requestStafferInfoFail,
  requestStafferInfoSuccess,
  requestStafferInfo,
} from './stafferInfo';
import * as types from '../constants/stafferInfo';

describe('stafferInfo create staffer actions', () => {
  it('should start new staffer creation', () => {
    const stafferData = { name: 'test staffer data' };
    const expectedAction = {
      type: types.CREATE_STAFFER,
      stafferData,
    };
    expect(createNewStaffer(stafferData)).toEqual(expectedAction);
  });

  it('should handle staffer creation success', () => {
    const data = { name: 'test staffer data' };
    const expectedAction = {
      type: types.CREATE_STAFFER_SUCCESS,
      data,
    };
    expect(stafferCreateSuccess(data)).toEqual(expectedAction);
  });

  it('should handle staffer creation failure', () => {
    const error = 'Test error';
    const expectedAction = {
      type: types.CREATE_STAFFER_FAIL,
      error,
    };
    expect(stafferCreateFail(error)).toEqual(expectedAction);
  });
});

describe('stafferInfo edit staffer actions', () => {
  it('should start staffer info edit', () => {
    const data = { name: 'test staffer data' };
    const expectedAction = {
      type: types.EDIT_STAFFER_INFO,
      data,
    };
    expect(editStafferInfo(data)).toEqual(expectedAction);
  });

  it('should handle staffer info edit success', () => {
    const data = { name: 'test staffer data' };
    const expectedAction = {
      type: types.EDIT_STAFFER_INFO_SUCCESS,
      data,
    };
    expect(editStafferInfoSuccess(data)).toEqual(expectedAction);
  });

  it('should handle staffer info edit failure', () => {
    const error = 'Test error';
    const expectedAction = {
      type: types.EDIT_STAFFER_INFO_FAIL,
      error,
    };
    expect(editStafferInfoFail(error)).toEqual(expectedAction);
  });
});

describe('stafferInfo request staffer info actions', () => {
  it('should start staffer info request', () => {
    const expectedAction = {
      type: types.REQUEST_STAFFER_INFO,
    };
    expect(requestStafferInfo()).toEqual(expectedAction);
  });

  it('should handle staffer info request success', () => {
    const data = { name: 'test staffer data' };
    const expectedAction = {
      type: types.REQUEST_STAFFER_INFO_SUCCESS,
      data,
    };
    expect(requestStafferInfoSuccess(data)).toEqual(expectedAction);
  });

  it('should handle staffer info request failure', () => {
    const error = 'Test error';
    const expectedAction = {
      type: types.REQUEST_STAFFER_INFO_FAIL,
      error,
    };
    expect(requestStafferInfoFail(error)).toEqual(expectedAction);
  });
});
