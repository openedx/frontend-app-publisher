import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { mount, shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import EditCoursePage from './index';

import SubmitConfirmModal from '../SubmitConfirmModal';

import { PUBLISHED, UNPUBLISHED } from '../../data/constants';

// Need to mock the Editor as we don't want to test TinyMCE
jest.mock('@tinymce/tinymce-react');

const mockStore = configureStore();

describe('EditCoursePage', () => {
  const courseInfo = {
    data: {
      additional_information: '',
      entitlements: [
        {
          mode: 'verified',
          price: '77.00',
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
    isFetching: false,
    error: null,
  };
  const courseOptions = {
    data: {
      actions: {
        PUT: {
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
      status: PUBLISHED,
      content_language: 'en-us',
      draft: undefined,
      end: '2019-08-14T00:00:00Z',
      go_live_date: '2019-05-06T00:00:00Z',
      marketing_url: null,
      max_effort: 123,
      min_effort: 10,
      pacing_type: 'instructor_paced',
      staff: [],
      start: '2019-05-14T00:00:00Z',
      transcript_languages: ['en-us'],
      weeks_to_complete: 100,
    };

    const unpublishedCourseRun = Object.assign(
      {},
      publishedCourseRun,
      { key: 'edX101+DemoX+T2', status: UNPUBLISHED },
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
      price: '200.00',
      short_description: '<p>Short</p>',
      subjectPrimary: 'basket-weaving',
      subjectSecondary: undefined,
      subjectTertiary: undefined,
      syllabus_raw: null,
      title: 'demo4004',
      videoSrc: null,
    };

    const expectedSendCourse = {
      additional_information: '<p>Stuff</p>',
      draft: true,
      entitlements: [{ mode: 'verified', price: '200.00', sku: '000000D' }],
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
      uuid: '00000000-0000-0000-0000-000000000000',
      video: { src: null },
    };

    const expectedSendCourseRuns = [
      {
        content_language: 'en-us',
        draft: true,
        end: '2019-08-14T00:00:00Z',
        go_live_date: '2019-05-06T00:00:00Z',
        key: 'edX101+DemoX+T2',
        max_effort: 123,
        min_effort: 10,
        pacing_type: 'instructor_paced',
        staff: [],
        length: undefined,
        start: '2019-05-14T00:00:00Z',
        status: 'unpublished',
        transcript_languages: ['en-us'],
        weeks_to_complete: 100,
      },
      {
        content_language: 'en-us',
        draft: true,
        end: '2019-08-14T00:00:00Z',
        go_live_date: '2019-05-06T00:00:00Z',
        key: 'edX101+DemoX+T1',
        max_effort: 123,
        min_effort: 10,
        pacing_type: 'instructor_paced',
        staff: [],
        length: undefined,
        start: '2019-05-14T00:00:00Z',
        status: 'published',
        transcript_languages: ['en-us'],
        weeks_to_complete: 100,
      },
    ];

    const mockHandleCourseSubmit = jest.fn();

    beforeEach(() => {
      mockHandleCourseSubmit.mockClear();
      expectedSendCourseRuns[0].draft = true;
      expectedSendCourseRuns[1].draft = true;
      expectedSendCourse.draft = true;
    });

    it('sets state correctly and does not show modal with no target run', () => {
      const component = shallow(<EditCoursePage
        courseInfo={courseInfo}
      />);

      // const component = mount(EditCoursePageWrapper());
      component.setState({
        submitConfirmVisible: false,
        targetRun: null,
      });

      component.instance().handleCourseSubmit = mockHandleCourseSubmit;
      component.update();

      component.instance().showModal(courseData);
      expect(component.state().targetRun).toEqual(null);
      expect(component.state().submitConfirmVisible).toEqual(false);
      expect(mockHandleCourseSubmit).toHaveBeenCalled();
    });

    it('sets state correctly and does not show modal with PUBLISHED target run', () => {
      const component = shallow(<EditCoursePage
        courseInfo={courseInfo}
      />);

      component.setState({
        submitConfirmVisible: false,
        targetRun: publishedCourseRun,
      });

      component.instance().handleCourseSubmit = mockHandleCourseSubmit;
      component.update();

      component.instance().showModal(courseData);
      expect(component.state().targetRun).toEqual(publishedCourseRun);
      expect(component.state().submitConfirmVisible).toEqual(false);
      expect(mockHandleCourseSubmit).toHaveBeenCalled();
    });

    it('sets state correctly and shows modal with UNPUBLISHED target run', () => {
      const component = shallow(<EditCoursePage
        courseInfo={courseInfo}
      />);

      component.setState({
        submitConfirmVisible: false,
        targetRun: unpublishedCourseRun,
      });

      component.instance().handleCourseSubmit = mockHandleCourseSubmit;
      component.update();

      component.instance().showModal(courseData);
      expect(component.state().targetRun).toEqual(unpublishedCourseRun);
      expect(component.state().submitConfirmVisible).toEqual(true);
      expect(component.state().submitCourseData).toEqual(courseData);
      expect(mockHandleCourseSubmit).not.toHaveBeenCalled();
    });

    it('sets state correctly when modal shown and continue submit called', () => {
      const component = shallow(<EditCoursePage
        courseInfo={courseInfo}
      />);

      component.setState({
        submitConfirmVisible: true,
        targetRun: unpublishedCourseRun,
      });

      component.instance().handleCourseSubmit = mockHandleCourseSubmit;
      component.update();

      component.instance().showModal(courseData);
      expect(component.state().targetRun).toEqual(unpublishedCourseRun);
      expect(component.state().submitConfirmVisible).toEqual(true);
      expect(component.state().submitCourseData).toEqual(courseData);

      component.instance().continueSubmit(courseData);
      expect(component.state().targetRun).toEqual(unpublishedCourseRun);
      expect(component.state().submitConfirmVisible).toEqual(false);
      expect(component.state().submitCourseData).toEqual({});
      expect(mockHandleCourseSubmit).toHaveBeenCalled();
    });

    it('handleCourseSubmit properly prepares course data for Save Edits case', () => {
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
        targetRun: null,
      });
      component.update();

      component.instance().handleCourseSubmit(courseData);
      expect(component.state().targetRun).toEqual(null);
      expect(mockEditCourse).toHaveBeenCalledWith(
        expectedSendCourse,
        expectedSendCourseRuns,
        false,
      );
    });

    it('handleCourseSubmit properly prepares course data for Published Submit case', () => {
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
        targetRun: publishedCourseRun,
      });
      component.update();

      expectedSendCourseRuns[1].draft = false;
      expectedSendCourse.draft = false;

      component.instance().handleCourseSubmit(courseData);
      expect(component.state().targetRun).toEqual(publishedCourseRun);
      expect(mockEditCourse).toHaveBeenCalledWith(
        expectedSendCourse,
        expectedSendCourseRuns,
        true,
      );
    });

    it('handleCourseSubmit properly prepares course data for Unpublished Submits case', () => {
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
        targetRun: unpublishedCourseRun,
      });
      component.update();

      expectedSendCourseRuns[0].draft = false;

      component.instance().handleCourseSubmit(courseData);
      expect(component.state().targetRun).toEqual(unpublishedCourseRun);
      expect(mockEditCourse).toHaveBeenCalledWith(
        expectedSendCourse,
        expectedSendCourseRuns,
        true,
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

      const modal = wrapper.find(SubmitConfirmModal);
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
