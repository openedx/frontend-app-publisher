import React from 'react';
import { shallow } from 'enzyme';

import { Staffer } from './index';


const defaultProps = {
  onRemove: () => {},
  staffer: {
    uuid: '2aba6189-ad7e-45a8-b269-bea071b80391',
    given_name: 'Dave',
    family_name: 'Grohl',
    profile_image_url: '/media/people/profile_images/2aba6189-ad7e-45a8-b269-bea071b80391-11df6812f839.png',
  },
};

describe('Staffer', () => {
  it('renders the staffer', () => {
    const component = shallow(<Staffer {...defaultProps} />);
    expect(component).toMatchSnapshot();
  });
});
