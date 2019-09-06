1. New Instructors Organization Association
----------------------------------------------

Status
------

Initial

Context
-------

We are using the course-run -> instructor linkage to derive organization associations for instructors for
the autocomplete search.  New instructors will not have this linkage, so we need to account for this
state in the create new instructor workflow.

Decision
--------

We will add newly created instructors to the staff list automatically.  This will mean that on save, these
instructors will now have a linkage to the course-run, and by virtue of that linkage, now be attached to
the authoring organizations for the course.

Consequences
------------

It is possible that users will create new instructors and not continue to save the course run that they
are authoring.  In this case, these new instructors will be orphaned in the database (not attached to any
organization) and will need to be cleaned up later to prevent data degradation.

References
----------
https://github.com/edx/frontend-app-publisher/tree/master/src/components/StaffList

