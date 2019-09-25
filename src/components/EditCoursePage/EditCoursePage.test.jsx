import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { mount, shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import EditCoursePage from './index';

import ConfirmationModal from '../ConfirmationModal';
import StatusAlert from '../StatusAlert';

import { PUBLISHED, REVIEW_BY_INTERNAL, REVIEW_BY_LEGAL, UNPUBLISHED } from '../../data/constants';

// Need to mock the Editor as we don't want to test TinyMCE
jest.mock('@tinymce/tinymce-react');

const mockStore = configureStore();

describe('EditCoursePage', () => {
  const defaultPrice = '77.00';
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
          staff: [],
          status: UNPUBLISHED,
          draft: undefined,
          marketing_url: null,
          has_ofac_restrictions: false,
          ofac_comment: '',
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
          staff: [],
          status: PUBLISHED,
          draft: undefined,
          marketing_url: null,
          has_ofac_restrictions: false,
          ofac_comment: '',
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
  const courseOptions = {
    data: {
      actions: {
        POST: {
          level_type: {
            choices: [
              { display_name: 'Beginner', value: 'beginner' },
              { display_name: 'Intermediate', value: 'intermediate' },
              { display_name: 'Advanced', value: 'advanced' },
            ],
          },
          subjects: {
            child: {
              choices: [
                { display_name: 'Business', value: 'business' },
                { display_name: 'Chemistry', value: 'chemistry' },
                { display_name: 'English', value: 'english' },
                { display_name: 'Security', value: 'security' },
              ],
            },
          },
        },
      },
    },
    isFetching: false,
    error: null,
  };
  const courseRunOptions = {
    data: {
      actions: {
        POST: {
          pacing_type: {
            type: 'choice',
            required: false,
            read_only: false,
            label: 'Pacing type',
            choices: [{
              display_name: 'Instructor-paced',
              value: 'instructor_paced',
            }, {
              display_name: 'Self-paced',
              value: 'self_paced',
            }],
          },
          content_language: {
            type: 'field',
            required: false,
            read_only: false,
            label: 'Content language',
            help_text: 'Language in which the course is administered',
            choices: [{
              display_name: 'Afrikaans',
              value: 'af',
            }, {
              display_name: 'Arabic - United Arab Emirates',
              value: 'ar-ae',
            }],
          },
          expected_program_type: {
            type: 'field',
            required: false,
            read_only: false,
            label: 'Expected Program Type',
            choices: [{
              display_name: 'Professional Certificate',
              value: 'professional-certificate',
            },
            {
              display_name: 'MicroMasters',
              value: 'micromasters',
            },
            {
              display_name: 'XSeries',
              value: 'xseries',
            },
            {
              display_name: 'Masters',
              value: 'masters',
            }],
          },
        },
      },
    },
    isFetching: false,
    error: null,
  };

  it('renders html correctly', () => {
    const component = shallow(<EditCoursePage />);
    expect(component).toMatchSnapshot();
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
    expect(component).toMatchSnapshot();
  });

  it('renders page correctly with courseInfo', () => {
    const component = shallow(<EditCoursePage
      courseInfo={courseInfo}
    />);
    expect(component).toMatchSnapshot();
  });

  it('renders page correctly with courseInfo error', () => {
    const component = shallow(<EditCoursePage
      courseInfo={{
        data: {},
        isFetching: false,
        error: ['Course Info error.'],
      }}
    />);
    expect(component).toMatchSnapshot();
  });

  it('renders page correctly with no courseInfo', () => {
    const component = shallow(<EditCoursePage
      courseInfo={null}
    />);
    expect(component).toMatchSnapshot();
  });

  it('renders page correctly with courseOptions', () => {
    const component = shallow(<EditCoursePage
      courseOptions={courseOptions}
    />);
    expect(component).toMatchSnapshot();
  });

  it('renders page correctly with courseOptions error', () => {
    const component = shallow(<EditCoursePage
      courseOptions={{
        data: {},
        isFetching: false,
        error: ['Course Options error.'],
      }}
    />);
    expect(component).toMatchSnapshot();
  });

  it('renders page correctly with no courseOptions', () => {
    const component = shallow(<EditCoursePage
      courseOptions={null}
    />);
    expect(component).toMatchSnapshot();
  });

  it('renders page correctly with courseInfo and courseOptions', () => {
    const component = shallow(<EditCoursePage
      courseInfo={courseInfo}
      courseOptions={courseOptions}
    />);
    expect(component).toMatchSnapshot();
  });

  it('renders page correctly with courseRunOptions', () => {
    const component = shallow(<EditCoursePage
      courseRunOptions={courseRunOptions}
    />);
    expect(component).toMatchSnapshot();
  });

  it('renders page correctly with no courseRunOptions', () => {
    const component = shallow(<EditCoursePage
      courseRunOptions={null}
    />);
    expect(component).toMatchSnapshot();
  });

  it('renders page correctly with courseRunOptions error', () => {
    const component = shallow(<EditCoursePage
      courseRunOptions={{
        data: {},
        isFetching: false,
        error: ['Course Run Options error.'],
      }}
    />);
    expect(component).toMatchSnapshot();
  });

  it('renders page correctly with courseInfo, courseOptions, and courseRunOptions', () => {
    const component = shallow(<EditCoursePage
      courseInfo={courseInfo}
      courseOptions={courseOptions}
      courseRunOptions={courseRunOptions}
    />);
    expect(component).toMatchSnapshot();
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
    expect(component).toMatchSnapshot();
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
      staff: [],
      status: PUBLISHED,
      draft: undefined,
      marketing_url: null,
      has_ofac_restrictions: false,
      ofac_comment: '',
    };

    const unpublishedCourseRun = Object.assign(
      {},
      publishedCourseRun,
      {
        key: 'edX101+DemoX+T2',
        status: UNPUBLISHED,
        expected_program_type: 'micromasters',
        expected_program_name: 'Test Program Name',
      },
    );

    const courseData = {
      additional_information: '<p>Stuff</p>',
      course_runs: [unpublishedCourseRun, publishedCourseRun],
      faq: '<p>Help?</p>',
      full_description: '<p>Long</p>',
      imageSrc: 'http://image.jpg',
      learner_testimonials: '<p>I learned stuff!</p>',
      level_type: 'Basic',
      mode: 'verified',
      outcome: '<p>Stuff</p>',
      prerequisites_raw: '',
      price: defaultPrice,
      short_description: '<p>Short</p>',
      subjectPrimary: 'basket-weaving',
      subjectSecondary: undefined,
      subjectTertiary: undefined,
      syllabus_raw: null,
      title: 'demo4004',
      url_slug: 'demo4004',
      videoSrc: null,
      editable: true,
    };

    const expectedSendCourse = {
      additional_information: '<p>Stuff</p>',
      draft: true,
      entitlements: [{ mode: 'verified', price: defaultPrice, sku: '000000D' }],
      faq: '<p>Help?</p>',
      full_description: '<p>Long</p>',
      image: 'http://image.jpg',
      key: 'edX+Test101x',
      learner_testimonials: '<p>I learned stuff!</p>',
      level_type: 'Basic',
      outcome: '<p>Stuff</p>',
      short_description: '<p>Short</p>',
      subjects: ['basket-weaving'],
      title: 'demo4004',
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
        go_live_date: '2019-05-06T00:00:00Z',
        key: 'edX101+DemoX+T2',
        max_effort: '123',
        min_effort: '10',
        rerun: null,
        staff: [],
        status: UNPUBLISHED,
        transcript_languages: ['en-us'],
        weeks_to_complete: '100',
      },
      {
        content_language: 'en-us',
        draft: true,
        expected_program_type: null,
        expected_program_name: '',
        go_live_date: '2019-05-06T00:00:00Z',
        key: 'edX101+DemoX+T1',
        max_effort: '123',
        min_effort: '10',
        rerun: null,
        staff: [],
        status: PUBLISHED,
        transcript_languages: ['en-us'],
        weeks_to_complete: '100',
      },
    ];

    const mockHandleCourseSubmit = jest.fn();

    beforeEach(() => {
      mockHandleCourseSubmit.mockClear();

      courseData.price = defaultPrice;
      courseData.course_runs[0].end = defaultEnd;
      courseData.course_runs[0].status = UNPUBLISHED;

      expectedSendCourseRuns[0].draft = true;
      expectedSendCourseRuns[1].draft = true;
      expectedSendCourse.draft = true;
      expectedSendCourse.entitlements[0].price = defaultPrice;
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
      />);

      component.setState({
        submitConfirmVisible: true,
      });
      component.update();

      component.instance().handleCourseSubmit(courseData);
      expect(mockEditCourse).toHaveBeenCalledWith(
        expectedSendCourse,
        [],
        false,
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
      />);

      component.setState({
        submitConfirmVisible: true,
      });
      component.update();

      courseData.price = '500.00';
      courseData.course_runs[0].end = '5000-08-12T12:34:56Z';

      expectedSendCourse.entitlements[0].price = '500.00';

      component.instance().handleCourseSubmit(courseData);
      expect(mockEditCourse).toHaveBeenCalledWith(
        expectedSendCourse,
        expectedSendCourseRuns,
        false,
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
      />);

      component.setState({
        submitConfirmVisible: true,
      });
      component.update();

      courseData.price = '500.00';
      expectedSendCourse.entitlements[0].price = '500.00';

      component.instance().handleCourseSubmit(courseData);
      expect(mockEditCourse).toHaveBeenCalledWith(
        expectedSendCourse,
        [expectedSendCourseRuns[1]],
        false,
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
        courseSubmitInfo={{
          targetRun: publishedCourseRun,
        }}
      />);

      component.setState({
        submitConfirmVisible: true,
      });
      component.update();

      expectedSendCourseRuns[1].draft = false;
      expectedSendCourse.draft = false;

      component.instance().handleCourseSubmit(courseData);
      expect(mockEditCourse).toHaveBeenCalledWith(
        expectedSendCourse,
        [expectedSendCourseRuns[1]],
        true,
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
        courseSubmitInfo={{
          targetRun: unpublishedCourseRun,
        }}
      />);

      component.setState({
        submitConfirmVisible: true,
      });
      component.update();

      expectedSendCourseRuns[0].draft = false;

      component.instance().handleCourseSubmit(courseData);
      expect(mockEditCourse).toHaveBeenCalledWith(
        expectedSendCourse,
        [expectedSendCourseRuns[0]],
        true,
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
      />);

      component.setState({
        submitConfirmVisible: true,
      });
      component.update();

      // Course changed so it should send saves for all non-archived runs, but this run is
      // in review so it won't be sent.
      courseData.price = '500.00';
      courseData.course_runs[0].end = '5000-08-12T12:34:56Z';
      courseData.course_runs[0].status = REVIEW_BY_INTERNAL;

      expectedSendCourse.entitlements[0].price = '500.00';

      component.instance().handleCourseSubmit(courseData);
      expect(mockEditCourse).toHaveBeenCalledWith(
        expectedSendCourse,
        [expectedSendCourseRuns[1]],
        false,
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
