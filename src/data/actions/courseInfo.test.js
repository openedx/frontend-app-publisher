import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import {
  requestCourseInfoFail,
  fetchCourseInfo,
  requestCourseInfoSuccess,
  requestCourseInfo,
  clearCourseInfoErrors,
  createCourseFail,
  createCourseSuccess,
  createNewCourse,
  createNewCourseRun,
  createCourseRunSuccess,
  createCourseRunFail,
  editCourseInfo,
  editCourseSuccess,
  editCourseFail,
  clearCourseSaved,
  setCreateAlertOff,
  updateFormValuesAfterSave,
} from './courseInfo';
import * as types from '../constants/courseInfo';

const mockStore = configureMockStore([thunk]);
const mockClient = new MockAdapter(axios);

const uuid = '11111111-1111-1111-1111-111111111111';

describe('courseInfo fetch course actions', () => {
  afterEach(() => {
    mockClient.reset();
  });

  it('handles fetch success', () => {
    mockClient.onGet(`http://localhost:18381/api/v1/courses/${uuid}/`)
      .replyOnce(200, JSON.stringify({
        key: 'DemoX+TestCourse',
      }));

    const expectedActions = [
      requestCourseInfo(uuid),
      requestCourseInfoSuccess(uuid, { key: 'DemoX+TestCourse' }),
    ];
    const store = mockStore();

    return store.dispatch(fetchCourseInfo(uuid)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('handles fetch error code', () => {
    mockClient.onGet(`http://localhost:18381/api/v1/courses/${uuid}/`)
      .replyOnce(500, '');

    const expectedActions = [
      requestCourseInfo(uuid),
      requestCourseInfoFail(
        uuid,
        ['Could not get course information.', 'Request failed with status code 500.'],
      ),
    ];
    const store = mockStore();

    return store.dispatch(fetchCourseInfo(uuid)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('handles fetch with bad id', () => {
    const expectedActions = [
      requestCourseInfoFail(
        'test',
        ['Could not get course information. test is not a valid course UUID.'],
      ),
    ];
    const store = mockStore();

    return store.dispatch(fetchCourseInfo('test')).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});

describe('courseInfo create course actions', () => {
  it('should clear courseInfo errors', () => {
    const expectedAction = {
      type: types.CLEAR_COURSE_INFO_ERRORS,
    };
    expect(clearCourseInfoErrors()).toEqual(expectedAction);
  });

  it('should start new course', () => {
    const data = { name: 'test course data' };
    const expectedAction = {
      type: types.CREATE_COURSE,
      data,
    };
    expect(createNewCourse(data)).toEqual(expectedAction);
  });

  it('should succeed', () => {
    const data = { name: 'test course data' };
    const expectedAction = {
      type: types.CREATE_COURSE_SUCCESS,
      data,
    };
    expect(createCourseSuccess(data)).toEqual(expectedAction);
  });

  it('should fail', () => {
    const error = 'Test error';
    const expectedAction = {
      type: types.CREATE_COURSE_FAIL,
      error,
    };
    expect(createCourseFail(error)).toEqual(expectedAction);
  });
});

describe('courseInfo edit course actions', () => {
  it('should send edits for a course', () => {
    const courseData = {
      title: 'test course title',
      short_description: '<p>short&nbsp;</p>',
      full_description: '<p>long desc</p>',
      outcome: '<p>learn</p>',
      subjectPrimary: 'army',
      subjectSecondary: 'cats',
      imageSrc: 'http://updated.image.src/woo.small',
      prerequisites_raw: '<p>prereq updated</p>',
      level_type: 'Intermediate',
      learner_testimonials: '',
      faq: '',
      additional_information: '',
      syllabus_raw: '',
      videoSrc: '',
      mode: 'verified',
      price: '32.00',
      uuid,
    };
    const expectedAction = {
      type: types.EDIT_COURSE_INFO,
      courseData,
    };
    expect(editCourseInfo(courseData)).toEqual(expectedAction);
  });

  it('should succeed', () => {
    const data = {
      title: 'test course title',
      short_description: '<p>short&nbsp;</p>',
      full_description: '<p>long desc</p>',
      outcome: '<p>learn</p>',
      subjectPrimary: 'army',
      subjectSecondary: 'cats',
      imageSrc: 'http://updated.image.src/woo.small',
      prerequisites_raw: '<p>prereq updated</p>',
      level_type: 'Intermediate',
      learner_testimonials: '',
      faq: '',
      additional_information: '',
      syllabus_raw: '',
      videoSrc: '',
      mode: 'verified',
      price: '32.00',
      uuid,
    };
    const expectedAction = {
      type: types.EDIT_COURSE_SUCCESS,
      data,
    };
    expect(editCourseSuccess(data)).toEqual(expectedAction);
  });

  it('should fail', () => {
    const error = 'Edit Course Test error';
    const expectedAction = {
      type: types.EDIT_COURSE_FAIL,
      error,
    };
    expect(editCourseFail(error)).toEqual(expectedAction);
  });

  it('should call clear course saved', () => {
    const expectedAction = { type: types.CLEAR_COURSE_SAVED };
    expect(clearCourseSaved()).toEqual(expectedAction);
  });

  it('form value update after save is called with passed change method', () => {
    const changeMock = jest.fn();
    const store = mockStore();
    const formValues = {
      geoLocationLng: '45.0000',
      geoLocationLat: '50.0000',
      url_slug: 'test_slug',
      watchers: ['test@test.com'],
      tags: ['tag1', 'tag2'],
      in_year_value: {
        per_lead_usa: 10,
        per_lead_international: 20,
        per_click_usa: 25,
        per_click_international: 30,
      },
      additional_metadata: {
        certificate_info: {
          heading: 'Test Certificate',
          blurb: 'test blurb',
        },
      },
      imageSrc: 'http://updated.image.src/woo.small',
      course_runs: [
        {
          status: 'published',
          transcript_languages: ['en-us'],
        },
      ],
    };
    store.dispatch(updateFormValuesAfterSave(changeMock, formValues, formValues));

    expect(changeMock).toHaveBeenNthCalledWith(1, 'imageSrc', 'http://updated.image.src/woo.small');
    expect(changeMock).toHaveBeenNthCalledWith(2, 'geoLocationLat', '50.0000');
    expect(changeMock).toHaveBeenNthCalledWith(3, 'geoLocationLng', '45.0000');
    expect(changeMock).toHaveBeenNthCalledWith(4, 'tags', ['tag1', 'tag2']);
    expect(changeMock).toHaveBeenNthCalledWith(5, 'url_slug', 'test_slug');
    expect(changeMock).toHaveBeenNthCalledWith(6, 'watchers', ['test@test.com']);
    expect(changeMock).toHaveBeenNthCalledWith(7, 'in_year_value.per_lead_usa', 10);
    expect(changeMock).toHaveBeenNthCalledWith(8, 'in_year_value.per_lead_international', 20);
    expect(changeMock).toHaveBeenNthCalledWith(9, 'in_year_value.per_click_usa', 25);
    expect(changeMock).toHaveBeenNthCalledWith(10, 'in_year_value.per_click_international', 30);
    expect(changeMock).toHaveBeenNthCalledWith(11, 'additional_metadata.certificate_info.heading', 'Test Certificate');
    expect(changeMock).toHaveBeenNthCalledWith(12, 'additional_metadata.certificate_info.blurb', 'test blurb');
    expect(changeMock).toHaveBeenNthCalledWith(13, 'course_runs[0].status', 'published');
    expect(changeMock).toHaveBeenNthCalledWith(14, 'course_runs[0].transcript_languages', ['en-us']);
  });
});

describe('courseInfo create course run actions', () => {
  it('should clear courseInfo errors', () => {
    const expectedAction = {
      type: types.CLEAR_COURSE_INFO_ERRORS,
    };
    expect(clearCourseInfoErrors()).toEqual(expectedAction);
  });

  it('should start creating new course run', () => {
    const data = { start: '2019-03-04T00:00:00.000Z' };
    const expectedAction = {
      type: types.CREATE_COURSE_RUN,
      data,
    };
    expect(createNewCourseRun(data)).toEqual(expectedAction);
  });

  it('should succeed creating new course run', () => {
    const data = { name: 'test course data' };
    const expectedAction = {
      type: types.CREATE_COURSE_RUN_SUCCESS,
      data,
    };
    expect(createCourseRunSuccess(data)).toEqual(expectedAction);
  });

  it('should fail creating new course run', () => {
    const error = 'Test error';
    const expectedAction = {
      type: types.CREATE_COURSE_RUN_FAIL,
      error,
    };
    expect(createCourseRunFail(error)).toEqual(expectedAction);
  });

  it('should clear create course run status alert', () => {
    const expectedAction = {
      type: types.CLEAR_COURSE_RUN_ALERT,
    };
    expect(setCreateAlertOff()).toEqual(expectedAction);
  });
});
