import React from 'react';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import { Field } from 'redux-form';
import { Hyperlink } from '@edx/paragon';
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';

import { BaseEditCourseForm } from './EditCourseForm';
import {
  REVIEW_BY_LEGAL, REVIEWED, UNPUBLISHED, PUBLISHED,
} from '../../data/constants';
import { courseOptions, courseRunOptions } from '../../data/constants/testData';

describe('BaseEditCourseForm', () => {
  const env = { ...process.env };

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
    topics: [],
    uuid: '11111111-1111-1111-1111-111111111111',
    editable: true,
    skill_names: [],
    organization_logo_override: 'http://image.src.small',
    organization_short_code_override: 'test short code',
    watchers: ['test@test.com'],
    location_restriction: {
      restriction_type: 'allowlist',
      countries: ['AF', 'AX'],
      states: ['CO'],
    },
    in_year_value: {
      per_click_usa: 100,
      per_click_international: 100,
      per_lead_usa: 100,
      per_lead_international: 100,
    },
  };

  const courseInfo = {
    data: {
      skill_names: [],
    },
  };

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...env };
    getAuthenticatedUser.mockReturnValue({ administrator: false });
  });

  afterEach(() => {
    process.env = env;
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
      courseInfo={courseInfo}
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
      courseInfo={courseInfo}
      courseOptions={courseOptions}
      courseRunOptions={courseRunOptions}
      uuid={initialValuesFull.uuid}
      type={initialValuesFull.type}
      id="edit-course-form"
    />);
    expect(shallowToJson(component)).toMatchSnapshot();
  });

  it('renders html correctly with skills data when skills are available', () => {
    const skillNames = ['skill1', 'skill2', 'skill3', 'skill4'];
    const courseInfoWithSkills = {
      data: {
        skill_names: skillNames,
      },
    };
    const initialValuesWithSkills = {
      title: initialValuesFull.title,
      skill_names: skillNames,
    };

    const component = shallow(<BaseEditCourseForm
      handleSubmit={() => null}
      initialValues={initialValuesWithSkills}
      title={initialValuesFull.title}
      number="Test101x"
      courseStatuses={[UNPUBLISHED]}
      courseInfo={courseInfoWithSkills}
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
      courseInfo={courseInfo}
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
      courseInfo={courseInfo}
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
      courseInfo={courseInfo}
      courseOptions={courseOptions}
      courseRunOptions={courseRunOptions}
      uuid={initialValuesFull.uuid}
      type={initialValuesFull.type}
      isSubmittingForReview
      id="edit-course-form"
    />);
    expect(shallowToJson(component)).toMatchSnapshot();
  });

  it('override slug format when IS_NEW_SLUG_FORMAT_ENABLED is true to check help text for url slug field', () => {
    process.env.IS_NEW_SLUG_FORMAT_ENABLED = 'true';

    const component = shallow(<BaseEditCourseForm
      handleSubmit={() => null}
      title={initialValuesFull.title}
      currentFormValues={initialValuesFull}
      number="Test101x"
      courseStatuses={[UNPUBLISHED]}
      courseInfo={courseInfo}
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
      courseInfo={courseInfo}
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
      courseInfo={courseInfo}
      courseOptions={courseOptions}
      courseRunOptions={courseRunOptions}
      uuid={initialValuesFull.uuid}
      type={initialValuesFull.type}
      id="edit-course-form"
    />);

    const disabledFields = component.find({ name: 'type', disabled: true });
    expect(disabledFields).toHaveLength(1);
  });

  it('Check if watchers field is disabled after being reviewed', () => {
    const courseInfoWithCourseRunStatuses = {
      ...courseInfo,
      data: {
        ...courseInfo.data,
        course_run_statuses: [REVIEWED],
      },
    };
    const component = shallow(<BaseEditCourseForm
      handleSubmit={() => null}
      title={initialValuesFull.title}
      initialValues={initialValuesFull}
      currentFormValues={initialValuesFull}
      number="Test101x"
      entitlement={{ sku: 'ABC1234' }}
      courseStatuses={[REVIEWED]}
      courseInfo={courseInfoWithCourseRunStatuses}
      courseOptions={courseOptions}
      courseRunOptions={courseRunOptions}
      uuid={initialValuesFull.uuid}
      type={initialValuesFull.type}
      id="edit-course-form"
    />);

    const watchersField = component.find({ name: 'watchers_list', disabled: true });
    expect(watchersField).toHaveLength(1);
  });

  it('Check if watchers field is enabled when any of the course run is in pre-reviewed status', () => {
    const courseInfoWithCourseRunStatuses = {
      ...courseInfo,
      data: {
        ...courseInfo.data,
        course_run_statuses: [REVIEW_BY_LEGAL, UNPUBLISHED],
      },
    };
    const component = shallow(<BaseEditCourseForm
      handleSubmit={() => null}
      title={initialValuesFull.title}
      initialValues={initialValuesFull}
      currentFormValues={initialValuesFull}
      number="Test101x"
      entitlement={{ sku: 'ABC1234' }}
      courseStatuses={[REVIEW_BY_LEGAL, UNPUBLISHED]}
      courseInfo={courseInfoWithCourseRunStatuses}
      courseOptions={courseOptions}
      courseRunOptions={courseRunOptions}
      uuid={initialValuesFull.uuid}
      type={initialValuesFull.type}
      id="edit-course-form"
    />);

    const watchersField = component.find({ name: 'watchers_list', disabled: false });
    expect(watchersField).toHaveLength(1);
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
      courseInfo={courseInfo}
      courseOptions={courseOptions}
      courseRunOptions={courseRunOptions}
      uuid={initialValuesFull.uuid}
      type={initialValuesFull.type}
      id="edit-course-form"
    />);

    const disabledFields = component.find({ name: 'type', disabled: true });
    expect(disabledFields).toHaveLength(1);
  });

  it('check for customValidity working correctly for url_slug in EditCourseForm', () => {
    const setCustomValidityMock = jest.fn();
    const courseInfoWithUrlSlug = {
      data: {
        url_slug: 'test-url-slug/',
      },
    };
    const initialValuesWithUrlSlug = {
      ...initialValuesFull,
      course_runs: [],
    };
    const component = shallow(
      <BaseEditCourseForm
        handleSubmit={() => null}
        title={initialValuesWithUrlSlug.title}
        initialValues={initialValuesWithUrlSlug}
        currentFormValues={initialValuesWithUrlSlug}
        number="Test101x"
        entitlement={{ sku: 'ABC1234' }}
        courseStatuses={[PUBLISHED]}
        courseInfo={courseInfoWithUrlSlug}
        courseOptions={courseOptions}
        courseRunOptions={courseRunOptions}
        uuid={initialValuesWithUrlSlug.uuid}
        type={initialValuesWithUrlSlug.type}
        id="edit-course-form"
      />,
    );

    const urlSlugField = component.find({ name: 'url_slug' });

    const invalidInput = 'Invalid-URL-Slug123/';
    urlSlugField.prop('extraInput').onInvalid({ target: { setCustomValidity: setCustomValidityMock } });
    urlSlugField.simulate('input', { target: { value: invalidInput } });
    expect(setCustomValidityMock).toHaveBeenCalledWith(
      'Please enter a valid URL slug. Course URL slug contains lowercase letters, numbers, underscores, and dashes only.',
    );

    // check that it will clear onInput after invalid input
    urlSlugField.prop('extraInput').onInput({ target: { setCustomValidity: setCustomValidityMock } });
    expect(setCustomValidityMock).toHaveBeenCalledWith('');
  });

  it('checks preview url renders correctly for old url slug format', () => {
    const urlSlug = 'test-url-slug';
    const { MARKETING_SITE_PREVIEW_URL_ROOT } = process.env;
    const courseInfoWithUrlSlug = { ...courseInfo, data: { ...courseInfo.data, url_slug: urlSlug } };
    const wrapper = shallow(<BaseEditCourseForm
      handleSubmit={() => null}
      title={initialValuesFull.title}
      initialValues={initialValuesFull}
      currentFormValues={initialValuesFull}
      number="Test101x"
      entitlement={{ sku: 'ABC1234' }}
      courseStatuses={[REVIEWED]}
      courseInfo={courseInfoWithUrlSlug}
      courseOptions={courseOptions}
      courseRunOptions={courseRunOptions}
      uuid={initialValuesFull.uuid}
      type={initialValuesFull.type}
      id="edit-course-form"
    />);
    expect(wrapper.instance().getLinkComponent([REVIEWED], courseInfoWithUrlSlug)).toEqual(
      <>
        <Hyperlink
          name="preview-url"
          destination={`${MARKETING_SITE_PREVIEW_URL_ROOT}/course/${urlSlug}`}
          target="_blank"
        >
          View Preview Page
        </Hyperlink>
        <span className="d-block">Any changes will go live when the website next builds</span>
      </>,
    );
  });

  it('checks preview url renders correctly for new slug format', () => {
    const urlSlug = 'learn/test-url-slug/test';
    const { MARKETING_SITE_PREVIEW_URL_ROOT } = process.env;
    const courseInfoWithUrlSlug = { ...courseInfo, data: { ...courseInfo.data, url_slug: urlSlug } };
    const wrapper = shallow(<BaseEditCourseForm
      handleSubmit={() => null}
      title={initialValuesFull.title}
      initialValues={initialValuesFull}
      currentFormValues={initialValuesFull}
      number="Test101x"
      entitlement={{ sku: 'ABC1234' }}
      courseStatuses={[REVIEWED]}
      courseInfo={courseInfoWithUrlSlug}
      courseOptions={courseOptions}
      courseRunOptions={courseRunOptions}
      uuid={initialValuesFull.uuid}
      type={initialValuesFull.type}
      id="edit-course-form"
    />);
    expect(wrapper.instance().getLinkComponent([REVIEWED], courseInfoWithUrlSlug)).toEqual(
      <>
        <Hyperlink
          name="preview-url"
          destination={`${MARKETING_SITE_PREVIEW_URL_ROOT}/${urlSlug}`}
          target="_blank"
        >
          View Preview Page
        </Hyperlink>
        <span className="d-block">Any changes will go live when the website next builds</span>
      </>,
    );
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
      courseInfo={courseInfo}
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
