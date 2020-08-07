import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import StatusAlert from '../StatusAlert';

class ImageUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.input.value,
      sizeValidationError: '',
    };

    this.handleFilePicked = this.handleFilePicked.bind(this);
    this.sizeValidator = this.sizeValidator.bind(this);
  }

  updateValue(value) {
    this.setState({ value });
    this.props.input.onChange(value);
  }

  handleFilePicked(event) {
    const {
      maxImageSizeKilo,
      requiredWidth,
      requiredHeight,
    } = this.props;
    const reader = new FileReader();
    const file = event.target.files[0];

    // file size is in bytes so we need to convert for our validation check
    if (file && file.size > maxImageSizeKilo * 1000) {
      this.updateValue('');
      this.setState({
        sizeValidationError: `That image is too large. Please upload an image that
        is less than ${maxImageSizeKilo} kB. Remember that image dimensions must be
        exactly ${requiredWidth}×${requiredHeight} pixels.`,
      });
      return;
    }

    reader.onload = () => {
      this.updateValue(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  }

  sizeValidator(event) {
    const {
      requiredWidth,
      requiredHeight,
      meta: {
        pristine,
      },
    } = this.props;

    if (!pristine && (event.target.naturalWidth !== requiredWidth
        || event.target.naturalHeight !== requiredHeight)) {
      this.updateValue('');
      this.setState({
        sizeValidationError: `That image has the wrong dimensions. Please upload
        an image with exactly ${requiredWidth}×${requiredHeight} pixels.`,
      });
    } else {
      this.setState({ sizeValidationError: '' });
    }
  }

  render() {
    const {
      className,
      disabled,
      id,
      input: {
        name,
      },
      label,
      meta: {
        error,
        submitFailed,
      },
    } = this.props;

    const { sizeValidationError } = this.state;

    return (
      <div className={classNames('form-group', className)}>
        <div name={name} tabIndex={-1}>
          <label htmlFor={id} className="w-100 p-0">{label}</label>  {/* eslint-disable-line jsx-a11y/label-has-for */}
          {sizeValidationError
            && (
            <StatusAlert
              alertType="warning"
              message={sizeValidationError}
            />
            )}
          {submitFailed && error
            && (
            <StatusAlert
              alertType="danger"
              message={error}
            />
            )}
          <img src={this.state.value} alt="" className="uploaded-image" onLoad={this.sizeValidator} />
          <input
            id={id}
            type="file"
            accept="image/jpeg, image/png"
            onChange={this.handleFilePicked}
            disabled={disabled}
          />
        </div>
      </div>
    );
  }
}

ImageUpload.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  id: PropTypes.string.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  maxImageSizeKilo: PropTypes.number.isRequired,
  requiredWidth: PropTypes.number.isRequired,
  requiredHeight: PropTypes.number.isRequired,
  input: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
  }).isRequired,
  meta: PropTypes.shape({
    error: PropTypes.string,
    pristine: PropTypes.bool,
    submitFailed: PropTypes.bool,
  }).isRequired,
};

ImageUpload.defaultProps = {
  className: '',
  disabled: false,
};

export default ImageUpload;
