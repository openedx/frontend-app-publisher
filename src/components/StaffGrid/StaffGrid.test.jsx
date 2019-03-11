import React from 'react';
import { shallow } from 'enzyme';

import StaffGrid from './index';

const staff = [
  {
    uuid: '6f23f2f8-10dd-454a-8497-2ba972c980c4',
    given_name: 'First',
    family_name: 'Last',
    profile_image_url: '/media/people/profile_images/6f23f2f8-10dd-454a-8497-2ba972c980c4-a411afec9477.jpeg',
  },
  {
    uuid: '17d0e2c0-9a02-421b-93bf-d081339090cc',
    given_name: 'Pippa',
    family_name: null,
    profile_image_url: '/media/people/profile_images/17d0e2c0-9a02-421b-93bf-d081339090cc-68912d27b6e7.jpeg',
  },
  {
    uuid: '2aba6189-ad7e-45a8-b269-bea071b80391',
    given_name: 'Dave',
    family_name: 'Grohl',
    profile_image_url: '/media/people/profile_images/2aba6189-ad7e-45a8-b269-bea071b80391-11df6812f839.png',
  },
];

describe('StaffGrid', () => {
  it('renders a grid of the staff', () => {
    const component = shallow(<StaffGrid staff={staff} />);
    expect(component).toMatchSnapshot();
  });
});
