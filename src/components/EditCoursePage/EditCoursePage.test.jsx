import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { mount, shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import configureStore from 'redux-mock-store';
import EditCoursePage from './index';

import ConfirmationModal from '../ConfirmationModal';
import StatusAlert from '../StatusAlert';

import {
  PUBLISHED, REVIEW_BY_INTERNAL, REVIEW_BY_LEGAL, UNPUBLISHED,
} from '../../data/constants';
import { courseOptions, courseRunOptions } from '../../data/constants/testData';
import { jsonDeepCopy } from '../../utils';

// Need to mock the Editor as we don't want to test TinyMCE
jest.mock('@tinymce/tinymce-react');

const mockStore = configureStore();

describe('EditCoursePage', () => {
  const defaultPrice = '77';
  const defaultEnd = '2019-08-14T00:00:00Z';

  const courseInfo = {
    data: {
      additional_information: '',
      course_runs: [
        {
          key: 'edX101+DemoX+T2',
          start: '2019-05-14T00:00:00Z',
          end: defaultEnd,
          expected_program_type: 'micromasters',
          expected_program_name: 'Test Program Name',
          go_live_date: '2019-05-06T00:00:00Z',
          min_effort: 10,
          max_effort: 123,
          pacing_type: 'instructor_paced',
          content_language: 'en-us',
          transcript_languages: ['en-us'],
          weeks_to_complete: 100,
          seats: [],
          staff: [],
          status: UNPUBLISHED,
          draft: undefined,
          marketing_url: null,
          has_ofac_restrictions: false,
          ofac_comment: '',
          run_type: '4e260c57-24ef-46c1-9a0d-5ec3a30f6b0c',
          external_key: null,
        },
        {
          key: 'edX101+DemoX+T1',
          start: '2019-05-14T00:00:00Z',
          end: defaultEnd,
          expected_program_type: null,
          expected_program_name: '',
          go_live_date: '2019-05-06T00:00:00Z',
          min_effort: 10,
          max_effort: 123,
          pacing_type: 'instructor_paced',
          content_language: 'en-us',
          transcript_languages: ['en-us'],
          weeks_to_complete: 100,
          seats: [],
          staff: [],
          status: PUBLISHED,
          draft: undefined,
          marketing_url: null,
          has_ofac_restrictions: false,
          ofac_comment: '',
          run_type: '4e260c57-24ef-46c1-9a0d-5ec3a30f6b0c',
          external_key: null,
        },
      ],
      entitlements: [
        {
          mode: 'verified',
          price: defaultPrice,
          currency: 'USD',
          sku: '000000D',
          expires: null,
        },
      ],
      faq: '',
      full_description: '<p>long desc</p>',
      image: {
        src: 'http://path/to/image/woo.small',
        width: null,
        height: null,
        description: null,
      },
      key: 'edX+Test101x',
      collaborators: [],
      learner_testimonials: null,
      level_type: 'intermediate',
      outcome: '<p>learn</p>',
      prerequisites_raw: '<p>prereq</p>',
      short_description: '<p>short&nbsp;</p>',
      subjects: [
        {
          banner_image_url: null,
          card_image_url: null,
          description: '',
          name: 'Security',
          slug: 'security',
          subtitle: null,
          uuid: '00000000-0000-0000-0000-000000000001',
        }, {
          banner_image_url: null,
          card_image_url: null,
          description: '',
          name: 'Chemistry',
          slug: 'chemistry',
          subtitle: null,
          uuid: '00000000-0000-0000-0000-000000000002',
        },
      ],
      syllabus_raw: '',
      title: 'Test title',
      type: '8a8f30e1-23ce-4ed3-a361-1325c656b67b',
      uuid: '00000000-0000-0000-0000-000000000000',
      video: {
        src: 'https://www.video.information/watch?v=cVsQLlk-T0s',
        description: null,
        image: null,
      },
    },
    showCreateStatusAlert: false,
    isFetching: false,
    error: null,
  };

  it('renders html correctly', () => {
    const component = shallow(<EditCoursePage />);
    expect(shallowToJson(component)).toMatchSnapshot();
  });

  it('renders page correctly while fetching', () => {
    const component = shallow(<EditCoursePage
      courseInfo={{
        data: {},
        isFetching: true,
        error: null,
      }}
      courseOptions={{
        data: {},
        isFetching: true,
        error: null,
      }}
      courseRunOptions={{
        data: {},
        isFetching: true,
        error: null,
      }}
    />);
    expect(shallowToJson(component)).toMatchSnapshot();
  });

  it('renders page correctly with courseInfo', () => {
    const component = shallow(<EditCoursePage
      courseInfo={courseInfo}
    />);
    expect(shallowToJson(component)).toMatchSnapshot();
  });

  it('renders page correctly with courseInfo error', () => {
    const component = shallow(<EditCoursePage
      courseInfo={{
        data: {},
        isFetching: false,
        error: ['Course Info error.'],
      }}
    />);
    expect(shallowToJson(component)).toMatchSnapshot();
  });

  it('renders page correctly with no courseInfo', () => {
    const component = shallow(<EditCoursePage
      courseInfo={null}
    />);
    expect(shallowToJson(component)).toMatchSnapshot();
  });

  it('renders page correctly with courseOptions', () => {
    const component = shallow(<EditCoursePage
      courseOptions={courseOptions}
    />);
    expect(shallowToJson(component)).toMatchSnapshot();
  });

  it('renders page correctly with courseOptions error', () => {
    const component = shallow(<EditCoursePage
      courseOptions={{
        data: {},
        isFetching: false,
        error: ['Course Options error.'],
      }}
    />);
    expect(shallowToJson(component)).toMatchSnapshot();
  });

  it('renders page correctly with no courseOptions', () => {
    const component = shallow(<EditCoursePage
      courseOptions={null}
    />);
    expect(shallowToJson(component)).toMatchSnapshot();
  });

  it('renders page correctly with courseInfo and courseOptions', () => {
    const component = shallow(<EditCoursePage
      courseInfo={courseInfo}
      courseOptions={courseOptions}
    />);
    expect(shallowToJson(component)).toMatchSnapshot();
  });

  it('renders page correctly with courseRunOptions', () => {
    const component = shallow(<EditCoursePage
      courseRunOptions={courseRunOptions}
    />);
    expect(shallowToJson(component)).toMatchSnapshot();
  });

  it('renders page correctly with no courseRunOptions', () => {
    const component = shallow(<EditCoursePage
      courseRunOptions={null}
    />);
    expect(shallowToJson(component)).toMatchSnapshot();
  });

  it('renders page correctly with courseRunOptions error', () => {
    const component = shallow(<EditCoursePage
      courseRunOptions={{
        data: {},
        isFetching: false,
        error: ['Course Run Options error.'],
      }}
    />);
    expect(shallowToJson(component)).toMatchSnapshot();
  });

  it('renders page correctly with courseInfo, courseOptions, and courseRunOptions', () => {
    const component = shallow(<EditCoursePage
      courseInfo={courseInfo}
      courseOptions={courseOptions}
      courseRunOptions={courseRunOptions}
    />);
    expect(shallowToJson(component)).toMatchSnapshot();
  });

  it('renders page correctly with courseInfo, courseOptions, and courseRunOptions errors', () => {
    const component = shallow(<EditCoursePage
      courseInfo={{
        data: {},
        isFetching: false,
        error: ['Course Info error.'],
      }}
      courseOptions={{
        data: {},
        isFetching: false,
        error: ['Course Options error.'],
      }}
      courseRunOptions={{
        data: {},
        isFetching: false,
        error: ['Course Run Options error.'],
      }}
    />);
    expect(shallowToJson(component)).toMatchSnapshot();
  });

  describe('EditCoursePage submission handling', () => {
    const publishedCourseRun = {
      key: 'edX101+DemoX+T1',
      start: '2019-05-14T00:00:00Z',
      end: defaultEnd,
      expected_program_type: null,
      expected_program_name: '',
      go_live_date: '2019-05-06T00:00:00Z',
      min_effort: '10',
      max_effort: '123',
      pacing_type: 'instructor_paced',
      content_language: 'en-us',
      transcript_languages: ['en-us'],
      weeks_to_complete: '100',
      seats: [],
      staff: [],
      status: PUBLISHED,
      draft: undefined,
      marketing_url: null,
      has_ofac_restrictions: false,
      ofac_comment: '',
      run_type: '4e260c57-24ef-46c1-9a0d-5ec3a30f6b0c',
      external_key: null,
    };

    const unpublishedCourseRun = {

      ...publishedCourseRun,
      key: 'edX101+DemoX+T2',
      status: UNPUBLISHED,
      expected_program_type: 'micromasters',
      expected_program_name: 'Test Program Name',
    };

    const courseData = {
      additional_information: '<p>Stuff</p>',
      course_runs: [unpublishedCourseRun, publishedCourseRun],
      faq: '<p>Help?</p>',
      full_description: '<p>Long</p>',
      imageSrc: 'http://image.jpg',
      learner_testimonials: '<p>I learned stuff!</p>',
      level_type: 'Basic',
      outcome: '<p>Stuff</p>',
      prerequisites_raw: '',
      prices: {
        verified: defaultPrice,
      },
      short_description: '<p>Short</p>',
      subjectPrimary: 'basket-weaving',
      subjectSecondary: undefined,
      subjectTertiary: undefined,
      syllabus_raw: null,
      title: 'demo4004',
      type: '8a8f30e1-23ce-4ed3-a361-1325c656b67b',
      url_slug: 'demo4004',
      videoSrc: null,
      editable: true,
    };

    const expectedSendCourse = {
      additional_information: '<p>Stuff</p>',
      draft: true,
      faq: '<p>Help?</p>',
      full_description: '<p>Long</p>',
      image: 'http://image.jpg',
      key: 'edX+Test101x',
      learner_testimonials: '<p>I learned stuff!</p>',
      level_type: 'Basic',
      outcome: '<p>Stuff</p>',
      prerequisites_raw: '',
      prices: {
        verified: defaultPrice,
      },
      short_description: '<p>Short</p>',
      subjects: ['basket-weaving'],
      syllabus_raw: null,
      title: 'demo4004',
      type: '8a8f30e1-23ce-4ed3-a361-1325c656b67b',
      url_slug: 'demo4004',
      uuid: '00000000-0000-0000-0000-000000000000',
      video: { src: null },
    };

    const expectedSendCourseRuns = [
      {
        content_language: 'en-us',
        draft: true,
        expected_program_type: 'micromasters',
        expected_program_name: 'Test Program Name',
        external_key: '',
        go_live_date: '2019-05-06T00:00:00Z',
        key: 'edX101+DemoX+T2',
        max_effort: '123',
        min_effort: '10',
        prices: {
          verified: defaultPrice,
        },
        rerun: null,
        run_type: '4e260c57-24ef-46c1-9a0d-5ec3a30f6b0c',
        staff: [],
        status: UNPUBLISHED,
        transcript_languages: ['en-us'],
        weeks_to_complete: '100',
      },
      {
        content_language: 'en-us',
        draft: false,
        expected_program_type: null,
        expected_program_name: '',
        external_key: '',
        go_live_date: '2019-05-06T00:00:00Z',
        key: 'edX101+DemoX+T1',
        max_effort: '123',
        min_effort: '10',
        prices: {
          verified: defaultPrice,
        },
        rerun: null,
        run_type: '4e260c57-24ef-46c1-9a0d-5ec3a30f6b0c',
        staff: [],
        status: PUBLISHED,
        transcript_languages: ['en-us'],
        weeks_to_complete: '100',
      },
    ];

    const mockHandleCourseSubmit = jest.fn();

    beforeEach(() => {
      mockHandleCourseSubmit.mockClear();

      courseData.course_runs[0].end = defaultEnd;
      courseData.course_runs[0].status = UNPUBLISHED;
      courseData.prices = {
        verified: defaultPrice,
      };

      expectedSendCourseRuns[0].draft = true;
      expectedSendCourseRuns[0].prices = {
        verified: defaultPrice,
      };
      expectedSendCourseRuns[1].draft = false;
      expectedSendCourseRuns[1].prices = {
        verified: defaultPrice,
      };
      expectedSendCourse.draft = false;
      expectedSendCourse.prices = {
        verified: defaultPrice,
      };
    });

    it('sets state correctly and does not show modal with no target run', () => {
      const component = shallow(<EditCoursePage
        courseInfo={courseInfo}
      />);

      component.setState({
        submitConfirmVisible: false,
      });

      component.instance().handleCourseSubmit = mockHandleCourseSubmit;
      component.update();

      component.instance().showModal(courseData);
      expect(component.state().submitConfirmVisible).toEqual(false);
      expect(mockHandleCourseSubmit).toHaveBeenCalled();
    });

    it('sets state correctly and does not show modal with PUBLISHED target run', () => {
      const component = shallow(<EditCoursePage
        courseInfo={courseInfo}
        courseSubmitInfo={{
          targetRun: publishedCourseRun,
        }}
      />);

      component.setState({
        submitConfirmVisible: false,
      });

      component.instance().handleCourseSubmit = mockHandleCourseSubmit;
      component.update();

      component.instance().showModal(courseData);
      expect(component.state().submitConfirmVisible).toEqual(false);
      expect(mockHandleCourseSubmit).toHaveBeenCalled();
    });

    it('sets state correctly and shows modal with UNPUBLISHED target run', () => {
      const component = shallow(<EditCoursePage
        courseInfo={courseInfo}
        courseSubmitInfo={{
          targetRun: unpublishedCourseRun,
        }}
      />);

      component.setState({
        submitConfirmVisible: false,
      });

      component.instance().handleCourseSubmit = mockHandleCourseSubmit;
      component.update();

      component.instance().showModal(courseData);
      expect(component.state().submitConfirmVisible).toEqual(true);
      expect(component.state().submitCourseData).toEqual(courseData);
      expect(mockHandleCourseSubmit).not.toHaveBeenCalled();
    });

    it('sets state correctly when modal shown and continue submit called', () => {
      const component = shallow(<EditCoursePage
        courseInfo={courseInfo}
        courseSubmitInfo={{
          targetRun: unpublishedCourseRun,
        }}
      />);

      component.setState({
        submitConfirmVisible: true,
      });

      component.instance().handleCourseSubmit = mockHandleCourseSubmit;
      component.update();

      component.instance().showModal(courseData);
      expect(component.state().submitConfirmVisible).toEqual(true);
      expect(component.state().submitCourseData).toEqual(courseData);

      component.instance().continueSubmit(courseData);
      expect(component.state().submitConfirmVisible).toEqual(false);
      expect(component.state().submitCourseData).toEqual({});
      expect(mockHandleCourseSubmit).toHaveBeenCalled();
    });

    it('upon course submission, StatusAlert is set to appear', () => {
      const component = shallow(<EditCoursePage
        courseInfo={{ data: { editable: true } }}
        courseSubmitInfo={{
          showReviewStatusAlert: true,
          targetRun: unpublishedCourseRun,
        }}
      />);
      const reviewAlert = component.find(StatusAlert);
      const reviewMessage = 'Course has been submitted for review. The course will be locked for the next two business days. You will receive an email when the review is complete.';
      expect(reviewAlert.props().message).toEqual(reviewMessage);
    });

    it('upon legal review submission, StatusAlert is set to appear', () => {
      const component = shallow(<EditCoursePage
        courseInfo={{ data: { editable: true } }}
        courseSubmitInfo={{
          showReviewStatusAlert: true,
          targetRun: { status: REVIEW_BY_LEGAL },
        }}
      />);
      const reviewAlert = component.find(StatusAlert);
      const reviewMessage = 'Legal Review Complete. Course Run is now awaiting PC Review.';
      expect(reviewAlert.props().message).toEqual(reviewMessage);
    });

    it('upon internal review submission, StatusAlert is set to appear', () => {
      const component = shallow(<EditCoursePage
        courseInfo={{ data: { editable: true } }}
        courseSubmitInfo={{
          showReviewStatusAlert: true,
          targetRun: { status: REVIEW_BY_INTERNAL },
        }}
      />);
      const reviewAlert = component.find(StatusAlert);
      const reviewMessage = 'PC Review Complete.';
      expect(reviewAlert.props().message).toEqual(reviewMessage);
    });

    it('upon course run creation, StatusAlert is set to appear', () => {
      const component = shallow(<EditCoursePage
        courseInfo={{ data: { title: 'TestCourse101', editable: true }, showCreateStatusAlert: true }}
      />);
      const createAlert = component.find(StatusAlert);
      const createMessage = 'Course run has been created in studio. See link below.';
      expect(createAlert.props().message).toEqual(createMessage);
    });

    it('handleCourseSubmit properly prepares course data for Save Edits case with no changes', () => {
      const mockEditCourse = jest.fn();
      const props = {
        editCourse: mockEditCourse,
      };
      const component = shallow(<EditCoursePage
        {...props}
        courseInfo={courseInfo}
        courseOptions={courseOptions}
      />);

      component.setState({
        submitConfirmVisible: true,
      });
      component.instance().getData = jest.fn();
      component.update();

      component.instance().handleCourseSubmit(courseData);
      expect(mockEditCourse).toHaveBeenCalledWith(
        expectedSendCourse,
        [],
        false,
        false,
        component.instance().getData,
      );
    });

    it('handleCourseSubmit properly prepares course data for Save Edits case with course changes (no archived run)', () => {
      const mockEditCourse = jest.fn();
      const props = {
        editCourse: mockEditCourse,
      };
      const component = shallow(<EditCoursePage
        {...props}
        courseInfo={courseInfo}
        courseOptions={courseOptions}
      />);

      component.setState({
        submitConfirmVisible: true,
      });
      component.instance().getData = jest.fn();
      component.update();

      courseData.prices.verified = '500.00';
      courseData.course_runs[0].end = '5000-08-12T12:34:56Z';

      expectedSendCourse.prices.verified = '500';
      expectedSendCourseRuns[0].prices = expectedSendCourse.prices;
      expectedSendCourseRuns[1].prices = expectedSendCourse.prices;

      component.instance().handleCourseSubmit(courseData);
      expect(mockEditCourse).toHaveBeenCalledWith(
        expectedSendCourse,
        expectedSendCourseRuns,
        false,
        false,
        component.instance().getData,
      );
    });

    it('handleCourseSubmit properly prepares course data for Save Edits case with course changes (archived run)', () => {
      const mockEditCourse = jest.fn();
      const props = {
        editCourse: mockEditCourse,
      };
      const component = shallow(<EditCoursePage
        {...props}
        courseInfo={courseInfo}
        courseOptions={courseOptions}
      />);

      component.setState({
        submitConfirmVisible: true,
      });
      component.instance().getData = jest.fn();
      component.update();

      courseData.prices.verified = '500.00';
      expectedSendCourse.prices.verified = '500';
      expectedSendCourseRuns[1].prices = expectedSendCourse.prices;

      component.instance().handleCourseSubmit(courseData);
      expect(mockEditCourse).toHaveBeenCalledWith(
        expectedSendCourse,
        [expectedSendCourseRuns[1]],
        false,
        false,
        component.instance().getData,
      );
    });

    it('handleCourseSubmit properly prepares course data for Save Edits case with course changes (with type)', () => {
      const mockEditCourse = jest.fn();

      const myCourseInfo = jsonDeepCopy(courseInfo);
      myCourseInfo.data.type = '9521aa7d-801b-4a67-92c3-716ea30f5086'; // credit
      myCourseInfo.data.course_runs[0].end = '5000-08-12T12:34:56Z'; // make this active
      myCourseInfo.data.course_runs[0].type = 'f17e29d6-4648-4bb5-a199-97dc40f904aa'; // credit
      myCourseInfo.data.course_runs[1].type = '4e260c57-24ef-46c1-9a0d-5ec3a30f6b0c'; // verified

      const component = shallow(<EditCoursePage
        courseInfo={myCourseInfo}
        courseOptions={courseOptions}
        editCourse={mockEditCourse}
      />);
      component.setState({
        submitConfirmVisible: true,
      });
      component.instance().getData = jest.fn();
      component.update();

      const myCourseData = jsonDeepCopy(courseData);
      delete myCourseData.price;
      myCourseData.type = myCourseInfo.data.type;
      myCourseData.prices = {};
      myCourseData.prices.credit = '500';
      myCourseData.prices.verified = '10';

      const myExpectedSendCourse = jsonDeepCopy(expectedSendCourse);
      myExpectedSendCourse.type = myCourseData.type;
      myExpectedSendCourse.prices = {
        credit: '500',
        verified: '10',
      };
      const myExpectedCourseRun0 = jsonDeepCopy(expectedSendCourseRuns[0]);
      myExpectedCourseRun0.prices = myExpectedSendCourse.prices;
      const myExpectedCourseRun1 = jsonDeepCopy(expectedSendCourseRuns[1]);
      myExpectedCourseRun1.prices = myExpectedSendCourse.prices;

      component.instance().handleCourseSubmit(myCourseData);
      expect(mockEditCourse).toHaveBeenCalledWith(
        myExpectedSendCourse,
        [myExpectedCourseRun0, myExpectedCourseRun1],
        false,
        false,
        component.instance().getData,
      );
    });

    it('handleCourseSubmit properly prepares course data for Published run Submit case', () => {
      const mockEditCourse = jest.fn();
      const props = {
        editCourse: mockEditCourse,
      };
      const component = shallow(<EditCoursePage
        {...props}
        courseInfo={courseInfo}
        courseOptions={courseOptions}
        courseSubmitInfo={{
          targetRun: publishedCourseRun,
        }}
      />);

      component.setState({
        submitConfirmVisible: true,
      });
      component.instance().getData = jest.fn();
      component.update();

      expectedSendCourseRuns[1].draft = false;

      component.instance().handleCourseSubmit(courseData);
      expect(mockEditCourse).toHaveBeenCalledWith(
        expectedSendCourse,
        [expectedSendCourseRuns[1]],
        true,
        false,
        component.instance().getData,
      );
    });

    it('handleCourseSubmit properly prepares course data for Unpublished run Submit case', () => {
      const mockEditCourse = jest.fn();
      const props = {
        editCourse: mockEditCourse,
      };
      const component = shallow(<EditCoursePage
        {...props}
        courseInfo={courseInfo}
        courseOptions={courseOptions}
        courseSubmitInfo={{
          targetRun: unpublishedCourseRun,
        }}
      />);

      component.setState({
        submitConfirmVisible: true,
      });
      component.instance().getData = jest.fn();
      component.update();

      expectedSendCourseRuns[0].draft = false;

      component.instance().handleCourseSubmit(courseData);
      expect(mockEditCourse).toHaveBeenCalledWith(
        expectedSendCourse,
        [expectedSendCourseRuns[0]],
        true,
        false,
        component.instance().getData,
      );
    });

    it('handleCourseSubmit properly prepares course data for Save Edits case with run in review', () => {
      const mockEditCourse = jest.fn();
      const props = {
        editCourse: mockEditCourse,
      };
      const component = shallow(<EditCoursePage
        {...props}
        courseInfo={courseInfo}
        courseOptions={courseOptions}
      />);

      component.setState({
        submitConfirmVisible: true,
      });
      component.instance().getData = jest.fn();
      component.update();

      // Course changed so it should send saves for all non-archived runs, but this run is
      // in review so it won't be sent.
      courseData.prices.verified = '500.00';
      courseData.course_runs[0].end = '5000-08-12T12:34:56Z';
      courseData.course_runs[0].status = REVIEW_BY_INTERNAL;

      expectedSendCourse.prices.verified = '500';
      expectedSendCourseRuns[1].prices = expectedSendCourse.prices;

      component.instance().handleCourseSubmit(courseData);
      expect(mockEditCourse).toHaveBeenCalledWith(
        expectedSendCourse,
        [expectedSendCourseRuns[1]],
        false,
        false,
        component.instance().getData,
      );
    });

    it('submit modal can be cancelled', () => {
      const EditCoursePageWrapper = props => (
        <MemoryRouter>
          <Provider store={mockStore()}>
            <EditCoursePage
              {...props}
              courseInfo={courseInfo}
              courseOptions={courseOptions}
              courseRunOptions={courseRunOptions}
            />
          </Provider>
        </MemoryRouter>
      );

      const wrapper = mount(EditCoursePageWrapper());

      wrapper.setState({
        submitConfirmVisible: true,
      });

      const modal = wrapper.find(ConfirmationModal);
      modal.find('.btn-secondary').simulate('click');

      expect(wrapper.find(EditCoursePage)
        .instance().state.submitConfirmVisible)
        .toEqual(false);
      expect(wrapper.find(EditCoursePage)
        .instance().state.submitCourseData)
        .toEqual({});
    });
  });
});
