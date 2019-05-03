import React from 'react';
import { shallow } from 'enzyme';

import EditCoursePage from './index';


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
});
