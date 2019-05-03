import {
  requiredMessage,
  basicValidate,
  getFieldName,
} from './validation';

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
