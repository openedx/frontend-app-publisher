import React from 'react';
import { Link } from 'react-router-dom';

import TableContainer from '../../containers/TableContainer';
import DiscoveryDataApiService from '../../data/services/DiscoveryDataApiService';
import ButtonToolbar from '../ButtonToolbar';
import PageContainer from '../PageContainer';

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

  return (
    <PageContainer wide>
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
