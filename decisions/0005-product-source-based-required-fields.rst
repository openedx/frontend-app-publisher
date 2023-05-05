5. Validating AdditionalMetadata fields based on product source
--------------------------------------------------------------------

Status
------
Accepted (Feb 2023)

Context
-------
During the recent influx of external products into the marketplace, a number of products were ingested into publisher which did
not have all of the AdditionalMetadata fields associated with them. These products were coming from different sources and thus had
different expectations of the validation in AdditionalMetadata fields. As such, the existing publisher flow, which required all of the
AdditionalMetadata fields to be present regardless of the product source, needed to be made more flexible to dynamically update its
validation strategy depending on the particular products.

Decision
--------
Modify the AdditionalMetadata field validation logic to base decisions on the source of external products. In particular, have 
a configuration object detailing the mapping between different product sources and the required AdditionalMetadata fields for 
their associated products. Based on this mapping then, make decisions in publisher as to whether all the required data has been
entered.

Specifically, maintain a mapping of the form `{"product_source_1": ["req_field_1", "req_field_2"], "product_source_2": ["req_field_3", "req_field_4"]}` in
publisher. At runtime look up the source associated with the product in this mapping to retrieve the names of the fields
that should be made required.

Since it is not feasible to store config objects in an open-source repo, the mapping must be stored in an environment variable. Here 
one is restricted by the fact that environment variables can only be strings. The workaround that has been implemented is to store the
config object as JSON string in an environment variable and parse it at runtime.

Alternatives
------------
One alternative that was considered was to remove validation entirely for the fields. However this was soon rejected as
it would be inconsistent with the rest of publisher's workflows and would not make for a nice user experience.

Future Enhancements
-------------------
In the future, this functionality may be extended to cover more or even all the fields in publisher and not just those under the banner of AdditionalMetadata.
For Example, there may be different validation strategies for short description, long description, instructor etc. depending on the product source.

References
-------------------
https://github.com/openedx/frontend-app-publisher/pull/825
