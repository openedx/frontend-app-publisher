import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

import { Hyperlink } from '@edx/paragon';
import TableContainer from '../../containers/TableContainer';
import DiscoveryDataApiService from '../../data/services/DiscoveryDataApiService';
import ButtonToolbar from '../ButtonToolbar';
import PageContainer from '../PageContainer';
import StatusAlert from '../StatusAlert';

const orgWhitelist = process.env.ORG_WHITELIST;

class CourseTable extends React.Component {
  componentDidMount() {
    this.props.fetchOrganizations();
  }

  isOrgWhitelisted() {
    const userOrgs = this.props.publisherUserInfo.organizations;
    if (!orgWhitelist || (orgWhitelist && orgWhitelist.length === 0)) {
      // No Whitelist specified allow all orgs
      return true;
    }
    for (let i = 0; i < userOrgs.length; i += 1) {
      if (orgWhitelist.includes(userOrgs[i].key)) {
        return true;
      }
    }
    return false;
  }

  render() {
    const {
      authentication: {
        administrator,
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
        key: 'key',
        columnSortable: true,
      },
      {
        label: 'Owner',
        key: 'owners',
        columnSortable: false,
      },
      {
        label: 'Modified',
        key: 'modified',
        columnSortable: true,
      },
    ];

    const formatCourseData = courses => courses.map(course => ({
      ...course,
      title: (<Link to={`/courses/${course.uuid}`}>{course.title}</Link>),
      owners: course.owners ? course.owners.map(owners => owners.name).join(', ') : '',
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
            <ButtonToolbar className="mb-3">
              <Link to="/courses/new">
                <button className="btn btn-primary">New Course</button>
              </Link>
            </ButtonToolbar>
            <TableContainer
              id="courses"
              className="courses"
              fetchMethod={DiscoveryDataApiService.fetchCourses}
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
};

export default CourseTable;
