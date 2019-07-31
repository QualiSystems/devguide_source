---
layout: page
title: Common Orchestration Script Recipes
category: orch
comments: true
order:  9
version: 
    - 9.3.0
---

In this section, we’ll provide a few handy examples of common script operations. The intention is to grow this into a good source to copy paste common code from. All of the examples are available in the
[DevGuide Examples](https://github.com/QualiSystems/devguide_examples) repository under the orchestration_scripts_examples folder.

#### Executing commands on sandbox resources

The following script attempts to execute a command only on resources that support it. If a resource does not support the command, the script will simply ignore it and move on to the next resource.

{% github_sample_ref /QualiSystems/devguide_examples/blob/master/orchestration_scripts_examples/try_execute_commands/try_execute_commands.py %}
{% highlight python %}
{% github_sample /QualiSystems/devguide_examples/blob/master/orchestration_scripts_examples/try_execute_commands/try_execute_commands.py 8 28 %}
{% endhighlight %}

#### Configuring Apps in a Sandbox

App configuration in a sandbox, initiated either by setup orchestration or a dedicated orchestration script, can be performed in parallel or ordered by custom logic using the app_configuration methods. 
In the following example, we will configure all the ‘web servers’ Apps after configuring the ‘application server’ App; Also, to enable connection between the deployed Apps,we will pass the application server’s address to the web servers configuration:

{% highlight python %}

from cloudshell.workflow.orchestration.sandbox import Sandbox

sandbox = Sandbox()

## configure Application server
application_server = sandbox.components.get_apps_by_name_contains('application server')[0]

sandbox.apps_configuration.apply_apps_configurations(application_server)

application_server_address = sandbox.components.get_apps_by_name_contains('application server')[0].deployed_app.FullAddress

web_servers = sandbox.components.get_apps_by_name_contains('web server')

for server in web_servers:
    ## set application server as app param (application_server_address is pre-configured on the app)
    sandbox.apps_configuration.set_config_param(server, 'application_server_address', application_server_address)

## configure web servers
sandbox.apps_configuration.apply_apps_configurations(web_servers)

{% endhighlight %}

Make sure to add a requirements.txt file that will include the cloudshell-orch-core package to use this example.

Note the code in the components helper’s method to get the correct Apps from the sandbox and the usage in the App object rather than the name of the App for other methods like _apps_configuration.set_config_param_.

Configuration of a sandbox’s Apps can be streamlined by using the OOB setup logic, as described in the CloudShell's OOB Orchestration section.
