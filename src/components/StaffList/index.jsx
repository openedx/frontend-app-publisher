import React from 'react';
import PropTypes from 'prop-types';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import { Staffer, getStafferName } from '../Staffer';


class StaffList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      staffList: props.input.value,
    };

    this.handleRemove = this.handleRemove.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
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

  handleRemove(uuid) {
    this.setState({
      staffList: this.state.staffList.filter(staffer => staffer.uuid !== uuid),
    }, () => this.props.input.onChange(this.state.staffList));
  }

  render() {
    const {
      staffList,
    } = this.state;

    return (
      <React.Fragment>
        Staff
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Droppable droppableId="StaffList" direction="vertical">
            {provided => (
              <div className="staff-list container" ref={provided.innerRef} {...provided.droppableProps}>
                {staffList.map((staffer, index) => (
                  <Draggable draggableId={getStafferName(staffer)} index={index} key={staffer.uuid}>
                    {draggableProvided => (
                      <div
                        className="staffer-wrapper row my-2"
                        ref={draggableProvided.innerRef}
                        {...draggableProvided.dragHandleProps}
                        {...draggableProvided.draggableProps}
                      >
                        <Staffer
                          onRemove={this.handleRemove}
                          staffer={staffer}
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
      </React.Fragment>
    );
  }
}

StaffList.propTypes = {
  input: PropTypes.shape({
    value: PropTypes.arrayOf(PropTypes.shape({
      uuid: PropTypes.string.isRequired,
      given_name: PropTypes.string.isRequired,
      family_name: PropTypes.string,
      profile_image_url: PropTypes.string.isRequired,
    })).isRequired,
    onChange: PropTypes.func.isRequired,
  }).isRequired,
};

export default StaffList;
