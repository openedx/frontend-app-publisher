import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container } from '@openedx/paragon';

import BulkOperationDetails from './BulkOperationDetails';
import DiscoveryDataApiService from '../../data/services/DiscoveryDataApiService';

const BulkOperationTaskDetailsPage = () => {
  const { taskId } = useParams();
  const [task, setTask] = React.useState({});

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
        <div className="text-center">
          <p>Loading...</p>
        </div>
      )}
    </Container>
  );
};

export default BulkOperationTaskDetailsPage;
