---
layout: page
title: Automating CloudShell Sandboxes for DevOps
comments: true
order:  1
version:
    - 8.3.0
---
In this section, we'll look at different recipes for creating and using CloudShell Sandboxes as a part of your CI/CD
or other DevOps pipelines. In this context, we'll concentrate on the use case of automating CloudShell externally from scripts or other platforms.

### Available APIs

CloudShell currently supports two different sets of APIs which can be used to automate and integrate Sandboxes with DevOps.

* The Python cloudshell-automation-api package - This Python package contains a comprehensive set of APIs for anything from managing inventory and connections to administrating users and groups as well as managing sandboxes and blueprints.  
* The CloudShell Sandbox REST APIs - These are CloudShell's next generation set of APIs. They are already using the latest terminology (sandboxes and blueprints instead of reservations and topologies/environments) and have advantages in performance and scaling. As of today, these APIs are limited to a specific set of commands focused on the workflow of starting and ending sandboxes. However, with each release more functionality is being added to the REST APIs and the intention is for this API set to eventually replace the Python package completely for most DevOps related workflows.

#### Which API to choose?
If the functionality you're looking for is covered by the REST APIs it is recommended to use it over the Python package.
If not, you can consider using the REST API for whatever subset of the required functionality it does offer and complement that with Python API calls.

#### Where are the APIs documented?

**REST API**

The REST API live documentation page is installed with CloudShell. To access it simply browse to the following default address:
http://[CloudShellPortalAddress]:82/api/v1/explore/. If you're accessing the link from the CloudShell Portal machine itself, or from the CloudShell SDK edition machine, you can simply use "localhost" or "127.0.0.1". The API documentation page allows you to test and experiment with the APIs as well as provide information on the different operations and parameters.

**Python API**

You can download the latest Python package reference from the CloudShell online help [here](http://help.quali.com/Online%20Help/8.1.0.4291/Python-API/).

When using the _cloudshell-automation-api_ package, make sure to install the version of the API which is compatible with your CloudShell version. To make the task of finding the right version easier, this package follows a versioning schema different from other CloudShell packages. The _major_ and _minor_ version of the _cloudshell-automation-api_ package will always match the CloudShell release its compatible with. Therefore, to install the latest compatible version you need to add these version requirements when installing from pip. For example, to install the latest _cloudshell-automation-api_ compatible with CloudShell 8.1, run:
{% highlight bash %}
python -m pip install "cloudshell-automation-api>=8.1,<8.2"
{% endhighlight %}

To install the latest _cloudshell-automation-api_ compatible with CloudShell 8.2, run:
{% highlight bash %}
python -m pip install "cloudshell-automation-api>=8.2,<9.0"
{% endhighlight %}

### Starting and stopping a sandbox

The simplest and recommended way to start or stop a new sandbox instance from a blueprint is using the REST API.
The REST API documentation page contains the details of the response and request format. The basic URLs of these operation is _/blueprints/{blueprint_identifier}/start_ and _/sandboxes/{sandbox_id}/stop_.

#### Using the Rest API from Python

The following code sample demonstrates using the REST APIs for a simple flow - creating a sandbox from a blueprint, ensuring setup completes successfully then after running some tests.

{% github_sample_ref /QualiSystems/devguide_examples/blob/master/devops_integration/sandbox_api_python_2_and_3/sandbox_api_example.py %}
{% highlight python %}
{% github_sample /QualiSystems/devguide_examples/blob/master/devops_integration/sandbox_api_python_2_and_3/sandbox_api_example.py 13 25 %}
{% endhighlight %}

This code uses a simple wrapper around the REST API which uses the _requests_ package. You can find the source code for that implementation [here](https://github.com/QualiSystems/devguide_examples/blob/master/devops_integration/sandbox_api_python_2_and_3/sandbox_api/sandbox_apis.py):

Since sandboxes used this way are really a scope for testing. It can be beneficial to use Python's _with_ statement to ensure a sandbox is always set up and torn down properly with every usage. The following code wraps the Sandbox REST API as a context, ensuring proper cleanup and providing convenient access to the sandbox details.

{% github_sample_ref /QualiSystems/devguide_examples/blob/master/devops_integration/sandbox_api_python_2_and_3/sandbox_context_example.py %}
{% highlight python %}
{% github_sample /QualiSystems/devguide_examples/blob/master/devops_integration/sandbox_api_python_2_and_3/sandbox_context_example.py 15 23 %}
{% endhighlight %}


**Both of the above examples are Python 2/3 compatible.**

#### Using the TestShell API from Python

The following code demonstrates implementing the same basic flow using the Python package:

{% github_sample_ref /QualiSystems/devguide_examples/blob/master/devops_integration/python_api/python_api_example.py %}
{% highlight python %}
{% github_sample /QualiSystems/devguide_examples/blob/master/devops_integration/python_api/python_api_example.py 18 34 %}
{% endhighlight %}

Similar to the REST example, we can wrap the setup and teardown of the sandbox in a context object and take advantage of the Python _with_ operator to simplify the flow.

{% github_sample_ref /QualiSystems/devguide_examples/blob/master/devops_integration/python_api/python_api_context_example.py %}
{% highlight python %}
{% github_sample /QualiSystems/devguide_examples/blob/master/devops_integration/python_api/python_api_context_example.py 18 31 %}
{% endhighlight %}

### Sandbox REST API Missing and Upcoming Features

Currently, the Sandbox REST API does not support the creation of future (pending) sandboxes. If your CloudShell environment does require this feature, you may need to fall back to the _cloudshell-automation-api_ package API for sandbox reservation (using the `CreateReservation` method).

### Executing Orchestration Commands

Executing orchestration commands from the REST API is supported using the _/sandboxes/{sandbox_identifier}/commands/{command_name}/start_ REST API method.
In addition, the Python package provides the necessary APIs to execute orchestration scripts in the sandbox:

{% github_sample_ref /QualiSystems/devguide_examples/blob/master/devops_integration/python_api/python_api_example.py %}
{% highlight python %}
{% github_sample /QualiSystems/devguide_examples/blob/master/devops_integration/python_api/python_api_example.py 9 16 %}
{% endhighlight %}

### Integrating with CI tools

The same basic workflow demonstrated in the above examples can be used to implement a plugin for CI frameworks
such as Jenkins, Travis or TeamCity.

Several Quali community projects already provide readymade solutions for some CI tools.

The [Sandbox-Jenkins-Plugin](https://github.com/jenkinsci/cloudshell-sandbox-plugin) provides build steps for creating and ending sandboxes for Jenkins, as well as integration with the new PipeLines feature for continuous delivery and DevOps automation.

The [Sandbox-Teamcity-Plugin](https://github.com/QualiSystems/Sandbox-TeamCIty-Plugin) provides similar build steps and integration for TeamCity.