import apiClient from '../apiClient';
import { PAGE_SIZE } from '../constants/table';

const discoveryBaseUrl = `${process.env.DISCOVERY_API_BASE_URL}/api/v1`;
const publisherBaseUrl = `${process.env.DISCOVERY_API_BASE_URL}/publisher/api`;


class DiscoveryDataApiService {
  static fetchCourse(uuid) {
    const queryParams = {
      editable: 1,
      exclude_utm: 1,
    };
    const url = `${discoveryBaseUrl}/courses/${uuid}/`;
    return apiClient.get(url, {
      params: queryParams,
    });
  }

  static fetchCourseRun(key, params) {
    const queryParams = {
      editable: 1,
      exclude_utm: 1,
      ...params,
    };
    const url = `${discoveryBaseUrl}/course_runs/${key}`;
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
      'editors',
      'course_run_statuses',
    ];
    const queryParams = {
      page: 1,
      page_size: PAGE_SIZE,
      fields: fields.join(),
      editable: 1,
      exclude_utm: 1,
      ...options,
    };
    const url = `${discoveryBaseUrl}/courses/`;
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
    const url = `${discoveryBaseUrl}/organizations/`;
    return apiClient.get(url, {
      params: queryParams,
    });
  }

  static createCourse(data) {
    const url = `${discoveryBaseUrl}/courses/`;
    // POST to Course endpoint to create
    return apiClient.post(url, data);
  }

  static createCourseRun(data) {
    const url = `${discoveryBaseUrl}/course_runs/`;
    return apiClient.post(url, data);
  }

  static fetchCourseOptions() {
    const queryParams = {
      editable: 1,
    };
    const url = `${discoveryBaseUrl}/courses/`;
    return apiClient.options(url, {
      params: queryParams,
    });
  }

  static fetchCourseRunOptions() {
    const url = `${discoveryBaseUrl}/course_runs/`;
    return apiClient.options(url);
  }

  static addCourseEditor(data) {
    const url = `${discoveryBaseUrl}/course_editors/`;
    return apiClient.post(url, data);
  }

  static removeCourseEditor(editorId) {
    const url = `${discoveryBaseUrl}/course_editors/${editorId}/`;
    return apiClient.delete(url);
  }

  static fetchUsersForCurrentUser() {
    const queryParams = {
      page: 1,
      page_size: 250,
    };
    const url = `${publisherBaseUrl}/admins/organizations/users/`;
    return apiClient.get(url, { params: queryParams });
  }

  static fetchCourseEditors(courseId) {
    const queryParams = {
      course: courseId,
    };
    const url = `${discoveryBaseUrl}/course_editors/`;
    return apiClient.get(url, { params: queryParams });
  }

  static fetchOrganizationRoles(id, role) {
    const queryParams = {};
    if (role) {
      queryParams.role = role;
    }
    const url = `${publisherBaseUrl}/admins/organizations/${id}/roles/`;
    return apiClient.get(url, { params: queryParams });
  }

  static fetchOrganizationUsers(id) {
    const url = `${publisherBaseUrl}/admins/organizations/${id}/users/`;
    return new Promise((resolve, reject) => apiClient.get(url)
      .then(response => resolve(response))
      .catch((error) => {
        if (error.response.status === 404) {
          resolve(null);
        } else {
          reject(error);
        }
      }));
  }

  static editCourseRuns(courseRunsData) {
    const queryParams = {
      exclude_utm: 1,
    };
    // Create a promises array to handle all of the new/modified course runs
    const promises = courseRunsData.map((courseRun) => {
      const courseRunUrl = `${discoveryBaseUrl}/course_runs/${courseRun.key}/`;
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
    const url = `${discoveryBaseUrl}/comments/`;
    return apiClient.get(url, { params: queryParams });
  }

  static createComment(data) {
    const url = `${discoveryBaseUrl}/comments/`;
    return apiClient.post(url, data);
  }

  static internalReviewEdit(courseRun) {
    const queryParams = {
      exclude_utm: 1,
    };
    const { key } = courseRun;
    const body = { ...courseRun };
    const courseRunUrl = `${discoveryBaseUrl}/course_runs/${key}/`;
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
    const url = `${discoveryBaseUrl}/courses/${uuid}/`;
    return apiClient.patch(url, courseData, {
      params: queryParams,
    });
  }

  static createStaffer(data) {
    const url = `${discoveryBaseUrl}/people/`;
    // POST to People endpoint to create
    return apiClient.post(url, data);
  }

  static fetchStaffer(uuid) {
    const url = `${discoveryBaseUrl}/people/${uuid}/`;
    return apiClient.get(url);
  }

  static editStaffer(stafferData) {
    const { uuid } = stafferData;
    const url = `${discoveryBaseUrl}/people/${uuid}/`;
    // PATCH to People endpoint to update
    return apiClient.patch(url, stafferData);
  }

  static autocompletePerson(text, organizationKeys) {
    const queryString = [`?q=${text}`].concat(organizationKeys);
    const url = `${discoveryBaseUrl}/search/person_typeahead/${queryString.join('&org=')}`;
    return apiClient.get(url);
  }
}

export default DiscoveryDataApiService;
