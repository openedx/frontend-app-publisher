import React from 'react';
import { shallow } from 'enzyme';

import EditCourseForm from './EditCourseForm';


describe('EditCourseForm', () => {
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
  };
  const initialValuesFull = {
    title: 'Test Title',
    short_description: 'short desc',
    full_description: 'long desc',
    outcome: 'learning outcomes',
    subjectPrimary: 'business',
    subjectSecondary: 'english',
    subjectTertiary: 'security',
    imageSrc: 'http://image.src.small',
    prerequisites_raw: 'prereq',
    level_type: 'advanced',
    learner_testimonials: 'learner testimonials',
    faq: 'frequently asked questions',
    additional_information: 'additional info',
    syllabus_raw: 'syllabus',
    videoSrc: 'https://www.video.src/watch?v=fdsafd',
    mode: 'verified',
    price: '77',
  };

  it('renders html correctly with minimal data', () => {
    const component = shallow(<EditCourseForm
      handleSubmit={() => null}
      initialValues={{
        title: 'Test Title',
      }}
      number="Test101x"
      courseOptions={courseOptions}
    />);
    expect(component).toMatchSnapshot();
  });

  it('renders html correctly with all data present', () => {
    const component = shallow(<EditCourseForm
      handleSubmit={() => null}
      initialValues={initialValuesFull}
      number="Test102x"
      courseOptions={courseOptions}
    />);
    expect(component).toMatchSnapshot();
  });

  it('renders html correctly while submitting', () => {
    const component = shallow(<EditCourseForm
      handleSubmit={() => null}
      initialValues={initialValuesFull}
      number="Test103x"
      courseOptions={courseOptions}
      submitting
    />);
    expect(component).toMatchSnapshot();
  });
});
