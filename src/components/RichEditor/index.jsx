import React from 'react';
import PropTypes from 'prop-types';

import { Editor } from '@tinymce/tinymce-react';
import 'tinymce/tinymce.min';
import 'tinymce/plugins/legacyoutput';
import 'tinymce/plugins/link';
import 'tinymce/plugins/lists';
import 'tinymce/themes/silver/theme';
import 'style-loader!tinymce/skins/ui/oxide/skin.min.css'; // eslint-disable-line import/no-webpack-loader-syntax, import/no-unresolved
import StatusAlert from '../StatusAlert';


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
      },
      meta: {
        touched,
        error,
      },
    } = this.props;
    const remainingChars = maxChars - this.state.charCount;
    const characterLimitMessage = `Recommended character limit (including spaces) is
      ${maxChars}. ${remainingChars} characters remaining.`;

    return (
      <React.Fragment>
        <div id={id} className="form-group mt-3">{label}</div>
        {touched && error &&
          <StatusAlert
            alertType="danger"
            message={error}
          />
        }
        {/*
          We are using aria-labelledby here instead of a <label> tag because the TinyMCE Editor
          adds an iframe instead of a standard tag that would be used with <label>. This was
          chosen as the best way to still label what the editor is used for.
          The <div> with the title stating what the Editor is for has the corresponding
          id to match the aria-labelledby.
        */}
        <div aria-labelledby={id}>
          <Editor
            initialValue={value}
            init={{
              branding: false,
              menubar: false,
              plugins: 'legacyoutput link lists',
              statusbar: false,
              toolbar: 'undo redo | bold italic underline | bullist numlist | link',
            }}
            onChange={this.updateCharCount}
            onKeyUp={this.updateCharCount}
            onInit={this.initCharCount}
          />
          {maxChars && <span>{characterLimitMessage}</span>}
        </div>
      </React.Fragment>
    );
  }
}

RichEditor.defaultProps = {
  maxChars: null,
};

RichEditor.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  maxChars: PropTypes.number,
  input: PropTypes.shape({
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
  }).isRequired,
  meta: PropTypes.shape({
    touched: PropTypes.bool,
    error: PropTypes.string,
  }).isRequired,
};

export default RichEditor;
