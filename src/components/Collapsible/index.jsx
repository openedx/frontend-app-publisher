import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Collapsible } from '@edx/paragon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

const CustomCollapsibleBody = ({ children }) => {
  const { isOpen } = useContext(Collapsible.Context);
  const style = {
    overflow: 'hidden',
    height: isOpen ? 'auto' : 0,
  };

  return (
    <div style={style}>
      <div className="collapsible-body">
        {children}
      </div>
    </div>
  );
};

CustomCollapsibleBody.propTypes = {
  children: PropTypes.node,
};

CustomCollapsibleBody.defaultProps = {
  children: undefined,
};

const CustomCollapsible = ({ children, title, ...props }) => (
  <Collapsible.Advanced className="collapsible-card" {...props}>
    <Collapsible.Trigger className="collapsible-trigger d-flex">
      <span className="flex-grow-1">{title}</span>
      <Collapsible.Visible whenClosed>
        <FontAwesomeIcon icon={faPlus} />
      </Collapsible.Visible>
      <Collapsible.Visible whenOpen>
        <FontAwesomeIcon icon={faMinus} />
      </Collapsible.Visible>
    </Collapsible.Trigger>
    <CustomCollapsibleBody>{children}</CustomCollapsibleBody>
  </Collapsible.Advanced>
);

CustomCollapsible.propTypes = {
  children: PropTypes.node,
  title: PropTypes.node.isRequired,
};

CustomCollapsible.defaultProps = {
  children: undefined,
};

export default CustomCollapsible;
