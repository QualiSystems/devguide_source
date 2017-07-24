---
layout: page
title: Getting Information from CloudShell
category: orch
comments: true
order: 2
version: 
    - 8.1.0
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

![Sandbox information]({{ site.baseurl}}/assets/reservation_context_8_1.png){:class="img-responsive"}

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

* **Resource additional info** -  When customizing an abstract resource, you can also choose to add some parameters to the resource that are not requirements but rather instructions on what to do with it. An example would be specifying an OS version to install on it. In this case, this parameter is not used to select the resource but rather to operate on the selected resource in the active environment. Additional info parameters are accessed using the RESOURCEADDITIONALINFO environment variable.

 As with sandboxes, we can use some helper modules to get the resource information in Python using the same object we used to get the reservation details:  

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

![Sandbox information]({{ site.baseurl}}/assets/script_param.png){:class="img-responsive"}

You’ll be able to access it using an environment variable by that name:

{% highlight python %}
import os
os.environ['Param1']
{% endhighlight %}

You can also use the Sandbox class:

{% highlight python %}
from cloudshell.workflow.orchestration.sandbox import Sandbox
Sandbox = Sandbox()
sandbox.get_user_param('Param1')

{% endhighlight %}

### Getting sandbox information using the API

A common use case for a script is to get a list of the different Apps and resources in the sandbox, to be able to call additional commands or API functions on them. To get that information, we can use the CloudShellAPI.

**To start a CloudShell API session:**

1. Obtain the Quali Server’s connectivity details. These details are also available as an environment variable in your script called ‘qualiConnectivityContext’. As with the sandbox information, you can use the Sandbox class to quickly get the connectivity information in a more convenient object form and initialize a CloudShellAPISession object by calling **Sandbox.connectivityContextDetails**.

2. Create a CloudShell API session object. Aince initializing a CloudShell API session object is a very common operation, you can use the **Sandbox** class to directly create an object. The **Sandbox** class will handle the passing of all of the required connectivity information for you. The **Sandbox** class provides a shortcut which makes accessing the CloudShell API from your script much easier. Simply use the following code:

{% highlight python %}
from cloudshell.workflow.orchestration.sandbox import Sandbox
session = Sandbox.automation_api
{% endhighlight %}

**Sandbox.automation_api** is a CloudShell API session object. You can use the IDE’s autocomplete capabilities to explore the available functions:

![Sandbox information]({{ site.baseurl}}/assets/sandbox_automation_api.png){:class="img-responsive"}