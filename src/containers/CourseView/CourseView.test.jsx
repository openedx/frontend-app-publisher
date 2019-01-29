import React from 'react';
import { shallow } from 'enzyme';

import { CourseViewBasic as CourseView } from './index';

describe('CourseView', () => {
  it('shows spinner while loading', () => {
    const component = shallow(<CourseView
      courseInfo={{
        error: null,
        isFetching: true,
        data: {},
      }}
    />);
    expect(component.find('#spinner')).toHaveLength(1);
  });

  it('shows a fetch error', async () => {
    const component = shallow(<CourseView
      courseInfo={{
        error: 'Failed.',
        isFetching: true,
        data: {},
      }}
    />);
    expect(component.find('#error').getElement().props.dialog).toEqual('Failed.');
  });

  it('calls fetch', () => {
    let called = false;
    shallow(<CourseView fetchCourseInfo={() => { called = true; }} />);
    expect(called).toBe(true);
  });

  describe('happy path', () => {
    let component;

    beforeAll(async () => {
      const courseInfo = {
        error: null,
        isFetching: false,
        data: {
          additional_information: 'Add Info',
          faq: 'FAQ',
          full_description: 'Long Desc',
          image: { src: 'https://example.com/image' },
          key: 'edX+DemoX',
          learner_testimonials: 'Learner Testimonial',
          level_type: 'Intermediate',
          outcome: 'Outcome',
          prerequisites_raw: 'Needs classes',
          short_description: 'Short Desc',
          subjects: [
            {
              name: 'Primary',
            },
            {
              name: 'Secondary',
            },
          ],
          syllabus_raw: 'Hello World',
          title: 'Dogs & You',
          video: { src: 'https://example.com/video' },
        },
      };
      component = shallow(<CourseView courseInfo={courseInfo} />);
    });

    it('parses course number from a course key', () => {
      expect(component.find('#number').getElement().props.value).toEqual('DemoX');
    });

    function checkElement(id, value, html) {
      expect(component.find(id).getElement().props.value).toEqual(value);
      expect(component.find(id).getElement().props.html).toEqual(html);
    }

    it('renders all elements as html or not as appropriate', () => {
      checkElement('#faq', 'FAQ', true);
      checkElement('#info', 'Add Info', true);
      checkElement('#ldesc', 'Long Desc', true);
      checkElement('#level', 'Intermediate', false);
      checkElement('#number', 'DemoX', false);
      checkElement('#outcome', 'Outcome', true);
      checkElement('#prereq', 'Needs classes', true);
      checkElement('#sdesc', 'Short Desc', true);
      checkElement('#subjects', 'Primary, Secondary', false);
      checkElement('#syllabus', 'Hello World', true);
      checkElement('#title', 'Dogs & You', false);

      checkElement('#image', <img alt="" src="https://example.com/image" />, false);

      const videoElement = component.find('#video').getElement();
      const videoValueProps = videoElement.props.value.props;
      expect(videoValueProps.content).toEqual('https://example.com/video');
      expect(videoValueProps.destination).toEqual('https://example.com/video');
      expect(videoElement.props.html).toEqual(false);
    });
  });

  describe('empty path', () => {
    let component;

    beforeAll(async () => {
      const courseInfo = {
        error: null,
        isFetching: false,
        // These empty values are what Discovery will send us when they are unset
        data: {
          additional_information: '',
          faq: '',
          full_description: '',
          image: null,
          key: 'edX/DemoX', // old-style
          learner_testimonials: '',
          level_type: null,
          outcome: '',
          prerequisites_raw: '',
          short_description: '',
          subjects: [],
          syllabus_raw: '',
          title: '',
          video: null,
        },
      };
      component = shallow(<CourseView courseInfo={courseInfo} />);
    });

    it('parses course number from an old-style course key', () => {
      expect(component.find('#number').getElement().props.value).toEqual('DemoX');
    });

    it('renders all elements as html or not as appropriate', () => {
      // Just spot check a few elements. We mostly care about whether an exception happened.
      expect(component.find('#faq').getElement().props.value).toEqual('');
      expect(component.find('#image').getElement().props.value).toEqual(null);
      expect(component.find('#info').getElement().props.value).toEqual('');
      expect(component.find('#ldesc').getElement().props.value).toEqual('');
      expect(component.find('#level').getElement().props.value).toEqual('');
      expect(component.find('#syllabus').getElement().props.value).toEqual('');
      expect(component.find('#video').getElement().props.value).toEqual(null);
    });
  });
});
