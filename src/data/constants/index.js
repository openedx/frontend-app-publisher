const VERIFIED_TRACK = Object.freeze({ name: 'Verified and Audit', key: 'verified' });
const AUDIT_TRACK = Object.freeze({ name: 'Audit Only', key: 'audit' });
const PROFESSIONAL_TRACK = Object.freeze({ name: 'Professional Only', key: 'professional' });
const MASTERS_TRACK = Object.freeze({ key: 'masters' });
const ENTITLEMENT_TRACKS = Object.freeze(['verified', 'professional']);

const REVIEW_BY_LEGAL = 'review_by_legal';
const REVIEW_BY_INTERNAL = 'review_by_internal';
const PUBLISHED = 'published';
const REVIEWED = 'reviewed';
const UNPUBLISHED = 'unpublished';
const ARCHIVED = 'archived';
const IN_REVIEW_STATUS = Object.freeze([REVIEW_BY_LEGAL, REVIEW_BY_INTERNAL]);
const POST_REVIEW_STATUSES = Object.freeze([PUBLISHED, REVIEWED]);
const COURSE_EXEMPT_FIELDS = Object.freeze(['imgSrc', 'videoSrc']);
const COURSE_RUN_NON_EXEMPT_FIELDS = Object.freeze(['expected_program_name', 'expected_program_type']);

const DATE_FORMAT = 'YYYY-MM-DD[T]HH:mm:ss[Z]';
const DATE_INPUT_PATTERN = '20[1-9][0-9]/(0[1-9]|1[012])/(0[1-9]|[12][0-9]|3[01])';
const FORMAT_DATE_MATCHER = /20\d{2}-(0\d{1}|1[0-2])-([0-2]\d{1}|3[0-1])/;
const NORMALIZE_DATE_MATCHER = /20\d{2}\/(0\d{1}|1[0-2])\/([0-2]\d{1}|3[0-1])/;

export {
  VERIFIED_TRACK,
  AUDIT_TRACK,
  PROFESSIONAL_TRACK,
  MASTERS_TRACK,
  ENTITLEMENT_TRACKS,
  REVIEW_BY_LEGAL,
  REVIEW_BY_INTERNAL,
  PUBLISHED,
  REVIEWED,
  UNPUBLISHED,
  ARCHIVED,
  IN_REVIEW_STATUS,
  POST_REVIEW_STATUSES,
  DATE_FORMAT,
  DATE_INPUT_PATTERN,
  FORMAT_DATE_MATCHER,
  NORMALIZE_DATE_MATCHER,
  COURSE_EXEMPT_FIELDS,
  COURSE_RUN_NON_EXEMPT_FIELDS,
};
