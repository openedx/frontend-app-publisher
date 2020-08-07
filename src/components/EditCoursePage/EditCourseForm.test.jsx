import React from 'react';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import { Field } from 'redux-form';
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';

import { BaseEditCourseForm } from './EditCourseForm';
import { REVIEW_BY_LEGAL, REVIEWED, UNPUBLISHED } from '../../data/constants';
import { courseOptions, courseRunOptions } from '../../data/constants/testData';

describe('BaseEditCourseForm', () => {
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
    prices: {
      verified: '77',
    },
    type: '8a8f30e1-23ce-4ed3-a361-1325c656b67b',
    uuid: '11111111-1111-1111-1111-111111111111',
    editable: true,
  };

  beforeEach(() => {
    getAuthenticatedUser.mockReturnValue({ administrator: false });
  });

  it('renders html correctly with minimal data', () => {
    const component = shallow(<BaseEditCourseForm
      handleSubmit={() => null}
      initialValues={{
        title: initialValuesFull.title,
      }}
      title={initialValuesFull.title}
      number="Test101x"
      courseStatuses={[UNPUBLISHED]}
      courseOptions={courseOptions}
      courseRunOptions={courseRunOptions}
      uuid={initialValuesFull.uuid}
      type={initialValuesFull.type}
      id="edit-course-form"
    />);
    expect(shallowToJson(component)).toMatchSnapshot();
  });

  it('renders html correctly with all data present', () => {
    const component = shallow(<BaseEditCourseForm
      handleSubmit={() => null}
      initialValues={initialValuesFull}
      currentFormValues={initialValuesFull}
      title={initialValuesFull.title}
      number="Test102x"
      courseStatuses={[UNPUBLISHED]}
      courseOptions={courseOptions}
      courseRunOptions={courseRunOptions}
      uuid={initialValuesFull.uuid}
      type={initialValuesFull.type}
      id="edit-course-form"
    />);
    expect(shallowToJson(component)).toMatchSnapshot();
  });

  it('renders html correctly with administrator being true', () => {
    getAuthenticatedUser.mockReturnValue({ administrator: true });
    const component = shallow(<BaseEditCourseForm
      handleSubmit={() => null}
      initialValues={initialValuesFull}
      currentFormValues={initialValuesFull}
      title={initialValuesFull.title}
      number="Test102x"
      courseStatuses={[UNPUBLISHED]}
      courseOptions={courseOptions}
      courseRunOptions={courseRunOptions}
      uuid={initialValuesFull.uuid}
      type={initialValuesFull.type}
      id="edit-course-form"
    />);
    expect(shallowToJson(component)).toMatchSnapshot();
  });

  it('renders html correctly while submitting', () => {
    const component = shallow(<BaseEditCourseForm
      handleSubmit={() => null}
      initialValues={initialValuesFull}
      currentFormValues={initialValuesFull}
      title={initialValuesFull.title}
      number="Test103x"
      courseStatuses={[UNPUBLISHED]}
      courseOptions={courseOptions}
      courseRunOptions={courseRunOptions}
      pristine={false}
      submitting
      uuid={initialValuesFull.uuid}
      type={initialValuesFull.type}
      id="edit-course-form"
    />);
    expect(shallowToJson(component)).toMatchSnapshot();
  });

  it('renders correctly when submitting for review', () => {
    const component = shallow(<BaseEditCourseForm
      handleSubmit={() => null}
      title={initialValuesFull.title}
      currentFormValues={initialValuesFull}
      number="Test101x"
      courseStatuses={[UNPUBLISHED]}
      courseOptions={courseOptions}
      courseRunOptions={courseRunOptions}
      uuid={initialValuesFull.uuid}
      type={initialValuesFull.type}
      isSubmittingForReview
      id="edit-course-form"
    />);
    expect(shallowToJson(component)).toMatchSnapshot();
  });

  it('renders with disabled fields if course is in review', () => {
    const component = shallow(<BaseEditCourseForm
      handleSubmit={() => null}
      title={initialValuesFull.title}
      currentFormValues={initialValuesFull}
      number="Test101x"
      courseStatuses={[REVIEW_BY_LEGAL]}
      courseOptions={courseOptions}
      courseRunOptions={courseRunOptions}
      uuid={initialValuesFull.uuid}
      type={initialValuesFull.type}
      courseInReview
      id="edit-course-form"
    />);

    const childFields = component.find(Field);
    childFields.forEach((field) => {
      expect(field.prop('disabled')).toBe(true);
    });
  });

  it('renders with course type disabled after being reviewed', () => {
    const component = shallow(<BaseEditCourseForm
      handleSubmit={() => null}
      title={initialValuesFull.title}
      initialValues={initialValuesFull}
      currentFormValues={initialValuesFull}
      number="Test101x"
      entitlement={{ sku: 'ABC1234' }}
      courseStatuses={[REVIEWED]}
      courseOptions={courseOptions}
      courseRunOptions={courseRunOptions}
      uuid={initialValuesFull.uuid}
      type={initialValuesFull.type}
      id="edit-course-form"
    />);

    const disabledFields = component.find({ name: 'type', disabled: true });
    expect(disabledFields).toHaveLength(1);
  });

  it('renders with course type disabled once a sku exists, even if course is unpublished', () => {
    const component = shallow(<BaseEditCourseForm
      handleSubmit={() => null}
      title={initialValuesFull.title}
      initialValues={initialValuesFull}
      currentFormValues={initialValuesFull}
      number="Test101x"
      entitlement={{ sku: 'ABC1234' }}
      courseStatuses={[UNPUBLISHED]}
      courseOptions={courseOptions}
      courseRunOptions={courseRunOptions}
      uuid={initialValuesFull.uuid}
      type={initialValuesFull.type}
      id="edit-course-form"
    />);

    const disabledFields = component.find({ name: 'type', disabled: true });
    expect(disabledFields).toHaveLength(1);
  });

  it('no marketing fields if course type is not marketable', () => {
    const initialValuesWithMasters = {
      ...initialValuesFull,
      type: '7b41992e-f268-4331-8ba9-72acb0880454',
    };
    const component = shallow(<BaseEditCourseForm
      handleSubmit={() => null}
      title={initialValuesWithMasters.title}
      initialValues={initialValuesWithMasters}
      currentFormValues={initialValuesWithMasters}
      number="Masters101x"
      courseStatuses={[UNPUBLISHED]}
      courseOptions={courseOptions}
      courseRunOptions={courseRunOptions}
      uuid={initialValuesWithMasters.uuid}
      type={initialValuesWithMasters.type}
      id="edit-course-form"
    />);

    const invisible = [
      'short_description', 'full_description', 'outcome', 'syllabus_raw', 'prerequisites_raw',
      'learner_testimonials', 'faq', 'additional_information', 'videoSrc',
    ];
    invisible.forEach((name) => {
      const fields = component.find({ name });
      expect(fields).toHaveLength(0);
    });

    // Just sanity check that a field we still want there is there:
    const fields = component.find({ name: 'imageSrc' });
    expect(fields).toHaveLength(1);
  });
});
