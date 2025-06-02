import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import { Hyperlink } from '@openedx/paragon';
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';
import '@testing-library/jest-dom';

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
const store = mockStore({});

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

  it.skip('renders html correctly with minimal data', async () => {
    // TODO: course run toolbar does not render
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
    await waitFor(() => expect(container).toMatchSnapshot());
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

  it.skip('renders html correctly with skills data when skills are available', async () => {
    // TODO: redux form/prop issue as the form is not rendering
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

    // const { container } = render(<BaseEditCourseForm
    //   handleSubmit={() => null}
    //   initialValues={initialValuesWithSkills}
    //   title={initialValuesFull.title}
    //   number="Test101x"
    //   courseStatuses={[UNPUBLISHED]}
    //   courseInfo={courseInfoWithSkills}
    //   courseOptions={courseOptions}
    //   courseRunOptions={courseRunOptions}
    //   uuid={initialValuesFull.uuid}
    //   type={initialValuesFull.type}
    //   id="edit-course-form"
    // />);
    await waitFor(() => expect(container).toMatchSnapshot());
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

  it('renders html correctly while submitting', async () => {
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

    await waitFor(() => expect(container).toMatchSnapshot());
  });

  it('renders correctly when submitting for review', async () => {
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

    await waitFor(() => expect(container).toMatchSnapshot());
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

  it.skip('renders with disabled fields if course is in review', () => {
    // TODO: some fields are not disabled.
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
      expect(field).toBeDisabled();
    });
  });

  it.skip('renders with course type disabled after being reviewed', async () => {
  // TODO: multiple elements returned
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

    const disabledFields = await screen.findByRole('textbox', { disabled: true });
    await waitFor(() => expect(disabledFields).toHaveLength(1));
  });

  it.skip('Check if watchers field is disabled after being reviewed', () => {
    // TODO: data-testid element not found
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

    const watchersField = screen.findByTestId('watchers-list', { disabled: true });
    expect(watchersField).toHaveLength(1);
  });

  it.skip('Check if watchers field is enabled when any of the course run is in pre-reviewed status', async () => {
    // TODO: data-testid element not found
    const courseInfoWithCourseRunStatuses = {
      ...courseInfo,
      data: {
        ...courseInfo.data,
        course_run_statuses: [REVIEW_BY_LEGAL, UNPUBLISHED],
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

    // render(<BaseEditCourseForm
    //   handleSubmit={() => null}
    //   title={initialValuesFull.title}
    //   initialValues={initialValuesFull}
    //   currentFormValues={initialValuesFull}
    //   number="Test101x"
    //   entitlement={{ sku: 'ABC1234' }}
    //   courseStatuses={[REVIEW_BY_LEGAL, UNPUBLISHED]}
    //   courseInfo={courseInfoWithCourseRunStatuses}
    //   courseOptions={courseOptions}
    //   courseRunOptions={courseRunOptions}
    //   uuid={initialValuesFull.uuid}
    //   type={initialValuesFull.type}
    //   id="edit-course-form"
    // />);

    const watchersField = screen.getByTestId('watchers-list', { disabled: false });
    expect(watchersField).toHaveLength(1);
  });

  it('renders with course type disabled once a sku exists, even if course is unpublished', async () => {
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
    await waitFor(() => expect(disabledFields).toHaveLength(1));
  });

  it.skip('check for customValidity working correctly for url_slug in EditCourseForm', () => {
    // TODO: to be converted to RTL after render call
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

    render(
      <Provider store={store}>
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
            />
          </IntlProvider>
        </MemoryRouter>
      </Provider>,
    );

    // render(
    //   <BaseEditCourseForm
    //     handleSubmit={() => null}
    //     title={initialValuesWithUrlSlug.title}
    //     initialValues={initialValuesWithUrlSlug}
    //     currentFormValues={initialValuesWithUrlSlug}
    //     number="Test101x"
    //     entitlement={{ sku: 'ABC1234' }}
    //     courseStatuses={[PUBLISHED]}
    //     courseInfo={courseInfoWithUrlSlug}
    //     courseOptions={courseOptions}
    //     courseRunOptions={courseRunOptions}
    //     uuid={initialValuesWithUrlSlug.uuid}
    //     type={initialValuesWithUrlSlug.type}
    //     id="edit-course-form"
    //   />,
    // );

    const urlSlugField = screen.findByRole('url_slug');

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

  it.skip('checks preview url renders correctly for old url slug format', () => {
    // TODO: to be converted to RTL format after rendering
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

    // const { container } = render(<BaseEditCourseForm
    //   handleSubmit={() => null}
    //   title={initialValuesFull.title}
    //   initialValues={initialValuesFull}
    //   currentFormValues={initialValuesFull}
    //   number="Test101x"
    //   entitlement={{ sku: 'ABC1234' }}
    //   courseStatuses={[REVIEWED]}
    //   courseInfo={courseInfoWithUrlSlug}
    //   courseOptions={courseOptions}
    //   courseRunOptions={courseRunOptions}
    //   uuid={initialValuesFull.uuid}
    //   type={initialValuesFull.type}
    //   id="edit-course-form"
    // />);
    expect(container.instance().getLinkComponent([REVIEWED], courseInfoWithUrlSlug)).toEqual(
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

  it.skip('checks preview url renders correctly for new slug format', () => {
    // TODO: To be converted from enzmye to RTL
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

    // const { container } = render(<BaseEditCourseForm
    //   handleSubmit={() => null}
    //   title={initialValuesFull.title}
    //   initialValues={initialValuesFull}
    //   currentFormValues={initialValuesFull}
    //   number="Test101x"
    //   entitlement={{ sku: 'ABC1234' }}
    //   courseStatuses={[REVIEWED]}
    //   courseInfo={courseInfoWithUrlSlug}
    //   courseOptions={courseOptions}
    //   courseRunOptions={courseRunOptions}
    //   uuid={initialValuesFull.uuid}
    //   type={initialValuesFull.type}
    //   id="edit-course-form"
    // />);
    expect(container.instance().getLinkComponent([REVIEWED], courseInfoWithUrlSlug)).toEqual(
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

  it.skip('no marketing fields if course type is not marketable', async () => {
    // TODO: findByName is not a valid function in RTL, a different mechanism is needed to get the fields
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

    // render(<BaseEditCourseForm
    //   handleSubmit={() => null}
    //   title={initialValuesWithMasters.title}
    //   initialValues={initialValuesWithMasters}
    //   currentFormValues={initialValuesWithMasters}
    //   number="Masters101x"
    //   courseStatuses={[UNPUBLISHED]}
    //   courseInfo={courseInfo}
    //   courseOptions={courseOptions}
    //   courseRunOptions={courseRunOptions}
    //   uuid={initialValuesWithMasters.uuid}
    //   type={initialValuesWithMasters.type}
    //   id="edit-course-form"
    // />);

    const invisible = [
      'short_description', 'full_description', 'outcome', 'syllabus_raw', 'prerequisites_raw',
      'learner_testimonials', 'faq', 'additional_information', 'videoSrc',
    ];
    await Promise.all(
      invisible.map(async (name) => {
        const fields = screen.findByName({ name });
        await waitFor(() => expect(fields).toHaveLength(0));
      }),
    );

    // Just sanity check that a field we still want there is there:
    const fields = screen.findByName({ name: 'imageSrc' });
    expect(fields).toHaveLength(1);
  });

  it('renders html correctly while fetching collaborator options', async () => {
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
    await waitFor(() => expect(container).toMatchSnapshot());
  });

  it.skip('does not add required prop for level_type and subjectPrimary fields when not submitting for review', async () => {
    // TODO: getByRole is unable to find the elements
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

    const levelTypeField = screen.getByRole('combobox', { name: 'level_type' });

    const subjectPrimaryField = screen.getByRole('combobox', { name: 'subjectPrimary' });

    expect(levelTypeField.prop('required')).toBe(false);
    expect(subjectPrimaryField.prop('required')).toBe(false);
  });
});
