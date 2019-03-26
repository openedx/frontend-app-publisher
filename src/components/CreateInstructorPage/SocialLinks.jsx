import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import RenderInputTextField from '../RenderInputTextField';
import RenderSelectField from '../RenderSelectField';
import RemoveButton from '../../components/RemoveButton';


class SocialLinks extends React.Component {
  constructor(props) {
    super(props);

    this.handleRemove = this.handleRemove.bind(this);
  }

  getSocialOptions() {
    return [
      { label: 'Please select a type', value: '' },
      { label: 'Facebook', value: 'facebook' },
      { label: 'Twitter', value: 'twitter' },
      { label: 'Blog', value: 'blog' },
      { label: 'Other', value: 'others' },
    ];
  }

  handleRemove(index) {
    this.props.fields.remove(index);
  }

  render() {
    const { fields } = this.props;

    return (
      <div className="social-links mt-4">
        <button
          type="button"
          className="btn btn-light js-add-button"
          onClick={() => fields.push({})}
        >
          Add social link
        </button>
        <ul className="list-group p-0 m-0">
          {fields.map((link, index) => (
            <li className="social-link list-group-item row d-flex align-items-center px-0 mx-0" key={link}>
              <div className="col-6">
                <Field
                  name={`${link}.type`}
                  component={RenderSelectField}
                  options={this.getSocialOptions()}
                  label={
                    <React.Fragment>
                      Type
                      <span className="required">*</span>
                    </React.Fragment>
                  }
                  required
                />
              </div>
              <div className="col-6">
                <Field
                  name={`${link}.title`}
                  component={RenderInputTextField}
                  type="text"
                  label={
                    <React.Fragment>
                      Title - optional
                    </React.Fragment>
                  }
                />
              </div>
              <div className="col-4">
                <Field
                  name={`${link}.url`}
                  component={RenderInputTextField}
                  type="text"
                  label={
                    <React.Fragment>
                      URL
                      <span className="required">*</span>
                    </React.Fragment>
                  }
                  required
                />
              </div>
              <RemoveButton
                label="Remove social link"
                onRemove={this.handleRemove}
                targetFieldNumber={index}
              />
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

SocialLinks.propTypes = {
  fields: PropTypes.shape({
    remove: PropTypes.func,
  }).isRequired,
};

export default SocialLinks;
