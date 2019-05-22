import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import StatusAlert from '../StatusAlert';


class ImageUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.input.value,
    };

    this.handleFilePicked = this.handleFilePicked.bind(this);
  }

  updateValue(value) {
    this.setState({ value });
    this.props.input.onChange(value);
  }

  handleFilePicked(event) {
    const reader = new FileReader();
    reader.onload = () => {
      this.updateValue(reader.result);
    };
    reader.readAsDataURL(event.target.files[0]);
  }

  render() {
    const {
      className,
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

    return (
      <div className={classNames('form-group', className)}>
        <div name={name} tabIndex={-1}>
          <label htmlFor={id} className="w-100 p-0">{label}</label>  {/* eslint-disable-line jsx-a11y/label-has-for */}
          {submitFailed && error &&
            <StatusAlert
              alertType="danger"
              message={error}
            />
          }
          <img src={this.state.value} alt="" className="uploaded-image" />
          <input id={id} type="file" accept="image/*" onChange={this.handleFilePicked} />
        </div>
      </div>
    );
  }
}

ImageUpload.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  input: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
  }).isRequired,
  meta: PropTypes.shape({
    error: PropTypes.string,
    submitFailed: PropTypes.bool,
  }).isRequired,
};

ImageUpload.defaultProps = {
  className: '',
};

export default ImageUpload;
