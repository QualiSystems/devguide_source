---
layout: page
title: Getting Information from CloudShell
category: tut
comments: true
order: 6
version:
    - 9.2.0
tags:
    - api
---

A typical Shell driver will first get crucial information from the sandbox and then use that information to access the device it controls. Some common information would be the address of the resource or App, attributes such as username and password, and information from other sandbox settings or components.

To provide easy access to such common information, each driver function has access to a special context object parameter, which is created by CloudShell for each driver command’s execution.

If you’ve generated the default driver template, you may have noticed that the pre-generated functions already have some docstring code-hint annotation. This allows some IDEs like PyCharm to provide autocomplete for the class properties and make it a lot easier to user.


### CloudShell Shell Core

The classes used for the command context parameters as well as other CloudShell interface classes are provided in the **cloudshell-shell-core package**, which is imported in the sample driver class.
The term _Resource_ may be a confusing one for the context object. In the CloudShell platform there are really two types of resources: a _deployed App_ is a resource that is deployed and lives inside the sandbox, whereas a _physical_ resource, or as it’s sometimes called _inventory_resource_, is a type of resource that lives in the CloudShell inventory and is pulled into blueprints and sandboxes.
Let’s take a look at the _ResourceCommandContext_ class to understand more about the information it provides:


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

### The ResourceContextDetails object

![Context Object]({{ site.baseurl}}/assets/context_object_completion.png)

#### Connectivity

The **_connectivity_** property contains information about how to connect to CloudShell, such as server address, ports, and so on. It also contains a token which can be used to log in to CloudShell API. As we’ll discuss later, it is generally recommended to use the CloudShell API as little as possible in your Shell, with the exception of a few operations, which we’ll cover later in the examples section of this guide. So while the connectivity information is readily available on the context, in most cases you should not have to use it.

#### Resource Context

The **_resource_** property contains most of the information we’ll need about the App or resource to which the Shell driver is assigned. This is the key piece of information any driver will need in order to implement commands that work with the device/App.
Let’s examine the _ResourceContextDetails_ class properties:

{% highlight python %}
context.resource.id  # (str) The identifier of the resource / service / app - consistent value that can't be changed / renamed by the user
context.resource.name   # The name of the resource/app
context.resource.fullname   # The full name of the resource, including any parent resources (relevant to inventory resources only)
context.resource.type   # (Service, App, Resource) The type can be either a Service, an App (which means a deployed App) or a Resource
context.resource.address   # The IP address of the resource / app
context.resource.model   # The resource/app model
context.resource.family = None  # The resource/app family or type classification
context.resource.description = None  # The resource/app description
context.resource.app_context = None # Infromation about the deployed app and app request to be discussed below
{% endhighlight %}

There is a lot of useful information in this object. Of special importance is the name of the resource, the address and the model. These provide the most basic details about the resource or App, and are required in order to communicate with it.



#### Connectors information

The **_connectors_** property provides information about the resource or App’s connectors (visual or network connectors) in the sandbox. The property maps to a list of Connector objects, each provides information about the source and target resource, as well as the connector’s attributes:

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

The **_reservation_** property contains information about the sandbox in which the command is running:

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

The **_resource_** property of the context object also contains the **_app_context_** property, which is relevant to deployed App and virtual machine drivers only. The **_app_context_** object has two separate JSON string properties nested under it: (1) the **_app_request_json_** property is a JSON string containing information about the app template which was requested in the blueprint, while (2) the **_deployed_app_json_** JSON contains information about the deployed application and where it’s running.

You can find JSON schema definitions of these two JSON objects here:


* [App Request JSON Schema](https://github.com/QualiSystems/cloudshell-shell-core/blob/dev/cloudshell/shell/core/schemas/app_request.json)

* [Deployed App JSON Schema](https://github.com/QualiSystems/cloudshell-shell-core/blob/dev/cloudshell/shell/core/schemas/deployed_app.json)


#### Custom Attributes and the Shell’s data model
In many cases, the Shell has specific information that is stored in attributes. For example, user credentials that are needed in order to connect to the resource. These attributes are part of the Shell’s data model. Their value can be easily retrieved by converting the _ResourceCommandContext_ to an instance of the generated Shell’s data model.

{% highlight python %}
from data_model import *

class DataModelExampleDriver (ResourceDriverInterface):

    def custom_command(self, context):
      resource = DataModelExample.create_from_context(context)
      resource.vendor = 'specify the shell vendor'
      resource.model = 'specify the shell model'
{% endhighlight %}

In this example, you can see that the code imports the generated Shell’s data_model, and then uses the _create_from_context_ function to convert the context parameter into an instance of _DataModelExample_, which is the Shell data model structure. Then, the code retrieves the attribute values by using properties such as _resource.vendor_ and _resource.model_. The properties of the Shell’s model will match the data model definition in the _shell-definition.yaml_ file.
