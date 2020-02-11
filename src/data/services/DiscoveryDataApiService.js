import apiClient from '../apiClient';
import { PAGE_SIZE } from '../constants/table';
import { from, throwError, forkJoin, of } from 'rxjs';
import { catchError, map, switchMap } from "rxjs/operators";
import { getErrorMessages } from "../../utils";


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
    return from(apiClient.get(url, { params: queryParams })).pipe(
      map(response => response.data),
      catchError(error => throwError(['Could not get course information.'].concat(getErrorMessages(error)))),
    );
  }

  static fetchCourseRun(key, params) {
    const queryParams = {
      editable: 1,
      exclude_utm: 1,
      ...params,
    };
    const url = `${DiscoveryDataApiService.discoveryBaseUrl}/course_runs/${key}`;
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
    const url = `${DiscoveryDataApiService.discoveryBaseUrl}/courses/`;
    return from(apiClient.get(url, { params: queryParams })).pipe(
      map(response => response.data),
    );
  }

  static fetchOrganizations() {
    const queryParams = {
      page: 1,
      page_size: 500,
      limit: 500,
    };
    const url = `${DiscoveryDataApiService.discoveryBaseUrl}/organizations/`;
    return from(apiClient.get(url, { params: queryParams })).pipe(
      map((response) => {
        if (response.data && response.data.results) {
          return response.data.results;
        }
        return [];
      }),
      catchError(error => throwError(['Unable to retrieve user Organizations, please contact support.'].concat(getErrorMessages(error)))),
    );
  }

  static createCourse(data) {
    const url = `${DiscoveryDataApiService.discoveryBaseUrl}/courses/`;
    // POST to Course endpoint to create
    return from(apiClient.post(url, data)).pipe(
      map(response => response.data),
      catchError(error => throwError(['Creation failed, please try again or contact support.'].concat(getErrorMessages(error)))),
    );
  }

  static createCourseRun(data) {
    const url = `${DiscoveryDataApiService.discoveryBaseUrl}/course_runs/`;
    return from(apiClient.post(url, data)).pipe(
      map(response => response.data),
      catchError((error) => {
        let errorList;
        if (!error.response || error.response.status === 504) {
          // See DISCO-1548. Basically, a course is so large that nginx kills requests before Studio
          // can finish copying content. So we add a custom message about this case.
          // In prod/stage, we see an 'undefined' response (axios eating it?) but the server does
          // return a 504 for this case. So handle both response values.
          errorList = ['Due to the quantity of content in this course, we anticipate a longer wait time for the creation of a new course run in Publisher. The run is now available in Studio in the meantime. Please check back in a business day or contact your Project Coordinator for help.'];
        } else {
          errorList = ['Course Run create failed, please try again or contact support.'].concat(getErrorMessages(error));
        }
        throwError(errorList);
      }),
    );
  }

  static fetchCourseOptions() {
    const queryParams = {
      editable: 1,
    };
    const url = `${DiscoveryDataApiService.discoveryBaseUrl}/courses/`;
    return from(apiClient.options(url, { params: queryParams })).pipe(
      map((response) => {
        const course = response.data;
        if (!course || !('actions' in course)) {
          return throwError('Did not understand response.');
        }
        return course;
      }),
      catchError(error => throwError(['Could not get course information.'].concat(getErrorMessages(error)))),
    );
  }

  static fetchCourseRunOptions() {
    const url = `${DiscoveryDataApiService.discoveryBaseUrl}/course_runs/`;
    return from(apiClient.options(url)).pipe(
      map((response) => {
        const courseRun = response.data;
        if (!courseRun || !('actions' in courseRun)) {
          return throwError('Did not understand response.');
        }
        return courseRun;
      }),
      catchError(error => throwError(['Could not get course run information.'].concat(getErrorMessages(error)))),
    );
  }

  static addCourseEditor(data) {
    const url = `${DiscoveryDataApiService.discoveryBaseUrl}/course_editors/`;
    return from(apiClient.post(url, data)).pipe(
      map(response => response.data),
      catchError(error => throwError(['Could not add course editor.'].concat(getErrorMessages(error)))),
    );
  }

  static removeCourseEditor(editorId) {
    const url = `${DiscoveryDataApiService.discoveryBaseUrl}/course_editors/${editorId}/`;
    return from(apiClient.delete(url)).pipe(catchError((error) => {
      throwError(['Could not remove course editor.'].concat(getErrorMessages(error)));
    }));
  }

  static fetchUsersForCurrentUser() {
    const queryParams = {
      page: 1,
      page_size: 250,
    };
    const url = `${DiscoveryDataApiService.publisherBaseUrl}/admins/organizations/users/`;
    return from(apiClient.get(url, { params: queryParams })).pipe(
      map((response) => {
        if (response.data && response.data.results) {
          return response.data.results.map(user => ({ id: user.id, name: user.full_name }));
        }
        return [];
      }),
    );
  }

  static fetchCourseEditors(courseId) {
    const queryParams = {
      course: courseId,
    };
    const url = `${DiscoveryDataApiService.discoveryBaseUrl}/course_editors/`;
    return from(apiClient.get(url, { params: queryParams })).pipe(
      map(response => (response.data ? response.data.results : [])),
      catchError(error => throwError(['Could not get course editors.'].concat(getErrorMessages(error)))),
    );
  }

  static fetchOrganizationRoles(ids, role) {
    const queryParams = {};
    if (role) {
      queryParams.role = role;
    }
    // const url = `${DiscoveryDataApiService.publisherBaseUrl}/admins/organizations/${id}/roles/`;
    // return apiClient.get(url, { params: queryParams });
    const responseObservables = ids.map(id => (
      from(apiClient.get(`${DiscoveryDataApiService.publisherBaseUrl}/admins/organizations/${id}/roles/`))
    ));
    return forkJoin(responseObservables).pipe(
      map((responses) => {
        // First, combine all the responses, removing duplicates
        const roles = {};
        responses.forEach((response) => {
          response.data.results.forEach((r) => {
            roles[r.id] = r;
          });
        });
        // Now we have an object that maps id -> full_names without duplicates.
        // Let's make it an array instead and sort it.
        const rolesArray = Object.values(roles);
        return rolesArray.sort((a, b) => (
          a.user.full_name.localeCompare(b.user.full_name) ||
          a.user.email.localeCompare(b.user.email)
        ));
      }),
      catchError(error => throwError(['Could not get organization roles.'].concat(getErrorMessages(error)))),
    );
  }

  static fetchOrganizationUsers(ids) {
    const responseObservables = ids.map(id => (
      from(apiClient.get(`${DiscoveryDataApiService.publisherBaseUrl}/admins/organizations/${id}/users/`))
        .pipe(catchError((error) => {
          if (error.response.status === 404) {
            return of();
          }
          return throwError(error);
        }))
    ));
    return forkJoin(responseObservables).pipe(
      map((responses) => {
        // First, combine all the responses, removing duplicates
        const users = {};
        responses.forEach((response) => {
          if (response) {
            response.data.results.forEach((user) => {
              users[user.id] = user;
            });
          }
        });
        // Now we have an object that maps id -> full_names without duplicates.
        // Let's make it an array instead and sort it.
        const usersArray = Object.values(users);
        return usersArray.sort((a, b) => (
          a.full_name.localeCompare(b.full_name) || a.email.localeCompare(b.email)
        ));
      }),
      catchError(error => throwError(['A problem occurred while retrieving users for this organization.'].concat(getErrorMessages(error)))),
    );
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
    return from(apiClient.get(url, { params: queryParams })).pipe(
      map(response => response.data),
      catchError(error => throwError(['Could not get course editors.'].concat(getErrorMessages(error)))),
    );
  }

  static createComment(data) {
    const url = `${DiscoveryDataApiService.discoveryBaseUrl}/comments/`;
    return from(apiClient.post(url, data)).pipe(
      map(response => response.data),
      catchError(error => throwError(['Comment create failed, please try again or contact support.'].concat(getErrorMessages(error)))),
    );
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
    return from(apiClient.post(url, data)).pipe(
      map(response => response.data),
      catchError(error => throwError(['Instructor create failed, please try again or contact support.'].concat(getErrorMessages(error)))),
    );
  }

  static fetchStaffer(uuid) {
    const url = `${DiscoveryDataApiService.discoveryBaseUrl}/people/${uuid}/`;
    return from(apiClient.get(url)).pipe(
      map(response => response.data),
      switchMap((stafferInfo) => {
        if (!stafferInfo || !('family_name' in stafferInfo)) {
          return throwError('Did not understand response.');
        }
        return of(stafferInfo);
      }),
      catchError(error => throwError(['Could not get instructor information.'].concat(getErrorMessages(error)))),
    );
  }

  static editStaffer(stafferData) {
    const { uuid } = stafferData;
    const url = `${DiscoveryDataApiService.discoveryBaseUrl}/people/${uuid}/`;
    // PATCH to People endpoint to update
    return from(apiClient.patch(url, stafferData)).pipe(
      map(response => response.data),
      catchError(error => throwError(['Edit instructor failed, please try again or contact support.'].concat(getErrorMessages(error)))),
    );
  }

  static autocompletePerson(text, organizationKeys) {
    const queryString = [`?q=${text}`].concat(organizationKeys);
    const url = `${DiscoveryDataApiService.discoveryBaseUrl}/search/person_typeahead/${queryString.join('&org=')}`;
    return apiClient.get(url);
  }
}

export default DiscoveryDataApiService;
