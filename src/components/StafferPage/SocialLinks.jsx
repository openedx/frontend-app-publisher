import React from 'react';
import PropTypes from 'prop-types';
import { Field, FieldArray } from 'redux-form';

import RenderInputTextField from '../RenderInputTextField';
import RenderSelectField from '../RenderSelectField';
import RemoveButton from '../RemoveButton';
import FieldLabel from '../FieldLabel';

class SocialLinks extends React.Component {
  constructor(props) {
    super(props);

    this.handleRemove = this.handleRemove.bind(this);
  }

  handleRemove(index) {
    this.props.fields.remove(index);
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

  render() {
    const { fields } = this.props;

    return (
      <div className="social-links mb-3">
        <ul className="list-group p-0 m-0 container-fluid">
          {fields.map((link, index) => (
            <li className="social-link list-group-item row d-flex align-items-center px-0 mx-0" key={link}>
              <div className="col-4">
                <Field
                  name={`${link}.type`}
                  component={RenderSelectField}
                  options={this.getSocialOptions()}
                  label={<FieldLabel text="Type" required />}
                  required
                />
              </div>
              <div className="col-3">
                <Field
                  name={`${link}.title`}
                  component={RenderInputTextField}
                  type="text"
                  label={<FieldLabel text="Link Text" />}
                />
              </div>
              <div className="col-4">
                <Field
                  name={`${link}.url`}
                  component={RenderInputTextField}
                  type="url"
                  label={<FieldLabel text="URL" required />}
                  required
                />
              </div>
              <input
                name={`${link}.id`}
                type="hidden"
              />
              <RemoveButton
                className="col-1 m-auto"
                label="Remove social link"
                onRemove={this.handleRemove}
                targetFieldNumber={index}
              />
            </li>
          ))}
        </ul>
        <button
          type="button"
          data-testid="js-add-button"
          className="btn js-add-button mt-2"
          style={{border:'1px solid #ddd',fontWeight:'550',fontSize:'16px',color:'#001747'}}
          onClick={() => fields.push({})}
        >
          Add social link
        </button>
      </div>
    );
  }
}

SocialLinks.propTypes = {
  fields: PropTypes.instanceOf(FieldArray).isRequired,
};

export default SocialLinks;
