import React from 'react';
import PropTypes from 'prop-types';

import jsxToString from 'jsx-to-string';
import ReactTooltip from 'react-tooltip';

class FieldHelp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toolTipIsOpen: false,
    };
    this.toggleToolTip = this.toggleToolTip.bind(this);
    this.closeToolTip = this.closeToolTip.bind(this);
    this.setTip = this.setTip.bind(this);
  }

  setTip(tip) {
    this.tooltip = tip;
  }

  toggleToolTip(event) {
    const { toolTipIsOpen } = this.state;

    if (event) {
      event.preventDefault();
    }

    if (toolTipIsOpen) {
      this.closeToolTip();
    } else {
      this.openToolTip();
    }
  }

  closeToolTip() {
    ReactTooltip.hide(this.tooltip);
    this.setState({ toolTipIsOpen: false });
  }

  openToolTip() {
    ReactTooltip.show(this.tooltip);
    this.setState({ toolTipIsOpen: true });
  }

  render() {
    return (
      <span id={this.props.id} className={this.props.className}>
        <button
          type="button"
          className="btn btn-link py-0 px-1 align-baseline"
          onClick={this.toggleToolTip}
          onBlur={this.closeToolTip}
          aria-describedby={`${this.props.id}-tooltip`}
        >
          <span className="fa fa-info-circle" />
        </button>
        <span
          className="field-help-data"
          ref={this.setTip}
          data-tip={jsxToString(this.props.tip)}
          data-html
          data-for={`${this.props.id}-tooltip`}
        />
        <ReactTooltip
          id={`${this.props.id}-tooltip`}
          place="right"
          type="dark"
          effect="solid"
          clickable
        />
      </span>
    );
  }
}

FieldHelp.defaultProps = {
  className: '',
};

FieldHelp.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string.isRequired,
  tip: PropTypes.node.isRequired,
};

export default FieldHelp;
