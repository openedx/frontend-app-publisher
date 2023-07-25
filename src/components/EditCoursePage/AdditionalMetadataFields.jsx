import React from 'react';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';
import RenderInputTextField from '../RenderInputTextField';
import FieldLabel from '../FieldLabel';
import RichEditor from '../RichEditor';
import { loadOptions, utcTimeZone } from '../../utils';
import DateTimeField from '../DateTimeField';
import RenderSelectField from '../RenderSelectField';
import ReduxFormCreatableSelect from '../ReduxFormCreatableSelect';
import { courseTagValidate } from '../../utils/validation';

const AdditionalMetadataFields = (props) => {
  const {
    disabled, sourceInfo, externalCourseMarketingType, productStatusOptions, externalCourseMarketingTypeOptions,
  } = props;
  const sourceSlug = sourceInfo?.slug;

  productStatusOptions.unshift({ value: '', label: 'Select a product status' });

  externalCourseMarketingTypeOptions.unshift({ value: '', label: 'Select a marketing type' });

  const SOURCE_SLUG_REQUIRED_FIELDS = JSON.parse(process.env.ADDITIONAL_METADATA_REQUIRED_FIELDS);

  function isRequiredField(fieldName) {
    if (['certificate_info_heading', 'certificate_info_blurb'].includes(fieldName)) {
      if (externalCourseMarketingType === 'sprint') {
        return false;
      }
    }
    if (sourceSlug === undefined || !(sourceSlug in SOURCE_SLUG_REQUIRED_FIELDS)) {
      return true;
    }
    if (SOURCE_SLUG_REQUIRED_FIELDS[sourceSlug].includes(fieldName)) {
      return true;
    }
    return false;
  }

  return (
    <div className="collapsible-card pgn_collapsible mt-4">
      <div className="collapsible-body">
        <FieldLabel text="Additional Metadata Details" className="h3 font-weight-normal mb-3" />
        <div className="mb-3 mt-1">
          <Field
            name="additional_metadata.display_on_org_page"
            type="checkbox"
            label="additional_metadata.display_on_org_page"
            disabled={disabled}
            component="input"
            required={isRequiredField('display_on_org_page')}
            className="float-left mt-1 ml-1"
          />
          <FieldLabel text="Display on Organization Page" className="font-weight-normal ml-2 float-left" />
          <br />
        </div>
        <Field
          name="additional_metadata.external_url"
          component={RenderInputTextField}
          label=<FieldLabel id="external_url.label" text="External landing page URL" />
          disabled={disabled}
          required={isRequiredField('external_url')}
        />
        <Field
          name="additional_metadata.external_identifier"
          component={RenderInputTextField}
          label=<FieldLabel id="external_identifier.label" text="External system identifier" />
          disabled={disabled}
          required={isRequiredField('external_identifier')}
        />
        <Field
          name="additional_metadata.lead_capture_form_url"
          component={RenderInputTextField}
          label=<FieldLabel id="lead_capture_form_url.label" text="Lead capture form url" />
          disabled={disabled}
          required={isRequiredField('lead_capture_form_url')}
        />
        <Field
          name="additional_metadata.organic_url"
          component={RenderInputTextField}
          label=<FieldLabel id="organic_url.label" text="Organic URL" />
          disabled={disabled}
          required={isRequiredField('organic_url')}
        />
        <Field
          name="additional_metadata.variant_id"
          component={RenderInputTextField}
          label=<FieldLabel id="variant_id.label" text="Course Variant Id" />
          disabled={disabled}
          required={isRequiredField('variant_id')}
        />
        <Field
          name="additional_metadata.course_term_override"
          component={RenderInputTextField}
          label={(
            <FieldLabel
              id="course_term_override.label"
              text="Course Term Override"
              helpText={(
                <div>
                  <dl>
                    <dt>Course Term</dt>
                    <dd>
                      For example, in the UK universities use programme instead of course, so you can define which
                      term you want to use in course description to keep the consistency.
                    </dd>
                  </dl>
                </div>
              )}
            />
          )}
          disabled={disabled}
          required={isRequiredField('course_term_override')}
        />
        <FieldLabel text="Fact 1" className="h3 font-weight-normal" />
        <Field
          name="additional_metadata.facts_1_heading"
          component={RenderInputTextField}
          label=<FieldLabel id="facts.heading" text="Heading" />
          disabled={disabled}
          required={isRequiredField('facts_1_heading')}
        />
        <Field
          name="additional_metadata.facts_1_blurb"
          component={RichEditor}
          label=<FieldLabel id="facts.blurb" text="Description" />
          disabled={disabled}
          required={isRequiredField('facts_1_blurb')}
        />
        <FieldLabel text="Fact 2" className="h3 font-weight-normal" />
        <Field
          name="additional_metadata.facts_2_heading"
          component={RenderInputTextField}
          label=<FieldLabel id="facts.heading" text="Heading" />
          disabled={disabled}
          required={isRequiredField('facts_2_heading')}
        />
        <Field
          name="additional_metadata.facts_2_blurb"
          component={RichEditor}
          label=<FieldLabel id="facts.blurb" text="Description" />
          disabled={disabled}
          required={isRequiredField('facts_2_blurb')}
        />
        <FieldLabel text="Certificate Information" className="h3 font-weight-normal" />
        <Field
          name="additional_metadata.certificate_info_heading"
          component={RenderInputTextField}
          label=<FieldLabel id="certificate-info.heading" text="Heading" />
          disabled={disabled}
          required={isRequiredField('certificate_info_heading')}
        />
        <Field
          name="additional_metadata.certificate_info_blurb"
          component={RichEditor}
          label=<FieldLabel id="certificate-info.blurb" text="Description" />
          disabled={disabled}
          required={isRequiredField('certificate_info_blurb')}
        />
        <Field
          name="additional_metadata.start_date"
          type="date"
          component={DateTimeField}
          dateLabel="Start Date"
          timeLabel={`Start Time (${utcTimeZone})`}
          utcTimeZone
          disabled={disabled}
          required={isRequiredField('start_date')}
        />
        <Field
          name="additional_metadata.end_date"
          type="date"
          component={DateTimeField}
          dateLabel="End Date"
          timeLabel={`End Time (${utcTimeZone})`}
          utcTimeZone
          disabled={disabled}
          required={isRequiredField('end_date')}
        />
        <Field
          name="additional_metadata.registration_deadline"
          type="date"
          component={DateTimeField}
          dateLabel="Registration Deadline Date"
          timeLabel={`Registration Deadline Time (${utcTimeZone})`}
          utcTimeZone
          disabled={disabled}
          required={isRequiredField('registration_deadline')}
        />
        <Field
          name="additional_metadata.product_status"
          component={RenderSelectField}
          label=<FieldLabel id="product_status.label" text="Product Status" />
          options={productStatusOptions}
          value="additional_metadata.product_status"
          disabled={disabled}
          required={isRequiredField('product_status')}
        />
        <Field
          name="additional_metadata.external_course_marketing_type"
          component={RenderSelectField}
          label=<FieldLabel id="external_course_marketing_type.label" text="External Product Marketing Type" />
          options={externalCourseMarketingTypeOptions}
          value="additional_metadata.external_course_marketing_type"
          disabled={disabled}
          required={isRequiredField('external_course_marketing_type')}
        />
        <FieldLabel text="Product Meta" className="h3 font-weight-normal" />
        <Field
          name="additional_metadata.product_meta_title"
          component={RenderInputTextField}
          label=<FieldLabel id="product_meta.title" text="Title" />
          disabled={disabled}
          required={isRequiredField('product_meta')}
        />
        <Field
          name="additional_metadata.product_meta_description"
          component={RenderInputTextField}
          label=<FieldLabel id="product_meta.description" text="Description" optional />
          disabled={disabled}
          optional
        />
        <Field
          name="additional_metadata.product_meta_keywords"
          component={ReduxFormCreatableSelect}
          label={(
            <FieldLabel
              id="additional_metadata.product_meta_keywords"
              text="Keywords"
              helpText={(
                <div>
                  <dl>
                    <dt>Keywords</dt>
                    <dd>
                      Enter SEO Meta tags for Products. Separate keywords with spaces.
                    </dd>
                  </dl>
                </div>
              )}
              optional
            />
          )}
          defaultValue={[]}
          isAsync
          isMulti
          disabled={disabled}
          optional
          isCreatable
          createOptionValidator={courseTagValidate}
          loadOptions={loadOptions}
        />
      </div>
    </div>
  );
};

AdditionalMetadataFields.propTypes = {
  disabled: PropTypes.bool,
  sourceInfo: PropTypes.shape({
    name: PropTypes.string,
    slug: PropTypes.string,
    description: PropTypes.string,
  }),
  externalCourseMarketingType: PropTypes.string,
  productStatusOptions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  })),
  externalCourseMarketingTypeOptions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  })),
};

AdditionalMetadataFields.defaultProps = {
  disabled: false,
  sourceInfo: {},
  externalCourseMarketingType: null,
  productStatusOptions: [],
  externalCourseMarketingTypeOptions: [],
};

export default AdditionalMetadataFields;
