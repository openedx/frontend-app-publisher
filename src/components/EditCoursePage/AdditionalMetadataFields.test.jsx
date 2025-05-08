import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { reduxForm } from 'redux-form';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import AdditionalMetadataFields from './AdditionalMetadataFields';

const mockStore = configureStore();
const store = mockStore({});

const productStatusOptions = [
  { value: 'published', label: 'Published' },
  { value: 'Archived', label: 'Archived' },
];

const externalCourseMarketingTypeOptions = [
  { value: 'sprint', label: 'Sprint' },
  { value: 'short_course', label: 'Short Course' },
];

const WrappedAdditionalMetaDataFields = reduxForm({ form: 'testForm' })(AdditionalMetadataFields);

describe('AdditionalMetadata Fields', () => {
  it('Display all fields', () => {
    const { container } = render(
      <Provider store={store}>
        <WrappedAdditionalMetaDataFields
          productStatusOptions={productStatusOptions}
          externalCourseMarketingTypeOptions={externalCourseMarketingTypeOptions}
        />
      </Provider>,
    );
    waitFor(() => expect(container).toMatchSnapshot());
  });

  it('Display required fields on the basis of external course marketing type', () => {
    const { container } = render(
      <Provider store={store}>
        <WrappedAdditionalMetaDataFields
          externalCourseMarketingType="sprint"
          productStatusOptions={productStatusOptions}
          externalCourseMarketingTypeOptions={externalCourseMarketingTypeOptions}
        />
      </Provider>,
    );
    waitFor(() => expect(container).toMatchSnapshot());
  });
});
