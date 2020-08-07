import React from 'react';
import PropTypes from 'prop-types';
import { Field, FieldArray } from 'redux-form';

import RenderInputTextField from '../RenderInputTextField';
import RemoveButton from '../RemoveButton';
import FieldLabel from '../FieldLabel';

class AreasOfExpertise extends React.Component {
  constructor(props) {
    super(props);

    this.handleRemove = this.handleRemove.bind(this);
  }

  handleRemove(index) {
    this.props.fields.remove(index);
  }

  render() {
    const { fields } = this.props;

    return (
      <div className="areas-of-expertise mb-3">
        <ul className="list-group p-0 m-0 container-fluid">
          {fields.map((expertise, index) => (
            <li className="area-of-expertise list-group-item row d-flex align-items-center px-0 mx-0" key={expertise}>
              <div className="col-11">
                <Field
                  name={`${expertise}.value`}
                  component={RenderInputTextField}
                  type="text"
                  label={<FieldLabel text="Area of expertise" required />}
                  required
                />
              </div>
              <input
                name={`${expertise}.id`}
                type="hidden"
              />
              <RemoveButton
                className="col-1"
                label="Remove area of expertise"
                onRemove={this.handleRemove}
                targetFieldNumber={index}
              />
            </li>
          ))}
        </ul>
        <button
          type="button"
          className="btn btn-outline-primary js-add-button mt-2"
          onClick={() => fields.push({})}
        >
          Add area of expertise
        </button>
      </div>
    );
  }
}

AreasOfExpertise.propTypes = {
  fields: PropTypes.instanceOf(FieldArray).isRequired,
};

export default AreasOfExpertise;
