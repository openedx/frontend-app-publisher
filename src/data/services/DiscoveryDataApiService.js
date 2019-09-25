import apiClient from '../apiClient';


class DiscoveryDataApiService {
  static autocompleteBaseUrl = `${process.env.DISCOVERY_API_BASE_URL}/admin/course_metadata`;
  static discoveryBaseUrl = `${process.env.DISCOVERY_API_BASE_URL}/api/v1`;
  static publisherBaseUrl = `${process.env.DISCOVERY_API_BASE_URL}/publisher/api`;

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
      'key_for_reruns',
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

  static fetchCourseOptions() {
    const queryParams = {
      editable: 1,
    };
    const url = `${DiscoveryDataApiService.discoveryBaseUrl}/courses/`;
    return apiClient.options(url, {
      params: queryParams,
    });
  }

  static fetchCourseRunOptions() {
    const url = `${DiscoveryDataApiService.discoveryBaseUrl}/course_runs/`;
    return apiClient.options(url);
  }

  static addCourseEditor(data) {
    const url = `${DiscoveryDataApiService.discoveryBaseUrl}/course_editors/`;
    return apiClient.post(url, data);
  }

  static removeCourseEditor(editorId) {
    const url = `${DiscoveryDataApiService.discoveryBaseUrl}/course_editors/${editorId}/`;
    return apiClient.delete(url);
  }

  static fetchCourseEditors(courseId) {
    const queryParams = {
      course: courseId,
    };
    const url = `${DiscoveryDataApiService.discoveryBaseUrl}/course_editors/`;
    return apiClient.get(url, { params: queryParams });
  }

  static fetchOrganizationRoles(id, role) {
    const queryParams = {};
    if (role) {
      queryParams.role = role;
    }
    const url = `${DiscoveryDataApiService.publisherBaseUrl}/admins/organizations/${id}/roles/`;
    return apiClient.get(url, { params: queryParams });
  }

  static fetchOrganizationUsers(id) {
    const url = `${DiscoveryDataApiService.publisherBaseUrl}/admins/organizations/${id}/users/`;
    return apiClient.get(url);
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

  static fetchComments(id) {
    const queryParams = {
      course_uuid: id,
    };
    const url = `${DiscoveryDataApiService.discoveryBaseUrl}/comments/`;
    return apiClient.get(url, { params: queryParams });
  }

  static createComment(data) {
    const url = `${DiscoveryDataApiService.discoveryBaseUrl}/comments/`;
    return apiClient.post(url, data);
  }

  static internalReviewEdit(courseRun) {
    const queryParams = {
      exclude_utm: 1,
    };
    const { key } = courseRun;
    const body = Object.assign({}, courseRun);
    const courseRunUrl = `${DiscoveryDataApiService.discoveryBaseUrl}/course_runs/${key}/`;
    // Remove key param from body for API validation
    delete body.key;

    return apiClient.patch(courseRunUrl, body, {
      params: queryParams,
    });
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
