import React from 'react';
import { shallow } from 'enzyme';
import { Field } from 'redux-form';

import { BaseEditCourseForm } from './EditCourseForm';
import { IN_LEGAL_REVIEW, REVIEWED, UNPUBLISHED } from '../../data/constants';
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
    mode: 'verified',
    price: '77',
    type: null,
    uuid: '11111111-1111-1111-1111-111111111111',
    editable: true,
  };
  const entitlement = {
    mode: 'verified',
    price: '77',
  };

  it('renders html correctly with minimal data', () => {
    const component = shallow(<BaseEditCourseForm
      handleSubmit={() => null}
      initialValues={{
        title: initialValuesFull.title,
      }}
      title={initialValuesFull.title}
      number="Test101x"
      entitlement={undefined}
      courseStatuses={[UNPUBLISHED]}
      courseOptions={courseOptions}
      courseRunOptions={courseRunOptions}
      uuid={initialValuesFull.uuid}
      type={initialValuesFull.type}
      id="edit-course-form"
    />);
    expect(component).toMatchSnapshot();
  });

  it('renders html correctly with all data present and verified entitlement', () => {
    const component = shallow(<BaseEditCourseForm
      handleSubmit={() => null}
      initialValues={initialValuesFull}
      currentFormValues={initialValuesFull}
      title={initialValuesFull.title}
      number="Test102x"
      entitlement={entitlement}
      courseStatuses={[UNPUBLISHED]}
      courseOptions={courseOptions}
      courseRunOptions={courseRunOptions}
      uuid={initialValuesFull.uuid}
      type={initialValuesFull.type}
      id="edit-course-form"
    />);
    expect(component).toMatchSnapshot();
  });

  it('renders html correctly with all data present and type defined', () => {
    const initialValuesUpdated = Object.assign({}, initialValuesFull, { type: '8a8f30e1-23ce-4ed3-a361-1325c656b67b' });
    const component = shallow(<BaseEditCourseForm
      handleSubmit={() => null}
      initialValues={initialValuesUpdated}
      currentFormValues={initialValuesUpdated}
      title={initialValuesUpdated.title}
      number="Test102x"
      entitlement={entitlement}
      courseStatuses={[UNPUBLISHED]}
      courseOptions={courseOptions}
      courseRunOptions={courseRunOptions}
      uuid={initialValuesUpdated.uuid}
      type={initialValuesUpdated.type}
      id="edit-course-form"
    />);
    expect(component).toMatchSnapshot();
  });

  it('renders html correctly with administrator being true', () => {
    const component = shallow(<BaseEditCourseForm
      authentication={{
        administrator: true,
      }}
      handleSubmit={() => null}
      initialValues={initialValuesFull}
      currentFormValues={initialValuesFull}
      title={initialValuesFull.title}
      number="Test102x"
      entitlement={entitlement}
      courseStatuses={[UNPUBLISHED]}
      courseOptions={courseOptions}
      courseRunOptions={courseRunOptions}
      uuid={initialValuesFull.uuid}
      type={initialValuesFull.type}
      id="edit-course-form"
    />);
    expect(component).toMatchSnapshot();
  });

  it('renders html correctly while submitting', () => {
    const component = shallow(<BaseEditCourseForm
      handleSubmit={() => null}
      initialValues={initialValuesFull}
      currentFormValues={initialValuesFull}
      title={initialValuesFull.title}
      number="Test103x"
      entitlement={entitlement}
      courseStatuses={[UNPUBLISHED]}
      courseOptions={courseOptions}
      courseRunOptions={courseRunOptions}
      pristine={false}
      submitting
      uuid={initialValuesFull.uuid}
      type={initialValuesFull.type}
      id="edit-course-form"
    />);
    expect(component).toMatchSnapshot();
  });

  it('renders correctly when submitting for review', () => {
    const component = shallow(<BaseEditCourseForm
      handleSubmit={() => null}
      title={initialValuesFull.title}
      currentFormValues={initialValuesFull}
      number="Test101x"
      entitlement={entitlement}
      courseStatuses={[UNPUBLISHED]}
      courseOptions={courseOptions}
      courseRunOptions={courseRunOptions}
      uuid={initialValuesFull.uuid}
      type={initialValuesFull.type}
      isSubmittingForReview
      id="edit-course-form"
    />);
    expect(component).toMatchSnapshot();
  });

  it('renders with disabled fields if course is in review', () => {
    const component = shallow(<BaseEditCourseForm
      handleSubmit={() => null}
      title={initialValuesFull.title}
      currentFormValues={initialValuesFull}
      number="Test101x"
      entitlement={entitlement}
      courseStatuses={[IN_LEGAL_REVIEW]}
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

  it('renders with mode disabled after being reviewed', () => {
    entitlement.sku = 'ABC1234';
    const component = shallow(<BaseEditCourseForm
      handleSubmit={() => null}
      title={initialValuesFull.title}
      initialValues={initialValuesFull}
      currentFormValues={initialValuesFull}
      number="Test101x"
      entitlement={entitlement}
      courseStatuses={[REVIEWED]}
      courseOptions={courseOptions}
      courseRunOptions={courseRunOptions}
      uuid={initialValuesFull.uuid}
      type={initialValuesFull.type}
      id="edit-course-form"
    />);

    const disabledFields = component.find({ disabled: true });
    expect(disabledFields.length === 1);
  });

  it('renders with course type disabled after being reviewed', () => {
    const initialValuesUpdated = Object.assign({}, initialValuesFull, { type: '8a8f30e1-23ce-4ed3-a361-1325c656b67b' });
    entitlement.sku = 'ABC1234';
    const component = shallow(<BaseEditCourseForm
      handleSubmit={() => null}
      title={initialValuesUpdated.title}
      initialValues={initialValuesUpdated}
      currentFormValues={initialValuesUpdated}
      number="Test101x"
      entitlement={entitlement}
      courseStatuses={[REVIEWED]}
      courseOptions={courseOptions}
      courseRunOptions={courseRunOptions}
      uuid={initialValuesUpdated.uuid}
      type={initialValuesUpdated.type}
      id="edit-course-form"
    />);

    const disabledFields = component.find({ disabled: true });
    expect(disabledFields.length === 1);
  });

  it('renders with mode disabled once a sku exists, even if course is unpublished', () => {
    entitlement.sku = 'ABC1234';
    const component = shallow(<BaseEditCourseForm
      handleSubmit={() => null}
      title={initialValuesFull.title}
      initialValues={initialValuesFull}
      currentFormValues={initialValuesFull}
      number="Test101x"
      entitlement={entitlement}
      courseStatuses={[UNPUBLISHED]}
      courseOptions={courseOptions}
      courseRunOptions={courseRunOptions}
      uuid={initialValuesFull.uuid}
      type={initialValuesFull.type}
      id="edit-course-form"
    />);

    const disabledFields = component.find({ disabled: true });
    expect(disabledFields.length === 1);
  });

  it('renders with course type disabled once a sku exists, even if course is unpublished', () => {
    const initialValuesUpdated = Object.assign({}, initialValuesFull, { type: '8a8f30e1-23ce-4ed3-a361-1325c656b67b' });
    entitlement.sku = 'ABC1234';
    const component = shallow(<BaseEditCourseForm
      handleSubmit={() => null}
      title={initialValuesUpdated.title}
      initialValues={initialValuesUpdated}
      currentFormValues={initialValuesUpdated}
      number="Test101x"
      entitlement={entitlement}
      courseStatuses={[UNPUBLISHED]}
      courseOptions={courseOptions}
      courseRunOptions={courseRunOptions}
      uuid={initialValuesUpdated.uuid}
      type={initialValuesUpdated.type}
      id="edit-course-form"
    />);

    const disabledFields = component.find({ disabled: true });
    expect(disabledFields.length === 1);
  });
});
