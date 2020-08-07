import React from 'react';
import { shallow } from 'enzyme';

import RemoveButton from '../RemoveButton';

import User from './User';

describe('User', () => {
  it('shows a remove button iff onRemove is set', () => {
    const baseArguments = {
      name: 'User',
      userId: 0,
    };

    const withoutCallback = shallow(<User
      {...baseArguments}
    />);
    expect(withoutCallback.find(RemoveButton)).toHaveLength(0);

    const withCallback = shallow(<User
      {...baseArguments}
      onRemove={jest.fn()}
    />);
    expect(withCallback.find(RemoveButton)).toHaveLength(1);
  });
});
