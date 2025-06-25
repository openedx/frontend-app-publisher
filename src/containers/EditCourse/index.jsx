import { connect } from 'react-redux';
import { getFormValues } from 'redux-form';

import EditCoursePage from '../../components/EditCoursePage';
import {
  updateFormValuesAfterSave, editCourse, fetchCourseInfo, clearCreateStatusAlert,
} from '../../data/actions/courseInfo';
import { clearSubmitStatus, clearCourseReviewAlert } from '../../data/actions/courseSubmitInfo';
import { addCourseEditor, fetchCourseEditors, removeCourseEditor } from '../../data/actions/courseEditors';
import { fetchCourseOptions } from '../../data/actions/courseOptions';
import { fetchCourseRunOptions } from '../../data/actions/courseRunOptions';
import { fetchOrganizationRoles } from '../../data/actions/organizationRoles';
import { fetchOrganizationUsers } from '../../data/actions/organizationUsers';
import { addComment, fetchComments } from '../../data/actions/comments';
import { fetchCollaboratorOptions } from '../../data/actions/collaboratorOptions';
import { fetchCourseTagOptions } from '../../data/actions/courseTagOptions';
import { withParams } from '../../utils/hoc';

const mapStateToProps = state => ({
  comments: state.comments,
  courseEditors: state.courseEditors,
  courseInfo: state.courseInfo,
  collaboratorOptions: state.collaboratorOptions,
  courseOptions: state.courseOptions,
  courseRunOptions: state.courseRunOptions,
  courseSubmitInfo: state.courseSubmitInfo,
  courseTagOptions: state.courseTagOptions,
  organizationRoles: state.organizationRoles,
  organizationUsers: state.organizationUsers,
  sourceInfo: state.sourceInfo,
  stafferInfo: state.stafferInfo,
  collaboratorInfo: state.collaboratorInfo,
  formValues: formId => getFormValues(formId)(state),
});

const mapDispatchToProps = {
  addCourseEditor,
  addComment,
  fetchComments,
  fetchCourseEditors,
  fetchCourseInfo,
  fetchCourseOptions,
  fetchCourseRunOptions,
  fetchOrganizationRoles,
  fetchOrganizationUsers,
  editCourse,
  clearSubmitStatus,
  clearCourseReviewAlert,
  clearCreateStatusAlert,
  removeCourseEditor,
  updateFormValuesAfterSave,
  fetchCollaboratorOptions,
  fetchCourseTagOptions,
};

const mergeProps = (stateProps, actionProps, { uuid }) => ({
  ...stateProps,
  ...actionProps,
  addCourseEditor: userId => actionProps.addCourseEditor(uuid, userId),
  fetchCourseEditors: () => actionProps.fetchCourseEditors(uuid),
  fetchCourseInfo: () => actionProps.fetchCourseInfo(uuid),
  addComment: comment => actionProps.addComment(comment),
  fetchComments: () => actionProps.fetchComments(uuid),
});



// export default withParams(connect(
//   mapStateToProps,
//   mapDispatchToProps,
//   mergeProps,
// )(EditCoursePage));


import {
  PUBLISHED, REVIEW_BY_INTERNAL, REVIEW_BY_LEGAL, UNPUBLISHED, EXECUTIVE_EDUCATION_SLUG,
} from '../../data/constants';

const defaultPrice = '77';
const defaultEnd = '2019-08-14T00:00:00Z';
const defaultUpgradeDeadlineOverride = '2019-09-14T00:00:00Z';
const variantId = '00000000-0000-0000-0000-000000000000';
const restrictionType = 'custom-b2b-enterprise';
const watchers = ['test@test.com'];


import { courseOptions, courseRunOptions } from '../../data/constants/testData';

const publishedCourseRun = {
  key: 'edX101+DemoX+T1',
  start: '2019-05-14T00:00:00Z',
  end: defaultEnd,
  upgrade_deadline_override: defaultUpgradeDeadlineOverride,
  variant_id: variantId,
  restriction_type: restrictionType,
  expected_program_type: null,
  expected_program_name: '',
  go_live_date: '2019-05-06T00:00:00Z',
  min_effort: '10',
  max_effort: '123',
  pacing_type: 'instructor_paced',
  content_language: 'en-us',
  transcript_languages: ['en-us'],
  weeks_to_complete: '100',
  seats: [],
  staff: [],
  status: PUBLISHED,
  draft: undefined,
  marketing_url: null,
  has_ofac_restrictions: false,
  ofac_comment: '',
  run_type: '4e260c57-24ef-46c1-9a0d-5ec3a30f6b0c',
  external_key: null,
};

