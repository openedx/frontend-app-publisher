import React from 'react';
import { render, waitFor, screen, fireEvent, within } from '@testing-library/react';
import { Hyperlink } from '@openedx/paragon';
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { createStore } from 'redux';
import createRootReducer from '../../data/reducers';

import { IntlProvider } from '@edx/frontend-platform/i18n';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { MemoryRouter } from 'react-router-dom';
import EditCourseForm from './EditCourseForm';
import {
  REVIEW_BY_LEGAL, REVIEWED, UNPUBLISHED, PUBLISHED,
} from '../../data/constants';
import { courseOptions, courseRunOptions } from '../../data/constants/testData';

const mockStore = configureStore();
const store = mockStore({form: {"edit-course-form": {
        values: {skill_names: ["HASTA", "BASTA"]},
        initial: {skill_names: ["HASTA", "BASTA"]},
        registeredFields: {skill_names: {count: 1, type: "Field", name: "skill_names"}}
      }}});

export const initialValuesFull = {
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
  course_runs: [
    {
      start: '2000-01-01T12:00:00Z', // Different format to be transformed
      end: '2010-01-01T00:00:00Z',
      external_key: null,
      go_live_date: '1999-12-31T00:00:00Z',
      pacing_type: 'self_paced',
      min_effort: 1,
      max_effort: 1,
      content_language: 'English',
      transcript_languages: ['English'],
      weeks_to_complete: 1,
      status: 'published',
      key: 'edX101+DemoX',
      has_ofac_restrictions: false,
      seats: [],
      run_type: '00000000-0000-4000-0000-000000000000',
    },
  ],
};

