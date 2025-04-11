import React from 'react';
import { render, waitFor } from '@testing-library/react';

import { IntlProvider } from '@edx/frontend-platform/i18n';
import TableComponent from './index';

describe('CourseTable', () => {
  const mockFormat = data => data.map(datum => ({
    ...datum,
  }));
  const mockColumns = [
    {
      label: 'Col 1',
      key: 'col1',
      columnSortable: true,
      accessor: 'col1',
    },
    {
      label: 'Col 2',
      key: 'col2',
      columnSortable: false,
      accessor: 'col2',
    },
  ];
  const mockFetch = () => [
    {
      col1: 'Test11',
      col2: 'Test12',
    },
    {
      col1: 'Test21',
      col2: 'Test22',
    },
  ];

  it('shows a table', () => {
    const { container } = render(<TableComponent
      id="test"
      className="test"
      fetchMethod={mockFetch}
      columns={mockColumns}
      formatData={mockFormat}
      tableSortable
      pageCount={1}
      itemCount={2}
      paginateTable={() => true}
      sortTable={() => true}
      clearTable={() => true}
      location={{ search: '?page=1&ordering=key' }}
      fetchEditorFilterOptions={() => true}
    />);
    waitFor(() => expect(container).toMatchSnapshot());
  });

  it('shows an error', () => {
    const { container } = render(<TableComponent
      id="test"
      className="test"
      fetchMethod={mockFetch}
      columns={mockColumns}
      formatData={mockFormat}
      error={new Error('Test error')}
      tableSortable
      pageCount={1}
      paginateTable={() => true}
      sortTable={() => true}
      clearTable={() => true}
      location={{ search: '?page=1&ordering=key' }}
      fetchEditorFilterOptions={() => true}
    />);
    waitFor(() => expect(container).toMatchSnapshot());
  });

  it('shows loading', () => {
    const { container } = render(<TableComponent
      id="test"
      className="test"
      fetchMethod={mockFetch}
      columns={mockColumns}
      formatData={mockFormat}
      tableSortable
      pageCount={1}
      paginateTable={() => true}
      sortTable={() => true}
      clearTable={() => true}
      location={{ search: '?page=1&ordering=key' }}
      loading
      fetchEditorFilterOptions={() => true}
    />);
    waitFor(() => expect(container).toMatchSnapshot());
  });

  it('shows an empty table', () => {
    const { container } = render(
      <IntlProvider locale="en">
        <TableComponent
          id="test"
          className="test"
          fetchMethod={mockFetch}
          columns={mockColumns}
          formatData={mockFormat}
          tableSortable
          pageCount={1}
          paginateTable={() => true}
          sortTable={() => true}
          clearTable={() => true}
          location={{ search: '?page=1&ordering=key' }}
          data={[]}
          fetchEditorFilterOptions={() => true}
        />
      </IntlProvider>,
    );
    waitFor(() => expect(container).toMatchSnapshot());
  });

  it('shows a populated table', () => {
    const { container } = render(
      <IntlProvider locale="en">
        <TableComponent
          id="test"
          className="test"
          fetchMethod={mockFetch}
          columns={mockColumns}
          formatData={mockFormat}
          tableSortable
          pageCount={1}
          itemCount={2}
          paginateTable={() => true}
          sortTable={() => true}
          clearTable={() => true}
          location={{ search: '?page=1&ordering=key' }}
          data={mockFetch()}
          fetchEditorFilterOptions={() => true}
        />
      </IntlProvider>,
    );
    waitFor(() => expect(container).toMatchSnapshot());
  });

  it('shows a populated table after a component update for page', () => {
    const defaultProps = {
      id: 'test',
      className: 'test',
      fetchMethod: mockFetch,
      columns: mockColumns,
      formatData: mockFormat,
      tableSortable: true,
      pageCount: 1,
      itemCount: 2,
      paginateTable: () => true,
      sortTable: () => true,
      clearTable: () => true,
      location: { search: '?page=1&ordering=key' },
      data: mockFetch(),
      fetchEditorFilterOptions: () => true,
    };
    const { rerender, container } = render(
      <IntlProvider locale="en">
        <TableComponent
          {...defaultProps}
        />
      </IntlProvider>,
    );
    const updatedProps = { ...defaultProps, location: { search: '?page=2&ordering=key' } };
    rerender(<IntlProvider locale="en"><TableComponent {...updatedProps} /></IntlProvider>);
    waitFor(() => expect(container).toMatchSnapshot());
  });

  it('shows a populated table after a component update for ordering', () => {
    const defaultProps = {
      id: 'test',
      className: 'test',
      fetchMethod: mockFetch,
      columns: mockColumns,
      formatData: mockFormat,
      tableSortable: true,
      pageCount: 1,
      itemCount: 2,
      paginateTable: () => true,
      sortTable: () => true,
      clearTable: () => true,
      location: { search: '?page=1&ordering=key' },
      data: mockFetch(),
      fetchEditorFilterOptions: () => true,
    };
    const { rerender, container } = render(
      <IntlProvider locale="en">
        <TableComponent
          {...defaultProps}
        />
      </IntlProvider>,
    );
    const updatedProps = { ...defaultProps, location: { search: '?page=1&ordering=-key' } };
    rerender(<IntlProvider locale="en"><TableComponent {...updatedProps} /></IntlProvider>);
    waitFor(() => expect(container).toMatchSnapshot());
  });
});
