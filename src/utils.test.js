import * as utils from './utils';


describe('utils tests', () => {
  it('jsonDeepCopy returns a new object', () => {
    const original = { data: 'test data' };
    const newObject = utils.jsonDeepCopy(original);
    expect(original === newObject).toBe(false);
    expect(original.data).toEqual(newObject.data);
    newObject.data = 'updated data';
    expect(original.data).not.toEqual(newObject.data);
  });

  it('getCourseNumber correctly parses course key fragments', () => {
    const courseKeyFragment = 'edx+Test101x';
    const courseKeyFragmentOld = 'edx/Test101x';
    const expected = 'Test101x';
    expect(utils.getCourseNumber(courseKeyFragment)).toEqual(expected);
    expect(utils.getCourseNumber(courseKeyFragmentOld)).toEqual(expected);
  });
});
