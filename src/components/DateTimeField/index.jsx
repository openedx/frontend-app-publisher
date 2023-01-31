import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Form } from '@edx/paragon';
import {
  getDateWithDashes,
  getDateWithSlashes,
  getTimeString,
  getDateWithDashesUTC,
  getTimeStringUTC,
} from '../../utils/index';
import FieldLabel from '../FieldLabel';
import { DATE_FORMAT, FORMAT_DATE_MATCHER } from '../../data/constants';

class DateTimeField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: this.props.utcTimeZone
        ? getDateWithDashesUTC(this.props.input.value)
        : getDateWithDashes(this.props.input.value),
      time: (this.props.utcTimeZone
        ? getTimeStringUTC(this.props.input.value)
        : getTimeString(this.props.input.value)) || '12:00',
    };
    this.concatDateTime = this.concatDateTime.bind(this);
    this.updateDate = this.updateDate.bind(this);
    this.updateTime = this.updateTime.bind(this);
    this.getValue = this.getValue.bind(this);
  }

  getValue(type, date) {
    if (type === 'date') { return getDateWithDashes(date); }
    return (date.match(FORMAT_DATE_MATCHER)) ? getDateWithSlashes(date) : date;
  }

  concatDateTime(date, time) {
    let datetime = moment(`${date} ${time}`, 'YYYY/MM/DD HH:mm');
    datetime = this.props.utcTimeZone
      ? datetime.format(DATE_FORMAT)
      : datetime.utc().format(DATE_FORMAT);
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
      maxLength,
      type,
      pattern,
      placeholder,
    } = this.props;

    const {
      date,
      time,
    } = this.state;

    return (
      <div className="row">
        <div className="col-6">
          <Form.Group controlId={`${name}-date-label`}>
            <Form.Label>
              <FieldLabel
                id={`${name}-date-label`}
                text={dateLabel}
                required
                helpText={helpText}
              />
            </Form.Label>
            <Form.Control
              name={`${name}Date`}
              type={type}
              value={this.getValue(type, date)}
              id={`${name}-date-label`}
              placeholder={placeholder}
              pattern={pattern}
              maxLength={maxLength}
              required={required}
              disabled={disabled}
              onChange={event => this.updateDate(event.target.value)}
              min={minDate}
              onInvalid={onInvalid}
            />
          </Form.Group>
        </div>
        <div className="col-6">
          <Form.Group controlId={`${name}-date-label`}>
            <Form.Label>
              <FieldLabel
                id={`${name}-time-label`}
                text={timeLabel}
                required
              />
            </Form.Label>
            <Form.Control
              name={`${name}Time`}
              type="time"
              value={time || '12:00'}
              placeholder="HH:mm"
              required={required}
              disabled={disabled}
              onChange={event => this.updateTime(event.target.value)}
            />
          </Form.Group>
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
  utcTimeZone: PropTypes.bool,
  onInvalid: PropTypes.func,
  maxLength: PropTypes.string,
  type: PropTypes.string,
  pattern: PropTypes.string,
  placeholder: PropTypes.string,
};

DateTimeField.defaultProps = {
  disabled: false,
  required: false,
  minDate: '',
  onInvalid: () => {},
  utcTimeZone: false,
  maxLength: '',
  type: '',
  pattern: 'dd/mm/yyyy',
  placeholder: '',
};

export default DateTimeField;
