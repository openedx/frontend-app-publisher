import { useCallback, useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import {
  DataTable, Alert, DropdownFilter
} from '@openedx/paragon';

import Collapsible from '../Collapsible';
import { formatDate } from '../../utils';
import DiscoveryDataApiService from '../../data/services/DiscoveryDataApiService';
import './BulkOperations.scss';

const HistoricalRecords = () => {
  const [isLoading, setIsLoading] = useState(true);

  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [historicalRecords, setHistoricalRecords] = useState(null);

  const [isError, setIsError] = useState(false);

  const prevStatus = useRef();

  const RECORDS_PER_PAGE = 10;

  const fetchData = useCallback((params) => {
    let statusFilter = params.filters.find(f => f.id === 'status')?.value;

    if (prevStatus.current !== statusFilter && params.pageIndex !== 0){
        prevStatus.current = statusFilter;
        return;
    }
    
    prevStatus.current = statusFilter;
    fetchBulkOpTasks(params.pageIndex, params.pageSize, statusFilter);
  }, [])

  async function fetchBulkOpTasks(pageNum, pageSize, statusFilter) {
    setIsLoading(true);
    try {
      const response = await DiscoveryDataApiService.fetchBulkOperations(pageNum, pageSize, statusFilter);
      setHistoricalRecords(response.data.results);
      setTotalItems(response.data.count);
      setTotalPages(Math.ceil(response.data.count / pageSize))
    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }

  function getCollapsibleTitle() {
    return <span className="font-weight-bold">Processing History</span>;
  }

  return (
    <Collapsible title={getCollapsibleTitle()}>
      {isError && (
        <Alert variant="danger">Failed to fetch historical tasks. Please try reloading the page</Alert>
      )}

      <DataTable
        isLoading={isLoading}
        isFilterable
        manualFilters
        isPaginated
        manualPagination
        initialState={{
        pageSize: RECORDS_PER_PAGE,
        pageIndex: 0,
        }}
        itemCount={totalItems}
        pageCount={totalPages}
        fetchData={fetchData}
        data={historicalRecords ?? []}
        columns={[
        {
          Header: 'Date',
          accessor: row => formatDate(row.created),
          disableFilters: true,
        },
        {
          Header: 'Filename',
          accessor: row => row.csv_file.split('/').pop(),
          Cell: ({value, row}) => <Link to={`/bulk-operation-tasks/${row.original.id}`}>{value}</Link>,
          disableFilters: true,
        },
        {
          Header: 'Status',
          accessor: 'status',
          Cell: ({value}) => {return (
              <span className={classNames(
              {
                  badge: true,
                  'text-capitalize': true,
                  'badge-danger': value.toLowerCase() === 'failed',
                  'badge-success': value.toLowerCase() === 'completed',
                  'badge-warning': value.toLowerCase() === 'processing',
                  'badge-info': value.toLowerCase() === 'pending',
              },
              )}>
              {value}
              </span>
          )},
          Filter: DropdownFilter,
          filter: 'equals',
          filterChoices: [
          {
              name: 'Pending',
              value: 'pending',
          },
          {
              name: 'Processing',
              value: 'processing',
          },
          {
              name: 'Completed',
              value: 'completed',
          },
          {
              name: 'Failed',
              value: 'failed',
          },
          ]
        },
        {
          Header: 'Operation',
          accessor: row => row.task_type,
          disableFilters: true,
        },
        ]}
      />
    </Collapsible>
  );
  
};

export default HistoricalRecords;
