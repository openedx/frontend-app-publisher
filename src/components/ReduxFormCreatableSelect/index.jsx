import React from 'react';
import PropTypes from 'prop-types';
import AsyncCreatableSelect from 'react-select/async-creatable';
import CreatableSelect from 'react-select/creatable';

import { Alert } from '@edx/paragon';

const ReduxFormCreatableSelect = props => {
  const {
    input: {
      name, onChange, onBlur, value,
    },
    meta: {
      touched, error,
    },
    defaultOptions, loadOptions, label, isMulti, isAsync,
    createOptionValidator, disabled, isSearchable, options, formatCreateLabel,
    placeholder,
  } = props;

  const selectProps = {
    isMulti,
    isValidNewOption: createOptionValidator,
    isSearchable,
    value,
    isDisabled: disabled,
    placeholder,
    formatCreateLabel,
    onChange: val => onChange(val),
    onBlur: () => onBlur(value),

  };

  return (
    <div className="mb-3" name={name}>
      <div className="mb-2.5">
        {label}
      </div>
      {touched && error
            && (
            <Alert variant="danger" className="mb-2.5">{error}</Alert>
            )}
      {isAsync
        ? (
          <AsyncCreatableSelect
            className="select-container"
            classNamePrefix="react-select-async"
            defaultOptions={defaultOptions}
            isValidNewOption={createOptionValidator}
            cacheOptions
            loadOptions={loadOptions}
            {...selectProps}
          />
        )
        : (
          <CreatableSelect
            className="select-container"
            classNamePrefix={`${touched && error ? 'danger' : ''} react-select`}
            placeholder={placeholder}
            components={{
              IndicatorSeparator: () => null,
            }}
            options={options}
            onChange={val => onChange(val)}
            onBlur={() => onBlur(value)}
            {...selectProps}
          />
        )}
    </div>
  );
};

ReduxFormCreatableSelect.defaultProps = {
  disabled: false,
  loadOptions: () => null,
  isMulti: false,
  isAsync: false,
  isSearchable: true,
  formatCreateLabel: label => label,
  placeholder: '',
  defaultOptions: [],
  createOptionValidator: (inputValue, selectValue, options) => {
    if (inputValue) { return ![...options].some(x => x.label?.toLowerCase() === inputValue.toLowerCase()); }
    return false;
  },

};

ReduxFormCreatableSelect.propTypes = {
  input: PropTypes.shape({
    onBlur: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    name: PropTypes.string,
  }).isRequired,
  meta: PropTypes.shape({
    touched: PropTypes.bool,
    error: PropTypes.bool,
  }).isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  defaultOptions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  })),
  options: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  })).isRequired,

  formatCreateLabel: PropTypes.func,
  createOptionValidator: PropTypes.func,
  disabled: PropTypes.bool,
  loadOptions: PropTypes.func,
  isMulti: PropTypes.bool,
  isAsync: PropTypes.bool,
  isSearchable: PropTypes.bool,
  placeholder: PropTypes.string,

};

export default ReduxFormCreatableSelect;
