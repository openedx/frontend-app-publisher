import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const ButtonToolbar = (props) => {
  const { className } = props;
  const fullClassName = classNames(
    'btn-toolbar justify-content-end',
    className,
  );
  const buttonList = React.Children.map(
    props.children,
    button => (
      <div className="btn-group ml-2" role="group">
        {button}
      </div>
    ),
  );

  return (
    <div className={fullClassName} role="toolbar">
      {buttonList}
    </div>
  );
};

ButtonToolbar.defaultProps = {
  children: [],
  className: '',
};

ButtonToolbar.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

export default ButtonToolbar;
