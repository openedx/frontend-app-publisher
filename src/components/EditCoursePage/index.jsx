/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

import EditCourseForm from './EditCourseForm';
import PageContainer from '../PageContainer';
import StatusAlert from '../StatusAlert';
import LoadingSpinner from '../LoadingSpinner';
import {
  buildInitialPrices, courseRunIsArchived, formatPriceData, getCourseNumber, isValidDate,
  isNonExemptChanged, jsonDeepEqual,
} from '../../utils';
import { courseRunSubmitting } from '../../data/actions/courseSubmitInfo';
import {
  IN_REVIEW_STATUS, PUBLISHED, REVIEW_BY_INTERNAL, REVIEW_BY_LEGAL, REVIEWED,
  UNPUBLISHED, AUDIT_TRACK, EXECUTIVE_EDUCATION_SLUG,
} from '../../data/constants';
import store from '../../data/store';
import ConfirmationModal from '../ConfirmationModal';
import SidePanes from '../SidePanes';

class EditCoursePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startedFetching: false,
      submitConfirmVisible: false,
      submitCourseData: {},
    };
    this.handleCourseSubmit = this.handleCourseSubmit.bind(this);
    this.setStartedFetching = this.setStartedFetching.bind(this);
    this.showModal = this.showModal.bind(this);
    this.cancelSubmit = this.cancelSubmit.bind(this);
    this.continueSubmit = this.continueSubmit.bind(this);
    this.dismissReviewStatusAlert = this.dismissReviewStatusAlert.bind(this);
    this.dismissCreateStatusAlert = this.dismissCreateStatusAlert.bind(this);
    this.displayReviewStatusAlert = this.displayReviewStatusAlert.bind(this);
    this.handleModalForReviewedRun = this.handleModalForReviewedRun.bind(this);
    this.buildInitialValues = this.buildInitialValues.bind(this);
    this.buildCourseRuns = this.buildCourseRuns.bind(this);
    this.getData = this.getData.bind(this);
  }

  componentDidMount() {
    this.getData();
  }

  componentWillUnmount() {
    this.dismissCreateStatusAlert();
    this.dismissReviewStatusAlert();
  }

  getData() {
    this.props.fetchCourseInfo();
    this.props.fetchCourseOptions();
    this.props.fetchCourseRunOptions();
    this.props.fetchCollaboratorOptions();
    this.setStartedFetching();
  }

  setStartedFetching() {
    this.setState({ startedFetching: true });
  }

  getFormId() {
    return `edit-course-form-${this.props.courseInfo.data.uuid}`;
  }

  prepareSendCourseRunData(courseData) {
    const {
      courseInfo: {
        data: {
          course_runs: initialCourseRuns,
          entitlements,
          type: initialType,
        },
      },
      courseOptions,
      courseSubmitInfo: {
        targetRun,
      },
    } = this.props;

    const sendCourseRuns = [];
    const initialCourseRunValues = this.buildCourseRuns();
    const priceData = formatPriceData(courseData, courseOptions);
    const fakeInitialPriceForm = {
      type: initialType,
      prices: buildInitialPrices(entitlements, initialCourseRuns),
    };
    const initialPriceData = formatPriceData(fakeInitialPriceForm, courseOptions);

    const courseTypeChanged = initialType !== courseData.type;
    const coursePriceChanged = !jsonDeepEqual(initialPriceData, priceData);

    const modifiedCourseRuns = courseData.course_runs.filter((run, i) => {
      // If we are submitting a run for review or re-publishing a run, it should
      // always get through to the backend
      if (targetRun && (run.key === targetRun.key)) {
        return true;
      }

      // Don't send any courses in review - backend will reject them
      if (IN_REVIEW_STATUS.includes(run.status)) {
        return false;
      }

      // send runs if they have changed OR the course type or price has
      // changed and the run is NOT "archived" (we care about the type and
      // price because those are passed down to the course runs' seats)
      const runHasChanges = !jsonDeepEqual(initialCourseRunValues[i], run);
      return runHasChanges
        || ((courseTypeChanged || coursePriceChanged) && !courseRunIsArchived(run));
    });

    modifiedCourseRuns.forEach((courseRun) => {
      let draft = true;
      const isTargetRun = targetRun && (courseRun.key === targetRun.key);
      if (isTargetRun || courseRun.status === PUBLISHED) {
        // If a course run triggered the submission, mark it as not a draft, or if we are
        // republishing content that has changed.
        draft = false;
      }

      sendCourseRuns.push({
        content_language: courseRun.content_language,
        draft,
        expected_program_type: courseRun.expected_program_type
          ? courseRun.expected_program_type : null,
        expected_program_name: courseRun.expected_program_name
          ? courseRun.expected_program_name : '',
        external_key: courseRun.external_key ? courseRun.external_key : '',
        go_live_date: isValidDate(courseRun.go_live_date) ? courseRun.go_live_date : null,
        upgrade_deadline_override: isValidDate(courseRun.upgrade_deadline_override)
          ? courseRun.upgrade_deadline_override : null,
        key: courseRun.key,
        max_effort: courseRun.max_effort ? courseRun.max_effort : null,
        min_effort: courseRun.min_effort ? courseRun.min_effort : null,
        ...priceData,
        rerun: courseRun.rerun ? courseRun.rerun : null,
        run_type: courseRun.run_type,
        // Reduce Staff list to just the UUID
        staff: courseRun.staff ? courseRun.staff.map(staffer => staffer.uuid) : courseRun.staff,
        status: courseRun.status,
        transcript_languages: courseRun.transcript_languages,
        weeks_to_complete: courseRun.weeks_to_complete ? courseRun.weeks_to_complete : null,
      });
    });
    return sendCourseRuns;
  }

  prepareInternalReview(courseData) {
    const { courseSubmitInfo: { targetRun } } = this.props;
    const courseRun = courseData.course_runs.find(run => run.key === targetRun.key);
    const editedRun = { key: courseRun.key };

    if (targetRun.status === REVIEW_BY_LEGAL) {
      if (courseRun.has_ofac_restrictions) {
        editedRun.has_ofac_restrictions = JSON.parse(courseRun.has_ofac_restrictions);
      }
      if (courseRun.ofac_comment) {
        editedRun.ofac_comment = courseRun.ofac_comment;
      }
      editedRun.status = REVIEW_BY_INTERNAL;
    } else {
      editedRun.status = REVIEWED;
    }

    return editedRun;
  }

  formatAdditionalMetadataFields(courseData) {
    return {
      external_url: courseData.additional_metadata.external_url,
      external_identifier: courseData.additional_metadata.external_identifier,
      lead_capture_form_url: courseData.additional_metadata.lead_capture_form_url,
      organic_url: courseData.additional_metadata.organic_url,
      certificate_info: {
        heading: courseData.additional_metadata.certificate_info_heading,
        blurb: courseData.additional_metadata.certificate_info_blurb,
      },
      facts: [{
        heading: courseData.additional_metadata.facts_1_heading,
        blurb: courseData.additional_metadata.facts_1_blurb,
      },
      {
        heading: courseData.additional_metadata.facts_2_heading,
        blurb: courseData.additional_metadata.facts_2_blurb,
      }],
      start_date: courseData.additional_metadata.start_date,
      registration_deadline: courseData.additional_metadata.registration_deadline,
      variant_id: courseData.additional_metadata.variant_id,
    };
  }

  formatValueFields(courseData) {
    if (courseData?.in_year_value) {
      return {
        per_lead_international: Number(courseData.in_year_value.per_lead_international),
        per_lead_usa: Number(courseData.in_year_value.per_lead_usa),
        per_click_international: Number(courseData.in_year_value.per_click_international),
        per_click_usa: Number(courseData.in_year_value.per_click_usa),
      };
    }
    return {
      per_lead_international: null,
      per_lead_usa: null,
      per_click_international: null,
      per_click_usa: null,
    };
  }

  formatLocationRestrictionFields(courseData) {
    if (courseData?.location_restriction) {
      return {
        restriction_type: courseData.location_restriction.restriction_type,
        countries: courseData.location_restriction.countries,
        states: courseData.location_restriction.states,
      };
    }
    return {
      restriction_type: null,
      countries: null,
      states: null,
    };
  }

  prepareSendCourseData(courseData) {
    const {
      courseInfo: {
        data: {
          key,
          uuid,
        },
      },
      courseOptions,
    } = this.props;

    // If we have an existing published course run, we need to also publish the course.
    // We want to use the same indicator of draft = false for consistency.
    const hasPublishedRun = courseData.course_runs.some(r => r.status === PUBLISHED);

    const priceData = formatPriceData(courseData, courseOptions);

    const formattedCourseData = {
      additional_information: courseData.additional_information,
      draft: !hasPublishedRun,
      faq: courseData.faq,
      full_description: courseData.full_description,
      image: courseData.imageSrc,
      key,
      learner_testimonials: courseData.learner_testimonials,
      level_type: courseData.level_type,
      location_restriction: courseData.location_restriction,
      organization_logo_override: courseData.organization_logo_override_url,
      organization_short_code_override: courseData.organization_short_code_override,
      outcome: courseData.outcome,
      prerequisites_raw: courseData.prerequisites_raw,
      ...priceData,
      short_description: courseData.short_description,
      // Reduce collaborator list to just the UUID
      collaborators: courseData.collaborators
        ? courseData.collaborators.map(staffer => staffer.uuid) : courseData.collaborators,
      subjects: [
        courseData.subjectPrimary,
        courseData.subjectSecondary,
        courseData.subjectTertiary,
      ].filter(subject => !!subject),
      syllabus_raw: courseData.syllabus_raw,
      title: courseData.title,
      type: courseData.type,
      url_slug: courseData.url_slug,
      uuid,
      video: { src: courseData.videoSrc },
      enterprise_subscription_inclusion: courseData.enterprise_subscription_inclusion,
    };

    if (courseData.course_type === EXECUTIVE_EDUCATION_SLUG) {
      formattedCourseData.additional_metadata = this.formatAdditionalMetadataFields(courseData);
    }

    // Check for values to prevent a new entry being created unnecessarily
    if (courseData.in_year_value && Object.values(courseData.in_year_value).some(value => value !== null)) {
      formattedCourseData.in_year_value = this.formatValueFields(courseData);
    }

    return formattedCourseData;
  }

  continueSubmit() {
    const {
      submitCourseData,
    } = this.state;

    this.setState({
      submitCourseData: {},
      submitConfirmVisible: false,
    });

    this.handleCourseSubmit(submitCourseData);
  }

  cancelSubmit() {
    const {
      clearSubmitStatus,
    } = this.props;

    this.setState({
      submitCourseData: {},
      submitConfirmVisible: false,
    });

    return clearSubmitStatus();
  }

  dismissReviewStatusAlert() {
    const { clearCourseReviewAlert } = this.props;
    clearCourseReviewAlert();
  }

  dismissCreateStatusAlert() {
    const { clearCreateStatusAlert } = this.props;
    clearCreateStatusAlert();
  }

  handleCourseSubmit(courseData) {
    /*
      Need to do some pre-processing before sending anything to course-discovery.
      This includes:
        1. Only sending the uuid from the array of staff objects
        2. Only including subjects that have values
        3. Putting the entitlement into an array and also adding in the sku
          (required for updating price)
        4. Renaming the image and video fields to correspond to what course-discovery is expecting
        5. Setting the uuid so we can create the url to send to course-discovery
    */
    const {
      courseSubmitInfo: {
        targetRun,
      },
      editCourse,
    } = this.props;
    const isInternalReview = targetRun && IN_REVIEW_STATUS.includes(targetRun.status);
    // Process course run info from courseData
    const modifiedCourseRuns = isInternalReview ? this.prepareInternalReview(courseData)
      : this.prepareSendCourseRunData(courseData);
    // Process courseData to reduced data set
    const courseEditData = this.prepareSendCourseData(courseData);
    return editCourse(
      courseEditData,
      modifiedCourseRuns,
      !!targetRun,
      !!isInternalReview,
      this.getData,
    );
  }

  displayReviewStatusAlert(status) {
    const {
      courseInfo: { data: { course_runs } },
      courseSubmitInfo: { targetRun: { key } },
    } = this.props;
    const runFromAPI = course_runs ? course_runs.find(run => run.key === key) : {};
    switch (status) {
      case REVIEW_BY_LEGAL:
        return 'Legal Review Complete. Course Run is now awaiting PC Review.';
      case REVIEW_BY_INTERNAL:
        return 'PC Review Complete.';
      default:
        if (status === PUBLISHED || (status === REVIEWED && runFromAPI.status === REVIEWED)) {
          return 'Course Run Updated.';
        }
        return 'Course has been submitted for review. The course will be locked for the next two business days. '
          + 'You will receive an email when the review is complete.';
    }
  }

  buildAdditionalMetadata() {
    const {
      courseInfo: {
        data: {
          additional_metadata,
        },
      },
    } = this.props;
    if (additional_metadata) {
      return {
        certificate_info: additional_metadata.certificate_info,
        external_identifier: additional_metadata.external_identifier,
        external_url: additional_metadata.external_url,
        lead_capture_form_url: additional_metadata.lead_capture_form_url,
        organic_url: additional_metadata.organic_url,
        certificate_info_heading: additional_metadata.certificate_info?.heading,
        certificate_info_blurb: additional_metadata.certificate_info?.blurb,
        facts_1_heading: additional_metadata.facts[0]?.heading,
        facts_1_blurb: additional_metadata.facts[0]?.blurb,
        facts_2_heading: additional_metadata.facts[1]?.heading,
        facts_2_blurb: additional_metadata.facts[1]?.blurb,
        start_date: additional_metadata.start_date,
        registration_deadline: additional_metadata.registration_deadline,
        variant_id: additional_metadata.variant_id,
      };
    }
    return {};
  }

  buildCourseRuns() {
    const {
      courseInfo: {
        data: {
          course_runs,
        },
      },
    } = this.props;

    const getUpgradeDeadlineOverride = (seats) => {
      const nonAuditSeat = seats.filter(seat => seat.type !== AUDIT_TRACK.key)[0];
      return nonAuditSeat ? nonAuditSeat.upgrade_deadline_override : null;
    };

    const buildSeats = (seats) => (
      seats.length > 0 && seats.map(seat => ({
        bulk_sku: seat.bulk_sku,
        credit_hours: seat.credit_hours,
        credit_provider: seat.credit_provider,
        currency: seat.currency,
        price: seat.price,
        sku: seat.sku,
        type: seat.type,
      }))
    );

    return course_runs && course_runs.map(courseRun => ({
      key: courseRun.key,
      start: courseRun.start,
      end: courseRun.end,
      upgrade_deadline_override: courseRun.seats.length > 0 ? getUpgradeDeadlineOverride(courseRun.seats) : null,
      expected_program_type: courseRun.expected_program_type,
      expected_program_name: courseRun.expected_program_name,
      external_key: courseRun.external_key,
      go_live_date: courseRun.go_live_date,
      min_effort: typeof courseRun.min_effort === 'number' ? String(courseRun.min_effort) : '',
      max_effort: typeof courseRun.max_effort === 'number' ? String(courseRun.max_effort) : '',
      pacing_type: courseRun.pacing_type,
      content_language: courseRun.content_language ? courseRun.content_language : 'en-us',
      transcript_languages: courseRun.transcript_languages.length ? courseRun.transcript_languages : ['en-us'],
      weeks_to_complete: typeof courseRun.weeks_to_complete === 'number' ? String(courseRun.weeks_to_complete) : '',
      staff: courseRun.staff,
      status: courseRun.status,
      draft: courseRun.draft,
      marketing_url: courseRun.marketing_url,
      has_ofac_restrictions: courseRun.has_ofac_restrictions,
      ofac_comment: courseRun.ofac_comment,
      run_type: courseRun.run_type,
      seats: buildSeats(courseRun.seats),
    }));
  }

  buildInYearValue() {
    return this.formatValueFields(this.props.courseInfo.data);
  }

  buildLocationRestriction() {
    return this.formatLocationRestrictionFields(this.props.courseInfo.data);
  }

  buildInitialValues() {
    const {
      courseInfo: {
        data: {
          title,
          url_slug,
          short_description,
          full_description,
          outcome,
          subjects,
          image,
          collaborators,
          prerequisites_raw,
          level_type,
          learner_testimonials,
          faq,
          additional_information,
          syllabus_raw,
          video,
          entitlements,
          course_type,
          type,
          course_runs,
          skill_names,
          enterprise_subscription_inclusion,
          organization_short_code_override,
          organization_logo_override_url,
        },
      },
    } = this.props;
    const subjectMap = subjects && subjects.map(x => x.slug);
    const subjectPrimary = subjectMap && subjectMap[0];
    const subjectSecondary = subjectMap && subjectMap[1];
    const subjectTertiary = subjectMap && subjectMap[2];
    const imageSrc = image && image.src;
    const videoSrc = video && video.src;
    const prices = buildInitialPrices(entitlements, course_runs);

    return {
      title,
      short_description,
      full_description,
      outcome,
      subjectPrimary,
      subjectSecondary,
      subjectTertiary,
      imageSrc,
      prerequisites_raw,
      level_type,
      learner_testimonials,
      faq,
      additional_information,
      syllabus_raw,
      videoSrc,
      prices,
      course_type,
      type,
      url_slug,
      collaborators,
      course_runs: this.buildCourseRuns(),
      skill_names,
      additional_metadata: this.buildAdditionalMetadata(),
      enterprise_subscription_inclusion,
      organization_short_code_override,
      organization_logo_override_url,
      location_restriction: this.buildLocationRestriction(),
      in_year_value: this.buildInYearValue(),
    };
  }

  handleModalForReviewedRun(submitCourseData) {
    const {
      courseSubmitInfo: {
        targetRun: {
          key,
        },
      },
      formValues,
    } = this.props;
    const currentValues = formValues(this.getFormId());
    const initialValues = this.buildInitialValues();
    if (isNonExemptChanged(initialValues, currentValues, key)
      || isNonExemptChanged(initialValues, currentValues)) {
      this.setState({
        submitCourseData,
        submitConfirmVisible: true, // show modal
      });
    } else {
      this.handleCourseSubmit(submitCourseData);
    }
  }

  showModal(submitCourseData) {
    const {
      courseSubmitInfo: {
        targetRun,
      },
    } = this.props;
    if (targetRun && targetRun.status === REVIEWED) {
      this.handleModalForReviewedRun(submitCourseData);
    } else if (targetRun && !(targetRun.status === PUBLISHED)
      && !IN_REVIEW_STATUS.includes(targetRun.status)) {
      // Submitting Run for review, show modal, and temporarily store form data until
      // we have a response for how to continue.
      store.dispatch(courseRunSubmitting());
      this.setState({
        submitCourseData,
        submitConfirmVisible: true, // show modal
      });
    } else {
      // Edit submission, no modal required.
      this.handleCourseSubmit(submitCourseData);
    }
  }

  render() {
    if (!this.props.courseInfo || !this.props.courseOptions || !this.props.courseRunOptions) {
      return (
        <StatusAlert
          id="error"
          alertType="danger"
          title="Course Edit Form failed to load: "
          message="Course information unavailable. Please try reloading the page and if the error
           persists, please contact support."
        />
      );
    }

    const {
      courseInfo,
      courseInfo: {
        data: {
          title,
          key,
          key_for_reruns,
          entitlements,
          course_runs,
          uuid,
          owners,
          editable,
          type,
          enterprise_subscription_inclusion,
        },
        showCreateStatusAlert,
      },
      courseOptions,
      courseRunOptions,
      formValues,
      courseSubmitInfo: {
        showReviewStatusAlert,
        targetRun,
      },
    } = this.props;
    const {
      startedFetching,
      submitConfirmVisible,
    } = this.state;
    const currentFormValues = formValues(this.getFormId());
    const courseStatuses = [];
    const courseInReview = course_runs && course_runs.some(courseRun => IN_REVIEW_STATUS.includes(courseRun.status));

    if (courseInReview) {
      courseStatuses.push(IN_REVIEW_STATUS[0]);
    }
    if (course_runs && course_runs.some(courseRun => PUBLISHED === courseRun.status)) {
      courseStatuses.push(PUBLISHED);
    }
    if (course_runs && !courseStatuses.includes(PUBLISHED)
      && course_runs.some(courseRun => REVIEWED === courseRun.status)) {
      courseStatuses.push(REVIEWED);
    }
    if (course_runs && !courseStatuses.includes(PUBLISHED)
      && !courseStatuses.includes(IN_REVIEW_STATUS[0]) && !courseStatuses.includes(REVIEWED)
      && course_runs.some(courseRun => UNPUBLISHED === courseRun.status)) {
      courseStatuses.push(UNPUBLISHED);
    }

    const numberKey = key_for_reruns || key;
    const number = numberKey && getCourseNumber(numberKey);
    const entitlement = entitlements && entitlements[0];

    const errorArray = [];
    if (courseInfo.error) {
      courseInfo.error.forEach((error, index) => {
        errorArray.push(error);
        if (index < courseInfo.error.length) {
          errorArray.push(<br />);
        }
      });
    }
    if (courseOptions.error) {
      courseOptions.error.forEach((error, index) => {
        errorArray.push(error);
        if (index < courseOptions.error.length) {
          errorArray.push(<br />);
        }
      });
    }
    if (courseRunOptions.error) {
      courseRunOptions.error.forEach((error, index) => {
        errorArray.push(error);
        if (index < courseRunOptions.error.length) {
          errorArray.push(<br />);
        }
      });
    }
    const showSpinner = !startedFetching || courseInfo.isFetching || courseOptions.isFetching
      || courseRunOptions.isFetching;
    const showForm = !showSpinner;

    return (
      <>
        <ConfirmationModal
          title="Submit for Review?"
          body="You will not be able to make edits while the course is in review, which can take up to 2 business days. Confirm your edits are complete."
          buttonLabel="Submit"
          open={submitConfirmVisible}
          onSubmit={this.continueSubmit}
          onClose={this.cancelSubmit}
        />
        <div className="container my-3">
          { showReviewStatusAlert && (
          <StatusAlert
            onClose={this.dismissReviewStatusAlert}
            dismissible
            alertType="success"
            message={targetRun && this.displayReviewStatusAlert(targetRun.status)}
          />
          ) }

          { showCreateStatusAlert && (
          <StatusAlert
            onClose={this.dismissCreateStatusAlert}
            dismissible
            alertType="success"
            message="Course run has been created in studio. See link below."
          />
          ) }
        </div>
        { showSpinner && <LoadingSpinner /> }
        <PageContainer
          sidePanes={showForm && (
          <SidePanes
            courseUuid={uuid}
            draft={courseStatuses}
            hidden={!showForm}
            addCourseEditor={editable && this.props.addCourseEditor}
            courseEditors={this.props.courseEditors}
            organizations={owners}
            fetchCourseEditors={this.props.fetchCourseEditors}
            fetchOrganizationRoles={!owners ? null : role => (
              this.props.fetchOrganizationRoles(owners.map(owner => owner.uuid), role)
            )}
            fetchOrganizationUsers={!owners ? null : () => (
              this.props.fetchOrganizationUsers(owners.map(owner => owner.uuid))
            )}
            organizationRoles={this.props.organizationRoles}
            organizationUsers={this.props.organizationUsers}
            removeCourseEditor={editable && this.props.removeCourseEditor}
            addComment={this.props.addComment}
            comments={this.props.comments}
            fetchComments={this.props.fetchComments}
            enterpriseSubscriptionInclusion={enterprise_subscription_inclusion}
          />
          )}
        >
          { showForm && !editable && (
          <StatusAlert
            alertType="secondary"
            message="You have permission to view this course, but not edit. If you would like to edit the course, please contact a course editor."
          />
          ) }
          { showForm && (
            <>
              <Helmet>
                <title>{`Course - ${title}`}</title>
              </Helmet>
              <EditCourseForm
                id={this.getFormId()}
                onSubmit={this.showModal}
                initialValues={this.buildInitialValues()}
                number={number}
                entitlement={entitlement || {}}
                title={title}
                courseRuns={this.buildCourseRuns()}
                uuid={uuid}
                currentFormValues={currentFormValues}
                courseInfo={courseInfo}
                courseInReview={courseInReview}
                courseStatuses={courseStatuses}
                owners={owners}
                isSubmittingForReview={targetRun && targetRun.status !== PUBLISHED}
                targetRun={targetRun}
                editable={editable}
                type={type}
                {...this.props}
              />
            </>
          )}
          { errorArray.length > 0 && (
            <StatusAlert
              id="error"
              alertType="danger"
              message={errorArray}
            />
          )}
        </PageContainer>
      </>
    );
  }
}

