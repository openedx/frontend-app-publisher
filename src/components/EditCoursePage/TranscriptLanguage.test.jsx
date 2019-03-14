import React from 'react';
import { shallow } from 'enzyme';

import TranscriptLanguage from './TranscriptLanguage';

const languageOptions = [{
  label: 'Arabic - United Arab Emirates',
  value: 'ar-ae',
}];

describe('Transcript Language', () => {
  it('renders correctly with no fields', () => {
    const component = shallow(<TranscriptLanguage
      fields={[]}
      languageOptions={languageOptions}
    />);
    expect(component).toMatchSnapshot();
  });

  it('renders correctly when given fields', () => {
    const component = shallow(<TranscriptLanguage
      fields={[{}]}
      languageOptions={languageOptions}
    />);
    expect(component).toMatchSnapshot();
  });

  it('adds fields when the add button is pushed', () => {
    const fields = [{}];
    const component = shallow(<TranscriptLanguage
      fields={fields}
      languageOptions={languageOptions}
    />);
    expect(fields.length).toEqual(1);

    component.find('.js-add-button').simulate('click');
    expect(fields.length).toEqual(2);
  });
});
