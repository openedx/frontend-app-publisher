import * as utils from '.';
import { COURSE_URL_SLUG_PATTERN, COURSE_URL_SLUG_PATTERN_NEW, COURSE_URL_SLUG_PATTERN_OLD } from '../data/constants';
import { DEFAULT_PRODUCT_SOURCE } from '../data/constants/productSourceOptions';

const initialRuns = [
  {
    key: 'key-1',
    expected_program_name: 'program-name',
    expected_program_type: 'program-type',
  },
  {
    key: 'key-2',
    expected_program_name: 'program-name',
    expected_program_type: 'program-type',
  },
];
const currentRuns = [
  {
    key: 'key-1',
    expected_program_name: 'program-name',
    expected_program_type: 'program-type',
  },
  {
    key: 'key-2',
    expected_program_name: 'program-name',
    expected_program_type: 'changed-type',
  },
];
const initialValues = {
  title: 'Example Course',
  course_runs: initialRuns,
};
const currentValues = {
  title: 'Example Course',
  course_runs: currentRuns,
};

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

describe('getCourseUrlSlugPattern', () => {
  it(
    'returns the new course url slug pattern when updatedSlugFlag is true and courseRunStatuses are in review',
    () => {
      const updatedSlugFlag = true;
      const courseRunStatuses = ['review_by_legal', 'review_by_internal'];
      expect(
        utils.getCourseUrlSlugPattern(updatedSlugFlag, courseRunStatuses, DEFAULT_PRODUCT_SOURCE),
      ).toEqual(COURSE_URL_SLUG_PATTERN_NEW);
    },
  );

  it(
    'returns the new course url slug pattern when updatedSlugFlag is true and courseRunStatuses are post review',
    () => {
      const updatedSlugFlag = true;
      const courseRunStatuses = ['published', 'reviewed'];
      expect(
        utils.getCourseUrlSlugPattern(updatedSlugFlag, courseRunStatuses, DEFAULT_PRODUCT_SOURCE),
      ).toEqual(COURSE_URL_SLUG_PATTERN_NEW);
    },
  );

  it(
    'returns the both old & new pattern when updatedSlugFlag is true and courseRunStatuses are not in review or post review',
    () => {
      const updatedSlugFlag = true;
      const courseRunStatuses = ['archived'];
      expect(
        utils.getCourseUrlSlugPattern(updatedSlugFlag, courseRunStatuses, DEFAULT_PRODUCT_SOURCE),
      ).toEqual(COURSE_URL_SLUG_PATTERN);
    },
  );

  it('returns the old course url slug pattern when updatedSlugFlag is false', () => {
    const updatedSlugFlag = false;
    const courseRunStatuses = ['archived'];
    expect(
      utils.getCourseUrlSlugPattern(updatedSlugFlag, courseRunStatuses, DEFAULT_PRODUCT_SOURCE),
    ).toEqual(COURSE_URL_SLUG_PATTERN_OLD);
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

describe('isNonExemptChanged', () => {
  it('returns true when a non exempt course field is changed', () => {
    const newCurrentValues = { ...currentValues, title: 'Changed Title' };
    expect(utils.isNonExemptChanged(initialValues, newCurrentValues)).toEqual(true);
  });

  it('returns false when no non exempt course fields are changed', () => {
    expect(utils.isNonExemptChanged(initialValues, currentValues)).toEqual(false);
  });

  it('returns true when an non exempt course run field is changed', () => {
    expect(utils.isNonExemptChanged(initialValues, currentValues, 'key-2')).toEqual(true);
  });

  it('returns false when no non exempt course run fields are changed', () => {
    expect(utils.isNonExemptChanged(initialValues, currentValues, 'key-1')).toEqual(false);
  });
});

describe('isPristine', () => {
  it('returns true for pristine course level fields', () => {
    expect(utils.isPristine(initialValues, currentValues)).toEqual(true);
  });

  it('returns false when course level fields are changed', () => {
    const newCurrentValues = { ...currentValues, title: 'Changed Title' };
    expect(utils.isPristine(initialValues, newCurrentValues)).toEqual(false);
  });

  it('returns true for pristine course run level fields', () => {
    expect(utils.isPristine(initialValues, currentValues, 'key-1')).toEqual(true);
  });

  it('returns false when course run level fields are changed', () => {
    expect(utils.isPristine(initialValues, currentValues, 'key-2')).toEqual(false);
  });
});
