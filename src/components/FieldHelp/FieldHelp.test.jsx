import React from 'react';
import ReactTooltip from 'react-tooltip';
import {
  fireEvent, waitFor, render, screen,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import FieldHelp from './index';

jest.mock('react-tooltip');

describe('FieldHelp', () => {
  it('can toggle tooltip', async () => {
    render(<FieldHelp id="jest" tip={<p>Hello World</p>} />);

    expect(ReactTooltip.show).not.toHaveBeenCalled();
    expect(ReactTooltip.hide).not.toHaveBeenCalled();

    const button = await screen.findByRole('button');
    fireEvent.click(button);
    await waitFor(() => expect(ReactTooltip.show).toHaveBeenCalledTimes(1));
  });

  it('node gets converted to string', async () => {
    render(<FieldHelp id="jest" tip={<p>Hello World</p>} />);
    const fieldHelpData = screen.getByTestId('field-help-data');
    const dataTip = fieldHelpData.getAttribute('data-tip');
    expect(dataTip).toMatch(/<p>\s*Hello World\s*<\/p>/);
  });

  it('renders correctly when tip is a string', () => {
    render(<FieldHelp id="string-tip" tip="Simple text tip" />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    const fieldHelpData = screen.getByTestId('field-help-data');
    expect(fieldHelpData.getAttribute('data-tip')).toContain('Simple text tip');
  });

  it('renders correctly when tip is a number', () => {
    render(<FieldHelp id="number-tip" tip={12345} />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    const fieldHelpData = screen.getByTestId('field-help-data');
    expect(fieldHelpData.getAttribute('data-tip')).toContain('12345');
  });
});
