---
layout: page
title: Getting Information from CloudShell
category: orch
comments: true
order: 2
version: 
    - 9.3.0
tags:
    - api
---


{% assign pageUrlSplited = page.url | split: "/" %}
{% assign pageVersion = pageUrlSplited[2] %}

Information about the sandbox on which your script is running and its components is available in your script as an environment variable. The standard way to get the information is using the **Sandbox** object.

**To use the *Sandbox* object:** 

* Import the cloudshell-orch-core python package and add it to your script, as illustrated in the example below. Note that the package is automatically imported when your sandbox starts.
In this example, the following code gets an object that contains all of the sandbox’s information:

{% highlight python %}
from cloudshell.workflow.orchestration.sandbox import Sandbox
Sandbox = Sandbox()
reservation_context_details = Sandbox.reservationContextDetails
{% endhighlight %}

Note that to execute this code, you will need to include a requirements.txt file in your script, see [Orchestration: Scripts Deep Dive]({{site.baseurl}}/orchestration/{{pageVersion}}/scripts-deep-dive.html) for more details.

To facilitate writing and debugging activities, it is recommended to use advanced IDEs such as PyCharm, which provide autocomplete functionality, as illustrated below. 

![Sandbox information]({{site.baseurl}}/assets/reservation_context_8_1.png){:class="img-responsive"}

Note that if you plan on using methods in your script, and want the IDE to autocomplete the *sandbox* object's class properties from within the method, you will need to include a docstring referencing the object. For details, see [Docstrings in orchestration scripts]({{site.baseurl}}/reference/{{pageVersion}}/intellisense-with-docstrings.html#docstrings-in-orchestration-scripts).

### Accessing the sandbox components

Use the **Sandbox** class to access and use the components of a sandbox in your orchestration scripts to implement custom logic. 

For example, let’s assume we want to get the names of the resources and Apps in a sandbox. To do so, we will use **Sandbox.component**.  The following code will iterate over the resources and Apps in the sandbox and print out their names:

{% highlight python %}
from cloudshell.workflow.orchestration.sandbox import Sandbox
Sandbox = Sandbox()

for resource_name, resource in Sandbox.components.resources.iteritems():
    print 'Found resource: {0}, with address: {0}'.format(resource_name, resource.FullAddress)

for app_name, app in Sandbox.components.apps.iteritems():
    print app_name
{% endhighlight %}

The components in the sandbox are stored in a dictionary object, from which a specific resource can be retrieved using a simple syntax. For example:

{% highlight python %}
Sandbox = Sandbox()
resource_details = Sandbox.components.resources['my_resource']
{% endhighlight %}

It’s also possible to get the sandbox components using helpers methods located under Sandbox.component such as get_resources_by_model, get_apps_by_name_contains and others. For example: 

{% highlight python %}
Sandbox = Sandbox()
services = Sandbox.components.get_services_by_alias('my-service-alias')
for service in services:
    print service.Alias
{% endhighlight %}

To refresh the components information at any time during the sandbox’s lifecycle, use the **Sandbox.components.refresh_components** method.


### Accessing the sandbox’s user inputs

User inputs provided by the user when they reserved the blueprint can be accessed by your script, as contextual information. This data is stored in several environment variables based on the input type:

*  **Global inputs** - These inputs are a part of the reservation form and can represent general data you wish to collect from the user for your automation. They can also be used to group together multiple other inputs as one data entry. You can access these using the GLOBALINPUTS environment variable.

* **Resource requirements** - These are inputs related to abstract resources. An abstract resource in CloudShell allows you to declare a generic spec or criteria for a resource rather than explicitly using a specific one. When customizing such an abstract resource, you can choose to make some of its properties available for the user to select, so as to make it more flexible. For example, for a physical device, instead of specifying the model in the blueprint, you can set the model as a parameter with a dropdown list for the user to select from when reserving it. Resource requirements are accessed using the RESOURCEREQUIREMENTS environment variable.

* **Resource additional info** -  When customizing an abstract resource, you can also choose to add some parameters to the resource that are not requirements but rather instructions on what to do with it. An example would be specifying an OS version to install on it. In this case, this parameter is not used to select the resource but rather to operate on the selected resource in the active sandbox. Additional info parameters are accessed using the RESOURCEADDITIONALINFO environment variable.

 As with sandboxes, we can use some helper modules to get the resource information in Python using the same object we used to get the reservation's details:  

 {% highlight python %}
Sandbox = Sandbox()

global_value = Sandbox.global_inputs['input name']
requirement_value = Sandbox.requirement_inputs['resource1']['input_name']
additiona_info_value = Sandbox.additional_info_inputs['resource1']['input_name']
{% endhighlight %}


### Getting script input parameters

You can add input parameters to a script by editing the it from the Script Management dashboard.
The input parameter values are also provided automatically to your script. CloudShell sets up an environment variable with
the same name as the parameter.

