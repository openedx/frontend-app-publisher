import apiClient from '../apiClient';

class DiscoveryDataApiService {
  static discoveryBaseUrl = `${process.env.DISCOVERY_API_BASE_URL}/api/v1`;
  static autocompleteBaseUrl = `${process.env.DISCOVERY_API_BASE_URL}/admin/course_metadata`;

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
    const url = `${DiscoveryDataApiService.discoveryBaseUrl}/courses/`;
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

  static editCourseRuns(courseRunsData) {
    const queryParams = {
      exclude_utm: 1,
    };
    // Create a promises array to handle all of the new/modified course runs
    const promises = courseRunsData.map((courseRun) => {
      const courseRunUrl = `${DiscoveryDataApiService.discoveryBaseUrl}/course_runs/${courseRun.key}/`;
      return apiClient.patch(courseRunUrl, courseRun, {
        params: queryParams,
      });
    });
    return Promise.all(promises);
  }

  static editCourse(courseData) {
    const { uuid } = courseData;
    const queryParams = {
      exclude_utm: 1,
    };
    const url = `${DiscoveryDataApiService.discoveryBaseUrl}/courses/${uuid}/`;
    return apiClient.patch(url, courseData, {
      params: queryParams,
    });
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

  static autocompletePerson(text, organizationKeys) {
    const queryString = [`?q=${text}`];
    if (organizationKeys) {
      organizationKeys.reduce((accumulator, key) => accumulator.push(key), queryString);
    }
    const url = `${DiscoveryDataApiService.discoveryBaseUrl}/search/person_typeahead/${queryString.join('&org=')}`;
    return apiClient.get(url);
  }
}

export default DiscoveryDataApiService;
