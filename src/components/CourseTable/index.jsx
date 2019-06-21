import React from 'react';
import { Link } from 'react-router-dom';

import { Hyperlink } from '@edx/paragon';
import TableContainer from '../../containers/TableContainer';
import DiscoveryDataApiService from '../../data/services/DiscoveryDataApiService';
import ButtonToolbar from '../ButtonToolbar';
import PageContainer from '../PageContainer';
import StatusAlert from '../StatusAlert';


const CourseTable = () => {
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
    </PageContainer>
  );
};

export default CourseTable;
