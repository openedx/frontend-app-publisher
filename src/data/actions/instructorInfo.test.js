import {
  instructorCreateFail,
  instructorCreateSuccess,
  createNewInstructor,
} from './instructorInfo';
import * as types from '../constants/instructorInfo';


// TODO: Add tests for createInstructor action
describe('instructorInfo create instructor actions', () => {
  it('should start new instructor creation', () => {
    const instructorData = { name: 'test instructor data' };
    const expectedAction = {
      type: types.CREATE_INSTRUCTOR,
      instructorData,
    };
    expect(createNewInstructor(instructorData)).toEqual(expectedAction);
  });

  it('should handle instructor creation success', () => {
    const data = { name: 'test instructor data' };
    const expectedAction = {
      type: types.CREATE_INSTRUCTOR_SUCCESS,
      data,
    };
    expect(instructorCreateSuccess(data)).toEqual(expectedAction);
  });

  it('should handle instructor creation failure', () => {
    const error = 'Test error';
    const expectedAction = {
      type: types.CREATE_INSTRUCTOR_FAIL,
      error,
    };
    expect(instructorCreateFail(error)).toEqual(expectedAction);
  });
});
