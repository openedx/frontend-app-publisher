import stringify from 'fast-json-stable-stringify';
import moment from 'moment';
import 'moment-timezone';
import qs from 'query-string';

import history from '../data/history';
import { COURSE_EXEMPT_FIELDS, COURSE_RUN_NON_EXEMPT_FIELDS, MASTERS_TRACK } from '../data/constants';
import { PAGE_SIZE } from '../data/constants/table';

const getDateWithDashes = date => (date ? moment(date).format('YYYY-MM-DD') : '');
const getDateWithSlashes = date => (date ? moment(date).format('YYYY/MM/DD') : '');
const getTimeString = date => (date ? moment(date).format('HH:mm') : '');
const localTimeZone = moment.tz(moment.tz.guess()).zoneAbbr();
const formatDate = date => (date ? moment(date).format('MMM DD, YYYY') : '');
const courseRunIsArchived = run => run.status === 'unpublished' && moment().isAfter(run.end);

const isSafari = /constructor/i.test(window.HTMLElement)
  || (p => (p.toString() === '[object SafariRemoteNotification]'))(!window['safari'] /* eslint dot-notation: 0 */
    || (typeof safari !== 'undefined' && safari.pushNotification)); /* eslint no-undef: 0 */

const isValidDate = (dateStr) => {
  const date = moment(dateStr);
  return moment(dateStr) && date.isValid();
};

const updateUrl = (queryOptions) => {
  if (!queryOptions) {
    return;
  }
  const currentQuery = qs.parse(window.location.search);

  // Apply any updates passed in over the current query. This requires consumers to explicitly
  // pass in parameters they want to remove, such as resetting the page when sorting, but ensures
  // that we bring forward all other params such as feature flags
  const newQuery = {
    ...currentQuery,
    ...queryOptions,
  };

  // Because we show page 1 by default, theres no reason to set the url to page=1
  if (newQuery.page === 1) {
    newQuery.page = undefined;
  }

  const newQueryString = `?${qs.stringify(newQuery)}`;
  if (newQueryString !== window.location.search) {
    history.push(newQueryString);
  }
};

// Returns an object containing pagination options (page_size, page, ordering) based on the current
// window location's query string, or, if not set in the window location uses defaults values.
const getPageOptionsFromUrl = () => {
  // TODO: this will not support multiple tables paging on a single page. Will need to prefix url
  // params with table id (or some other mechanism) if this becomes a feature requirement
  const defaults = {
    pageSize: PAGE_SIZE,
    page: 1,
    ordering: 'title',
    filter: undefined,
    editors: undefined,
    course_run_statuses: undefined,
  };
  const query = qs.parse(window.location.search);
  return {
    page_size: parseInt(query.page_size, 10) || defaults.pageSize,
    page: parseInt(query.page, 10) || defaults.page,
    ordering: query.ordering || defaults.ordering,
    pubq: query.filter || defaults.filter,
    editors: query.editors || defaults.editors,
    course_run_statuses: query.course_run_statuses || defaults.course_run_statuses,
  };
};

const jsonDeepCopy = src => JSON.parse(JSON.stringify(src));
const jsonDeepEqual = (a, b) => stringify(a) === stringify(b);

const getCourseNumber = (courseKeyFragment) => {
  const COURSE_KEY_FRAGMENT_REGEX = /\+|\//;
  const keyParts = courseKeyFragment.split(COURSE_KEY_FRAGMENT_REGEX);
  return keyParts[keyParts.length - 1];
};

const addPeriodToString = (string) => {
  if (typeof string === 'string') {
    const punctuation = new Set(['.', ',', ':', '!', '?']);
    if (punctuation.has(string.substr(-1))) {
      return string;
    }
    return `${string}.`;
  }
  return string;
};

const getErrorMessages = (error) => {
  if (typeof error === 'object') {
    // For form validation from DRF, comes back as an object of fields:errors
    if (error.response && error.response.data && typeof error.response.data === 'object') {
      return Object.keys(error.response.data).map(key => addPeriodToString(`${key}: ${error.response.data[key]}`));
    }
    // Some request responses contain a .message, as well as JS errors let's
    // try to use the request data or message before the or base JS errors check
    const message = (
      error.response && (error.response.data || error.response.message)
    ) || error.message || error;
    return [addPeriodToString(message)];
  }
  if (typeof error === 'string') {
    return [addPeriodToString(error)];
  }
  return ['Unknown error.'];
};

// Compares two price objects (objects like {verified: '20', credit: '50.5'})
const pricesEqual = (initialPrices, currentPrices) => {
  const initialKeys = Object.keys(initialPrices);
  const currentKeys = Object.keys(currentPrices);
  if (!jsonDeepEqual(initialKeys, currentKeys)) {
    return false;
  }

  return initialKeys.every((key) => {
    const initialNumber = Number(initialPrices[key]).toFixed(2);
    const currentNumber = Number(currentPrices[key]).toFixed(2);
    return initialNumber === currentNumber;
  });
};

