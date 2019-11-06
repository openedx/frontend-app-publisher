import moment from 'moment';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import React from 'react';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import qs from 'query-string';

import { Hyperlink, SearchField } from '@edx/paragon';
import TableContainer from '../../containers/TableContainer';
import ButtonToolbar from '../ButtonToolbar';
import PageContainer from '../PageContainer';
import StatusAlert from '../StatusAlert';
import { getPageOptionsFromUrl, updateUrl } from '../../utils';
import Pill from '../Pill';
import { UNPUBLISHED, PUBLISHED, REVIEWED } from '../../data/constants';

const orgBlacklist = process.env.ORG_BLACKLIST ? process.env.ORG_BLACKLIST.split(',') : [];
const dot = color => ({
  alignItems: 'center',
  display: 'flex',

  ':before': {
    backgroundColor: color,
    borderRadius: 10,
    content: '" "',
    display: 'block',
    marginRight: 8,
    height: 10,
    width: 10,
  },
});

class CourseTable extends React.Component {
  state = {
    filterGroups: [
      {
        label: 'Course Run Statuses',
        options: [
          { value: 'in_review', label: 'In review', color: '#e7e7e7' },
          { value: PUBLISHED, label: 'Published', color: '#008100' },
          { value: REVIEWED, label: 'Scheduled', color: '#0075b4' },
          { value: UNPUBLISHED, label: 'Unsubmitted', color: '#E2C018' },
        ],
      },
    ],
    selectedFilters: [],
  };

  componentDidMount() {
    this.props.fetchOrganizations();
  }

  componentDidUpdate(prevProps) {
    const {
      authentication: {
        administrator,
      },
      editorFilterOptions,
    } = this.props;
    const prevEditorFilterOptions = prevProps.editorFilterOptions;

    if (editorFilterOptions !== prevEditorFilterOptions && !administrator) {
      this.state.filterGroups.push({
        label: 'Course Editors',
        options: editorFilterOptions.map(editor => ({ value: editor.id, label: editor.name })),
      });
      this.getSelectedFiltersFromUrl();
    }
    const {
      editors: prevEditors,
      course_run_statuses: prevCourseRunStatuses,
    } = qs.parse(prevProps.location.search);
    const {
      editors,
      course_run_statuses: courseRunStatuses,
    } = qs.parse(this.props.location.search);
    if ((editors !== prevEditors) || (courseRunStatuses !== prevCourseRunStatuses)) {
      this.getSelectedFiltersFromUrl();
    }
  }

  getSelectedFiltersFromUrl() {
    const pageOptions = getPageOptionsFromUrl();

    const courseRunStatusesFromQuery = pageOptions.course_run_statuses ?
      pageOptions.course_run_statuses.split(',') : null;
    const selectedCourseRunStatuses = courseRunStatusesFromQuery ?
      this.state.filterGroups.find(group => (
        group.label === 'Course Run Statuses'
      )).options.filter(option => courseRunStatusesFromQuery.includes(option.value)) : [];

    const editorsFromQuery = pageOptions.editors ? pageOptions.editors.split(',') : null;
    const selectedEditors = editorsFromQuery ? this.state.filterGroups.find(group => (
      group.label === 'Course Editors'
    )).options.filter(option => editorsFromQuery.includes(option.value.toString())) : [];

    this.setState({
      selectedFilters: selectedCourseRunStatuses.concat(selectedEditors),
    });
  }

  updateFilterQueryParamsInUrl(selectedFilters) {
    const courseRunStatusParams = selectedFilters.filter(filter => !Number.isInteger(filter.value));
    const editorParams = selectedFilters.filter(filter => Number.isInteger(filter.value));
    const params = {
      course_run_statuses: courseRunStatusParams.length ?
        courseRunStatusParams.map(filter => filter.value).toString() : null,
      editors: editorParams.length ? editorParams.map(filter => filter.value).toString() : null,
    };
    updateUrl({ ...params, page: 1 });
  }

  isOrgWhitelisted() {
    const userOrgs = this.props.publisherUserInfo.organizations;
    if (!orgBlacklist || (orgBlacklist && orgBlacklist.length === 0)) {
      // No Blacklist specified allow all orgs
      return true;
    }
    return userOrgs.any(org => !orgBlacklist.includes(org.key));
  }

