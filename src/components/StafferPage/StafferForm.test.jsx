import React from 'react';
import { shallow } from 'enzyme';

import { extractOrgChoices, BaseStafferForm } from './StafferForm';


const stafferOptions = {
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

const stafferInfo = {
  data: {
    uuid: '14d7368b-51dc-42de-9952-0870bcd1f5f1',
    salutation: null,
    given_name: 'staff',
    family_name: 'er',
    bio: '<p><strong>b</strong>io<i>grapizing</i></p>',
    slug: 'staff-er',
    position: {
      title: 'señor',
      organization_name: '',
      organization_id: 1,
      organization_override: null,
      organization_marketing_url: null,
    },
    areas_of_expertise: [
      {
        id: 10,
        value: 'Experting',
      },
    ],
    profile_image: {
      medium: {
        height: 110,
        url: 'http://localhost:18381/media/media/people/profile_images/14d7368b-51dc-42de-9952-0870bcd1f5f1-1ffe0424ec10.medium.jpeg',
        width: 110,
      },
    },
    works: [],
    urls: {
      facebook: null,
      twitter: null,
      blog: null,
    },
    urls_detailed: [
      {
        title: 'Github',
        type: 'others',
        id: 10,
        url: 'https://github.com/edx',
        display_title: 'Github',
      },
    ],
    email: null,
    profile_image_url: 'http://localhost:18381/media/media/people/profile_images/14d7368b-51dc-42de-9952-0870bcd1f5f1-1ffe0424ec10.jpeg',
    major_works: '<p><em>Workings</em></p>',
    published: true,
  },
  error: null,
  isFetching: false,
  isSaving: false,
};

const noReferrerSourceInfo = {
  referrer: null,
};

const sourceInfo = {
  referrer: 'courses/00000000-0000-0000-0000-000000000000',
};

describe('StafferForm', () => {
  it('renders html correctly', () => {
    const component = shallow(<BaseStafferForm
      pristine
      submitting={false}
      isSaving={false}
      stafferOptions={stafferOptions}
      handleSubmit={() => {}}
      sourceInfo={noReferrerSourceInfo}
    />);
    expect(component).toMatchSnapshot();
  });

  it('renders html correctly when submitting', () => {
    const component = shallow(<BaseStafferForm
      pristine={false}
      submitting
      isSaving={false}
      stafferOptions={stafferOptions}
      handleSubmit={() => {}}
      sourceInfo={noReferrerSourceInfo}
    />);
    expect(component).toMatchSnapshot();
  });

  it('renders html correctly when creating', () => {
    const component = shallow(<BaseStafferForm
      pristine={false}
      submitting={false}
      isSaving
      stafferOptions={stafferOptions}
      handleSubmit={() => {}}
      sourceInfo={noReferrerSourceInfo}
    />);
    expect(component).toMatchSnapshot();
  });

  it('renders correctly with staffer info', () => {
    const component = shallow(<BaseStafferForm
      pristine
      submitting={false}
      isSaving={false}
      stafferOptions={stafferOptions}
      stafferInfo={stafferInfo}
      handleSubmit={() => {}}
      sourceInfo={noReferrerSourceInfo}
    />);
    expect(component).toMatchSnapshot();
  });

  it('renders correctly when sent from the edit course page', () => {
    const component = shallow(<BaseStafferForm
      pristine
      submitting={false}
      isSaving={false}
      stafferOptions={stafferOptions}
      handleSubmit={() => {}}
      sourceInfo={sourceInfo}
    />);
    expect(component).toMatchSnapshot();
  });
});

describe('extractOrgChoices', () => {
  it('extracts org choices from options', () => {
    const choices = extractOrgChoices(stafferOptions);
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
