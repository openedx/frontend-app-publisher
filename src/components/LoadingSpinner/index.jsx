import React from 'react';
import { Icon } from '@edx/paragon';

const LoadingSpinner = () => (
  <div className="mx-auto text-center">
    <Icon
      id="spinner"
      className={['fa', 'fa-circle-o-notch', 'fa-spin', 'fa-3x', 'fa-fw']}
    />
  </div>
);

export default LoadingSpinner;
