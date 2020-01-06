# frontend-app-publisher

[![Greenkeeper badge](https://badges.greenkeeper.io/edx/frontend-app-publisher.svg)](https://greenkeeper.io/)

Publisher frontend to manage course creation and marketing content curation.

# Important Note

This repository is in early Alpha stages of development and will be for the foreseeable future. Until then it is
not recommended for use in production.

# Development Environment

## Getting Started

This application requires an edx-platform instance for authentication. For local development
   you will need to setup a local instance of the edX Docker Devstack
    * https://github.com/edx/devstack

You should be able to view it in a web browser at `localhost:18400`.

## Running Tests

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
