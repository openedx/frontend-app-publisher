import React from 'react';
import PropTypes from 'prop-types';
import { Badge } from '@edx/paragon';

class CourseSkills extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      skillNames: props.input.value,
    };
  }

  render() {
    const {
      className,
      id,
      input: {
        name,
      },
      label,
    } = this.props;
    const {
      skillNames,
    } = this.state;
    return (
      <div className="form-group mb-2">
        <div id={id} name={name} tabIndex="-1">{label}</div>
        {skillNames.map(skill => (
          <Badge
            key={skill}
            className={className}
            variant="light"
          >
            { skill }
          </Badge>
        ))}
      </div>
    );
  }
}

CourseSkills.propTypes = {
  className: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  input: PropTypes.shape({
    value: PropTypes.arrayOf(PropTypes.string).isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
};

export default CourseSkills;
