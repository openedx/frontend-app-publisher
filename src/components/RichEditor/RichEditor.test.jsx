import React from 'react';
import { render } from '@testing-library/react';
import RichEditor from './index';

describe('RichEditor', () => {
  it('shows a rich text editor with no default text value', () => {
    const { container } = render(<RichEditor
      label="Rich Text Editor Test"
      id="rich-text-editor-test"
      input={{
        value: null,
        onChange: () => null,
      }}
      maxChars={500}
      meta={{ touched: false, error: '' }}
    />);
    expect(container).toMatchSnapshot();
  });

  it('shows a rich text editor with default text value', () => {
    const { container } = render(<RichEditor
      label={<strong>Rich Text Editor Test</strong>}
      id="rich-text-editor-test"
      input={{
        value: '<p>Prior text<p>',
        onChange: () => null,
      }}
      maxChars={2500}
      meta={{ touched: false, error: '' }}
    />);
    expect(container).toMatchSnapshot();
  });

  it('shows a rich text editor with no maxChars', () => {
    const { container } = render(<RichEditor
      label={<strong>Rich Text Editor Test</strong>}
      id="rich-text-editor-test"
      input={{
        value: '<p>Prior text<p>',
        onChange: () => null,
      }}
      meta={{ touched: false, error: '' }}
    />);
    expect(container).toMatchSnapshot();
  });

  it('shows a rich text editor and an error', () => {
    const { container } = render(<RichEditor
      label="Rich Text Editor Test"
      id="rich-text-editor-test"
      input={{
        value: null,
        onChange: () => null,
      }}
      maxChars={500}
      meta={{ touched: true, error: 'Required' }}
    />);
    expect(container).toMatchSnapshot();
  });

  it.skip('change handlers are called', () => {
    // TODO: Update the test to work with RTL
    const onChange = jest.fn();
    const mockEditor = {
      getContent: jest.fn().mockImplementation(() => 'Hello, text'),
    };

    const component = render(<RichEditor
      label="Rich Text Editor Test"
      id="rich-text-editor-test"
      input={{
        value: null,
        onChange,
      }}
      maxChars={500}
      meta={{ touched: true, error: 'Required' }}
    />);
    const instance = component.instance();

    expect(instance.state.charCount).toEqual(0);
    expect(instance.state.value).toBeNull();

    const editorComponent = component.find('Editor');

    expect(editorComponent.exists()).toBe(true);
    editorComponent.prop('onEditorChange')('Hello, text', mockEditor);

    expect(onChange).toHaveBeenCalledWith('Hello, text');
    expect(mockEditor.getContent).toHaveBeenCalledTimes(2);
    // 'Hello, text' length
    expect(instance.state.charCount).toEqual(11);
    expect(instance.state.value).toEqual('Hello, text');
  });

  it.skip('componentDidUpdate updates state', () => {
    // TODO: Update the test to work with RTL
    const component = render(<RichEditor
      label="Rich Text Editor Test"
      id="rich-text-editor-test"
      input={{
        value: null,
        onChange: () => null,
      }}
      maxChars={500}
      meta={{ touched: true, error: 'Required' }}
    />);

    component.setProps({ input: { value: 'New Value' } });
    expect(component.instance().state.value).toEqual('New Value');
  });
});
