import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './PageContainer.scss';

const PageContainer = (props) => {
  const containerClasses = classNames('container my-3 content-container', props.className);
  const colClasses = classNames('col', { 'col-xl-7 col-9': !props.wide });

  return (
    <div className={containerClasses}>
      <div className="row justify-content-md-center">
        <div className={colClasses}>
          {props.children}
        </div>

        {props.sidePanes
          && (
          <div className="col-3">
            {props.sidePanes}
          </div>
          )}
      </div>
    </div>
  );
};

PageContainer.defaultProps = {
  children: [],
  className: '',
  sidePanes: undefined,
  wide: false,
};

PageContainer.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  sidePanes: PropTypes.node,
  wide: PropTypes.bool,
};

export default PageContainer;
