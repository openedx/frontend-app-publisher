import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Spinner } from '@edx/paragon';

import Pane from './Pane';

const LanguageConfigPane = ({
  getLanguageConfig,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [languageConfig, setLanguageConfig] = useState(false);

  const toggleLanguageConfig = () => {
    setIsLoading(true);
    setLanguageConfig(!languageConfig);
    setError(null);
    setIsLoading(false);
  };

  useEffect(() => {
    getLanguageConfig(languageConfig ? 'rtl' : 'ltr');
  }, [languageConfig, getLanguageConfig]);

  return (
    <Pane className="mt-1" title="Language Configuration" info="Select the language configuration for the course.">
      <Form className="mt-1">
        <Form.Label>
          Fields Direction:
        </Form.Label>
        <div className="mt-1">
          Left to Right
          <Form.Switch
            name="direction"
            value={languageConfig}
            className="ml-2"
            onChange={toggleLanguageConfig}
          >
            Right to left
          </Form.Switch>
        </div>
        {isLoading && <Spinner className="ml-2" />}
        {error && <div className="text-danger">{error}</div>}
      </Form>
    </Pane>
  );
};

LanguageConfigPane.propTypes = {
  getLanguageConfig: PropTypes.func,
};

LanguageConfigPane.defaultProps = {
    getLanguageConfig: () => {},
};

export default LanguageConfigPane;
