# frontend-app-publisher

Publisher integrates with the course discovery, ecommerce, and Studio services and can be used to
create new courses and course runs which will be pushed out to Studio for content authoring. Inside
of Publisher, the course team can manage ecommerce products, marketing information, and creation of
new course runs within a course.

# When to use Publisher

When deciding whether to use Publisher, consider the following:

## Does Publisher replace Studio?

In short, no.  Publisher is not a course authoring tool, and doesn't replace Studio for the editing
of course content.

However, it does replicate Studio functionality insofar as it relates to creating and editing course
metadata.  Put simply, if your organization opts to use Publisher, course authors will no longer use
Studio when creating courses, configuring their settings, writing about pages, and instantiating
course runs.  They'll do so via Publisher, but will still go to Studio to flesh out course content.

## If Publisher doesn't replace Studio, what is it good for?

Publisher was primarily created to make it possible for courses to undergo a draft, review, and
publish cycle, in a workflow that resembles Github reviews:

1. A course author creates a course or a course run, then submits it for review.

1. Review staff is automatically notified, after which they comment and/or suggest changes to the
   course in a manner that is easily digestible by the author.  Think colored diffs.

1. Once review is done, the author is automatically notified, and can proceed to accept, reject, or
   modify the suggested changes.

1. After the review process is finalized, the course can be published automatically.

This is not all, though.  In implementing the above, Publisher also:

* Streamlines the management of course runs.  Where in Studio it was previously difficult to view a
    course's runs at a glance, in Publisher this information is available more directly and
    concisely.

* Standardizes the process of creating About pages and their formatting.

* Facilitates integration of courses with other Open edX components such as Discovery, Programs, and
    eCommerce: there's no longer a need to manage course runs separately in each one.  For instance,
    when creating a course in Publisher, the author is required to enter a price for the
    certificate, and this information is subsequently published in eCommerce with no need to do so
    manually.

## This sounds nice, but do I really need it?

Publisher is most useful for organizations that:

* Require an Open edX-integrated tool that facilitates the review and publication process for a
    large number of courses.

* Need to review and publish course content produced by third parties.

* Host a significant number of courses and/or create course runs frequently, and are interested in a
    more efficient way of managing them.

* Are heavy users of eCommerce or Programs, and would like a centralized way to manage integration
    of courses.

If your organization doesn't fall into one of the above categories, Publisher can still be useful
but will likely not be considered mission-critical.  For a detailed feature-by-feature guide, refer
to the [Introduction to Publisher](https://edx.readthedocs.io/projects/edx-partner-course-staff/en/latest/set_up_course/pub_create_ann_course/pub_introduction.html)
chapter of the courseware development documentation.

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
