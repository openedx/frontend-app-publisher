import React from 'react';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';

import RichEditor from './index';

describe('RichEditor', () => {
  it('shows a rich text editor with no default text value', () => {
    const component = shallow(<RichEditor
      label="Rich Text Editor Test"
      id="rich-text-editor-test"
      input={{
        value: null,
        onChange: () => null,
      }}
      maxChars={500}
      meta={{ touched: false, error: '' }}
    />);
    expect(shallowToJson(component)).toMatchSnapshot();
  });

  it('shows a rich text editor with default text value', () => {
    const component = shallow(<RichEditor
      label={<strong>Rich Text Editor Test</strong>}
      id="rich-text-editor-test"
      input={{
        value: '<p>Prior text<p>',
        onChange: () => null,
      }}
      maxChars={2500}
      meta={{ touched: false, error: '' }}
    />);
    expect(shallowToJson(component)).toMatchSnapshot();
  });

  it('shows a rich text editor with no maxChars', () => {
    const component = shallow(<RichEditor
      label={<strong>Rich Text Editor Test</strong>}
      id="rich-text-editor-test"
      input={{
        value: '<p>Prior text<p>',
        onChange: () => null,
      }}
      meta={{ touched: false, error: '' }}
    />);
    expect(shallowToJson(component)).toMatchSnapshot();
  });

  it('shows a rich text editor and an error', () => {
    const component = shallow(<RichEditor
      label="Rich Text Editor Test"
      id="rich-text-editor-test"
      input={{
        value: null,
        onChange: () => null,
      }}
      maxChars={500}
      meta={{ touched: true, error: 'Required' }}
    />);
    expect(shallowToJson(component)).toMatchSnapshot();
  });
});
