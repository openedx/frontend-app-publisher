import React from 'react';
import NewInstructorImage from '../../../assets/new-instructor-80.png';

export default (suggestion) => (
  <div className="d-flex flex-row m-1 p-1">
    <div className="m-1 p-1 w-25">
      <img
        src={suggestion.image_url || NewInstructorImage}
        alt={`logo for ${suggestion.name}`}
        className="w-100"
      />
    </div>
    <div className="m-1 p-1 w-75">
      <div className="m-1 p-1">{suggestion.name}</div>
      <div className="m-1 p-1">
        {suggestion.item_text && (
          <span>{suggestion.item_text}</span>
        )}
      </div>
    </div>
  </div>
);
