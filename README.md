# frontend-app-publisher

[![Greenkeeper badge](https://badges.greenkeeper.io/edx/frontend-app-publisher.svg)](https://greenkeeper.io/)

Publisher frontend to manage course creation and marketing content curation.

# Important Note

This repository is in early Alpha stages of development and will be for the foreseeable future. Until then it is
not recommended for use in production.

# Development Environment

## Getting Started

Run the following commands to get started with the Publisher Development environment.

1. Install Docker locally.
    * Docker is used to generate a local development environment that contains all the required tools and libraries to
    develop against.

    * The most recent stable version of Docker should work.

2. This application requires a edx-platform instance for authentication. For local development
   you will need to setup a local instance of the edX Docker Devstack
    * https://github.com/edx/devstack
    * Follow the instructions on this repo to get the local environment up and running.

3. Run the following docker-compose commands to get started.

    This command will build the Docker container for the Publisher Frontend.

    ```
    make build
    ```

    Now run the following command to start the container and application.

    ```
    make up
    ```

    You can also run `make up-attached` if you prefer to run the container while tailing the logs.

    At the end of these commands the web application should be running. You should be able to view it
    in a web browser at `localhost:18400`.

4. When you are done working run the following command to stop the docker container.

    ```
    make down
    ```

## Running Tests

Currently we are using Jest and Enzyme for our testing

1. The following command will ensure the container is up and then exec into it and run the tests using npm. Output will show up in your terminal.

    ```
    make test
    ```

    Other useful commands exist in the `package.json` file.  These need to be run in the container
    shell using `make shell`.

    * `npm snapshot` - will update the snapshots for snapshot tests

2. To run tests on a specific folder or file, use Jest directly.

    ```
    jest path/to/folder/
    ```
    or
    ```
    jest path/to/file.test.js[x]
    ```

    Additionally, for snapshot tests, you can update only the snapshots in a folder or for a test by appending `-u` to the end of the command.

## Linting

To lint your javascript and sass run:

    ```
    make lint
    ```
