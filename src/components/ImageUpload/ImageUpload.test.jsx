import React from 'react';
import { render, waitFor } from '@testing-library/react';

import ImageUpload from './index';

describe('ImageUpload', () => {
  it('shows an image upload with no prior image', () => {
    const { container } = render(<ImageUpload
      label="Course Image: *"
      id="image-no-prior"
      input={{
        name: 'imageSrc',
        value: null,
        onChange: () => null,
      }}
      meta={{
        error: null,
        pristine: true,
        submitFailed: false,
      }}
      maxImageSize={1000000}
      requiredWidth={1134}
      requiredHeight={675}
    />);
    waitFor(() => expect(container).toMatchSnapshot());
  });

  it('shows an image upload with prior image', () => {
    const { container } = render(<ImageUpload
      label={<strong>Course Image: *</strong>}
      id="image-with-prior"
      input={{
        name: 'imageSrc',
        value: 'http://www.image.uploaded.source/view/image',
        onChange: () => null,
      }}
      meta={{
        error: null,
        pristine: true,
        submitFailed: false,
      }}
      maxImageSize={256000}
      requiredHeight={110}
      requiredWidth={110}
    />);
    waitFor(() => expect(container).toMatchSnapshot());
  });

  it('shows an image upload and an error', () => {
    const { container } = render(<ImageUpload
      label="Image Error Test"
      id="image-with-error"
      input={{
        name: 'imageSrc',
        value: null,
        onChange: () => null,
      }}
      meta={{
        error: 'Required',
        pristine: false,
        submitFailed: true,
      }}
      maxImageSize={1000000}
      requiredWidth={1134}
      requiredHeight={675}
    />);
    waitFor(() => expect(container).toMatchSnapshot());
  });
});