  render() {
    const {
      authentication: {
        administrator,
      },
    } = this.props;
    const { selectedFilters, filterGroups } = this.state;

    const courseTableColumns = [
      {
        label: 'Course Name',
        key: 'title',
        columnSortable: true,
      },
      {
        label: 'Course Number',
        key: 'number',
        columnSortable: true,
      },
      {
        label: 'States',
        key: 'course_run_statuses',
        columnSortable: false,
      },
      {
        label: 'Course Editors',
        key: 'course_editor_names',
        columnSortable: false,
      },
    ];

    const pageOptions = getPageOptionsFromUrl();

    const formatCourseData = courses => courses.map(course => ({
      ...course,
      title: (<Link to={`/courses/${course.uuid}`}>{course.title}</Link>),
      modified: moment.utc(course.modified).format('MMM DD, YYYY'),
      number: course.key_for_reruns || course.key,
      course_run_statuses: (<Pill statuses={course.course_run_statuses} />),
      course_editor_names: course.editors ? course.editors.map(editor => editor.user.full_name).join(', ') : '',
    }));
    const showDashboard = this.isOrgWhitelisted() || administrator;
    const oldPublisherLink = `${process.env.DISCOVERY_API_BASE_URL}/publisher/`;

    return (
      <PageContainer wide>
        <StatusAlert
          alertType="warning"
          message={
            <React.Fragment>
              This is a beta version of the new Publisher tool. Please do not use this tool unless
              edX has asked you to be in the beta testing group.&nbsp;
              <Hyperlink destination={oldPublisherLink}>
                Click here to access the older version of Publisher.
              </Hyperlink>
            </React.Fragment>
          }
        />
        {showDashboard &&
        (
          <React.Fragment>
            <Helmet>
              <title>{`Publisher Beta | ${process.env.SITE_NAME}`}</title>
            </Helmet>
            <div className="row">
              <div className="col-2 float-left">
                <ButtonToolbar className="mb-3" leftJustify>
                  <Link to="/courses/new">
                    <button className="btn btn-primary">New Course</button>
                  </Link>
                </ButtonToolbar>
              </div>
              <div className="col-5 float-right pt-1">
                <Select
                  closeMenuOnSelect={false}
                  value={selectedFilters}
                  options={filterGroups}
                  onChange={filters => this.updateFilterQueryParamsInUrl(filters === null ?
                    [] : filters)}
                  isMulti
                  maxMenuHeight="30vh"
                  placeholder="Filters..."
                  styles={
                    {
                      option: (styles, { data }) => ({ ...styles, ...dot(data.color) }),
                      multiValue: (styles, { data }) => (
                        { ...styles, backgroundColor: data.color || '#e7e7e7', opacity: 0.7 }
                      ),
                      multiValueLabel: (styles, { data }) => (
                        {
                          ...styles,
                          color: data.label === 'Published' || data.label === 'Scheduled' ? '#ffffff' : '#000000',
                        }
                      ),
                    }
                  }
                />
              </div>
              <div className="col-5 float-right">
                <SearchField
                  value={pageOptions.pubq}
                  onClear={() => {
                    updateUrl({ filter: null });
                  }}
                  onSubmit={(filter) => {
                    updateUrl({ filter, page: 1 });
                  }}
                />
              </div>
            </div>
            <TableContainer
              className="courses"
              columns={courseTableColumns}
              formatData={formatCourseData}
              tableSortable
            />
          </React.Fragment>
        )}
      </PageContainer>
    );
  }
}

CourseTable.defaultProps = {
  authentication: {
    administrator: false,
  },
  fetchOrganizations: () => {},
  publisherUserInfo: {},
};

CourseTable.propTypes = {
  authentication: PropTypes.shape({
    administrator: PropTypes.bool,
  }),
  fetchOrganizations: PropTypes.func,
  publisherUserInfo: PropTypes.shape({
    organizations: PropTypes.array,
    error: PropTypes.arrayOf(PropTypes.string),
    isFetching: PropTypes.bool,
  }),
  editorFilterOptions: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    full_name: PropTypes.string,
  })).isRequired,
  location: PropTypes.shape({
    search: PropTypes.string,
  }).isRequired,
};

export default CourseTable;