const isNonExemptChanged = (initialValues, currentFormValues, runKey) => {
  // if run key is present, we are checking if the non exempt fields have been changed
  if (runKey) {
    const { course_runs: initialRuns } = initialValues;
    const { course_runs: currentRuns } = currentFormValues;
    if (currentRuns) {
      const index = currentRuns.findIndex(run => run.key === runKey);
      return COURSE_RUN_NON_EXEMPT_FIELDS.some(field => (
        initialRuns[index][field] !== currentRuns[index][field]
      ));
    }
    return false;
  }
  // if no run key preset, we are checking that no fields besides the course exempt
  // fields are changed
  return Object.keys(currentFormValues).some((key) => {
    if (key !== 'course_runs' && !COURSE_EXEMPT_FIELDS.includes(key)) {
      if (key === 'prices') {
        return !pricesEqual(initialValues[key], currentFormValues[key]);
      }
      return initialValues[key] !== currentFormValues[key];
    }
    return false;
  });
};

const isPristine = (initialValues, currentFormValues, runKey) => {
  // if run key is present, we are checking pristine state for a single course run form
  if (runKey) {
    const { course_runs: initialRuns } = initialValues;
    const { course_runs: currentRuns } = currentFormValues;
    if (currentRuns) {
      const index = currentRuns.findIndex(run => run.key === runKey);

      return jsonDeepEqual(initialRuns[index], currentRuns[index]);
    }
    return true;
  }
  // if no run key preset, we are checking the pristine state of course level fields
  return Object.keys(initialValues).every((key) => {
    if (key !== 'course_runs') {
      if (key === 'prices') {
        return pricesEqual(initialValues[key], currentFormValues[key]);
      }
      return initialValues[key] === currentFormValues[key];
    }
    return true;
  });
};

const parseOptions = inChoices => inChoices.map(choice => ({ label: choice.display_name, value: choice.value }));

const getOptionsData = (options) => {
  if (!options) {
    return [];
  }
  const { data } = options;
  if (!data || !data.actions) {
    return [];
  }
  return data.actions.POST;
};

const formatCollaboratorOptions = (options) => (
  options.map(({ name = '', uuid, image: { original: { url } = { url: '' } } }) => ({ name, uuid, image_url: url }))
);

const parseCourseTypeOptions = (typeOptions) => {
  const courseTypes = {};
  const courseRunTypeOptions = {};
  const runTypeModes = {};
  const priceLabels = {};
  const initialSelect = [{ label: 'Select enrollment track', value: '' }];
  const courseTypeOptions = initialSelect.concat(typeOptions.map((type) => {
    courseTypes[type.uuid] = type;

    const runTypeOptions = type.course_run_types.map((courseRunType) => {
      runTypeModes[courseRunType.uuid] = courseRunType.modes;
      return { label: courseRunType.name, value: courseRunType.uuid };
    });
    courseRunTypeOptions[type.uuid] = initialSelect.concat(runTypeOptions);

    const typePrices = {};
    type.tracks.forEach((track) => {
      if (track.mode.payee && track.seat_type !== null) {
        typePrices[track.seat_type.slug] = track.seat_type.name;
      }
    });
    priceLabels[type.uuid] = typePrices;

    return { label: type.name, value: type.uuid };
  }));
  return {
    priceLabels,
    courseRunTypeOptions,
    courseTypeOptions,
    courseTypes,
    runTypeModes,
  };
};

const formatPriceData = (formData, courseOptions) => {
  const priceData = {
    prices: {},
  };

  const courseOptionsData = getOptionsData(courseOptions);
  if (!courseOptionsData) {
    return priceData;
  }
  const parsedTypeOptions = parseCourseTypeOptions(courseOptionsData.type.type_options);
  const priceLabels = parsedTypeOptions.priceLabels[formData.type];

  // formData is going to potentially have more seat types than we need, so we pare down here
  Object.keys(priceLabels).forEach((seatType) => {
    if (formData.prices[seatType]) {
      // We strip trailing zeros to ease comparisons between formatted data
      priceData.prices[seatType] = formData.prices[seatType].replace(/\.00$/, '');
    }
  });

  return priceData;
};

const buildInitialPrices = (entitlements, courseRuns) => {
  const prices = {};

  if (courseRuns) {
    // Go through each seat and set a price based on it. We overwrite earlier types/prices this
    // way, which is intentional. If for some reason there's a disagreement, we want the newer
    // values (which will be later in the run list).
    courseRuns.forEach((courseRun) => {
      courseRun.seats.forEach((seat) => {
        prices[seat.type] = seat.price;
      });
    });
  }

  if (entitlements) {
    // prefer entitlement price in case it differs by doing these last
    entitlements.forEach((entitlement) => {
      prices[entitlement.mode] = entitlement.price;
    });
  }

  return prices;
};

const hasMastersTrack = (runTypeUuid, runTypeModes) => (!!runTypeUuid
  && !!runTypeModes[runTypeUuid] && runTypeModes[runTypeUuid].includes(MASTERS_TRACK.key));

export {
  courseRunIsArchived,
  getDateWithDashes,
  getDateWithSlashes,
  getTimeString,
  formatDate,
  updateUrl,
  getPageOptionsFromUrl,
  jsonDeepCopy,
  jsonDeepEqual,
  getCourseNumber,
  getErrorMessages,
  isValidDate,
  localTimeZone,
  isSafari,
  isNonExemptChanged,
  isPristine,
  parseOptions,
  getOptionsData,
  parseCourseTypeOptions,
  formatPriceData,
  buildInitialPrices,
  hasMastersTrack,
  formatCollaboratorOptions,
};
