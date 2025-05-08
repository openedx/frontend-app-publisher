import React from 'react';
import ReactTooltip from 'react-tooltip';
import {
  fireEvent, waitFor, render, screen,
} from '@testing-library/react';
import FieldHelp from './index';

jest.mock('react-tooltip');

describe('FieldHelp', () => {
  it('can toggle tooltip', async () => {
    const { container } = render(<FieldHelp id="jest" tip={<p>Hello World</p>} />);

    expect(ReactTooltip.show).not.toHaveBeenCalled();
    expect(ReactTooltip.show).not.toHaveBeenCalled();

    fireEvent.click(container);
    // wrapper.find('button').simulate('click');
    waitFor(() => expect(ReactTooltip.show).toHaveBeenCalledTimes(1));

    const button = await screen.findByRole('button');
    fireEvent.click(button);
    waitFor(() => expect(ReactTooltip.show).toHaveBeenCalledTimes(1));
  });

  it('node gets converted to string', async () => {
    await render(<FieldHelp id="jest" tip={<p>Hello World</p>} />);
    waitFor(() => expect(screen.findByTestId('field-help-data').prop('data-tip')).toMatch(/<p>\s*Hello World\s*<\/p>/));
  });
});
