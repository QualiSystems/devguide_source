---
layout: page
title: Getting information from CloudShell
category: tut
order: 5
---
A typical shell driver, will first get crucial information from the sandbox and then use that information
to access the device it controls. Some common information would be the resource or app's address, attributes
such as username and password, as well as other information from other sandbox settings or components.

To provide easy access to such common information, each driver function has access to a special context object parameter,
which is created by CloudShell for each driver command execution. If you've generated the default driver template,
you may have noticed that the pre-generated functions already have some docstring code-hint annotation.
This allows some IDEs like Pycharm to provide autocomplete for the class properties and make it a lot easier to user.

#### CloudShell Shell Core

The classes used for the command context parameters, as well as other interface classes CloudShell provides are provided
in the **_cloudshell-shell-core_** package which you also may have noticed is imported in the sample driver class.
The term _Resource_ may be a confusing one for the context object. We consider both
Lets take a look at the ResourceCommandContext class to understand more about the information it provides:

{% highlight python %}
class ResourceCommandContext:
    def __init__(self, connectivity, resource, reservation, connectors):
        self.connectivity = connectivity                # Connectivity details that can help connect to the APIs
        """:type : ConnectivityContext"""
        self.resource = resource                        # The details of the resource using the driver
        """:type : ResourceContextDetails"""
        self.reservation = reservation                  # The details of the reservation
        """:type : ReservationContextDetails"""
        self.connectors = connectors                    # The list of visual connectors and routes that are connected to the resource (the resource will be considered as the source end point)
        """:type : list[Connector]"""
{% endhighlight %}

#### The ResourceContextDetails object

![Context Object]({{ site.url }}/devguide/assets/context_object_completion.png)

The **_connectivity_** attribute contains information about how to connect to CloudShell, information like server address, ports and so on.
It also contains a token which can be used to log in to the CloudShell API. As we'll discuss, it is generally recommended to use the CloudShel API
as little as possible in your Shell, with the exception of a few operations which we'll cover later in the examples section of this guide.
So while the connectivity information is readily available on the context, in most cases you should not have to use it.

The **resource** attribute contains most of the information you'll need about the app or resource to which your Shell driver is assigned.
Lets examine the _ResourceContextDetails_ class properties:

{% highlight python %}
context.resource.id  # (str) The identifier of the resource / service / app - consistent value that can't be changed / renamed by the user
context.resource.name   # The name of the resource/app
context.resource.fullname   # The full name of the resource, including any parent resources (relevant to inventory resources only)
context.resource.type   # (Service, App, Resource) The type can be either a Service an App (which means a deployed App) or a Resource
context.resource.address   # The IP address of the resource / app
context.resource.model   # The resource/app model
context.resource.family = None  # The resource/app family or type classification
context.resource.description = None  # The resource/app description
        """:type : str"""
        context.resource.attributes = None  # A dictionary that contains the resource attributes (name, value)
        """:type : dict[str,str]"""
        context.resource.app_context = None
        """:type : AppContext"""
{% endhighlight %}

There is a lot of useful information in this object. Of special importance is The _name_ of the resource, the _address_ and the _model_. These provide
the most basic details about the resource or app required to communicate with it. Other attributes, such as the user and password credentials, additional
interfaces and other settings will be found in _attributes_ property. The _attributes_ property is a dictionary with the keys being the attribute names
and the value being the current value. To access an attribute such as 'User' on an app, simply do a simple lookup:

{% highlight python %}
user = context.attributes['User']
{% endhighlight %}

#### Connectivity information

The _connectivity_ property provides information about the resource or app's connectors (visual or network connectors) in the sandbox.
The _ConnectivityContext_ class provides the following properties:



#### Additional information for apps and VMs

Two additional properties in the  object provide information specifically for apps and virtual machines. The app_context property provides extensive
information about the app, its deployment parameters, shell parameters and installation options. The object contains

{
  "name": "tinyLinux",
  "description": null,
  "logicalResource": {
    "family": "Generic App Family",
    "model": "NtSwitch",
    "driver": "NtSwitchDriver",
    "description": "",
    "attributes": []
  },
  "deploymentService": {
    "name": "vCenter VM From Template",
    "model": "vCenter VM From Template",
    "driver": "Deploy From Template Driver",
    "attributes": [
      {
        "name": "vCenter Name",
        "value": "VMWare vCenter"
      },
      {
        "name": "vCenter Template",
        "value": "Tomer/PhotonDocker"
      },
      {
        "name": "VM Cluster",
        "value": ""
      },
      {
        "name": "VM Storage",
        "value": ""
      },
      {
        "name": "VM Resource Pool",
        "value": ""
      },
      {
        "name": "VM Location",
        "value": ""
      },
      {
        "name": "Auto Power On",
        "value": "True"
      },
      {
        "name": "Auto Power Off",
        "value": "True"
      },
      {
        "name": "Wait for IP",
        "value": "True"
      },
      {
        "name": "Auto Delete",
        "value": "True"
      },
      {
        "name": "Autoload",
        "value": "True"
      },
      {
        "name": "IP Regex",
        "value": ""
      },
      {
        "name": "Refresh IP Timeout",
        "value": "600"
      }
    ],
    "scriptCommandName": null,
    "scriptInputs": []
  },
  "installationService": null
}
{
  "name": "tinyLinux_8889c6a9",
  "family": "Generic App Family",
  "model": "NtSwitch",
  "address": "192.168.65.34",
  "attributes": [],
  "vmdetails": {
    "id": "58250371-2095-4c2a-9515-d21e3026dae4",
    "cloudProviderId": "44a8463c-911e-4a56-9abd-f3b9ee127438",
    "uid": "42225e87-9b6d-b4cb-f85e-b6537c7c3c91",
    "vmCustomParams": [
      {
        "id": "3bebdbd3-712c-4315-a38e-00fd611ac319",
        "name": "wait_for_ip",
        "value": "True"
      },
      {
        "id": "4a4c713e-2ca3-48cb-9df9-19e845bb6973",
        "name": "autoload",
        "value": "True"
      },
      {
        "id": "1ab7184e-f67d-4dc3-9b38-2ec0d9e82dae",
        "name": "refresh_ip_timeout",
        "value": "600"
      },
      {
        "id": "004111ba-e11e-458f-9739-881a998eb674",
        "name": "auto_power_off",
        "value": "True"
      },
      {
        "id": "c79fd120-bfe8-4a93-8b9c-93816489311f",
        "name": "auto_delete",
        "value": "True"
      },
      {
        "id": "fd8c5615-97a4-4b5c-90e8-9fac955ff047",
        "name": "auto_power_on",
        "value": "True"
      },
      {
        "id": "e80655e1-dd88-4fc1-ba50-f47c0fb8afae",
        "name": "ip_regex",
        "value": ""
      }
    ]
  }
}
