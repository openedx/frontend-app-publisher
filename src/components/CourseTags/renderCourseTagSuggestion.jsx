import React from 'react';

function renderCourseTagSuggestion(suggestion) {
  return (
    <div className="d-flex flex-row m-1 p-1">
      <div className="m-1 p-1 w-75">
        <div className="m-1 p-1">{suggestion.value}</div>
      </div>
    </div>
  );
}

export default renderCourseTagSuggestion;
