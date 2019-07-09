import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const ButtonToolbar = (props) => {
  const { className, leftJustify } = props;
  const fullClassName = classNames(
    `btn-toolbar ${leftJustify ? 'justify-content-start' : 'justify-content-end'}`,
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
  leftJustify: false,
};

ButtonToolbar.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  leftJustify: PropTypes.bool,
};

export default ButtonToolbar;
