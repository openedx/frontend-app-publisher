import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@edx/paragon';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// TODO: Make these actually do something
const removeStaff = () => {};

const editStaff = () => {};

const getStafferName = staffer => `${staffer.given_name} ${staffer.family_name || ''}`;

class StaffGrid extends React.Component {
  constructor(props) {
    super(props);
    this.state = { staffList: props.staff };
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
    });
  }

  render() {
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId="staffGrid" direction="horizontal">
          {provided => (
            <div ref={provided.innerRef} className="staff-grid row" {...provided.droppableProps}>
              {this.state.staffList.map((staffer, index) => (
                <Draggable draggableId={getStafferName(staffer)} index={index}>
                  {draggableProvided => (
                    <div
                      ref={draggableProvided.innerRef}
                      className="staffer-wrapper col-6 col-md-4 col-lg-3 col-xl-2"
                      key={staffer.uuid}
                      {...draggableProvided.dragHandleProps}
                      {...draggableProvided.draggableProps}
                    >
                      <div className="staffer-image-wrapper overflow-hidden">
                        <img src={staffer.profile_image_url} className="rounded-circle w-50" alt="" />
                      </div>
                      <div className="staffer-details">
                        <button className="btn mr-1 p-0" onClick={() => removeStaff()}>
                          <Icon
                            id="delete-icon"
                            className={['fa', 'fa-trash', 'fa-fw', 'text-danger']}
                            screenReaderText={`Remove ${getStafferName(staffer)}`}
                          />
                        </button>
                        <button className="btn mr-1 p-0" onClick={() => editStaff()}>
                          <Icon
                            id="edit-icon"
                            className={['fa', 'fa-edit', 'fa-fw']}
                            screenReaderText={`Edit ${getStafferName(staffer)}`}
                          />
                        </button>
                        <span className="name font-weight-bold">
                          {getStafferName(staffer)}
                        </span>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  }
}

StaffGrid.propTypes = {
  staff: PropTypes.arrayOf(PropTypes.shape({
    uuid: PropTypes.string.isRequired,
    given_name: PropTypes.string.isRequired,
    family_name: PropTypes.string,
    profile_image_url: PropTypes.string.isRequired,
  })).isRequired,
};

export default StaffGrid;
