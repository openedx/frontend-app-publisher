import axios from 'axios';

import DiscoveryDataApiService from './DiscoveryDataApiService';

const mockTask = {
  task_id: '123',
  task_type: 'course_create',
  uploaded_by: 'test-user',
  status: 'completed',
  created: '2023-01-01T00:00:00Z',
  modified: '2023-01-02T00:00:00Z',
  csv_file: 'https://example.com/file.csv',
  task_summary: null,
};

describe('fetchOrganizationUsers', () => {
  const get = jest.spyOn(axios, 'get');

  it('should resolve on a 404 response with null', () => {
    get.mockRejectedValue({ response: { status: 404 } });
    return DiscoveryDataApiService.fetchOrganizationUsers('test-id').then((response) => {
      expect(response).toEqual(null);
    });
  });

  it('should reject as expected if not a 404 response', () => {
    const mockError = { response: { status: 401 } };
    get.mockRejectedValue(mockError);
    return DiscoveryDataApiService.fetchOrganizationUsers('test-id').catch((error) => {
      expect(error).toEqual(mockError);
    });
  });
});

describe('fetchBulkOperationTask', () => {
  const taskId = 1;
  const expectedUrl = `${process.env.DISCOVERY_API_BASE_URL}/api/v1/bulk_operation_tasks/${taskId}/`;
  const get = jest.spyOn(axios, 'get');

  it('should fetch task successfully', async () => {
    const mockData = mockTask;
    get.mockResolvedValue({ data: mockData });

    const result = await DiscoveryDataApiService.fetchBulkOperationTask(taskId);
    expect(get).toHaveBeenCalledWith(expectedUrl);
    expect(result.data).toEqual(mockData);
  });

  it('should return null on 404 response', async () => {
    get.mockRejectedValue({ response: { status: 404 } });

    await expect(DiscoveryDataApiService.fetchBulkOperationTask(taskId)).rejects.toEqual({ response: { status: 404 } });
  });

  it('should reject for other error statuses', async () => {
    const mockError = { response: { status: 500 } };
    get.mockRejectedValue(mockError);

    await expect(DiscoveryDataApiService.fetchBulkOperationTask(taskId)).rejects.toEqual(mockError);
  });
});
