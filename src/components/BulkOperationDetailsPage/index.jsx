import React, { useEffect } from "react";
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import BulkOperationDetails from "./BulkOperationDetails";
import { fetchBulkOperationTask } from '../../data/actions/bulkOperationTasks';

export default function BulkOperationDetailsPage() {
  const { taskId } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchBulkOperationTask(taskId));
  }, [taskId, dispatch]);

  const task = useSelector(state => state.bulkOperationTask?.byId?.[taskId]);
  const loading = useSelector(state => state.bulkOperationTask?.loading?.[taskId]);
  const error = useSelector(state => state.bulkOperationTask?.errors?.[taskId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.join(', ')}</p>;

  return task ? <BulkOperationDetails task={task} /> : <p>Task not found</p>;
}
