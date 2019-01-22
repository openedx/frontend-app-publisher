import React from 'react';
import LoadingMessage from '../LoadingMessage';

const TableLoadingOverlay = () => (
  <React.Fragment>
    <div className="table-loading-overlay" aria-hidden="true" />
    <div className="table-loading-message d-flex align-items-center justify-content-center ">
      <LoadingMessage className="loading" />
    </div>
  </React.Fragment>
);

export default TableLoadingOverlay;
