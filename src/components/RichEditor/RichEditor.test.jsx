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
    const mockHandleOnChange = jest.spyOn(RichEditor.prototype, 'handleOnChange');

    const {container} = render(<RichEditor
      label="Rich Text Editor Test"
      id="rich-text-editor-test"
      input={{
        value: 'St',
        onChange,
      }}
      maxChars={500}
      meta={{ touched: true, error: 'Required' }}
    />);

    
    // const user = await userEvent.setup();
    await waitFor(() => expect(container.querySelector('iframe').contentDocument.querySelector('#tinymce')).toBeInTheDocument());
    
    // Assert 0 and null
    expect(await screen.findByText('Recommended character limit (including spaces) is 500. 498 characters remaining.')).toBeInTheDocument();
    await waitFor(() => expect(container.querySelector('iframe').contentDocument.querySelector('#tinymce').querySelector('p').textContent).toBe('St'));


    // Fire change, assert onEditorChange and onChange called with right props
  
    const input = container.querySelector('iframe').contentDocument.querySelector('#tinymce')
    // const input = container.querySelector('textarea')
    
    console.error('OH', input);

    fireEvent.input(input, {target: {innerHTML: '<p>EDRDD</p>'}});
    // await userEvent.keyboard('My boi')
    
    
    // await userEvent.type(input, 'Please');

    await new Promise(res => setTimeout(res, 3000));

    // container.querySelector('iframe').contentWindow.Range.prototype.getClientRects = () => ({
    //   item: () => null,
    //   length: 0,
    //   [Symbol.iterator]: jest.fn(),
    // });
    // container.querySelector('iframe').contentWindow.HTMLElement.prototype.getClientRects = () => ({
    //   item: () => null,
    //   length: 0,
    //   [Symbol.iterator]: jest.fn(),
    // });

    container.querySelector('iframe').contentWindow.Range.prototype.getBoundingClientRect = () => ({
      top: 54,
      bottom: 86,
      left:20,
      right: 40
    });
    // container.querySelector('iframe').contentWindow.HTMLElement.prototype.getBoundingClientRect = () => ({
    //   top: 54,
    //   bottom: 86,
    //   left:20,
    //   right: 40
    // });

    // fireEvent.change(input);

    // await waitFor(() => expect(container.querySelector('iframe').contentDocument.querySelector('#tinymce').querySelector('p').textContent).toBe('EDRDD'));
    
    // window.HTMLElement.prototype.getClientRects = () => [];
    // container.querySelector('iframe').contentWindow.HTMLElement.prototype.getClientRects = () => [];
    fireEvent.keyUp(input)

    // editorComponent.prop('onEditorChange')('Hello, text', mockEditor);

    expect(onChange).toHaveBeenLastCalledWith('<p>EDRDD</p>');
    await waitFor(() => expect(container.querySelector('iframe').contentDocument.querySelector('#tinymce').querySelector('p').textContent).toBe('EDRDD'));

    expect(mockHandleOnChange).toHaveBeenCalledTimes(1);

    // expect(instance.state.charCount).toEqual(11);
    // expect(instance.state.value).toEqual('Hello, text');
  });

  it('componentDidUpdate updates state', async () => {
    const {container, rerender} = render(<RichEditor
      label="Rich Text Editor Test"
      id="rich-text-editor-test"
      input={{
        value: "This is amazing",
        onChange: () => null,
      }}
      maxChars={500}
      meta={{ touched: true, error: 'Required' }}
    />);

    
    let iframe = await container.querySelector('iframe');

    console.error(iframe, 'POO')
    
    console.error(iframe.contentDocument.readyState, 'PAPA')
    
    await waitFor(() => expect(iframe.contentDocument.querySelector('#tinymce').querySelector('p')).toBeInTheDocument());

    console.error(iframe.contentDocument.querySelector('#tinymce').querySelector('p').textContent, 'FINALE');

    rerender(<RichEditor
      label="Rich Text Editor Test"
      id="rich-text-editor-test"
      input={{
        value: "WOAH HOAH",
        onChange: () => null,
      }}
      maxChars={500}
      meta={{ touched: true, error: 'Required' }}
    />);


    console.error(iframe.contentDocument.querySelector('#tinymce').querySelector('p').textContent, 'DINALE');


  });
});
