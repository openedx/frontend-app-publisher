import React from 'react';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';
import RenderInputTextField from '../RenderInputTextField';
import FieldLabel from '../FieldLabel';
import RichEditor from '../RichEditor';
import { utcTimeZone } from '../../utils';
import DateTimeField from '../DateTimeField';

function AdditionalMetadataFields(props) {
  const {
    disabled,
  } = props;

  return (
    <div className="collapsible-card pgn_collapsible mt-4">
      <div className="collapsible-body">
        <FieldLabel text="Additional Metadata Details" className="h3 font-weight-normal mb-3" />
        <Field
          name="additional_metadata.external_url"
          component={RenderInputTextField}
          label=<FieldLabel id="external_url.label" text="External landing page URL" />
          disabled={disabled}
          required
        />
        <Field
          name="additional_metadata.external_identifier"
          component={RenderInputTextField}
          label=<FieldLabel id="external_identifier.label" text="2U system identifier" />
          disabled={disabled}
          required
        />
        <Field
          name="additional_metadata.lead_capture_form_url"
          component={RenderInputTextField}
          label=<FieldLabel id="lead_capture_form_url.label" text="Lead capture form url" />
          disabled={disabled}
          required
        />
        <Field
          name="additional_metadata.organic_url"
          component={RenderInputTextField}
          label=<FieldLabel id="organic_url.label" text="Organic URL" />
          disabled={disabled}
          required
        />
        <Field
          name="additional_metadata.variant_id"
          component={RenderInputTextField}
          label=<FieldLabel id="variant_id.label" text="Course Variant Id" />
          disabled={disabled}
          required={false}
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
          required={false}
        />
        <FieldLabel text="Fact 1" className="h3 font-weight-normal" />
        <Field
          name="additional_metadata.facts_1_heading"
          component={RenderInputTextField}
          label=<FieldLabel id="facts.heading" text="Heading" />
          disabled={disabled}
          required
        />
        <Field
          name="additional_metadata.facts_1_blurb"
          component={RichEditor}
          label=<FieldLabel id="facts.blurb" text="Description" />
          disabled={disabled}
          required
        />
        <FieldLabel text="Fact 2" className="h3 font-weight-normal" />
        <Field
          name="additional_metadata.facts_2_heading"
          component={RenderInputTextField}
          label=<FieldLabel id="facts.heading" text="Heading" />
          disabled={disabled}
          required
        />
        <Field
          name="additional_metadata.facts_2_blurb"
          component={RichEditor}
          label=<FieldLabel id="facts.blurb" text="Description" />
          disabled={disabled}
          required
        />
        <FieldLabel text="Certificate Information" className="h3 font-weight-normal" />
        <Field
          name="additional_metadata.certificate_info_heading"
          component={RenderInputTextField}
          label=<FieldLabel id="certificate-info.heading" text="Heading" />
          disabled={disabled}
          required
        />
        <Field
          name="additional_metadata.certificate_info_blurb"
          component={RichEditor}
          label=<FieldLabel id="certificate-info.blurb" text="Description" />
          disabled={disabled}
          required
        />
        <Field
          name="additional_metadata.start_date"
          type="date"
          component={DateTimeField}
          dateLabel="Start Date"
          timeLabel={`Start Time (${utcTimeZone})`}
          utcTimeZone
          disabled={disabled}
          required
        />
        <Field
          name="additional_metadata.registration_deadline"
          type="date"
          component={DateTimeField}
          dateLabel="Registration Deadline Date"
          timeLabel={`Registration Deadline Time (${utcTimeZone})`}
          utcTimeZone
          disabled={disabled}
        />
      </div>
    </div>
  );
}

AdditionalMetadataFields.propTypes = {
  disabled: PropTypes.bool,
};

AdditionalMetadataFields.defaultProps = {
  disabled: false,
};

export default AdditionalMetadataFields;
