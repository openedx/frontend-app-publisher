import { getErrorMessages } from '../../utils';
import DiscoveryDataApiService from '../services/DiscoveryDataApiService';

import {
    REQUEST_BULK_OPERATION_TASK,
    REQUEST_BULK_OPERATION_TASK_FAIL,
    REQUEST_BULK_OPERATION_TASK_SUCCESS,
} from '../constants/bulkOperationTasks';

function requestBulkOperationTask(id) {
    return { type: REQUEST_BULK_OPERATION_TASK, id };
}

function requestBulkOperationTaskFail(id, error) {
    return { type: REQUEST_BULK_OPERATION_TASK_FAIL, id, error };
}

function requestBulkOperationTaskSuccess(id, data) {
    return { type: REQUEST_BULK_OPERATION_TASK_SUCCESS, id, data };
}
function fetchBulkOperationTask(id) {
    return (dispatch) => {
        dispatch(requestBulkOperationTask(id));

        return DiscoveryDataApiService.fetchBulkOperationTasks(id)
            .then((response) => {
                console.log('response hey', response.data);
                const task = response.data;
                dispatch(requestBulkOperationTaskSuccess(id, task));
            })
            .catch((error) => {
                const msg = ['Could not get bulk operation tasks.'].concat(getErrorMessages(error));
                dispatch(requestBulkOperationTaskFail(id, msg));
            });
    };
};

export {
    fetchBulkOperationTask,
};