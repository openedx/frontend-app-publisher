import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Spinner } from '@edx/paragon';

import DiscoveryDataApiService from '../../data/services/DiscoveryDataApiService';
import Pane from './Pane';

const CatalogInclusionPane = ({ courseUuid, subInclusion }) => {
  const [inclusion, setInclusion] = useState(subInclusion);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const toggleInclusion = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const data = {
      uuid: courseUuid,
      enterprise_subscription_inclusion: !(inclusion),
    };
    try {
      await DiscoveryDataApiService.editCourse(data);
      setInclusion(!(inclusion));
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setError(true);
    }
  };

  const message = 'Self-paced courses from participating partner organizations can be included in the Subscription Catalog.';
  const errorMessage = 'We were unable to toggle this attribute. Please try again later.';

  return (
    <Pane className="mt-1" title="Enterprise Subscriptions" info={message}>
      <div className="font-weight-bold">Course Inclusion Status</div>
      <Form className="mt-4">
        <Form.Switch
          checked={inclusion}
          data-testid="course-inclusion-switch"
          onChange={toggleInclusion}
          helperText={error && (<span>{errorMessage}</span>)}
        >Included
        </Form.Switch>
        {isLoading && (
          <Spinner
            data-testid="course-inclusion-loading"
            animation="border"
            variant="primary"
            className="mr-3 float-right"
            screenReaderText="loading"
          />
        )}
      </Form>
    </Pane>
  );
};

CatalogInclusionPane.propTypes = {
  courseUuid: PropTypes.string.isRequired,
  subInclusion: PropTypes.bool.isRequired,
};

export default CatalogInclusionPane;
