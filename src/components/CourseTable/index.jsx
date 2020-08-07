import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import React from 'react';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import qs from 'query-string';
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';
import { SearchField } from '@edx/paragon';

import TableContainer from '../../containers/TableContainer';
import ButtonToolbar from '../ButtonToolbar';
import PageContainer from '../PageContainer';
import { formatDate, getPageOptionsFromUrl, updateUrl } from '../../utils';
import Pill from '../Pill';
import { PUBLISHED, REVIEWED } from '../../data/constants';

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
  constructor(props) {
    super(props);
    this.state = {
      filterGroups: [
        {
          label: 'Course Run Statuses',
          options: [
            { value: 'in_review', label: 'In review', color: '#e7e7e7' },
            { value: PUBLISHED, label: 'Published', color: '#008100' },
            { value: REVIEWED, label: 'Scheduled', color: '#0075b4' },
            { value: 'unsubmitted', label: 'Unsubmitted', color: '#E2C018' },
          ],
        },
      ],
      selectedFilters: [],
    };
  }

  componentDidMount() {
    this.props.fetchOrganizations();
  }

  componentDidUpdate(prevProps) {
    const {
      table: {
        editorFilterOptions,
      },
    } = this.props;
    const { administrator } = getAuthenticatedUser();
    const prevEditorFilterOptions = prevProps.table.editorFilterOptions;

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

    const courseRunStatusesFromQuery = pageOptions.course_run_statuses
      ? pageOptions.course_run_statuses.split(',') : null;

    const editorsFromQuery = pageOptions.editors ? pageOptions.editors.split(',') : null;
    const selectedEditors = editorsFromQuery ? this.state.filterGroups.find(group => (
      group.label === 'Course Editors'
    )).options.filter(option => editorsFromQuery.includes(option.value.toString())) : [];

    if (!courseRunStatusesFromQuery) {
      this.setState({
        selectedFilters: selectedEditors,
      });
    } else {
      this.setState(prevState => ({
        selectedFilters: prevState.filterGroups.find(group => (
          group.label === 'Course Run Statuses'
        ))
          .options
          .filter(option => courseRunStatusesFromQuery.includes(option.value))
          .concat(selectedEditors),
      }));
    }
  }

  updateFilterQueryParamsInUrl(selectedFilters) {
    const courseRunStatusParams = selectedFilters.filter(filter => !Number.isInteger(filter.value));
    const editorParams = selectedFilters.filter(filter => Number.isInteger(filter.value));
    const params = {
      course_run_statuses: courseRunStatusParams.length
        ? courseRunStatusParams.map(filter => filter.value).toString() : null,
      editors: editorParams.length ? editorParams.map(filter => filter.value).toString() : null,
    };
    updateUrl({ ...params, page: 1 });
  }

  renderTableHeader() {
    const { selectedFilters, filterGroups } = this.state;
    const pageOptions = getPageOptionsFromUrl();

    return (
      <>
        <div className="row">
          <div className="col-2 float-left">
            <ButtonToolbar className="mb-3" leftJustify>
              <Link to="/courses/new">
                <button type="button" className="btn btn-primary">New Course</button>
              </Link>
            </ButtonToolbar>
          </div>
          <div className="col-5 float-right">
            <Select
              closeMenuOnSelect={false}
              value={selectedFilters}
              options={filterGroups}
              onChange={filters => this.updateFilterQueryParamsInUrl(filters === null
                ? [] : filters)}
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
              placeholder="Search"
            />
          </div>
        </div>
      </>
    );
  }

  render() {
    const {
      table: {
        error,
        loading,
      },
    } = this.props;

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
    const formatCourseData = courses => courses.map(course => ({
      ...course,
      title: (<Link to={`/courses/${course.uuid}`}>{course.title}</Link>),
      modified: formatDate(course.modified),
      number: course.key_for_reruns || course.key,
      course_run_statuses: (<Pill statuses={course.course_run_statuses} />),
      course_editor_names: course.editors ? course.editors.map(editor => editor.user.full_name).join(', ') : '',
    }));

    return (
      <PageContainer wide>
        <Helmet>
          <title>{`Publisher | ${process.env.SITE_NAME}`}</title>
        </Helmet>
        {!loading && !error && this.renderTableHeader()}
        <TableContainer
          className="courses"
          columns={courseTableColumns}
          formatData={formatCourseData}
          tableSortable
        />
      </PageContainer>
    );
  }
}

CourseTable.defaultProps = {
  fetchOrganizations: () => {},
  publisherUserInfo: {
    organizations: [],
  },
  table: {
    error: null,
    loading: false,
    editorFilterOptions: [],
  },
};

CourseTable.propTypes = {
  fetchOrganizations: PropTypes.func,
  publisherUserInfo: PropTypes.shape({
    organizations: PropTypes.array,
    error: PropTypes.arrayOf(PropTypes.string),
    isFetching: PropTypes.bool,
  }),
  location: PropTypes.shape({
    search: PropTypes.string,
  }).isRequired,
  table: PropTypes.shape({
    error: PropTypes.arrayOf(PropTypes.string),
    loading: PropTypes.bool,
    editorFilterOptions: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
      full_name: PropTypes.string,
    })),
  }),
};

export default CourseTable;
