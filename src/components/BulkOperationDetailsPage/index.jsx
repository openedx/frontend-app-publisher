import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container } from '@openedx/paragon';

import BulkOperationDetails from './BulkOperationDetails';
import DiscoveryDataApiService from '../../data/services/DiscoveryDataApiService';
import LoadingSpinner from '../LoadingSpinner';

const BulkOperationTaskDetailsPage = () => {
  const { taskId } = useParams();
  const [task, setTask] = useState(null);

  useEffect(() => {
    DiscoveryDataApiService.fetchBulkOperationTask(taskId)
      .then((response) => {
        setTask(response.data);
      })
      .catch((error) => {
        console.error('Error fetching bulk operation details:', error);
      });
  }, [taskId]);

  return (
    <Container className="py-3" size="lg">
      {task ? (<BulkOperationDetails task={task} />) : (
        <div>
          <LoadingSpinner
            className="text-center"
            size="lg"
            style={{ marginTop: '20px' }}
          />
        </div>
      )}
    </Container>
  );
};

export default BulkOperationTaskDetailsPage;
