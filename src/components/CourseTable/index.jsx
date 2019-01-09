import React from 'react';
import apiClient from '../../data/apiClient';

function CourseTable() {
  return (
    <div>
      <h2>Hello, welcome to Publisher! You are logged in.</h2>
      <button onClick={() => apiClient.logout()}>Logout</button>
    </div>
  );
}

export default CourseTable;
