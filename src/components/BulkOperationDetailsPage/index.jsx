import React, { useEffect } from "react";
import BulkOperationDetails from "./BulkOperationDetails";
import { useParams } from "react-router-dom";

import {
    Container
} from '@openedx/paragon';
import DiscoveryDataApiService from "../../data/services/DiscoveryDataApiService";

export default function BulkOperationDetailsPage() {
  const { taskId } = useParams();
    const [bulkOperationDetails, setBulkOperationDetails] = React.useState({});

    useEffect(() => {
        DiscoveryDataApiService.fetchBulkOperationTask(taskId)
            .then((response) => {
                setBulkOperationDetails(response.data);
            })
            .catch((error) => {
                console.error("Error fetching bulk operation details:", error);
            });
    }
    , [taskId]);
    return (
        <Container className="py-3" size="lg">
            <BulkOperationDetails task={bulkOperationDetails} />
        </Container>
    );
}