EditCoursePage.defaultProps = {
  addComment: () => null,
  addCourseEditor: () => null,
  comments: {
    data: [],
  },
  courseEditors: {
    data: [],
  },
  courseInfo: {
    data: {},
  },
  courseOptions: {},
  courseRunOptions: {},
  fetchComments: () => null,
  fetchCourseEditors: () => null,
  fetchCourseInfo: () => {},
  fetchCourseOptions: () => {},
  fetchCourseRunOptions: () => {},
  fetchOrganizationRoles: () => null,
  fetchOrganizationUsers: () => null,
  fetchCollaboratorOptions: () => null,
  editCourse: () => null,
  clearSubmitStatus: () => {},
  clearCourseReviewAlert: () => {},
  clearCreateStatusAlert: () => {},
  courseSubmitInfo: {},
  formValues: () => {},
  organizationRoles: {
    data: [],
  },
  organizationUsers: {
    data: [],
  },
  removeCourseEditor: () => null,
  collaboratorInfo: {},
};

EditCoursePage.propTypes = {
  addComment: PropTypes.func,
  addCourseEditor: PropTypes.func,
  comments: PropTypes.shape({
    data: PropTypes.arrayOf(PropTypes.shape()),
    isFetching: PropTypes.bool,
    isCreating: PropTypes.bool,
    error: PropTypes.arrayOf(PropTypes.string),
  }),
  courseEditors: PropTypes.shape({
    data: PropTypes.array,
    isFetching: PropTypes.bool,
  }),
  courseInfo: PropTypes.shape({
    data: PropTypes.shape(),
    error: PropTypes.arrayOf(PropTypes.string),
    isFetching: PropTypes.bool,
    showCreateStatusAlert: PropTypes.bool,
  }),
  courseOptions: PropTypes.shape({
    data: PropTypes.shape(),
    error: PropTypes.arrayOf(PropTypes.string),
    isFetching: PropTypes.bool,
  }),
  courseRunOptions: PropTypes.shape({
    data: PropTypes.shape(),
    error: PropTypes.arrayOf(PropTypes.string),
    isFetching: PropTypes.bool,
  }),
  fetchComments: PropTypes.func,
  fetchCourseEditors: PropTypes.func,
  fetchCourseInfo: PropTypes.func,
  fetchCourseOptions: PropTypes.func,
  fetchCourseRunOptions: PropTypes.func,
  fetchOrganizationRoles: PropTypes.func,
  fetchOrganizationUsers: PropTypes.func,
  fetchCollaboratorOptions: PropTypes.func,
  editCourse: PropTypes.func,
  clearSubmitStatus: PropTypes.func,
  clearCourseReviewAlert: PropTypes.func,
  clearCreateStatusAlert: PropTypes.func,
  courseSubmitInfo: PropTypes.shape({
    showReviewStatusAlert: PropTypes.bool,
    targetRun: PropTypes.shape({
      key: PropTypes.string,
      uuid: PropTypes.string,
      status: PropTypes.string,
    }),
  }),
  formValues: PropTypes.func,
  organizationRoles: PropTypes.shape({
    data: PropTypes.array,
  }),
  organizationUsers: PropTypes.shape({
    data: PropTypes.array,
  }),
  removeCourseEditor: PropTypes.func,
  collaboratorInfo: PropTypes.shape({}),
};

export default EditCoursePage;
