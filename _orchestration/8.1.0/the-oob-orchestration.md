---
layout: page
title: CloudShell's OOB Orchestration
category: orch
comments: true
version: 
    - 8.1.0
order:  9
---
Every CloudShell installation includes out of the box setup and teardown workflows. These reflect some common workflows we see across many of our customers that we’ve decided to integrate as default behavior. The OOB setup and teardown processes handle App deployment and startup, connectivity, App discovery and installation. 
As of CloudShell 7.1, the OOB scripts are included as part of the default blueprint template.
The following diagram describes the OOB setup and teardown flow:


![Setup Workflow]({{ site.baseurl}}/assets/orchestration_workflow.png){: .center-image }

These OOB setup and teardown scripts can be found in the Scripts – Blueprint management page. You can review their source code in the [cloudshell-orch-sandbox repository](https://github.com/QualiSystems/cloudshell-orch-sandbox/tree/master/sandbox_scripts).

As of CloudShell 8.1, the default setup and teardown logic moved to a python package called cloudshell-orch-core for ease of use. The default blueprint template includes a reference to the cloudshell-orch-core package using the requirments.txt mechanism, which is supported for orchestration scripts. Here is the implementation of the OOTB setup script:


{% highlight python %}
from cloudshell.workflow.orchestration.Sandbox import Sandbox
from cloudshell.workflow.orchestration.setup.default_setup_orchestrator import DefaultSetupWorkflow

sandbox = Sandbox()

DefaultSetupWorkflow().register(sandbox)

sandbox.execute_setup()
{% endhighlight %}

As you can see, to use the default orchestration logic, we instantiated the *DefaultSetupWorkflow* class and registered the sandbox to use the default behavior.
Starting in CloudShell 8.1, sandbox setup is divided into 3 stages: provisioning, connectivity and configuration. It’s possible to disable the default implementation of each stage by setting enable_stageName=False, as illustrated in this example:

{% highlight python %}
DefaultSetupWorkflow().register(Sandbox, enable_connectivity=False)
{% endhighlight %}



The OOB setup and teardown scripts can easily be customized or extended. Click [here](https://github.com/QualiSystems/cloudshell-orch-sandbox/blob/develop/Samples/Setup/ordered_configuration_example.py) for an example on how to customize the app configuration order in the setup stage, or see [other samples](https://github.com/QualiSystems/cloudshell-orch-sandbox/tree/develop/Samples) to learn how to extend the OOB orchestration scripts.


### Extending the OOB Orchestration Scripts

You can extend the OOB setup and teardown scripts by adding additional steps, or controlling the order of execution. For example, calling additional commands to validate Apps or resource states, launching additional orchestration, or controlling the order in which the sandbox is provisioned.

1. Create a copy of the appropriate script, (see below for extension options), and upload the updated version separately into CloudShell Portal as a Setup or Teardown script. DO NOT remove any step in the setup workflow. However, you can add your own steps or change the order of execution.

2. Make sure not to name your extended script ‘setup’ but give it a more specific name. The name ‘setup’ is a reserved name, which may cause unexpected behavior when used on a setup script.

Extending the setup script can be done by implementing the required logic in one of the setup stages: provisioning, connectivity and configuration or as a post stage for validation. For example, adding some logic to the configuration stage can be made in the following way:

{% highlight python %}
from cloudshell.workflow.orchestration.Sandbox import Sandbox
from cloudshell.workflow.orchestration.setup.default_setup_orchestrator import DefaultSetupWorkflow

Sandbox = Sandbox()

DefaultSetupWorkflow().register(Sandbox)

Sandbox.workflow.add_to_configuration(my_custom_login, components)
{% endhighlight %}

The workflow helper supports the following extension methods:
* add_to_provisioning
* on_provisioning_ended
* add_to_connectivity
* on_connectivity_ended
* add_to_configuration
* on_configuration_ended

Each of the following methods gets a custom function and list of components to use in the function. For example, executing some custom logic to validate resource configuration:

{% highlight python %}
from cloudshell.workflow.orchestration.Sandbox import Sandbox
from cloudshell.workflow.orchestration.setup.default_setup_orchestrator import DefaultSetupWorkflow

def custom_function(sandbox, components):
    pass

sandbox = Sandbox()

DefaultSetupWorkflow().register(sandbox)

resources = sandbox.components.get_resources_by_model('Generic Resource Model')

sandbox.workflow.on_configuration_ended(custom_function, resources)
{% endhighlight %}

Note that all methods of the OOB setup logic in the same stage are executed in parallel.
The custom function should get arrays of the sandbox and its components as inputs. It’s recommended to use this function template as a starting point:

{% highlight python %}
from cloudshell.workflow.orchestration.Sandbox import Sandbox

def custom_func(sandbox, components):
    """
    :param Sandbox sandbox:
    :return:
    """
    pass
{% endhighlight %}


Here is an implementation example of custom configuration logic for a 3 tier application where each type of App is configured consecutively while passing some global inputs and configuration parameters between the Apps:

{% highlight python %}
from cloudshell.workflow.orchestration.Sandbox import Sandbox
from cloudshell.workflow.orchestration.setup.default_setup_orchestrator import DefaultSetupWorkflow


def main():
    sandbox = Sandbox()
    sandbox.automation_api.WriteMessageToReservationOutput(reservationId=sandbox.id,
                                                           message='Starting to execute the cool stuff!')

    DefaultSetupWorkflow().register(sandbox, enable_configuration=False)  # Disable OOTB configuration
    sandbox.workflow.add_to_configuration(function=configure_apps,
                                          components=sandbox.components.apps)
    sandbox.execute_setup()


def configure_apps(sandbox, components):
    """
    :param Sandbox sandbox:
    :return:
    """
    sandbox.automation_api.WriteMessageToReservationOutput(reservationId=sandbox.id,
                                                           message='configure_apps started')
    build_id = sandbox.global_inputs['build_id']

    # Configure databases
    databases = sandbox.components.get_apps_by_name_contains('Database')
    sandbox.automation_api.WriteMessageToReservationOutput(reservationId=sandbox.id,
                                                           message='Configuring Databases')
    for app in databases:
        sandbox.apps_configuration.set_config_param(app=app,
                                                    key='build_id',
                                                    value=build_id)

        sandbox.automation_api.WriteMessageToReservationOutput(reservationId=sandbox.id,
                                                               message='Database configured with build_id {0}'.format(str(build_id)))

    sandbox.apps_configuration.apply_apps_configurations(databases)

    sandbox.automation_api.WriteMessageToReservationOutput(reservationId=sandbox.id,
                                                           message='Finished to configure databases')

    # Configure Application Servers
    app_servers = sandbox.components.get_apps_by_name_contains('Application')

    sandbox.automation_api.WriteMessageToReservationOutput(reservationId=sandbox.id,
                                                           message='Configuring Application Servers')

    database = sandbox.components.get_apps_by_name_contains('Database')[0].deployed_app.FullAddress

    for app_server in app_servers:
        sandbox.apps_configuration.set_config_param(app=app_server,
                                                    key='build_id',
                                                    value=build_id)


        sandbox.apps_configuration.set_config_param(app=app_server,
                                                    key='DB_address',
                                                    value=database)

        sandbox.automation_api.WriteMessageToReservationOutput(reservationId=sandbox.id,
                                                               message='Application Server configured with build_id {0} , and DB address {1}'
                                                               .format(str(build_id), str(database)))

    sandbox.apps_configuration.apply_apps_configurations(app_servers)
    
    sandbox.automation_api.WriteMessageToReservationOutput(reservationId=sandbox.id,
                                                           message='Finished to configure Application Servers')

    # Configure web servers
    application_server_address = sandbox.components.get_apps_by_name_contains('Application')[0].deployed_app.FullAddress

    web_servers = sandbox.components.get_apps_by_name_contains('Web')

    for app in web_servers:
        sandbox.apps_configuration.set_config_param(app=app,
                                                    key='Application Server',
                                                    value=application_server_address)

        sandbox.apps_configuration.set_config_param(app=app,
                                                    key='build_id',
                                                    value=build_id)
        
        sandbox.automation_api.WriteMessageToReservationOutput(reservationId=sandbox.id,
                                                               message='Web Server configured with build_id {0}, and Application Server address {1}'
                                                               .format(str(build_id), str(application_server_address)))


    sandbox.apps_configuration.apply_apps_configurations(web_servers)
    sandbox.automation_api.WriteMessageToReservationOutput(reservationId=sandbox.id,
                                                           message='Finished to configure Web Servers')

main()
{% endhighlight %}