import React from 'react';
import { shallow } from 'enzyme';

import ImageUpload from './index';


describe('ImageUpload', () => {
  it('shows an image upload with no prior image', () => {
    const component = shallow(<ImageUpload
      label="Course Image: *"
      id="image-no-prior"
      input={{
        value: null,
        onChange: () => null,
      }}
    />);
    expect(component).toMatchSnapshot();
  });

  it('shows an image upload with prior image', () => {
    const component = shallow(<ImageUpload
      label={<strong>Course Image: *</strong>}
      id="image-with-prior"
      input={{
        value: 'http://www.image.uploaded.source/view/image',
        onChange: () => null,
      }}
    />);
    expect(component).toMatchSnapshot();
  });
});
