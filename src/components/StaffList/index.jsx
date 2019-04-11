import React from 'react';
import PropTypes from 'prop-types';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Autosuggest from 'react-autosuggest';

import DiscoveryDataApiService from '../../data/services/DiscoveryDataApiService';

import { Staffer, getStafferName } from '../Staffer';


class StaffList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      staffList: props.input.value || [], // requires staffList to be an array
      suggestions: [], // the suggestions returned by the discovery service for autocomplete
      searchString: '', // search input provided by the user
    };

    this.handleRemove = this.handleRemove.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
    this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
    this.getSuggestionValue = this.getSuggestionValue.bind(this);
    this.renderSuggestion = this.renderSuggestion.bind(this);
    this.onSuggestionEntered = this.onSuggestionEntered.bind(this);
  }

  /**
   *
   * @param event - used by autosuggest internals
   * @param newValue - search string for query
   */
  onChange(event, { newValue }) {
    this.setState({ searchString: newValue });
  }

  /**
   * The callback method for when a user has provided input in the search input field for
   * autocomplete.  Responsible for deciding if we need to fetch new results (if input is long
   * enough).
   *
   * @param value - the text the user has input in the search input element.
   * @return Promise - continue async execution
   */
  onSuggestionsFetchRequested({ value }) {
    const {
      owners,
    } = this.props;

    if (value.length >= 2) { // We don't hit the discovery service until we have enough characters
      const organizationKeys = owners.map(owner => owner.key);
      return DiscoveryDataApiService
        .autocompletePerson(value, organizationKeys)
        .then((response) => {
          const { results } = response.data;
          // Add in last 'suggestion' - the 'add new' instructor link
          results.push({
            id: 'new',
            text: {
              profile_image_url: '/assets/new-instructor-80.png',
              given_name: '',
              family_name: '',
            },
            link: '/instructors/new',
            link_text: 'Add New Instructor',
          });
          this.setState({ suggestions: results });
        });
    }
    return Promise.resolve();
  }

  onSuggestionsClearRequested() {
    this.setState({
      suggestions: [],
    });
  }

  onDragEnd(result) {
    // Element was dropped outside the list.
    if (!result.destination) {
      return;
    }
    // Element has not actually moved.
    if (result.destination.index === result.source.index) {
      return;
    }
    const newStaffList = Array.from(this.state.staffList);
    const [removed] = newStaffList.splice(result.source.index, 1);
    newStaffList.splice(result.destination.index, 0, removed);
    this.setState({
      staffList: newStaffList,
    }, () => this.props.input.onChange(this.state.staffList));
  }

  /**
   * The callback method for when a user enters a value in the autocomplete list.
   * Responsible for updating the redux state of selected options.
   *
   * @param event - unused but a required parameter for autosuggest component
   * @param suggestion - the entered suggestion
   */
  onSuggestionEntered(event, { suggestion }) {
    const { staffList } = this.state;
    const newInstructor = (suggestion.id === 'new');
    const instructorAlreadySelected =
      staffList.some(staff => staff.uuid === suggestion.text.uuid);
    const newStaffList = Array.from(this.state.staffList);
    if (!instructorAlreadySelected && !newInstructor) {
      newStaffList.push(suggestion.text); // add to component state
    }
    // add to form state (trigger change action)
    this.setState({
      staffList: newStaffList,
    }, () => this.props.input.onChange(this.state.staffList));
    // clear search string to allow for another staffer to be added.
    this.setState({ searchString: '' });
  }

  /**
   * The callback method for when a user selects a suggestion in the autocomplete list.
   * Responsible for updating the search input text after selection
   *
   * @param selectedValue - the selected autocomplete option
   * @returns {string} - the value for the search input box after a selection
   */
  getSuggestionValue(selectedValue) {
    if (selectedValue.link_text) {
      return selectedValue.link_text;
    }
    return `${selectedValue.text.given_name} ${selectedValue.text.family_name}`;
  }


  handleRemove(uuid) {
    this.setState({
      staffList: this.state.staffList.filter(staffer => staffer.uuid !== uuid),
    }, () => this.props.input.onChange(this.state.staffList));
  }

  handleAutosuggestEnterEvent(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  }

  /**
   * Renders a suggestion in the autocomplete 'div'.  Called for each suggestion returned from
   * the fetch response.
   *
   * @param suggestion - the suggestion object in the state.suggestions array
   * @returns {*} - the rendered suggestion
   */
  renderSuggestion(suggestion) {
    return (
      <div className="d-flex flex-row m-1 p-1">
        <div className="m-1 p-1 w-25">
          <img
            src={suggestion.text.profile_image_url}
            alt={`profile for ${getStafferName(suggestion.text)}`}
            className="rounded-circle w-100"
          />
        </div>
        <div className="m-1 p-1 w-75">
          <div className="m-1 p-1">{getStafferName(suggestion.text)}</div>
          <div className="m-1 p-1">
            {suggestion.link && (
              <a href={suggestion.link}>{suggestion.link_text}</a>
            )}
            {suggestion.text.position && (
              <span>
                {suggestion.text.position.title} at {suggestion.text.position.organization_name}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  render() {
    const {
      staffList,
      suggestions,
      searchString,
    } = this.state;
    const {
      disabled,
      courseUuid,
    } = this.props;
    const inputProps = {
      placeholder: '',
      value: searchString,
      onChange: this.onChange,
      type: 'text',
      disabled,
      className: 'form-control',
    };

    return (
      <React.Fragment>
        Staff
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Droppable droppableId="StaffList" direction="vertical">
            {provided => (
              <div className="staff-list container" ref={provided.innerRef} {...provided.droppableProps}>
                {staffList && staffList.map((staffer, index) => (
                  <Draggable
                    draggableId={getStafferName(staffer)}
                    index={index}
                    key={staffer.uuid}
                    isDragDisabled={disabled}
                  >
                    {draggableProvided => (
                      <div
                        className="staffer-wrapper col-12 my-2"
                        ref={draggableProvided.innerRef}
                        {...draggableProvided.dragHandleProps}
                        {...draggableProvided.draggableProps}
                      >
                        <Staffer
                          onRemove={this.handleRemove}
                          staffer={staffer}
                          disabled={disabled}
                          courseUuid={courseUuid}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        {/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */}
        <label className="col-12" id="label-staff-search" htmlFor="staff-search" onKeyDown={this.handleAutosuggestEnterEvent}>Search or add new instructor
          <Autosuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
            getSuggestionValue={this.getSuggestionValue}
            renderSuggestion={this.renderSuggestion}
            inputProps={inputProps}
            onSuggestionSelected={this.onSuggestionEntered}
            id="staff-search"
          />
        </label>
        {/* eslint-enable jsx-a11y/no-noninteractive-element-interactions */}
      </React.Fragment>
    );
  }
}

StaffList.propTypes = {
  input: PropTypes.shape({
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.shape({
        uuid: PropTypes.string.isRequired,
        given_name: PropTypes.string.isRequired,
        family_name: PropTypes.string,
        profile_image_url: PropTypes.string.isRequired,
      })),
    ]).isRequired,
    onChange: PropTypes.func.isRequired,
  }).isRequired,
  disabled: PropTypes.bool,
  owners: PropTypes.arrayOf(PropTypes.shape({})),
  courseUuid: PropTypes.string.isRequired,
};

StaffList.defaultProps = {
  disabled: false,
  owners: [],
};

export default StaffList;
