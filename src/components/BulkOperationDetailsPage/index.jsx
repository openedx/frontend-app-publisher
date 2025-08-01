import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container } from '@openedx/paragon';

import BulkOperationDetails from './BulkOperationDetails';
import DiscoveryDataApiService from '../../data/services/DiscoveryDataApiService';
import LoadingSpinner from '../LoadingSpinner';

const BulkOperationTaskDetailsPage = () => {
  const { taskId } = useParams();
  const [task, setTask] = useState(null);
  const [errorMessage, setError] = useState(null);

  useEffect(() => {
    DiscoveryDataApiService.fetchBulkOperationTask(taskId)
      .then((response) => {
        setTask(response.data);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, [taskId]);

  return (
    <Container className="py-3" size="lg">
      {task ? (<BulkOperationDetails task={task} />) : (
        <div>
          {errorMessage ? (
            <div className="alert alert-danger">
              <strong>Error:</strong> {errorMessage}
            </div>
          ) : (
            <div>
              <LoadingSpinner
                className="text-center"
                size="lg"
                style={{ marginTop: '20px' }}
              />
            </div>
          )}
        </div>
      )}
    </Container>
  );
};

export default BulkOperationTaskDetailsPage;
