import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { InputText } from '@edx/paragon';
import { getDateString, getTimeString } from '../../utils/index';
import FieldLabel from '../FieldLabel';
import { DATE_FORMAT } from '../../data/constants';

class DateTimeField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: getDateString(this.props.input.value) || '',
      time: getTimeString(this.props.input.value) || '',
    };
    this.concatDateTime = this.concatDateTime.bind(this);
    this.updateDate = this.updateDate.bind(this);
    this.updateTime = this.updateTime.bind(this);
  }

  concatDateTime(date, time) {
    const datetime = moment.utc(`${date} ${time}`, 'YYYY/MM/DD HH:mm').format(DATE_FORMAT);
    this.props.input.onChange(datetime);
  }

  updateDate(value) {
    const {
      time,
    } = this.state;
    this.setState({ date: value });
    this.concatDateTime(value, time);
  }

  updateTime(value) {
    const {
      date,
    } = this.state;
    this.setState({ time: value });
    this.concatDateTime(date, value);
  }

  render() {
    const {
      input: {
        name,
      },
      dateLabel,
      timeLabel,
      helpText,
      disabled,
      required,
      minDate,
      onInvalid,
    } = this.props;

    const {
      date,
      time,
    } = this.state;

    return (
      <div className="row">
        <div className="col-6">
          <InputText
            name={`${name}Date`}
            type="date"
            value={getDateString(date)}
            label={
              <FieldLabel
                id={`${name}-date-label`}
                text={dateLabel}
                required
                helpText={helpText}
              />
            }
            placeholder="mm/dd/yyyy"
            required={required}
            disabled={disabled}
            onChange={e => this.updateDate(e)}
            min={minDate}
            onInvalid={onInvalid}
          />
        </div>
        <div className="col-6">
          <InputText
            name={`${name}Time`}
            type="time"
            value={time}
            label={
              <FieldLabel
                id={`${name}-time-label`}
                text={timeLabel}
                required
              />
            }
            placeholder="HH:mm"
            required={required}
            disabled={disabled}
            onChange={e => this.updateTime(e)}
          />
        </div>
      </div>
    );
  }
}

DateTimeField.propTypes = {
  dateLabel: PropTypes.string.isRequired,
  timeLabel: PropTypes.string.isRequired,
  helpText: PropTypes.node.isRequired,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  input: PropTypes.shape({
    value: PropTypes.string,
    name: PropTypes.string,
    onChange: PropTypes.func.isRequired,
  }).isRequired,
  minDate: PropTypes.string,
  onInvalid: PropTypes.func,
};

DateTimeField.defaultProps = {
  disabled: false,
  required: false,
  minDate: '',
  onInvalid: () => {},
};

export default DateTimeField;
