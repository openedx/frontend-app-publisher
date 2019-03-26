import React from 'react';
import PropTypes from 'prop-types';


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
      id,
      label,
      required,
    } = this.props;

    return (
      <div className="form-group">
        <label htmlFor={id} className="col-12 p-0">{label}</label>  {/* eslint-disable-line jsx-a11y/label-has-for */}
        <img src={this.state.value} alt="" />
        <input id={id} type="file" accept="image/*" required={required} onChange={this.handleFilePicked} />
      </div>
    );
  }
}

ImageUpload.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  input: PropTypes.shape({
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
  }).isRequired,
  required: PropTypes.bool,
};

ImageUpload.defaultProps = {
  required: false,
};

export default ImageUpload;
