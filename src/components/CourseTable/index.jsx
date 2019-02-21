import React from 'react';
import { Link } from 'react-router-dom';

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
    <div className="container">
      <div className="row justify-content-md-center">
        <div className="col-md-10">
          <div className="row justify-content-md-end">
            <Link to="/courses/new">
              <button className="btn btn-outline-primary">New Course</button>
            </Link>
          </div>
          <div className="row">
            <div className="col">
              <TableContainer
                id="courses"
                className="courses"
                fetchMethod={DiscoveryDataApiService.fetchCourses}
                columns={courseTableColumns}
                formatData={formatCourseData}
                tableSortable
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseTable;
