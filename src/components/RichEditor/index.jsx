import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { Editor } from '@tinymce/tinymce-react';
import 'tinymce/tinymce.min';
import 'tinymce/icons/default';
import 'tinymce/plugins/legacyoutput';
import 'tinymce/plugins/link';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/directionality';
import 'tinymce/themes/silver/theme';
import '@edx/tinymce-language-selector';
import 'tinymce/skins/ui/oxide/skin.css';
import contentCss from 'tinymce/skins/content/default/content.min.css';
import contentUiCss from 'tinymce/skins/ui/oxide/content.min.css';
import { Alert } from '@edx/paragon';

class RichEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      charCount: 0,
    };
    this.initCharCount = this.initCharCount.bind(this);
    this.updateCharCount = this.updateCharCount.bind(this);
  }

  initCharCount(event, editor) {
    const content = editor.getContent({ format: 'text' });
    this.setState({
      charCount: content.length,
    });
  }

  updateCharCount(event, editor) {
    const content = editor.getContent({ format: 'text' });
    this.setState({
      charCount: content.length,
    });
    const htmlContent = editor.getContent();
    this.props.input.onChange(htmlContent);
  }

  render() {
    const {
      maxChars,
      id,
      label,
      input: {
        value,
        name,
      },
      meta: {
        submitFailed,
        error,
      },
      disabled,
    } = this.props;
    const remainingChars = maxChars - this.state.charCount;
    const characterLimitMessage = `Recommended character limit (including spaces) is
      ${maxChars}. ${remainingChars} characters remaining.`;

    let contentStyle;
    // In the test environment this causes an error so set styles to empty since they aren't needed for testing.
    try {
      contentStyle = [contentCss, contentUiCss].join('\n');
    } catch (err) {
      contentStyle = '';
    }

    return (
      <div className="form-group">
        <div id={id} name={name} tabIndex="-1" className="mb-2">{label}</div>
        {submitFailed && error
          && (
          <Alert variant="danger">{error}</Alert>
          )}
        {/*
          We are using aria-labelledby here instead of a <label> tag because the TinyMCE Editor
          adds an iframe instead of a standard tag that would be used with <label>. This was
          chosen as the best way to still label what the editor is used for.
          The <div> with the title stating what the Editor is for has the corresponding
          id to match the aria-labelledby.
        */}
        <div aria-labelledby={id} className={classNames({ 'disabled-rich-text': disabled })}>
          <Editor
            initialValue={value}
            init={{
              branding: false,
              menubar: false,
              plugins: 'legacyoutput link lists language directionality',
              statusbar: false,
              selector: `#${id}`,
              toolbar: 'undo redo | bold italic underline | bullist numlist | link | language | ltr rtl',
              entity_encoding: 'raw',
              extended_valid_elements: 'span[lang|id] -span',
              content_css: false,
              content_style: contentStyle,
              default_link_target: '_blank',
            }}
            onChange={this.updateCharCount}
            onKeyUp={this.updateCharCount}
            onInit={this.initCharCount}
            disabled={disabled}
          />
          {maxChars && <span>{characterLimitMessage}</span>}
        </div>
      </div>
    );
  }
}

RichEditor.defaultProps = {
  maxChars: null,
  disabled: false,
};

RichEditor.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  maxChars: PropTypes.number,
  input: PropTypes.shape({
    value: PropTypes.string,
    name: PropTypes.string,
    onChange: PropTypes.func.isRequired,
  }).isRequired,
  meta: PropTypes.shape({
    touched: PropTypes.bool,
    submitFailed: PropTypes.bool,
    error: PropTypes.string,
  }).isRequired,
  disabled: PropTypes.bool,
};

export default RichEditor;
