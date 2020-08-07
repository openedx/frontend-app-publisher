import React from 'react';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';

import { Staffer } from './index';

const defaultProps = {
  onRemove: jest.fn(),
  item: {
    uuid: '2aba6189-ad7e-45a8-b269-bea071b80391',
    given_name: 'Dave',
    family_name: 'Grohl',
    profile_image_url: '/media/people/profile_images/2aba6189-ad7e-45a8-b269-bea071b80391-11df6812f839.png',
  },
  referrer: '/course/11111111-1111-1111-1111-111111111111',
};

describe('Staffer', () => {
  it('renders the staffer', () => {
    const component = shallow(<Staffer {...defaultProps} />);
    expect(shallowToJson(component)).toMatchSnapshot();
  });

  it('calls onRemove when the delete button is clicked', () => {
    const component = shallow(<Staffer {...defaultProps} />);
    component.find('.js-delete-btn').simulate('click');
    expect(defaultProps.onRemove).toHaveBeenCalled();
  });
});
