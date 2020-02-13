import React from 'react';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';

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
    },
    {
      label: 'Col 2',
      key: 'col2',
      columnSortable: false,
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
    const component = shallow(<TableComponent
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
      fetchEditorFilterOptions={() => true}
    />);
    expect(shallowToJson(component)).toMatchSnapshot();
  });

  it('shows an error', () => {
    const component = shallow(<TableComponent
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
    expect(shallowToJson(component)).toMatchSnapshot();
  });

  it('shows loading', () => {
    const component = shallow(<TableComponent
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
    expect(shallowToJson(component)).toMatchSnapshot();
  });

  it('shows an empty table', () => {
    const component = shallow(<TableComponent
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
    />);
    expect(shallowToJson(component)).toMatchSnapshot();
  });

  it('shows a populated table', () => {
    const component = shallow(<TableComponent
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
      data={mockFetch()}
      fetchEditorFilterOptions={() => true}
    />);
    expect(shallowToJson(component)).toMatchSnapshot();
  });

  it('shows a populated table after a component update for page', () => {
    const component = shallow(<TableComponent
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
      data={mockFetch()}
      fetchEditorFilterOptions={() => true}
    />);
    component.setProps({
      location: {
        search: '?page=2&ordering=key',
      },
    });
    expect(shallowToJson(component)).toMatchSnapshot();
  });

  it('shows a populated table after a component update for ordering', () => {
    const component = shallow(<TableComponent
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
      data={mockFetch()}
      fetchEditorFilterOptions={() => true}
    />);
    component.setProps({
      location: {
        search: '?page=1&ordering=-key',
      },
    });
    expect(shallowToJson(component)).toMatchSnapshot();
  });
});
