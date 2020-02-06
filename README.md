# frontend-app-publisher

Publisher integrates with the course discovery, ecommerce, and Studio services and can be used to
create new courses and course runs which will be pushed out to Studio for content authoring. Inside
of Publisher, the course team can manage ecommerce products, marketing information, and creation of
new course runs within a course.

# Important Note

At this point in time, there is no standard process for installing Microfrontends in a production
setting, but Publisher is still being provided so the community can become more familiar with it and
possibly configure and install it on their own.

# Development Environment

## Getting Started

This application requires an edx-platform instance for authentication. For local development
   you will need to setup a local instance of the edX Docker Devstack
    * https://github.com/edx/devstack

You should be able to view it in a web browser at `localhost:18400`.

## Running Tests

Note: The assumption behind running any of these commands is that the user is
already shelled into the container using the `make frontend-app-publisher-shell`
command in devstack.

Currently we are using Jest and Enzyme for our testing

1. The following command will run the tests using npm. Output will show up in your terminal.

    ```
    make test
    ```

    Other useful commands exist in the `package.json` file.

    * `npm run snapshot` - will update the snapshots for snapshot tests

2. To run tests on a specific folder or file, use Jest directly.

    ```
    ./node_modules/.bin/jest path/to/folder/
    ```
    or
    ```
    ./node_modules/.bin/jest path/to/file.test.js[x]
    ```

    Additionally, for snapshot tests, you can update only the snapshots in a folder or for a test by appending `-u` to the end of the command.

## Linting

To lint your javascript and sass run:

    ```
    make lint
    ```
