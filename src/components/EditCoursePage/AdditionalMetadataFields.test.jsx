import React from 'react';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';

import AdditionalMetadataFields from './AdditionalMetadataFields';

describe('AdditionalMetadata Fields', () => {
  it('Display all fields', () => {
    const component = shallow(<AdditionalMetadataFields />);
    expect(shallowToJson(component)).toMatchSnapshot();
  });
});
