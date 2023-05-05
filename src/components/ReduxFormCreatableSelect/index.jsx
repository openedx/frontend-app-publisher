import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
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
    defaultOptions, loadOptions, label, isCreatable, isMulti, isAsync,
    createOptionValidator, disabled, isSearchable, options, formatCreateLabel,
    placeholder,
  } = props;

  const creatableOnlyProps = {
    isMulti,
    isValidNewOption: createOptionValidator,
    formatCreateLabel,
  };

  const commonProps = {
    isSearchable,
    value,
    isDisabled: disabled,
    placeholder,
    onChange: val => onChange(val),
    onBlur: () => onBlur(value),
  };

  const FormCreatableSelect = isAsync
    ? (
      <AsyncCreatableSelect
        className="select-container"
        classNamePrefix="react-select-async"
        defaultOptions={defaultOptions}
        isValidNewOption={createOptionValidator}
        cacheOptions
        loadOptions={loadOptions}
        {...commonProps}
        {...creatableOnlyProps}
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
        {...commonProps}
        {...creatableOnlyProps}
      />
    );

  const FormSimpleSelect = (
    <Select
      className="select-container"
      classNamePrefix={`${touched && error ? 'danger' : ''} react-select`}
      placeholder={placeholder}
      components={{
        IndicatorSeparator: () => null,
      }}
      options={options}
      {...commonProps}
    />
  );

  return (
    <div className="mb-3 mr-2" name={name}>
      <div className="mb-2.5">
        {label}
      </div>
      {touched && error
            && (
            <Alert variant="danger" className="mb-2.5">{error}</Alert>
            )}
      {/* if isCreatable prop is set, render a creatable select else render a simple one */}
      {isCreatable
        ? FormCreatableSelect
        : FormSimpleSelect}
    </div>
  );
};

ReduxFormCreatableSelect.defaultProps = {
  disabled: false,
  loadOptions: () => null,
  isCreatable: false,
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
  isCreatable: PropTypes.bool,
  isMulti: PropTypes.bool,
  isAsync: PropTypes.bool,
  isSearchable: PropTypes.bool,
  placeholder: PropTypes.string,

};

export default ReduxFormCreatableSelect;
