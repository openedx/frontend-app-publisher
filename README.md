# publisher-frontend

[![Greenkeeper badge](https://badges.greenkeeper.io/edx/publisher-frontend.svg)](https://greenkeeper.io/)

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
    
    You can also run `make up-detached` if you prefer to run the container without tailing the logs.
    
    At the end of these commands the web application should be running. You should be able to view it 
    in a web browser at `localhost:18400`.
    
4. When you are done working run the following command to stop the docker container.

    ```
    make down
    ``` 
    
## Running Tests

Currently we are using Jest and Enzyme for our testing

1.  Start the Docker container and shell into the container

    ```
    make up-detached shell
    ```
    
2. Run the tests using npm within the shell

    ```
    make test
    ```
    
    Other useful commands exist in the `package.json` file.  These need to be run in the container
    shell using `make shell`.
    
    * `npm snapshot` - will update the snapshots for snapshot tests
