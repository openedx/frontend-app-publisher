import moment from 'moment';
import qs from 'query-string';

import history from '../data/history';

const getDateString = date => (date ? moment.utc(date).format('YYYY-MM-DD') : '');

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
    pageSize: 50,
    page: 1,
    ordering: undefined,
  };
  const query = qs.parse(window.location.search);
  return {
    page_size: parseInt(query.page_size, 10) || defaults.pageSize,
    page: parseInt(query.page, 10) || defaults.page,
    ordering: query.ordering || defaults.ordering,
  };
};

const jsonDeepCopy = src => JSON.parse(JSON.stringify(src));

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
  } else if (typeof error === 'string') {
    return [addPeriodToString(error)];
  }
  return ['Unknown error.'];
};

export {
  getDateString,
  updateUrl,
  getPageOptionsFromUrl,
  jsonDeepCopy,
  getCourseNumber,
  getErrorMessages,
  isValidDate,
};
