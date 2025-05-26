import React from 'react';
import { render, screen, within, waitFor, fireEvent } from '@testing-library/react';
import RichEditor from './index';
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event';


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

  it('change handlers are called', async () => {
    const onChange = jest.fn();
    const mockHandleEditorChange = jest.spyOn(RichEditor.prototype, 'handleEditorChange');

    const {container} = render(<RichEditor
      label="Rich Text Editor Test"
      id="rich-text-editor-test"
      input={{
        value: 'Start',
        onChange,
      }}
      maxChars={500}
      meta={{ touched: true, error: 'Required' }}
    />);
    
    // Initial render
    await waitFor(() => expect(container.querySelector('iframe').contentDocument.querySelector('#tinymce')).toBeInTheDocument());
    expect(await screen.findByText('Recommended character limit (including spaces) is 500. 495 characters remaining.')).toBeInTheDocument();
    await waitFor(() => expect(container.querySelector('iframe').contentDocument.querySelector('#tinymce').querySelector('p').textContent).toBe('Start'));

    
    // JSDOM does not support these, so stub them out
    container.querySelector('iframe').contentWindow.Range.prototype.getClientRects = () => ({
      item: () => null,
      length: 0,
      [Symbol.iterator]: jest.fn(),
    });

    container.querySelector('iframe').contentWindow.Range.prototype.getBoundingClientRect = () => ({
      top: 54,
      bottom: 86,
      left:20,
      right: 40
    });

    // Fire change, assert onEditorChange and onChange called with right props
    const input = container.querySelector('iframe').contentDocument.querySelector('#tinymce')
    fireEvent.keyUp(input, {target: {innerHTML: '<p>Hello World!</p>'}});

    expect(onChange).toHaveBeenLastCalledWith('<p>Hello World!</p>');
    await waitFor(() => expect(container.querySelector('iframe').contentDocument.querySelector('#tinymce').querySelector('p').textContent).toBe('Hello World!'));

    expect(mockHandleEditorChange).toHaveBeenLastCalledWith('<p>Hello World!</p>', expect.anything());
    expect(await screen.findByText('Recommended character limit (including spaces) is 500. 488 characters remaining.')).toBeInTheDocument();

  });

  it('componentDidUpdate updates state', async () => {
    const {container, rerender} = render(<RichEditor
      label="Rich Text Editor Test"
      id="rich-text-editor-test"
      input={{
        value: null,
        onChange: () => null,
      }}
      maxChars={500}
      meta={{ touched: true, error: 'Required' }}
    />);

    rerender(<RichEditor
      label="Rich Text Editor Test"
      id="rich-text-editor-test"
      input={{
        value: "New Value",
        onChange: () => null,
      }}
      maxChars={500}
      meta={{ touched: true, error: 'Required' }}
    />);

    let iframe = container.querySelector('iframe');
    await waitFor(() => expect(iframe.contentDocument.querySelector('p')).toBeInTheDocument());
    
    let tinymceContent = within(iframe.contentDocument.querySelector('p')).getByText('New Value');
    expect(tinymceContent).toBeInTheDocument();
  });
});
