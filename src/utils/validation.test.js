import {
  requiredMessage,
  basicValidate,
  getFieldName,
  editCourseValidate,
} from './validation';
import { PUBLISHED, UNPUBLISHED } from '../data/constants';

describe('basicValidate', () => {
  it('returns a validation message for falsey values', () => {
    const falseyValues = [0, '', undefined, null];

    falseyValues.forEach((value) => {
      expect(basicValidate(value)).toEqual(requiredMessage);
    });
  });

  it('returns undefined for truthy values', () => {
    const truthyValues = [1, 'test', { key: 'key value' }];

    truthyValues.forEach((value) => {
      expect(basicValidate(value)).toEqual(undefined);
    });
  });
});

describe('getFieldName', () => {
  it('returns null if there are no errors', () => {
    expect(getFieldName(undefined)).toEqual(null);
  });

  it('returns the first field name in errors for simple fields', () => {
    const errors = {
      short_description: 'This field is required',
      full_description: 'This field is required',
    };
    expect(getFieldName(errors)).toEqual('short_description');
  });

  it('returns the first full field name in errors for field arrays, ignoring null errors', () => {
    const errors = {
      course_runs: [
        null,
        {
          transcript_languages: {
            _error: 'This field is required',
          },
          staff: 'This field is required',
        },
      ],
      full_description: 'This field is required',
    };
    expect(getFieldName(errors)).toEqual('course_runs[1].transcript_languages');
  });

  it('returns the first full field name in errors for deeply nested fields', () => {
    const errors = {
      course_runs: [
        null,
        {
          deep_property: [
            null,
            null,
            {
              deeper_property: [
                {
                  deepest_property: 'This field is required',
                },
              ],
            },
          ],
          transcript_languages: {
            _error: 'This field is required',
          },
          staff: 'This field is required',
        },
      ],
      full_description: 'This field is required',
    };

    expect(getFieldName(errors)).toEqual('course_runs[1].deep_property[2].deeper_property[0].deepest_property');
  });
});

describe('editCourseValidate', () => {
  const unpublishedTargetRun = {
    status: UNPUBLISHED,
    key: 'TestRun',
  };

  it('does not return errors if there is no target run', () => {
    const targetRun = null;
    expect(editCourseValidate({}, { targetRun })).toEqual({});
  });

  it('does not return errors if the target run is published', () => {
    const targetRun = {
      status: PUBLISHED,
      key: 'TestRun',
    };
    expect(editCourseValidate({}, { targetRun })).toEqual({});
  });

  it('returns errors for missing course level fields', () => {
    const values = {
      short_description: undefined,
      full_description: undefined,
      outcome: 'Outcome',
      course_runs: [],
      imageSrc: 'base64;encodedimage',
    };

    const expectedErrors = {
      short_description: requiredMessage,
      full_description: requiredMessage,
      course_runs: [],
    };
    expect(editCourseValidate(values, { targetRun: unpublishedTargetRun })).toEqual(expectedErrors);
  });

  it('returns error for missing image fields', () => {
    const values = {
      short_description: 'Short',
      full_description: 'Full',
      outcome: 'Outcome',
      imageSrc: null,
      course_runs: [
        {
          key: 'NonSubmittingTestRun',
        },
      ],
    };

    const expectedErrors = {
      imageSrc: requiredMessage,
      course_runs: [null],
    };
    expect(editCourseValidate(values, { targetRun: unpublishedTargetRun })).toEqual(expectedErrors);
  });

  it('does not return errors on course runs that are not the submitting run', () => {
    const values = {
      short_description: 'Short',
      full_description: 'Full',
      outcome: 'Outcome',
      imageSrc: 'base64;encodedimage',
      course_runs: [
        {
          key: 'NonSubmittingTestRun',
        },
      ],
    };
    expect(editCourseValidate(values, { targetRun: unpublishedTargetRun })).toEqual({});
  });

  it('returns errors on submitting course runs with missing transcript languages', () => {
    const values = {
      short_description: 'Short',
      full_description: 'Full',
      outcome: 'Outcome',
      imageSrc: 'base64;encodedimage',
      course_runs: [
        {
          key: 'NonSubmittingTestRun',
        },
        {
          key: 'TestRun',
          transcript_languages: [],
          staff: [
            {
              dummy_field: 'Staff dummy field',
            },
          ],
        },
      ],
    };

    const expectedErrors = {
      course_runs: [
        null,
        {
          transcript_languages: { _error: requiredMessage },
        },
      ],
    };
    expect(editCourseValidate(values, { targetRun: unpublishedTargetRun })).toEqual(expectedErrors);
  });

  it('returns errors on submitting course runs with missing staff', () => {
    const values = {
      short_description: 'Short',
      full_description: 'Full',
      outcome: 'Outcome',
      imageSrc: 'base64;encodedimage',
      course_runs: [
        {
          key: 'NonSubmittingTestRun',
        },
        {
          key: 'TestRun',
          transcript_languages: [
            {
              dummy_field: 'Transcript languages dummy field',
            },
          ],
          staff: [],
        },
      ],
    };

    const expectedErrors = {
      course_runs: [
        null,
        {
          staff: requiredMessage,
        },
      ],
    };
    expect(editCourseValidate(values, { targetRun: unpublishedTargetRun })).toEqual(expectedErrors);
  });
});
