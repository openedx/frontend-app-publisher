import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { InputText } from '@edx/paragon';
import { getDateWithDashes, getDateWithSlashes, getTimeString } from '../../utils/index';
import FieldLabel from '../FieldLabel';
import { DATE_FORMAT, FORMAT_DATE_MATCHER } from '../../data/constants';

class DateTimeField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: getDateWithDashes(this.props.input.value),
      time: getTimeString(this.props.input.value) || '12:00',
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
    const datetime = moment(`${date} ${time}`, 'YYYY/MM/DD HH:mm');
    this.props.input.onChange(datetime.utc().format(DATE_FORMAT));
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
          <InputText
            name={`${name}Date`}
            type={type}
            value={this.getValue(type, date)}
            label={(
              <FieldLabel
                id={`${name}-date-label`}
                text={dateLabel}
                required
                helpText={helpText}
              />
            )}
            placeholder={placeholder}
            pattern={pattern}
            maxLength={maxLength}
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
            value={time || '12:00'}
            label={(
              <FieldLabel
                id={`${name}-time-label`}
                text={timeLabel}
                required
              />
            )}
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
  maxLength: '',
  type: '',
  pattern: '',
  placeholder: '',
};

export default DateTimeField;
