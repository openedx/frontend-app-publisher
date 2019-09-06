1. Long Term Configuration
----------------------------------------------

Status
------

Initial

Context
-------

Over time configuration will need to be added to the application.  This needs to be separated between local and
production.


Decision
--------

The proposed approach is that local configurations will be set in the `config/webpack.dev.config.js` within the
`EnvironmentPlugin`.  In Production we will override these variables in the local environment.

Consequences
------------

This will allow for a separation of the local and production variables.  It will also allow for storing needed
variables for use throughout the application.


References
----------

* https://github.com/edx/frontend-app-publisher/tree/master/config
