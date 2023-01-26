import React from 'react';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';
import RenderInputTextField from '../RenderInputTextField';
import FieldLabel from '../FieldLabel';

const GeoLocationFields = (props) => {
  const {
    disabled,
  } = props;

  return (
    <div className="collapsible-card pgn_collapsible mt-4">
      <div className="collapsible-body">
        <FieldLabel
          text="Merchandising Geolocation Data"
          className="h3 font-weight-normal mb-3"
          id="geolocation.info"
          helpText={(
            <div>
              <p>
                Location name, longitude, and latitude must be provided together for successful data update.
              </p>
            </div>
            )}
        />
        <Field
          name="geolocation.location_name"
          component={RenderInputTextField}
          label={(
            <FieldLabel
              id="geolocation.location_name.label"
              text="Location Name"
              helpText={(
                <div>
                  <p>
                    The name of the location present on the given longitude and latitude.
                  </p>
                </div>
                )}
            />
                )}
          disabled={disabled}
          required={false}
        />

        <Field
          name="geolocation.lng"
          type="number"
          component={RenderInputTextField}
          label={(
            <FieldLabel
              id="geolocation.longitude.label"
              text="Longitude"
              helpText={(
                <div>
                  <p>
                    Longitude of the location from where the course is being offered.
                  </p>
                </div>
                )}
            />
                )}
          extraInput={{
            min: -180,
            max: 180,
          }}
          disabled={disabled}
          required={false}
        />

        <Field
          name="geolocation.lat"
          type="number"
          component={RenderInputTextField}
          label={(
            <FieldLabel
              id="geolocation.latitude.label"
              text="Latitude"
              helpText={(
                <div>
                  <p>
                    Latitude of the location from where the course is being offered.
                  </p>
                </div>
                )}
            />
                )}
          extraInput={{
            min: -90,
            max: 90,
          }}
          disabled={disabled}
          required={false}
        />

      </div>
    </div>
  );
};

GeoLocationFields.propTypes = {
  disabled: PropTypes.bool,
};

GeoLocationFields.defaultProps = {
  disabled: false,
};

export default GeoLocationFields;
