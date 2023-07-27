6. Program Slugs in Publisher
-------------------------------

Status
------

Accepted (July 2023)

Context
-------

Ability to update the slugs for programs is needed to be accessible to a group of users.
These slugs are used in generating marketing url for each type of programs.
These program slugs will be programmatically generated initially but can be edited if needed, just like courses.
In order to grant the ability to update slugs for programs, we will going to display programs on Publisher due to its ease of access.
Instead of displaying all program information on the publisher, we will only show the editable slug field.

Decision
--------

A new tab will be added on Publisher named "Programs/Degrees" in the header.
Upon clicking the tab, the user will be shown a list of programs with minimal info.
Each item in the list will take the user to a page/modal where an input field will be available for slugs and a save button.
To access the program list and detail pages, every user must be granted the necessary permissions.
These permissions necessitate that a user must have access to Publisher and be part of a designated user group.


Consequences
------------

Programs slugs will be available on Publisher for the users having permissions while the program authoring stays on discovery django admin.
