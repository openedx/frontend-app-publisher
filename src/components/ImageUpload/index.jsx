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
    return (
      <div className="form-group">
        <label htmlFor={this.props.id} className="col-12">{this.props.label}</label>  {/* eslint-disable-line jsx-a11y/label-has-for */}
        <img src={this.state.value} alt="" />
        <input id={this.props.id} type="file" accept="image/*" onChange={this.handleFilePicked} />
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
};

export default ImageUpload;
