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

  static editCourse(courseData, courseRunData, newCourseRunData) {
    const { uuid } = courseData;
    const url = `${DiscoveryDataApiService.discoveryBaseUrl}/courses/${uuid}/`;
    // Create a promises array to handle all of the new/modified course runs
    const promises = courseRunData.map((courseRun) => {
      const courseRunUrl = `${DiscoveryDataApiService.discoveryBaseUrl}/course_runs/${courseRun.key}/`;
      return apiClient.patch(courseRunUrl, courseRun);
    });
    newCourseRunData.forEach((courseRun) => {
      /* eslint-disable no-param-reassign */
      courseRun.course = courseData.key; // Need key association set for creation
      /* eslint-enable no-param-reassign */
      const courseRunUrl = `${DiscoveryDataApiService.discoveryBaseUrl}/course_runs/`;
      promises.push(apiClient.post(courseRunUrl, courseRun));
    });
    // Add PATCH to Course endpoint to create to promises array
    promises.push(apiClient.patch(url, courseData));
    return Promise.all(promises);
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
