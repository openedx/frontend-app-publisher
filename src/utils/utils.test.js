import * as utils from '.';


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

describe('getCourseError', () => {
  it('returns a string from a string', () => {
    const testError = 'Test error message';
    expect(utils.getErrorMessages(testError)).toEqual(['Test error message.']);
  });

  it('returns a string from a JS error', () => {
    const testError = new Error('Test error message');
    expect(utils.getErrorMessages(testError)).toEqual(['Test error message.']);
  });

  it('returns an array of strings from a DRF-like error ', () => {
    const testResponse = {
      response: {
        data: {
          key: 'value',
        },
        message: 'Response message',
      },
      message: 'Error message',
    };
    expect(utils.getErrorMessages(testResponse)).toEqual(['key: value.']);
  });

  it('returns a string from an error without data', () => {
    const testResponse = {
      response: {
        message: 'Response message',
      },
      message: 'Error message',
    };
    expect(utils.getErrorMessages(testResponse)).toEqual(['Response message.']);
  });

  it('returns the object if fields not found for an object', () => {
    const testResponse = {};
    expect(utils.getErrorMessages(testResponse)).toEqual([{}]);
  });

  it('returns an error message if type is not known', () => {
    const testResponse = 10; // Just a random integer
    expect(utils.getErrorMessages(testResponse)).toEqual(['Unknown error.']);
  });
});
