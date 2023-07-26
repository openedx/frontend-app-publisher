import React from 'react';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';

import AdditionalMetadataFields from './AdditionalMetadataFields';

const productStatusOptions = [
  { value: 'published', label: 'Published' },
  { value: 'Archived', label: 'Archived' },
];

const externalCourseMarketingTypeOptions = [
  { value: 'sprint', label: 'Sprint' },
  { value: 'short_course', label: 'Short Course' },
];

describe('AdditionalMetadata Fields', () => {
  it('Display all fields', () => {
    const component = shallow(<AdditionalMetadataFields
      productStatusOptions={productStatusOptions}
      externalCourseMarketingTypeOptions={externalCourseMarketingTypeOptions}
    />);
    expect(shallowToJson(component)).toMatchSnapshot();
  });

  it('Display required fields on the basis of external course marketing type', () => {
    const component = shallow(<AdditionalMetadataFields
      externalCourseMarketingType="sprint"
      productStatusOptions={productStatusOptions}
      externalCourseMarketingTypeOptions={externalCourseMarketingTypeOptions}
    />);
    expect(shallowToJson(component)).toMatchSnapshot();
  });
});
