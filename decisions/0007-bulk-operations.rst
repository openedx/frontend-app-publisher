7. Bulk Course and Course Run Operations
=========================================

Status
-------
Accepted (April, 2025)


Context
--------
Publisher MFE is the entry point for Course Authors, Project Coordinators, and Course Editors to manage courses and course runs. Any action performed on Publisher MFE results in calling course-discovery APIs.
course-discovery is the backend service and primarily acts as a product catalog and data aggregator. course-discovery maintains the communication and information exchange with platform and ecommerce.

Due to this, when actions are performed on Publisher, the appropriate side-effects and data push to relevant systems are handled automatically. For example, creating the course and course run from publisher ends up creating the course run in Studio.
This eliminates the additional step of setting up the course on Studio manually.
For an organization partner, Discovery is not required to create the courses on platform (Studio), but the usage of discovery and Publisher MFE speeds up the management of courses and their respective course runs.

The process is not without shortcomings. The partner organizations have their own methods of handling the product data. They commonly use spreadsheets, CSVs, or documents to maintain and manage the catalog data.
For instance, their document of choice can contain the details about a course, course's active runs, past runs, and upcoming or planned variants.
To input that information, they go to publisher, create a new course/course run (or search and open the existing page), perform the edits, save or publish, and repeat the process.

This activity is time-consuming and redundant. They have to move back and forth between publisher and data documents to copy and paste the information.
Ideally, if the information is already present in a commonly used format, there should be a capability to use that data and create or update records within the system.


Decision
--------
A new section, Bulk Operation, will be added in Publisher MFE. The bulk operations will be a CSV-based data loading mechanism to perform a variety of bulk operations. These include:

- Course Creation
- Course Updates
- Course Re-run
- Course Run Updates
- Course Editor Updates

A dedicated UI will be added for Bulk Operation. On the UI, the user will be able to:

- Submit a new bulk operation
- Check the status of in-progress tasks
- Review the past completed tasks

To start a new bulk operation, the user will select an operation type and upload the CSV. Once the CSV is uploaded, the backend will be notified of the operation request.
The backend will validate the CSV and start the ingestion process. On publisher, the user can refresh the page any time to view the status updates. These will not be real time updates. They show the current stage of ingestion (progressing, validating, success, failure, etc.).
Once the job has completed, the user will be able to see the ingestion records and summary.

Alternatives Considered
------------------------
Instead of adding CSV support, add a capability to select the courses from the courses list on publisher and perform selective operations (changing enterprise inclusion, create re-runs, etc.). However, such options are limited in the functionality they can offer.