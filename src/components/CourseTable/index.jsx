import React from 'react';

import TableContainer from '../../containers/TableContainer';
import DiscoveryDataApiService from '../../data/services/DiscoveryDataApiService';

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
    owners: course.owners ? course.owners.map(owners => owners.name).join(', ') : '',
  }));

  return (
    <TableContainer
      id="courses"
      className="courses"
      fetchMethod={DiscoveryDataApiService.fetchCourses}
      columns={courseTableColumns}
      formatData={formatCourseData}
      tableSortable
    />
  );
};

export default CourseTable;
