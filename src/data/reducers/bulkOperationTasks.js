import {
    REQUEST_BULK_OPERATION_TASK,
    REQUEST_BULK_OPERATION_TASK_FAIL,
    REQUEST_BULK_OPERATION_TASK_SUCCESS,
} from '../constants/bulkOperationTasks';

const initialState = {
    byId: {},
    loading: {},
    errors: {},
  };
  
function bulkOperationTask(state = initialState, action) {
    switch (action.type) {
      case REQUEST_BULK_OPERATION_TASK:
        return {
          ...state,
          loading: { ...state.loading, [action.id]: true },
          errors: { ...state.errors, [action.id]: null },
        };
      case REQUEST_BULK_OPERATION_TASK_SUCCESS:
        return {
          ...state,
          loading: { ...state.loading, [action.id]: false },
          byId: { ...state.byId, [action.id]: action.data },
        };
      case REQUEST_BULK_OPERATION_TASK_FAIL:
        return {
          ...state,
          loading: { ...state.loading, [action.id]: false },
          errors: { ...state.errors, [action.id]: action.error },
        };
      default:
        return state;
    }
  }
  
export default bulkOperationTask;