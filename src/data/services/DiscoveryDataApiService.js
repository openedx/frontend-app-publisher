import apiClient from '../apiClient';

class DiscoveryDataApiService {
  static discoveryBaseUrl = `${process.env.DISCOVERY_API_BASE_URL}/api/v1`;

  static fetchCourse(uuid) {
    const queryParams = {
      editable: 1,
      exclude_utm: 1,
    };
    const url = `${DiscoveryDataApiService.discoveryBaseUrl}/courses/${uuid}/`;
    return apiClient.get(url, {
      params: queryParams,
      editable: 1,
    });
  }

  static fetchCourses(options) {
    const fields = [
      'uuid',
      'key',
      'title',
      'modified',
      'owners',
    ];
    const queryParams = {
      page: 1,
      page_size: 50,
      fields: fields.join(),
      editable: 1,
      exclude_utm: 1,
      ...options,
    };
    const url = `${DiscoveryDataApiService.discoveryBaseUrl}/courses`;
    return apiClient.get(url, {
      params: queryParams,
    });
  }

  static fetchOrganizations() {
    const queryParams = {
      page: 1,
      page_size: 500,
      limit: 500,
    };
    const url = `${DiscoveryDataApiService.discoveryBaseUrl}/organizations/`;
    return apiClient.get(url, {
      params: queryParams,
    });
  }

  static createCourse(data) {
    const url = `${DiscoveryDataApiService.discoveryBaseUrl}/courses/`;
    // POST to Course endpoint to create
    return apiClient.post(url, data);
  }

  static createCourseRun(data) {
    const url = `${DiscoveryDataApiService.discoveryBaseUrl}/course_runs/`;
    return apiClient.post(url, data);
  }

  static fetchCourseOptions(uuid) {
    const queryParams = {
      editable: 1,
    };
    const url = `${DiscoveryDataApiService.discoveryBaseUrl}/courses/${uuid}/`;
    return apiClient.options(url, {
      params: queryParams,
    });
  }

  static fetchCourseRunOptions() {
    const url = `${DiscoveryDataApiService.discoveryBaseUrl}/course_runs/`;
    return apiClient.options(url);
  }

  static editCourse(courseData, courseRunData) {
    const { uuid } = courseData;
    const url = `${DiscoveryDataApiService.discoveryBaseUrl}/courses/${uuid}/`;
    // Create a promises array to handle all of the new/modified course runs
    const promises = courseRunData.map((courseRun) => {
      const courseRunUrl = `${DiscoveryDataApiService.discoveryBaseUrl}/course_runs/${courseRun.key}/`;
      return apiClient.patch(courseRunUrl, courseRun);
    });
    // Add PATCH to Course endpoint to create to promises array
    promises.push(apiClient.patch(url, courseData));
    return Promise.all(promises);
  }

  static createStaffer(data) {
    const url = `${DiscoveryDataApiService.discoveryBaseUrl}/people/`;
    // POST to People endpoint to create
    return apiClient.post(url, data);
  }

  static fetchStafferOptions() {
    const url = `${DiscoveryDataApiService.discoveryBaseUrl}/people/`;
    return apiClient.options(url);
  }

  static fetchStaffer(uuid) {
    const url = `${DiscoveryDataApiService.discoveryBaseUrl}/people/${uuid}/`;
    return apiClient.get(url);
  }

  static editStaffer(stafferData) {
    const { uuid } = stafferData;
    const url = `${DiscoveryDataApiService.discoveryBaseUrl}/people/${uuid}/`;
    // PATCH to People endpoint to update
    return apiClient.patch(url, stafferData);
  }
}

export default DiscoveryDataApiService;
