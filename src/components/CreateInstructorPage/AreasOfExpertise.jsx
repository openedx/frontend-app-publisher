import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import RenderInputTextField from '../RenderInputTextField';
import RemoveButton from '../../components/RemoveButton';


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
      <div className="areas-of-expertise my-4">
        <button
          type="button"
          className="btn btn-light js-add-button"
          onClick={() => fields.push({})}
        >
          Add area of expertise
        </button>
        <ul className="list-group p-0 m-0">
          {fields.map((expertise, index) => (
            <li className="area-of-expertise list-group-item row d-flex align-items-center px-0 mx-0" key={expertise}>
              <div className="col-10">
                <Field
                  name={`${expertise}.value`}
                  component={RenderInputTextField}
                  type="text"
                  label={
                    <React.Fragment>
                      Area of expertise
                      <span className="required" aria-hidden>*</span>
                    </React.Fragment>
                  }
                  required
                />
              </div>
              <RemoveButton
                label="Remove area of expertise"
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

AreasOfExpertise.propTypes = {
  fields: PropTypes.shape({
    remove: PropTypes.func,
  }).isRequired,
};

export default AreasOfExpertise;