This means that if your script looks like this, with a parameter called ‘Param1’ defined:

![Sandbox information]({{site.baseurl}}/assets/script_param.png){:class="img-responsive"}

You’ll be able to access it using an environment variable by that name:

{% highlight python %}
import os
os.environ['PARAM1']
{% endhighlight %}

You can also use the Sandbox class:

{% highlight python %}
from cloudshell.workflow.orchestration.sandbox import Sandbox
Sandbox = Sandbox()
sandbox.get_user_param('Param1')

{% endhighlight %}

Note that when using the *get_user_param* helper function, the input name is case insensitive since the function will uppercase it.

### Getting sandbox information using the API

A common use case for a script is to get a list of the different Apps and resources in the sandbox, to be able to call additional commands or API functions on them. To get that information, we can use the CloudShellAPI.

**To start a CloudShell API session:**

1. Obtain the Quali Server’s connectivity details. These details are also available as an environment variable in your script called ‘qualiConnectivityContext’. As with the sandbox information, you can use the Sandbox class to quickly get the connectivity information in a more convenient object form and initialize a CloudShellAPISession object by calling **Sandbox.connectivityContextDetails**.

2. Create a CloudShell API session object. Since initializing a CloudShell API session object is a very common operation, you can use the **Sandbox** class to directly create an object. The **Sandbox** class will handle the passing of all of the required connectivity information for you. The **Sandbox** class provides a shortcut which makes accessing the CloudShell API from your script much easier. Simply use the following code:

{% highlight python %}
from cloudshell.workflow.orchestration.sandbox import Sandbox
session = Sandbox.automation_api
{% endhighlight %}

**Sandbox.automation_api** is a CloudShell API session object. You can use the IDE’s autocomplete capabilities to explore the available functions:

![Sandbox information]({{site.baseurl}}/assets/sandbox_automation_api.png){:class="img-responsive"}

### Getting the sandbox's current status

This is done by calling the GetReservationStatus API and requires obtaining two details from the sandbox - **Status** and **ProvisioningStatus**:

* **Status** provides the reservation status. Possible responses are:

  * **Pending**: Sandbox is scheduled to start in the future
  * **Started**: Sandbox is currently running
  * **In Use**: Sandbox is running and has "in use" resources
  * **Completed**: Sandbox has ended
  * **Overtime**: Sandbox is in Overtime mode (i.e. sandbox has reached its scheduled end time but has "in use" resource)

* **ProvisioningStatus** provides the sandbox's current phase. Possible responses are:
  * **Not Run**: Sandbox is scheduled to start in the future
  * **Setup**: Sandbox is running Setup
  * **Ready**: Sandbox is "Active" (without errors)
  * **Teardown**: Sandbox is in Teardown state
  * **Error**: Sandbox is "Active with Error"
  * **BeforeSetup**: Sandbox is running, but Setup hasn't started

For example, running a custom "health check" operation on the environment once the sandbox is active:

{% highlight python %}
from cloudshell.workflow.orchestration.sandbox import Sandbox
import post_setup_configurations as configs
 
sandbox = Sandbox()
reservation_id = sandbox.reservationContextDetails.id
api = sandbox.automation_api
 
result = api.GetReservationStatus(reservation_id)
 
if result.ReservationSlimStatus.Status == 'Started' and result.ReservationSlimStatus.ProvisioningStatus == 'Ready':
    configs.run_health_check
{% endhighlight %}

### Getting custom sandbox metadata

Starting with CloudShell 9.2, it is possible to store and retrieve custom key-value data from the sandbox. For details, see [Custom Sandbox Metadata]({{site.baseurl}}/reference/{{pageVersion}}/working-with-sandbox-metadata.html).

### Getting saved sandbox information

Starting with CloudShell 9.0, the *cloudshell-orch-core* python package includes a new class called *reservationLifecycleDetails*, which allows you to get the following details about your sandbox: saved sandbox name and description, and the current sandbox user name.

![Sandbox information]({{site.baseurl}}/assets/reservationLifecycleDetails.png){:class="img-responsive"}

Note that depending on the sandbox, the information may be partial. For example, if the sandbox is not a saved sandbox, the saved sandbox name and description will be missing. For details about our OOB saved sandbox orchestration scripts, see [CloudShell's OOB Orchestration]({{site.baseurl}}/orchestration/{{pageVersion}}/the-oob-orchestration.html).

### Getting the user context

Starting with CloudShell 9.0, you can get the CloudShell user who ran the blueprint/orchestration command in the **Sandbox** class.

For example:

{% highlight python %}
from cloudshell.workflow.orchestration.sandbox import Sandbox
Sandbox = Sandbox()
user = Sandbox.reservationContextDetails.running_user
{% endhighlight %}

