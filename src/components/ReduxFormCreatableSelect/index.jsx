import React from 'react';
import PropTypes from 'prop-types';
import AsyncCreatableSelect from 'react-select/async-creatable';

import DiscoveryDataApiService from '../../data/services/DiscoveryDataApiService';

const ReduxFormCreatableSelect = props => {
  const {
    input, defaultOptions, currentValue, setValue,
  } = props;

  const loadOptions = (inputValue, callback) => DiscoveryDataApiService.fetchCourseTags(inputValue)
    .then((response) => {
      callback(response.data.map(tag => (
        {
          label: tag.value,
          value: tag.value,
        }
      )));
    })
    .catch(() => {
      callback(null);
    });

  return (

    <>
      {props.label}
      <AsyncCreatableSelect
        isMulti
        onChange={value => {
          input.onChange(value);
          setValue(value ? value.map(v => v.label) : []);
        }}
        onBlur={() => input.onBlur(input.value)}
        defaultOptions={defaultOptions}
        isValidNewOption={props.createOptionValidator}
        cacheOptions
        isSearchable
        styles={{
          menu: styles => ({ ...styles, zIndex: 5 }),
          control: styles => ({ ...styles, marginTop: '8px' }),
        }}
        value={currentValue}
        loadOptions={loadOptions}
        isDisabled={props.disabled}
      />
    </>
  );
};

ReduxFormCreatableSelect.defaultProps = {
  disabled: false,
};

ReduxFormCreatableSelect.propTypes = {
  input: PropTypes.shape({
    onBlur: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  }).isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  defaultOptions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  }).isRequired).isRequired,
  currentValue: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  }).isRequired).isRequired,
  setValue: PropTypes.func.isRequired,
  createOptionValidator: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default ReduxFormCreatableSelect;
