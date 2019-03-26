import apiClient from '../apiClient';

class DiscoveryDataApiService {
  static discoveryBaseUrl = `${process.env.DISCOVERY_API_BASE_URL}/api/v1`;

  static fetchCourse(uuid) {
    const url = `${DiscoveryDataApiService.discoveryBaseUrl}/courses/${uuid}/`;
    return apiClient.get(url);
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
      ...options,
    };
    const url = `${DiscoveryDataApiService.discoveryBaseUrl}/courses`;
    return apiClient.get(`${url}`, {
      params: queryParams,
    });
  }

  static fetchOrganizations() {
    const url = `${DiscoveryDataApiService.discoveryBaseUrl}/organizations/`;
    return apiClient.get(url);
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
    const url = `${DiscoveryDataApiService.discoveryBaseUrl}/courses/${uuid}/`;
    return apiClient.options(url);
  }

  static editCourse(courseData) {
    const { uuid } = courseData;
    const url = `${DiscoveryDataApiService.discoveryBaseUrl}/courses/${uuid}/`;
    // PATCH to Course endpoint to create
    return apiClient.patch(url, courseData);
  }

  static createInstructor(data) {
    const url = `${DiscoveryDataApiService.discoveryBaseUrl}/people/`;
    // POST to People endpoint to create
    return apiClient.post(url, data);
  }

  static fetchInstructorOptions() {
    const url = `${DiscoveryDataApiService.discoveryBaseUrl}/people/`;
    return apiClient.options(url);
  }
}

export default DiscoveryDataApiService;
