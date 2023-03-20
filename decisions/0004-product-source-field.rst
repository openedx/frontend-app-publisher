4. Adding Product Source to Courses on Course Creation via Publisher
--------------------------------------------------------------------

Status
------

Accepted (March 2023)

Context
-------
Owing to the platform focused marketing and revenue strategies, now there is a massive opportunity to improve the marketplace architecture. As multiple LoBs plugged into edx marketplace for marketing their products, the marketplace architecture needs to be improved 
to support the new business requirements and allow them to create their products through publisher. Currently, only the legacy edx products are created through publisher with empty product source field. 
To maintain the distinction between the different LoBs products, a new field needs to be added to the course creation form in the publisher, allowing the course teams to select the product source for their course.

Decision
--------
Adding a new field in the course creation form in publisher to allow the course teams to select the product source for their courses. 
The Product Source field is a drop-down list that appears on the course creation page, enabling the selection of the source of the product.
The **product source** field is crucial in identifying the source of the product, especially since several LoBs and third-party sources have plugged into the system.
However, for the time being, the field will be hidden. In the meantime, courses created through the publisher will have a :emphasis:`default value of` **edX** :emphasis:`for the product source`.
This default value will help to keep track of the courses and their sources until the field is visible again.

Future Enhancements
-------------------
For future enhancements, there are plans to filter organizations based on the product source, allowing course teams to select organizations from a filtered list.