describe('BaseEditCourseForm', () => {
  const env = { ...process.env };

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
    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <IntlProvider locale="en">
            <EditCourseForm
              handleSubmit={() => null}
              initialValues={initialValuesFull}
              title={initialValuesFull.title}
              number="Test101x"
              courseStatuses={[UNPUBLISHED]}
              courseInfo={courseInfo}
              courseOptions={courseOptions}
              courseRunOptions={courseRunOptions}
              uuid={initialValuesFull.uuid}
              type={initialValuesFull.type}
              id="edit-course-form"
            />
          </IntlProvider>
        </MemoryRouter>
      </Provider>,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders html correctly with all data present', () => {
    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <IntlProvider locale="en">
            <EditCourseForm
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
            />
          </IntlProvider>
        </MemoryRouter>
      </Provider>,
    );
    expect(container).toMatchSnapshot();
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
    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <IntlProvider locale="en">
            <EditCourseForm
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
            />
          </IntlProvider>
        </MemoryRouter>
      </Provider>,
    );

    expect(container).toMatchSnapshot();
  });

  it('renders html correctly with administrator being true', () => {
    getAuthenticatedUser.mockReturnValue({ administrator: true });
    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <IntlProvider locale="en">
            <EditCourseForm
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
            />
          </IntlProvider>
        </MemoryRouter>
      </Provider>,
    );

    expect(container).toMatchSnapshot();
  });

  it('renders html correctly while submitting', () => {
    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <IntlProvider locale="en">
            <EditCourseForm
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
            />
          </IntlProvider>
        </MemoryRouter>
      </Provider>,
    );

    waitFor(() => expect(container).toMatchSnapshot());
  });

  it('renders correctly when submitting for review', () => {
    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <IntlProvider locale="en">
            <EditCourseForm
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
            />
          </IntlProvider>
        </MemoryRouter>
      </Provider>,
    );

    waitFor(() => expect(container).toMatchSnapshot());
  });

  it('override slug format when IS_NEW_SLUG_FORMAT_ENABLED is true to check help text for url slug field', () => {
    process.env.IS_NEW_SLUG_FORMAT_ENABLED = 'true';

    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <IntlProvider locale="en">
            <EditCourseForm
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
            />
          </IntlProvider>
        </MemoryRouter>
      </Provider>,
    );

    expect(container).toMatchSnapshot();
  });

  it('renders with disabled fields if course is in review', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <IntlProvider locale="en">
            <EditCourseForm
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
            />
          </IntlProvider>
        </MemoryRouter>
      </Provider>,
    );

    const childFields = screen.getAllByRole('textbox');
    childFields.forEach((field) => {
      expect(field.disabled || field.parentElement.classList.contains('disabled-rich-text')).toBe(true);
    });
  });

  it('renders with course type disabled after being reviewed', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <IntlProvider locale="en">
            <EditCourseForm
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
            />
          </IntlProvider>
        </MemoryRouter>
      </Provider>,
    );

    
    const typeField = screen.getByRole('combobox', { name: 'Course enrollment track Cannot edit after submission' });
    expect(typeField).toBeDisabled()
  });

  it('Check if watchers field is disabled after being reviewed', () => {
    const courseInfoWithCourseRunStatuses = {
      ...courseInfo,
      data: {
        ...courseInfo.data,
        course_run_statuses: [REVIEWED],
      },
    };

    render(
      <Provider store={store}>
        <MemoryRouter>
          <IntlProvider locale="en">
            <EditCourseForm
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
            />
          </IntlProvider>
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.getByLabelText('watchers-list')).toBeDisabled()
  });

  it('Check if watchers field is enabled when any of the course run is in pre-reviewed status', async () => {
    const courseInfoWithCourseRunStatuses = {
      ...courseInfo,
      data: {
        ...courseInfo.data,
        course_run_statuses: [REVIEW_BY_LEGAL, UNPUBLISHED],
      },
    };

    const {container} = render(
      <Provider store={store}>
        <MemoryRouter>
          <IntlProvider locale="en">
            <EditCourseForm
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
            />
          </IntlProvider>
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.getByLabelText('watchers-list')).not.toBeDisabled()
  });

  it('renders with course type disabled once a sku exists, even if course is unpublished', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <IntlProvider locale="en">
            <EditCourseForm
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
            />
          </IntlProvider>
        </MemoryRouter>
      </Provider>,
    );

    const disabledFields = screen.findByText('type', { disabled: true });
    waitFor(() => expect(disabledFields).toHaveLength(1));
  });

  it('check for customValidity working correctly for url_slug in EditCourseForm', async () => {
    getAuthenticatedUser.mockReturnValue({ administrator: true });

    const courseInfoWithUrlSlug = {
      data: {
        url_slug: 'test-url-slug/',
      },
    };
    const initialValuesWithUrlSlug = {
      ...initialValuesFull,
      course_runs: [],
    };
    const realStore = createStore(createRootReducer());
    render(
      <Provider store={realStore}>
        <MemoryRouter>
          <IntlProvider locale="en">
            <EditCourseForm
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
              editable
            />
          </IntlProvider>
        </MemoryRouter>
      </Provider>,
    );

    const urlSlugField = screen.getByRole('textbox', {name: 'URL slug'});

    const invalidInput = 'Invalid-URL-Slug123/mah';
    fireEvent.input(urlSlugField, {target: {value: invalidInput}})
    const submitButton = screen.getByRole('button', {name: 
      'Save & Continue Editing'
    })
    fireEvent.click(submitButton);
    expect(urlSlugField.validationMessage).toBe(
      'Please enter a valid URL slug. Course URL slug contains lowercase letters, numbers, underscores, and dashes only.',
    );

    // check validation message after valid input
    fireEvent.input(urlSlugField, {target: {value: ""}})
    expect(urlSlugField.validationMessage).toBe('');
  });

  it('checks preview url renders correctly for old url slug format', () => {
    const urlSlug = 'test-url-slug';
    const { MARKETING_SITE_PREVIEW_URL_ROOT } = process.env;
    const courseInfoWithUrlSlug = { ...courseInfo, data: { ...courseInfo.data, url_slug: urlSlug } };
    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <IntlProvider locale="en">
            <EditCourseForm
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
            />
          </IntlProvider>
        </MemoryRouter>
      </Provider>,
    );

    const link = screen.getByRole('link', { name: /View Preview Page/i })
    expect(link).toHaveAttribute('href', `${MARKETING_SITE_PREVIEW_URL_ROOT}/course/${urlSlug}`);

  });

  it('checks preview url renders correctly for new slug format', () => {
    const urlSlug = 'learn/test-url-slug/test';
    const { MARKETING_SITE_PREVIEW_URL_ROOT } = process.env;
    const courseInfoWithUrlSlug = { ...courseInfo, data: { ...courseInfo.data, url_slug: urlSlug } };

    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <IntlProvider locale="en">
            <EditCourseForm
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
            />
          </IntlProvider>
        </MemoryRouter>
      </Provider>,
    );

    const link = screen.getByRole('link', { name: /View Preview Page/i })
    expect(link).toHaveAttribute('href', `${MARKETING_SITE_PREVIEW_URL_ROOT}/${urlSlug}`);
  });

  it('no marketing fields if course type is not marketable', () => {
    const initialValuesWithMasters = {
      ...initialValuesFull,
      type: '7b41992e-f268-4331-8ba9-72acb0880454',
    };

    render(
      <Provider store={store}>
        <MemoryRouter>
          <IntlProvider locale="en">
            <EditCourseForm
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
            />
          </IntlProvider>
        </MemoryRouter>
      </Provider>,
    );

    screen.debug()

    const invisible = [
      'Short description', 'Long description', 'What you will learn', 'Syllabus', 'Prerequisites',
      'Learner testimonials', 'Frequently asked questions', 'Additional information', 'About video link',
    ];
    invisible.forEach((name) => {
      expect(screen.queryByText(name)).not.toBeInTheDocument();
    });

    // Just sanity check that a field we still want there is there:
    expect(screen.queryByText('Image')).toBeInTheDocument();
  });

  it('renders html correctly while fetching collaborator options', () => {
    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <IntlProvider locale="en">
            <EditCourseForm
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
              collaboratorOptions={{ data: {} }}
            />
          </IntlProvider>
        </MemoryRouter>
      </Provider>,
    );

    // const { container } = render(<BaseEditCourseForm
    //   handleSubmit={() => null}
    //   initialValues={{
    //     title: initialValuesFull.title,
    //   }}
    //   title={initialValuesFull.title}
    //   number="Test101x"
    //   courseStatuses={[UNPUBLISHED]}
    //   courseInfo={courseInfo}
    //   courseOptions={courseOptions}
    //   courseRunOptions={courseRunOptions}
    //   uuid={initialValuesFull.uuid}
    //   type={initialValuesFull.type}
    //   id="edit-course-form"
    //   collaboratorOptions={{ data: {} }}
    // />);
    waitFor(() => expect(container).toMatchSnapshot());
  });

  it('does not add required prop for level_type and subjectPrimary fields when not submitting for review', async () => {
    const initialValuesWithMasters = {
      ...initialValuesFull,
      type: '7b41992e-f268-4331-8ba9-72acb0880454',
    };

    render(
      <Provider store={store}>
        <MemoryRouter>
          <IntlProvider locale="en">
            <EditCourseForm
              handleSubmit={() => null}
              title="Test Course"
              initialValues={{ title: initialValuesFull.title }}
              currentFormValues={initialValuesWithMasters}
              number="Test101x"
              courseStatuses={[UNPUBLISHED]}
              courseInfo={courseInfo}
              courseOptions={courseOptions}
              courseRunOptions={courseRunOptions}
              uuid={initialValuesWithMasters.uuid}
              type={initialValuesWithMasters.type}
              isSubmittingForReview={false}
              id="edit-course-form"
            />
          </IntlProvider>
        </MemoryRouter>
      </Provider>,
    );

    const levelTypeField = screen.getByRole('combobox', { name: 'Course level' });

    const subjectPrimaryField = screen.getByRole('combobox', { name: 'Primary subject' });

    expect(levelTypeField).not.toBeRequired();
    expect(subjectPrimaryField).not.toBeRequired();
  });
});
