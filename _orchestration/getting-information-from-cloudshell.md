---
layout: page
title: Getting Information from CloudShell
category: orch
comments: true
order: 2
tags:
    - api
---

Information about the sandbox your script is running on and its components is automatically available in your script
as an environment variable. The standard way to get that information in Python is to use the ‘os’ package.

{% highlight python %}
import os
os.environ['RESERVATIONCONTEXT']
# {"id":"5487c6ce-d0b3-43e9-8ee7-e27af8406905",
#  "ownerUser":"bob",
#  "ownerPass":"nIqm+BG6ZGJjby5hUittVFFJASc=",
#  "domain":"Global",
#  "environmentName":"My environment",
#  "description":"New demo environment",
#  "parameters":
#    { "globalInputs": [],
#      "resourceRequirements":[],
#      "resourceAdditionalInfo":[]}}

{% endhighlight %}

However, we’ve added helpers to make it easier to get that information without having to parse the environment
variables yourself. Just import our helper classes to take advantage of that functionality.
You can use the following code to get an object which contains all of the sandbox information:

{% highlight python %}
import cloudshell.helpers.scripts.cloudshell_scripts_helpers as helpers
helpers.get_reservation_context_details()
{% endhighlight %}

This will return a Python object you can use to query the same reservation information directly:

![Sandbox information]({{site.baseurl}}/assets/reservation_context.png){:class="img-responsive"}

### Getting the sandbox information using the API

A common use case for a script is to get a list of the different Apps and resources in the sandbox, to be able
to call additional commands or API functions on them. To get that information we can use the CloudShellAPI.

To start a CloudShell API session, we need connectivity details to the Quali server. These details are also available
as an environment variable in your script called 'qualiConnectivityContext'. As with the reservation information,
you can use the _script_helpers_ module to quickly get the connectivity information in a more convenient object form
and initialize a CloudShellAPISession object by calling _helpers.get_reservation_context_details()_.

However, since initializing a CloudShell API session object is a very common operation, you can use the helpers to directly
create an object. The helper module will take care of passing all of the required connectivity information for you.
The _cloudshell_script_helpers_ module provides a shortcut which makes accessing the CloudShell API from your script
much easier. Simply use the following code:

{% highlight python %}
import cloudshell.helpers.scripts.cloudshell_scripts_helpers as helpers
helpers.get_api_session()
{% endhighlight %}

The _get_api_session()_ function will return a CloudShell API session object. You can use the IDE's autocomplete capabilities
to explore the available functions:

![API Autocomplete]({{site.baseurl}}/assets/api_autocomplete.png){:class="img-responsive"}

In this case we want to get information about the resources and Apps in the sandbox, so we can use the _GetReservationDetails_
function. The following code will iterate over the resources and Apps in the sandbox and print out their names:

{% highlight python %}
reservation_id = helpers.get_reservation_context_details().id
reservation_details = helpers.get_api_session().GetReservationDetails(reservation_id).ReservationDescription

for resource in reservation_details.Resources:
    print resource.Name

for app in reservation_details.Apps:
    print app.Name

{% endhighlight %}

### Accessing the sandbox user inputs

The user inputs provided by the user when he reserved the blueprint are also a contextual information that can be
accessed by your script. This data is stored in several environment variables based on the input type:

*  **Global inputs** - These inputs are a part of the reservation form and can represent general data you wish to
collect from the user for your automation. They can also be used to group together multiple other inputs as one data entry.
You can access these using the _GLOBALINPUTS_ environment variable.

* **Resource requirements** - These are inputs related to abstract resource. An abstract resource in CloudShell allows you to declare a generic spec or requirements for a resource rather than explicitly using a specific one. When customizing such an abstract resource you can choose to make some of its properties available for the user to select, so as to make it more flexible. For example, for a physical device, instead of specifying the model in the blueprint you can set that as a parameter with a dropdown list for the user to select from when reserving it.
Resource requirements are accessed using the _RESOURCEREQUIREMENTS_ environment variable.

* **Resource additional info** -  When customizing an abstract resource you can also choose to add some parameters to the
resource that are not requirements but rather instructions on what to do with it. An example would be specifying an OS
version to install on it. In this case, this parameter is not used to select the resource but rather to operate on the
selected resource in the active environment. Additional info parameters are accessed using the _RESOURCEADDITIONALINFO_
environment variable.

 As with reservations, we can use some helper modules to get the resource information in Python using the same object we used to get the
 reservation details:  

 {% highlight python %}

parameters = helpers.get_reservation_context_details().parameters
global_value = parameters.global_inputs['input name']
requirement_value = parameters.resource_requirements['resource1']['input_name']
additiona_info_value = parameters.resource_additional_info['resource1']['input_name']

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
os.environ['Param1']
{% endhighlight %}

You can also use the scripting helper class:

{% highlight python %}
import cloudshell.helpers.scripts.cloudshell_scripts_helpers as helpers
helpers.get_user_param('Param1')
{% endhighlight %}
