import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Spinner } from '@edx/paragon';
import { PUBLISHED, REVIEWED, UNPUBLISHED } from '../../data/constants';

import DiscoveryDataApiService from '../../data/services/DiscoveryDataApiService';
import Pane from './Pane';

const CatalogInclusionPane = ({
  courseUuid,
  draftStatuses,
  orgInclusion,
  subInclusion,
}) => {
  const [inclusion, setInclusion] = useState(subInclusion);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const message = 'Self-paced courses from participating partner organizations can be included in the subscription catalog.';
  const stateError = 'Edits are not allowed while all course runs are in review.';
  const organizationInclusionMessage = 'Organization is not currently a participating partner in the subscription catalog.';

  const toggleInclusion = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    let draft = null;
    if (draftStatuses.includes(PUBLISHED) || draftStatuses.includes(REVIEWED)) {
      draft = false;
    } else if (draftStatuses.includes(UNPUBLISHED)) {
      draft = true;
    } else {
      // if it hits this condition, the only course runs are in review, so we will block
      // edits at the course level
      setIsLoading(false);
      setError(stateError);
    }

    if (draft !== null) {
      const data = {
        uuid: courseUuid,
        draft,
        enterprise_subscription_inclusion: !(inclusion),
      };
      try {
        const response = await DiscoveryDataApiService.editCourse(data);
        setInclusion(response.data.enterprise_subscription_inclusion);
        setError(null);
        setIsLoading(false);
      } catch (err) {
        const errorText = `Unable to toggle attribute, received error: ${err.response.status} ${err.response.statusText}`;
        setIsLoading(false);
        setError(errorText);
      }
    }
  };

  return (
    <Pane className="mt-1" title="Enterprise Subscriptions" info={message}>
      <div className="font-weight-bold">Course Inclusion Status</div>
      <Form className="mt-4">
        <Form.Switch
          disabled={!orgInclusion}
          checked={inclusion}
          className="course-inclusion-switch"
          onChange={toggleInclusion}
          helperText={error !== null && (<span>{error}</span>)}
        >Included
        </Form.Switch>
        {!orgInclusion && (<div className="text-gray-300 x-small">{organizationInclusionMessage}</div>)}
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
  draftStatuses: PropTypes.arrayOf(PropTypes.string).isRequired,
  orgInclusion: PropTypes.bool.isRequired,
  subInclusion: PropTypes.bool.isRequired,
};

export default CatalogInclusionPane;
