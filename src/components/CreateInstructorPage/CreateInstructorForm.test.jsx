import React from 'react';
import { shallow } from 'enzyme';

import { extractOrgChoices, BaseCreateInstructorForm, basicValidate } from './CreateInstructorForm';


const instructorOptions = {
  data: {
    actions: {
      POST: {
        position: {
          children: {
            organization: {
              choices: [
                { display_name: 'edX', value: 1 },
                { display_name: 'bananasX', value: 2 },
              ],
            },
          },
        },
      },
    },
  },
};

describe('CreateInstructorForm', () => {
  it('renders html correctly', () => {
    const component = shallow(<BaseCreateInstructorForm
      pristine
      submitting={false}
      isCreating={false}
      instructorOptions={instructorOptions}
      handleSubmit={() => {}}
    />);
    expect(component).toMatchSnapshot();
  });

  it('renders html correctly when submitting', () => {
    const component = shallow(<BaseCreateInstructorForm
      pristine={false}
      submitting
      isCreating={false}
      instructorOptions={instructorOptions}
      handleSubmit={() => {}}
    />);
    expect(component).toMatchSnapshot();
  });

  it('renders html correctly when creating', () => {
    const component = shallow(<BaseCreateInstructorForm
      pristine={false}
      submitting={false}
      isCreating
      instructorOptions={instructorOptions}
      handleSubmit={() => {}}
    />);
    expect(component).toMatchSnapshot();
  });
});

describe('extractOrgChoices', () => {
  it('extracts org choices from options', () => {
    const choices = extractOrgChoices(instructorOptions);
    expect(choices).toEqual([
      { label: 'Select instructor organization', value: '' },
      { label: 'edX', value: 1 },
      { label: 'bananasX', value: 2 },
    ]);
  });

  it('extracts empty list of org choices from empty options', () => {
    const choices = extractOrgChoices({});
    expect(choices).toEqual([]);
  });

  it('extracts empty list of org choices from junk options', () => {
    const choices = extractOrgChoices({ junk: 'junk' });
    expect(choices).toEqual([]);
  });
});

describe('basicValidate', () => {
  it('returns a validation message for falsey values', () => {
    const falseyValues = [0, '', undefined, null];

    falseyValues.forEach((value) => {
      expect(basicValidate(value)).toEqual('This field is required');
    });
  });

  it('returns undefined for truthy values', () => {
    const truthyValues = [1, 'test', { key: 'key value' }];

    truthyValues.forEach((value) => {
      expect(basicValidate(value)).toEqual(undefined);
    });
  });
});
