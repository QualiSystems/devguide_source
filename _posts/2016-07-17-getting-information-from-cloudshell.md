---
layout: page
title: Getting Information from CloudShell
category: tut
comments: true
order: 5
tags:
    - api
---
A typical Shell driver, will first get crucial information from the sandbox and then use that information
to access the device it controls. Some common information would be the resource or app's address, attributes
such as username and password, as well as other information from other sandbox settings or components.

To provide easy access to such common information, each driver function has access to a special context object parameter,
which is created by CloudShell for each driver command execution. If you've generated the default driver template,
you may have noticed that the pre-generated functions already have some docstring code-hint annotation.
This allows some IDEs like Pycharm to provide autocomplete for the class properties and make it a lot easier to user.

#### CloudShell Shell Core

The classes used for the command context parameters, as well as other interface classes CloudShell provides are provided
in the **_cloudshell-shell-core_** package which you also may have noticed is imported in the sample driver class.
The term _Resource_ may be a confusing one for the context object. In the CloudShell platform there are really two types
of resources, a _deployed app_ is a resource which is deployed and lives inside the sandbox, whereas a _physical resource_
or as its sometimes called _inventory_resource_ is a type of resource that lives in the CloudShell inventory and is pulled into
blueprints and sandboxes.
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

#### Connectivity

The **_connectivity_** property contains information about how to connect to CloudShell, information like server address, ports and so on.
It also contains a token which can be used to log in to the CloudShell API. As we'll discuss, it is generally recommended to use the CloudShell API
as little as possible in your Shell, with the exception of a few operations which we'll cover later in the examples section of this guide.
So while the connectivity information is readily available on the context, in most cases you should not have to use it.

#### Resource Context

The **_resource_** property contains most of the information you'll need about the app or resource to which your Shell driver is assigned.
This is the key pieces of information any driver will need to implement commands that work with the device/app.
Lets examine the _ResourceContextDetails_ class properties:

{% highlight python %}
context.resource.id  # (str) The identifier of the resource / service / app - consistent value that can't be changed / renamed by the user
context.resource.name   # The name of the resource/app
context.resource.fullname   # The full name of the resource, including any parent resources (relevant to inventory resources only)
context.resource.type   # (Service, App, Resource) The type can be either a Service, an App (which means a deployed App) or a Resource
context.resource.address   # The IP address of the resource / app
context.resource.model   # The resource/app model
context.resource.family = None  # The resource/app family or type classification
context.resource.description = None  # The resource/app description
context.resource.attributes = None  # A dictionary that contains the resource attributes (name, value)
user = context.resource.attributes['User'] = # Get a specific attribute value from the dictionary
context.resource.app_context = None # Infromation about the deployed app and app request to be discussed below
{% endhighlight %}

There is a lot of useful information in this object. Of special importance is The _name_ of the resource, the _address_ and the _model_. These provide
the most basic details about the resource or app required to communicate with it. Other attributes, such as the user and password credentials, additional
interfaces and other settings will be found in _attributes_ property. The _attributes_ property is a dictionary with the keys being the attribute names
and the value being the current value.

#### Connectors information

The **_connectors_** property provides information about the resource or app's connectors (visual or network connectors) in the sandbox.
The property maps to a list of Connector objects, each provides information about the source and target resource. As
well as the connector attributes:

{% highlight python %}
for connector in context.connectors:
    connector.source  # The name of the source resource (end point)
    """:type : str"""
    connector.target  # The name of the target resource (end point)
    """:type : str"""
    connector.target_family   # The family of the target resource
    """:type : str"""
    connector.target_model   # The model of the target resource
    """:type : str"""
    connector.target_type   # The type of the target resource  (Service, App, Resource)
    """:type : str"""
    connector.target_attributes   # A dictionary with the target resource attributes (name, value)
    """:type : dict[str,str]"""
    connector.direction   # The direction of the connection: Uni, Bi
    """:type : str"""
    connector.alias  # The connection alias
    """:type : str"""
    connector.attributes   # The dictionary that includes the connection attributes (name, value)
    """:type : dict[str,str]"""
    connector.connection_type   # The type of the connection: Route, Visual Connector, Physical
    """:type : str"""
{% endhighlight %}

#### Sandbox information

The **_reservation_** property contains information about the sandbox reservation the command is running under.
class ReservationContextDetails:

{% highlight python %}
context.reservation.reservation_id
""":type : str"""
# The unique identifier of the sandbox reservation
context.reservation.environment_name  
""":type : str"""
# The name of the blueprint
context.reservation.environment_path
""":type : str"""
# The full path of the blueprint
context.reservation.domain
""":type : str"""
# The sandbox reservation CloudShell Domain        
context.reservation.description
# The sandbox reservation description
""":type : str"""
context.reservation.owner_user  
# the owner of the reservation
""":type : str"""
context.reservation.owner_email
# the email of the owner of the reservation
""":type : str"""
{% endhighlight %}

#### Additional information for apps and VMs

The resource property of the context object also contains the **_app_context_** property which is relevant to deployed app and virtual
machine drivers only. The **_app_context_** object has two separate JSON string properties nested under it: The **_app_request_json_**
property is a JSON string containing information about the app template which was requested in the blueprint. The **_deployed_app_json_**  
JSON, to the contrary, contains information about the deployed application and where its running.

You can find a JSON schema definitions of the two JSON objects here:

* [App Request JSON Schema](https://github.com/QualiSystems/cloudshell-shell-core/blob/dev/cloudshell/shell/core/schemas/app_request.json)

* [Deployed App JSON Schema](https://github.com/QualiSystems/cloudshell-shell-core/blob/dev/cloudshell/shell/core/schemas/deployed_app.json)

More information and examples about the information in this JSON and how to use it will be provided in the deployed apps driver
section of this guide.
