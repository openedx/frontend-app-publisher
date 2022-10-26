import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import RenderInputTextField from '../RenderInputTextField';
import FieldLabel from '../FieldLabel';

const PriceList = ({
  disabled,
  extraInput,
  priceLabels,
  required,
}) => (
  <>
    {Object.keys(priceLabels).map(seatType => (
      <Field
        key={seatType}
        name={`prices.${seatType}`}
        component={RenderInputTextField}
        extraInput={{
          min: 1.00,
          step: 0.01,
          max: 10000.00,
          ...extraInput,
        }}
        type="number"
        label={(
          <FieldLabel
            text={`${priceLabels[seatType]} Price (USD)`}
            required
          />
)}
        disabled={disabled}
        required={required}
      />
    ))}
  </>
);

PriceList.propTypes = {
  disabled: PropTypes.bool,
  extraInput: PropTypes.shape(),
  priceLabels: PropTypes.shape(),
  required: PropTypes.bool,
};

PriceList.defaultProps = {
  disabled: false,
  extraInput: {},
  priceLabels: {},
  required: false,
};

export default PriceList;