const unpublishedCourseRun = {

  ...publishedCourseRun,
  key: 'edX101+DemoX+T2',
  status: UNPUBLISHED,
  expected_program_type: 'micromasters',
  expected_program_name: 'Test Program Name',
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
    editable: true,
    additional_information: '',
    additional_metadata: {
      external_url: 'https://www.external_url.com',
      external_identifier: '2U_external_identifier',
      lead_capture_form_url: 'https://www.lead_capture_url.com',
      organic_url: 'https://www.organic_url.com',
      certificate_info: {
        heading: 'heading',
        blurb: 'blurb',
      },
      facts: [{
        heading: 'facts_1_heading',
        blurb: 'facts_1_blurb',
      },
      {
        heading: 'facts_2_heading',
        blurb: 'facts_2_blurb',
      }],
      start_date: '2019-05-10T00:00:00Z',
      end_date: '2019-05-10T00:00:00Z',
      product_status: 'published',
      external_course_marketing_type: 'short_course',
      product_meta: null,
      registration_deadline: '2019-05-10T00:00:00Z',
      variant_id: '00000000-0000-0000-0000-000000000000',
    },
    course_runs: [
      {
        key: 'edX101+DemoX+T2',
        start: '2019-05-14T00:00:00Z',
        end: defaultEnd,
        upgrade_deadline_override: '2019-05-10T00:00:00Z',
        variant_id: null,
        restriction_type: restrictionType,
        expected_program_type: 'micromasters',
        expected_program_name: 'Test Program Name',
        go_live_date: '2019-05-06T00:00:00Z',
        min_effort: 10,
        max_effort: 123,
        pacing_type: 'instructor_paced',
        content_language: 'ar-ae',
        transcript_languages: ['ar-ae'],
        weeks_to_complete: 100,
        seats: [],
        staff: [],
        status: UNPUBLISHED,
        draft: undefined,
        marketing_url: null,
        has_ofac_restrictions: false,
        ofac_comment: '',
        run_type: '4e260c57-24ef-46c1-9a0d-5ec3a30f6b0c',
        external_key: null,
      },
      {
        key: 'edX101+DemoX+T1',
        start: '2019-05-14T00:00:00Z',
        end: defaultEnd,
        upgrade_deadline_override: '2019-05-10T00:00:00Z',
        variant_id: null,
        restriction_type: null,
        expected_program_type: null,
        expected_program_name: '',
        go_live_date: '2019-05-06T00:00:00Z',
        min_effort: 10,
        max_effort: 123,
        pacing_type: 'instructor_paced',
        content_language: 'ar-ae',
        transcript_languages: ['ar-ae'],
        weeks_to_complete: 100,
        seats: [],
        staff: [],
        status: PUBLISHED,
        draft: undefined,
        marketing_url: null,
        has_ofac_restrictions: false,
        ofac_comment: '',
        run_type: '4e260c57-24ef-46c1-9a0d-5ec3a30f6b0c',
        external_key: null,
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
    collaborators: [],
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
    type: '8a8f30e1-23ce-4ed3-a361-1325c656b67b',
    topics: [],
    uuid: '00000000-0000-0000-0000-000000000000',
    video: {
      src: 'https://www.video.information/watch?v=cVsQLlk-T0s',
      description: null,
      image: null,
    },
    skill_names: [],
    organization_logo_override_url: 'http://image.src.small',
    organization_short_code_override: 'test short code',
    watchers,
    watchers_list: watchers?.length ? watchers.map(w => ({ label: w, value: w })) : null,
    location_restriction: {
      restriction_type: 'allowlist',
      countries: [
        'AF', 'AX',
      ],
      states: ['AL'],
    },
  },
  showCreateStatusAlert: false,
  isFetching: false,
  error: null,
};



export default function Fun(){
    return (


        <EditCoursePage
          courseInfo={courseInfo}
          courseOptions={courseOptions}
          courseRunOptions={courseRunOptions}
          currentFormValues={initialValuesFull}
          courseSubmitInfo={{targetRun: unpublishedCourseRun}}
        />

    )

}