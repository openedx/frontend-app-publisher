import React from 'react';
import { shallow } from 'enzyme';

import RemoveButton from './index';


const mockOnRemove = jest.fn(targetFieldNumber => targetFieldNumber);

const defaultProps = {
  label: 'Test Label',
  onRemove: mockOnRemove,
  targetFieldNumber: 0,
};

describe('RemoveButton', () => {
  it('renders correctly', () => {
    const component = shallow(<RemoveButton {...defaultProps} />);
    expect(component).toMatchSnapshot();
  });

  it('calls the `onRemove` function with the target field number when the button is clicked', () => {
    const component = shallow(<RemoveButton {...defaultProps} />);

    component.find('button').simulate('click');
    expect(mockOnRemove).toBeCalledWith(defaultProps.targetFieldNumber);
  });
});
