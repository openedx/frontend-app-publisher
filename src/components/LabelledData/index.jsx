import React from 'react';

import PropTypes from 'prop-types';

const defaultProps = {
  value: '',
  html: false,
};

const inputProps = {
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  html: PropTypes.bool,
};

function LabelledData({ label, value, html }) {
  return (
    <div className="row">
      <div className="labelled-data-label col-2 font-weight-bold">{label}:</div>
      {html &&
        <div
          className="labelled-data-value col"
          dangerouslySetInnerHTML={{ __html: value }} // eslint-disable-line react/no-danger
        />
      }
      {!html && <div className="labelled-data-value col">{value}</div>}
    </div>
  );
}

LabelledData.defaultProps = defaultProps;
LabelledData.propTypes = inputProps;

export default LabelledData;
