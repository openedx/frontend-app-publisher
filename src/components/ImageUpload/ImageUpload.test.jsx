import React from 'react';
import { shallow } from 'enzyme';

import ImageUpload from './index';


describe('ImageUpload', () => {
  it('shows an image upload with no prior image', () => {
    const component = shallow(<ImageUpload
      label="Course Image: *"
      id="image-no-prior"
      input={{
        name: 'imageSrc',
        value: null,
        onChange: () => null,
      }}
      meta={{
        error: null,
        submitFailed: false,
      }}
    />);
    expect(component).toMatchSnapshot();
  });

  it('shows an image upload with prior image', () => {
    const component = shallow(<ImageUpload
      label={<strong>Course Image: *</strong>}
      id="image-with-prior"
      input={{
        name: 'imageSrc',
        value: 'http://www.image.uploaded.source/view/image',
        onChange: () => null,
      }}
      meta={{
        error: null,
        submitFailed: false,
      }}
    />);
    expect(component).toMatchSnapshot();
  });

  it('shows an image upload and an error', () => {
    const component = shallow(<ImageUpload
      label="Image Error Test"
      id="image-with-error"
      input={{
        name: 'imageSrc',
        value: null,
        onChange: () => null,
      }}
      meta={{
        error: 'Required',
        submitFailed: true,
      }}
    />);
    expect(component).toMatchSnapshot();
  });
});
