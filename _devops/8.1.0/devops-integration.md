---
layout: page
title: Automating CloudShell Sandboxes for DevOps
comments: true
order:  1
version:
    - 8.1.0
---
In this section, we'll look at different recipes for creating and using CloudShell Sandboxes as a part of your CI/CD
or other DevOps pipelines. In this context, we'll concentrate on the use case of automating CloudShell externally from scripts or other platforms.

### Available APIs

CloudShell currently supports two different sets of APIs which can be used to automate and integrate Sandboxes with DevOps.

* The CloudShell Automation API (_cloudshell-automation-api_ package) - This python package contains a comprehensive set of APIs for anything from managing inventory and connections to administrating users and groups as well as managing sandboxes and blueprints. The package allows developers to use the TestShell API in shell drivers and python scripts.
* The CloudShell Sandbox APIs - These RESTful APIs comprise CloudShell's next generation set of APIs. They are already using the latest terminology (sandboxes and blueprints instead of reservations and topologies/environments) and have advantages in performance and scaling. As of today, these APIs are limited to a specific set of commands focused on the workflow of starting and ending sandboxes. However, with each release, more functionality is being added to the Sandbox APIs and the intention is for this API set to eventually replace the CloudShell Automation API package completely for most DevOps-related workflows.

#### Which API to choose?
If the functionality you're looking for is covered by the Sandbox APIs, it is recommended to use it over the CloudShell Automation package.
If not, you can consider using the Sandbox API for whatever subset of the required functionality it does offer and complement that with CloudShell Automation API calls.

#### Where are the APIs documented?

**CloudShell Sandbox API**

The Sandbox API live documentation page is installed with CloudShell. To access it simply browse to the following default address:
http://[CloudShellPortalAddress]:82/api/v1/explore/. If you're accessing the link from the CloudShell Portal machine itself, or from the CloudShell SDK edition machine, you can simply use "localhost" or "127.0.0.1". The API documentation page allows you to test and experiment with the APIs as well as provide information on the different operations and parameters.

**CloudShell Automation API**

The latest 8.1 Automation API online help is available <a href="http://help.quali.com/Online%20Help/8.1.0.4496/Python-API/" target="_blank">here</a>.

When using the _cloudshell-automation-api_ package, make sure to install the version of the API which is compatible with your CloudShell version. To make the task of finding the right version easier, this package follows a versioning schema different from other CloudShell packages. The _major_ and _minor_ version of the _cloudshell-automation-api_ package will always match the CloudShell release its compatible with. Therefore, to install the latest compatible version you need to add these version requirements when installing from pip. For example, to install the latest _cloudshell-automation-api_ compatible with CloudShell 8.0, run:
{% highlight bash %}
python -m pip install "cloudshell-automation-api>=8.0,<8.1"
{% endhighlight %}

To install the latest _cloudshell-automation-api_ compatible with CloudShell 8.1, run:
{% highlight bash %}
python -m pip install "cloudshell-automation-api>=8.1,<8.2"
{% endhighlight %}

### Starting and stopping a sandbox

The simplest and recommended way to start or stop a new sandbox instance from a blueprint is using the Sandbox API.
The Sandbox API live documentation page contains the details of the response and request format. The basic URLs of these operation is  _/blueprints/{blueprint_identifier}/start_ and _/sandboxes/{sandbox_id}/stop_.

#### Using the Sandbox API from python

The following code sample demonstrates using the Sandbox APIs for a simple flow - creating a sandbox from a blueprint and then ensuring setup completes successfully after running some tests.

{% github_sample_ref /QualiSystems/devguide_examples/blob/master/devops_integration/sandbox_api_python_2_and_3/sandbox_api_example.py %}
{% highlight python %}
{% github_sample /QualiSystems/devguide_examples/blob/master/devops_integration/sandbox_api_python_2_and_3/sandbox_api_example.py 13 25 %}
{% endhighlight %}

This code uses a simple wrapper around the Sandbox API which uses the _requests_ package. You can find the source code for that implementation [here](https://github.com/QualiSystems/devguide_examples/blob/master/devops_integration/sandbox_api_python_2_and_3/sandbox_api/sandbox_apis.py):

Since sandboxes used this way are really a scope for testing. It can be beneficial to use python's _with_ statement to ensure a sandbox is always set up and torn down properly with every usage. The following code wraps the Sandbox API as a context, ensuring proper cleanup and providing convenient access to the sandbox details.

{% github_sample_ref /QualiSystems/devguide_examples/blob/master/devops_integration/sandbox_api_python_2_and_3/sandbox_context_example.py %}
{% highlight python %}
{% github_sample /QualiSystems/devguide_examples/blob/master/devops_integration/sandbox_api_python_2_and_3/sandbox_context_example.py 15 23 %}
{% endhighlight %}


**Both of the above examples are python 2/3 compatible.**

#### Using the Automation API from python

The following code demonstrates implementing the same basic flow using the CloudShell Automation API package:

{% github_sample_ref /QualiSystems/devguide_examples/blob/master/devops_integration/python_api/python_api_example.py %}
{% highlight python %}
{% github_sample /QualiSystems/devguide_examples/blob/master/devops_integration/python_api/python_api_example.py 18 34 %}
{% endhighlight %}

Similar to the Sandbox API example, we can wrap the setup and teardown of the sandbox in a context object and take advantage of the python _with_ operator to simplify the flow.

{% github_sample_ref /QualiSystems/devguide_examples/blob/master/devops_integration/python_api/python_api_context_example.py %}
{% highlight python %}
{% github_sample /QualiSystems/devguide_examples/blob/master/devops_integration/python_api/python_api_context_example.py 18 31 %}
{% endhighlight %}

### Sandbox API Missing and Upcoming Features

Currently, the Sandbox API does not support the creation of future (pending) sandboxes. If your CloudShell environment does require this feature, you may need to fall back to the _cloudshell-automation-api_ package API for sandbox reservation (using the `CreateReservation` method).

### Executing Orchestration Commands

Executing orchestration commands from the Sandbox API is supported using the _/sandboxes/{sandbox_identifier}/commands/{command_name}/start_ method.
In addition, the Automation API package provides the necessary APIs to execute orchestration scripts in the sandbox:


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
