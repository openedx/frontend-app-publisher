import * as utils from './utils';


describe('jsonDeepCopy', () => {
  it('returns a new object', () => {
    const original = { data: 'test data' };
    const newObject = utils.jsonDeepCopy(original);
    expect(original === newObject).toBe(false);
    expect(original.data).toEqual(newObject.data);
    newObject.data = 'updated data';
    expect(original.data).not.toEqual(newObject.data);
  });
});

describe('getCourseNumber', () => {
  it('correctly parses course key fragments', () => {
    const courseKeyFragment = 'edx+Test101x';
    const courseKeyFragmentOld = 'edx/Test101x';
    const expected = 'Test101x';
    expect(utils.getCourseNumber(courseKeyFragment)).toEqual(expected);
    expect(utils.getCourseNumber(courseKeyFragmentOld)).toEqual(expected);
  });
});

describe('getCourseEditFormId', () => {
  it('correctly returns an identifying string when given a uuid', () => {
    const uuid = '11111111-1111-1111-1111-111111111111';
    expect(utils.getCourseEditFormId(uuid)).toContain(uuid);
  });
});
