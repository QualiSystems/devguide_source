---
layout: page
title: Auto-discovery for Inventory Shells
category: tut
order:  9
comments: true
version:
    - 9.0.0
tags:
    - discovery
    - SNMP
---

{% assign pageUrlSplited = page.url | split: "/" %}
{% assign pageVersion = pageUrlSplited[2] %}


Automated discovery makes it easy to import physical inventory devices into CloudShell by using automation to read their internal structure and attributes.


### Inventory Shells in CloudShell

Shells for physical devices are defined with a certain internal structure which can be found in their CloudShell Standard. For example, a basic physical resource can have Resource Port sub-resources, whereas a Switch can have blades and port channels according to the
[Networking Shell Standard](https://github.com/QualiSystems/cloudshell-standards/blob/master/Documentation/networking_standard.md).


### The Auto-discovery process

Auto-discovery is triggered when creating resources for Shells that support it. When the administrator creates a resource in CloudShell Portal, CloudShell prompts the administrator to fill out mandatory attributes and then launches the Auto-discovery process, querying the physical device and describing its internal structure and attributes to CloudShell.


**To implement the Auto-discovery process in a Shell:**

1.	Enable Auto-discovery in the shell-definition.yaml file
2.	Add mandatory attributes to the Auto-discovery process
3.	Implement the get_inventory function
4.	Add validations
5.	To test your code, create a resource with the template



#### Enable Auto-discovery in the shell-definition.yaml file
In the context of this example, we’ll create a new Switch type resource based on the
[Networking Shell Standard](https://github.com/QualiSystems/cloudshell-standards/blob/master/Documentation/networking_standard.md).

**To create a new Shell project:**
* Run the following command in your Command Line:
{% highlight bash %}
shellfoundry new implementing-discovery --template=gen2/networking/switch
cd implementing_discovery
{% endhighlight %}


The _shell-definition.yaml_ file includes a basic Auto-discovery template.

{% highlight yaml %}
vendor.ImplementingDiscovery:
  derived_from: cloudshell.nodes.Switch
  capabilities:
    auto_discovery_capability:
      type: cloudshell.capabilities.AutoDiscovery
      properties:
        enable_auto_discovery:
          type: boolean
          default: true
        auto_discovery_description:
          type: string
          default: Describe the auto discovery
        inventory_description:
          type: string
          default: Describe the resource shell template
{% endhighlight %}


The Auto-discovery process is described as a TOSCA capability with several properties.
*	**enable_auto_discovery** - This property defines whether the Auto-discovery process is automatically triggered when creating a new resource.
*	**auto_discovery_description** - This description is presented to the user before the Auto-discovery process begins.
*	**inventory_description** - This is the description of the Shell template. It is presented to the user when creating a new resource.


#### Add mandatory attributes to the Auto-discovery process
In many Auto-discovery implementations, we need to ask the administrator for information before communicating with the physical device, for example, to provide the administrator’s credentials. If we add custom attributes to the Auto-discovery definition of the Shell, CloudShell will prompt the administrator to fill out these attributes before running the discovery. This ensures that the information will be available for the discovery process to use.

In the context of this example, we’ll add 3 properties to the Auto-discovery process: _User_, _Password_ and _my_custom_attribute_.

The _User_ and _Password_ attributes are defined in the standard, so we only need to add them to the _auto_discovery_capability_ section. However, _my_custom_attribute_ is a specific attribute that we want to add to this Shell, so we need to add the attribute to both the properties section and the _auto_discovery_capability_ section.

{% highlight yaml %}
vendor.ImplementingDiscovery:
  derived_from: cloudshell.nodes.Switch
  properties:
    my_custom_attribute:
      type: string          # optional values: string, integer, float, boolean, cloudshell.datatypes.Password
  capabilities:
    auto_discovery_capability:
      type: cloudshell.capabilities.AutoDiscovery
      properties:
        enable_auto_discovery:
          type: boolean
          default: true
        auto_discovery_description:
          type: string
          default: Describe the auto discovery
        inventory_description:
          type: string
          default: Describe the resource shell template
        User:
          type: string
        Password:
          type: cloudshell.datatypes.Password
        my_custom_attribute:
          type: string
{% endhighlight %}



For example:

![Discovery Dialog]({{ site.baseurl}}/assets/new_resource_settings.png){:class="img-responsive"}


#### Implement the get_inventory function

The goal of the _get_inventory_ function in the Shell’s driver is to query the device and return a list of sub-resources and attribute values back to CloudShell.
After querying the device, the function should return a specific result to CloudShell to allow creating the right resources.

**To implement the get_inventory function:**

* Run the _shellfoundry generate_ command to generate the Shell’s data model.
  For more information about the Shell’s data model, see chapter [Managing the Shell Data Model]({{site.baseurl}}/shells/{{pageVersion}}/generating-shell-data-model.html)

This is an example of the _get_inventory_ implementation:

{% github_sample_ref QualiSystems/devguide_examples/blob/master/2nd%20gen%20shells%20-%20implementing_discovery/src/driver.py %}
{% highlight python %}
{% github_sample QualiSystems/devguide_examples/blob/master/2nd%20gen%20shells%20-%20implementing_discovery/src/driver.py 14 42 %}
{% endhighlight %}

This _get_inventory_ code creates an instance of the root resource by calling the _create_from_context_ function. Then, it assigns attribute values and creates a hierarchy of sub-resources.

Note that we’re only returning information about sub-resources. The root resource already exists at this stage and already has the mandatory attributes defined by the template.

This sample creates _GenericChassis_, _GenericModule_ and _GenericPort_ resource models and uses the _add_sub_resource_ function to build the resource hierarchy.


**To create the port:**

1) Create a new _GenericPort_ instance.

2) Provide a unique name for the port.

3) Add it as a sub resource of a specific module:
  a.	Call the _add_sub_resource_ function on the module.
  b.	Provide both the _relative_address_ of the port and the instance that represents the port.


To return the information back to CloudShell, we need to use a specific data structure that represents the result of the discovery. The data structure is created automatically by calling the _create_autoload_details()_ function.



#### Add validations

A common enhancement for discovery functions that greatly improves the usability of the Auto-discovery process is to validate the information provided by the administrator. For example, trying to log in with the address and credentials and reporting back any error, or checking the text for illegal characters.

Any exceptions raised in the _get_inventory_ flow will display an error message to help the administrator correct their input and try again



#### Create a resource with the template

To test the code, let’s create a resource based on the Shell template.

**To create a resource with the template:**

1) Import the Shell template using ShellFoundry.

2) Open CloudShell Portal’s **Inventory** dashboard and click the **Add New** button.
A dialog box is displayed, prompting you to select the template and enter a resource name.

3) Select the **ImplementingDiscovery** template, enter a name for the resource, and click **Create**.


The **Resource** dialog box is displayed.

![Discovery Dialog]({{ site.baseurl}}/assets/discovery_page.png){:class="img-responsive"}

4) Enter the **Username** and **Password** and click **Start discovery**.
The _get_inventory_ function creates the entire device structure and a system message pops up to indicate the discovery process completed successfully.

5) To validate, enter the name of the new resource in the **Inventory** search field.
You should see a list of sub-resources with the discovered attributes:


![Discovery Dialog]({{ site.baseurl}}/assets/inventory_search.png){:class="img-responsive"}
