import React from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import Autosuggest from 'react-autosuggest';
import { push } from 'connected-react-router';
import PropTypes from 'prop-types';
import store from '../../data/store';
import sourceInfo from '../../data/actions/sourceInfo';
import StatusAlert from '../StatusAlert';

class ListField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentList: props.input.value || [],
      suggestions: [], // the suggestions returned by the discovery service for autocomplete
      searchString: '', // search input provided by the user
    };

    this.onChange = this.onChange.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
    this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
    this.getSuggestionValue = this.getSuggestionValue.bind(this);
    this.renderSuggestion = this.props.renderSuggestion.bind(this);
    this.onSuggestionEntered = this.onSuggestionEntered.bind(this);
    this.fetchSuggestions = this.props.fetchSuggestions.bind(this);
  }

  componentDidMount() {
    this.updateList();
  }

  onSuggestionsFetchRequested({ value }) {
    const {
      fetchSuggestions,
      createNewUrl,
      newItemText,
    } = this.props;

    if (value.length >= 3) {
      return fetchSuggestions(value).then((response) => {
        const results = response.data;
        results.push({
          image_url: '',
          uuid: '',
          url: createNewUrl,
          item_text: newItemText,
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

  onChange(event, { newValue }) {
    this.setState({ searchString: newValue });
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

    const getRearrangedList = prevState => {
      const newList = Array.from(prevState.currentList);
      const [removed] = newList.splice(result.source.index, 1);
      newList.splice(result.destination.index, 0, removed);
      return newList;
    };

    this.setState(prevState => ({
      currentList: getRearrangedList(prevState),
    }), () => this.props.input.onChange(this.state.currentList));
  }

  onSuggestionEntered(event, { suggestion }) {
    const {
      createNewUrl,
      referrer,
      courseRunKey,
    } = this.props;
    // clear search string to allow for another item to be added.
    this.setState({ searchString: '' });
    if (suggestion.item_text) {
      // Send users to the create new page
      if (courseRunKey) {
        store.dispatch(sourceInfo(referrer, courseRunKey));
      } else {
        store.dispatch(sourceInfo(referrer));
      }
      store.dispatch(push(createNewUrl));
      return;
    }

    const addToCurrentList = prevState => {
      const newList = Array.from(prevState.currentList);
      // if item NOT already selected
      if (!newList.some(item => item.uuid === suggestion.uuid)) {
        newList.push(suggestion); // add to component state
      }
      return newList;
    };

    // add to form state (trigger change action)
    this.setState(prevState => ({
      currentList: addToCurrentList(prevState),
    }), () => this.props.input.onChange(this.state.currentList));
  }

  getSuggestionValue(selectedValue) {
    if (selectedValue.item_text) {
      return selectedValue.item_text;
    }
    return selectedValue.name;
  }

  updateList() {
    const {
      courseRunKey,
      newItemInfo: {
        data: newItem,
      },
      sourceInfo: {
        referringRun,
      },
      input,
    } = this.props;

    if ((!courseRunKey || courseRunKey === referringRun) && newItem && newItem.uuid) {
      const containsNewEntry = this.state.currentList
        .some(item => item.uuid === newItem.uuid);
      if (!containsNewEntry) {
        this.setState(prevState => ({
          currentList: prevState.currentList.concat(newItem),
        }), () => input.onChange(this.state.currentList));
      }
    }
  }

  handleRemove(uuid) {
    this.setState(prevState => ({
      currentList: prevState.currentList.filter(item => item.uuid !== uuid),
    }), () => this.props.input.onChange(this.state.currentList));
  }

  render() {
    const {
      disabled,
      renderItemComponent,
      itemType,
      meta: {
        submitFailed,
        error,
      },
      input: {
        name,
      },
    } = this.props;
    const {
      suggestions,
      searchString,
      currentList,
    } = this.state;

    const inputProps = {
      placeholder: '',
      value: searchString,
      onChange: this.onChange,
      type: 'text',
      disabled,
      className: 'form-control',
    };

    return (
      <div name={name} tabIndex="-1">
        {submitFailed && error
        && (
          <StatusAlert
            alertType="danger"
            message={error}
          />
        )}
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Droppable droppableId={`${itemType}List`} direction="vertical">
            {provided => (
              <div className="staff-list container" ref={provided.innerRef} {...provided.droppableProps}>
                {currentList && currentList.map((item, index) => (
                  <Draggable
                    draggableId={item.uuid}
                    index={index}
                    key={item.uuid}
                    isDragDisabled={disabled}
                  >
                    {draggableProvided => (
                      <div
                        className="staffer-wrapper col-12 my-2"
                        ref={draggableProvided.innerRef}
                        {...draggableProvided.dragHandleProps}
                        {...draggableProvided.draggableProps}
                      >
                        {React.createElement(renderItemComponent, {
                          onRemove: this.handleRemove,
                          item,
                          ...this.props,
                        })}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        {/* eslint-disable jsx-a11y/label-has-associated-control,jsx-a11y/no-noninteractive-element-interactions */}
        <label className="w-100" id={`label-${itemType}-search`} htmlFor={`${itemType}-search`} onKeyDown={this.handleAutosuggestEnterEvent}>
          <strong>{`Search or add new ${itemType}:`}</strong>
          <Autosuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
            getSuggestionValue={this.getSuggestionValue}
            renderSuggestion={this.renderSuggestion}
            inputProps={inputProps}
            onSuggestionSelected={this.onSuggestionEntered}
            alwaysRenderSuggestions={searchString.length > 2}
            id={`${itemType}-search`}
          />
        </label>
        {/* eslint-enable jsx-a11y/no-noninteractive-element-interactions */}
      </div>
    );
  }
}

ListField.propTypes = {
  renderSuggestion: PropTypes.func.isRequired,
  fetchSuggestions: PropTypes.func.isRequired,
  createNewUrl: PropTypes.string.isRequired,
  referrer: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  itemType: PropTypes.string.isRequired,
  input: PropTypes.shape({
    value: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.shape({
        uuid: PropTypes.string.isRequired,
      })),
      PropTypes.string]),
    onChange: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  renderItemComponent: PropTypes.func.isRequired,
  courseRunKey: PropTypes.string,
  newItemInfo: PropTypes.shape({
    data: PropTypes.shape({}),
  }),
  sourceInfo: PropTypes.shape({
    referringRun: PropTypes.string,
  }),
  meta: PropTypes.shape({
    submitFailed: PropTypes.bool,
    error: PropTypes.string,
  }).isRequired,
  newItemText: PropTypes.string.isRequired,
};

ListField.defaultProps = {
  disabled: false,
  courseRunKey: null,
  newItemInfo: {},
  sourceInfo: {},
};

export default ListField;
