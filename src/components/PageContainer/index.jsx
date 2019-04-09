import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const PageContainer = (props) => {
  const containerClasses = classNames('container my-3', props.className);
  const colClasses = classNames('col', { 'col-xl-6 col-lg-10': !props.wide });

  return (
    <div className={containerClasses}>
      <div className="row justify-content-md-center">
        <div className={colClasses}>
          {props.children}
        </div>
      </div>
    </div>
  );
};

PageContainer.defaultProps = {
  children: [],
  className: '',
  wide: false,
};

PageContainer.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  wide: PropTypes.bool,
};

export default PageContainer;
