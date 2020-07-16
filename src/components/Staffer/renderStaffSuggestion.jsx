import React from 'react';
import NewInstructorImage from '../../../assets/new-instructor-80.png';
import { getStafferName } from './index';

export default (suggestion) => (
  <div className="d-flex flex-row m-1 p-1">
    <div className="m-1 p-1 w-25">
      <img
        src={suggestion.profile_image_url || NewInstructorImage}
        alt={`profile for ${getStafferName(suggestion)}`}
        className="rounded-circle w-100"
      />
    </div>
    <div className="m-1 p-1 w-75">
      {suggestion.given_name && <div className="m-1 p-1">{getStafferName(suggestion)}</div>}
      <div className="m-1 p-1">
        {suggestion.item_text && (
          <span>{suggestion.item_text}</span>
        )}
        {suggestion.position && (
          <span>
            { suggestion.position.title} at {suggestion.position.organization_name }
          </span>
        )}
      </div>
    </div>
  </div>
);
