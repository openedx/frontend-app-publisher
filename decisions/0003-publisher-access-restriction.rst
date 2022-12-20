3. Publisher Access Restrictions for Internal Users
----------------------------------------------------


Status
------

Accepted (November 2022)

Context
-------

Any internal or staff user visiting the publisher can view, create, or edit the course, course run, and staff information. 
The administrator checks on the front end (and on the discovery backend) are loose compared to Course editor permissions. The editor-level restrictions do not apply to the staff users.

But why does this matter? Publisher provides the interface for authoring the marketing information for courses. That includes sensitive and risk-prone data such as price, schedule dates, etc. Any unintentional edits to these fields by any internal user
risk polluting the marketing and financial data for the course's organization and the platform as a whole. Therefore, there is a need to add an access layer for internal users. Without the proper access, the internal users would not be able to perform any data modifications.

Decision
--------

The access checks on Publisher and Discovery backend will be implemented using role-based authorization. Using `edx-rbac`_, the following actions will be performed:

* A new feature-based role, PUBLISHER_EDITOR, will be added in the Discovery backend. There will not be any system-wide role because this mechanism is focused only on Discovery and Publisher. 
* The role will be assigned to internal users within Discovery. The role assignment will be accessible via an exposed endpoint. The role assignment will contain other information, such as the assignment date, the reason for giving access, access history, etc.
* Publisher will make an additional API call to get the users' assigned roles. Based on the assignment, the behavior of the publisher will vary.

 .. _edx-rbac: https://github.com/openedx/edx-rbac

Consequences
------------

* This change will not impact Project Coordinators, Course Editors, and Legal users. They will be provided appropriate access upon the implementation
* The staff or internal users will have read-only access by default. To be able to create or edit courses and course runs, they would need the appropriate role.
* This behavior will be toggleable via settings on both the front end and back end (discovery). This is to allow flexibility in the usage of Publisher for the Open edX community.

Alternates Considered
-----------------------

One option was to create a Django User group, assign the users to the new group, and make decisions based on the group. This approach, however, falls short in adding metadata of the role assignment.

Related ADR
------------

- https://github.com/openedx/course-discovery/blob/master/docs/decisions/0017-internal-users-publisher-access-restriction.rst
  