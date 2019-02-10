---
layout: page
title: Modeling Shells with TOSCA
category: tut
comments: true
version:
    - 9.1.0
order:  4
---

{% assign pageUrlSplited = page.url | split: "/" %}
{% assign pageVersion = pageUrlSplited[2] %}


By defining how a Shell is modeled in CloudShell, we can control how it’s represented in CloudShell. If you’ve gone through the steps of the [Getting Started]({{site.baseurl}}/shells/{{pageVersion}}/getting-started.html) tutorial, you may have noticed that with little effort we’ve already managed to model a new type of entity.


In this section, we’ll take a more in-depth look at how we can customize how Shell resources or deployed Apps are presented and behave in CloudShell.

<iframe width="854" height="480" src="https://www.youtube.com/embed/fJIQvjR5_RA?list=PLnWTXOESKY41iU_0InfWSkwYq7IDkv7pH" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

### Setting the Standard
The first thing to do is to classify the Shell according to one of the CloudShell standards. CloudShell has a growing number of standards, which make it easier to create a new Shell.

To give a few examples:
* [Deployed App Shell Standard](https://github.com/QualiSystems/cloudshell-standards/blob/master/Documentation/deployed_app_standard.md)
* [Compute Shell Standard](https://github.com/QualiSystems/cloudshell-standards/blob/master/Documentation/compute_standard.md)
* [Networking Shell Standard](https://github.com/QualiSystems/cloudshell-standards/blob/master/Documentation/networking_standard.md)
* [Firewall Shell Standard](https://github.com/QualiSystems/cloudshell-standards/blob/master/Documentation/firewall_standard.md)
* [Custom Service Shell Standard](https://github.com/QualiSystems/cloudshell-standards/blob/master/Documentation/Custom%20Service%20Shell%20Standard.md)

*Regarding the **Layer 1 Shell** template, please note that this is a special kind of shell with its own template and mechanism, and works differently from 1st and 2nd Gen shells. For more information, see [Creating an L1 Switch Shell]({{site.baseurl}}/reference/{{pageVersion}}/L1-switch-shell.html).*

**To get a list of the possible templates:**
* Run the following command in your Command Line:
{% highlight bash %}
shellfoundry list
{% endhighlight %}

For this example, we’ll use the _gen2/resource_ template, which is an implementation of the Shell’s basic standard, a generic standard for any standalone Shell.

**To create a new Shell from the template:**
* Run the following command in your Command Line:
{% highlight bash %}
shellfoundry new custom-data-model --template gen2/resource
cd custom-data-model
{% endhighlight %}


In previous examples we generated a Shell package that can be installed in CloudShell. This time, we’ll take a look at some of the important settings of the Shell’s model and demonstrate how it can be customized.



### TOSCA Modeling
CloudShell’s 2nd Gen Shells are modeled with TOSCA, an open standard for designing and modeling cloud-based services. To develop a Shell, there is no need for an in depth understanding of TOSCA. We will introduce all the important concepts for Shell development in this topic. If you are interested in learning more about TOSCA, you can read the [TOSCA YAML Specification](http://docs.oasis-open.org/tosca/TOSCA-Simple-Profile-YAML/v1.0/csprd01/TOSCA-Simple-Profile-YAML-v1.0-csprd01.html).

Shells created using ShellFoundry include the _shell-definition.yaml_ file, which holds the Shell model specifications in TOSCA format. Let’s review the structure of this file:

{% highlight yaml %}
tosca_definitions_version: tosca_simple_yaml_1_0


imports:
  - cloudshell_standard: cloudshell_resource_standard_1_0_0.yaml

node_types:
  vendor.switch.CustomDataModel:
    derived_from: cloudshell.nodes.GenericResource
    ...
    ...
    ...
{% endhighlight %}


This file uses a YAML format and includes several key elements:
* The first line indicates the TOSCA version. At this point CloudShell supports version 1.0.   
* The **imports** section indicates the CloudShell standard that is used. It already points to the standard of the ShellFoundry template that was used to create the Shell.
* The **node_types** section is the most important part. The Shell is modeled as a new TOSCA node that derives from the _cloudshell.nodes.GenericResource_ node. This parent node is defined in the imported CloudShell standard file and lists all the configurations that were defined in the standard.


In the following sections, we will describe how to edit the _shell-definition.yaml_ file and customize the Shell’s data model.


### The Standard Data Model
First, let’s understand which definitions the Shell inherits from the standard. The standard is not vendor-, device- or App-specific, but a general description of how Shells created from the same standard should integrate with CloudShell.

The standard defines the following elements:

* **Data model structure** - Shells can be modeled using a hierarchy of building blocks. We often call the Shell itself the ‘root’, and under it we have ‘sub-resource’. In this generic Shell example, the data model structure includes ports and power ports. If we use a switch template instead, the structure will include switch-specific elements such as chassis, modules, port groups and networking ports.

* **Attributes** - Attributes are used to store persistent information about the Shell. This information is presented to the user in CloudShell Portal and can be used in automation processes. Attributes are defined for all levels of the Shell’s hierarchy. For example, the root level has generic information like ‘vendor’, ‘model’, ‘user’ and ‘password’, and the sub-resource level may have attributes such as ‘port speed’ and ‘port description’.

* **Link to one of CloudShell standard families** - CloudShell families typically represent broad categories or roles of resources, such as Switch, Router, Compute Server and Database.

* **Driver interface** – A python class with the common functions that the Shell driver may have. For example: _init_, _save_, _restore_ etc.

To see all the details of the Resource Standard used in this example, go to: [Resource Standard Documentation](https://github.com/QualiSystems/resource-shell-standard-clean/blob/master/spec/shell_resource_standard.md).


Note that each ShellFoundry template uses its own standard and has its own documentation.


### Extending the Data model
Let’s review the complete structure of the _shell-definition.yaml_ file and see which settings can be customized:

{% highlight yaml %}
tosca_definitions_version: tosca_simple_yaml_1_0

metadata:
  template_name: CustomDataModel
  template_author: Anonymous
  template_version: 0.1.0
  template_icon: shell-icon.png

description: >
  TOSCA based resource shell

imports:
  - cloudshell_standard: cloudshell_resource_standard_1_0_0.yaml

node_types:
  vendor.switch.CustomDataModel:
    derived_from: cloudshell.nodes.GenericResource
    #properties:
    #  property_name:
    #    type: string          # optional values: string, integer, float, boolean, cloudshell.datatypes.Password
    #    default: fast
    #    description: Some attribute description
    #    constraints:
    #      - valid_values: [fast, slow]
    artifacts:
      icon:
        file: shell-icon.png
        type: tosca.artifacts.File
      driver:
        file: CustomDataModelDriver.zip
        type: tosca.artifacts.File
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



**To extend the data model:**

1.	Edit the Shell metadata
2.	Add a custom attribute to the Shell
3.	Determine the usage of custom Shell attributes
4.	Customize the Shell’s Image
5.	Add Shell Capabilities



#### Edit the Shell metadata
The TOSCA metadata element describes important information that needs to be updated.

{% highlight yaml %}
metadata:
  template_name: CustomDataModel
  template_author: Anonymous
  template_version: 0.1.0
  template_icon: shell-icon.png
{% endhighlight %}


* **template_name** is the Shell name that is displayed to the CloudShell administrator in CloudShell Portal’s **Manage** page.

* **template_author** is the developer’s name. It is recommended to edit this field.

* **template_version** defines the version number of the Shell.

* **template_icon** is the image that is displayed on the shell’s resources in CloudShell Portal.


#### Add a custom attribute to the Shell
In certain situations, we might want to extend the Shell by adding our own custom attributes. There are several common use cases for adding an attribute:

* Saving administrative information, such as custom permission groups, categories and contact person.
* Saving additional information about the device. This information can be loaded or used by the driver.

An example of adding a custom attribute is already included in the _shell-definition.yaml_ file:

{% highlight yaml %}
properties:
  my_property:
    type: string          
    default: fast
    description: Some attribute description
    constraints:
      - valid_values: [fast, slow]
{% endhighlight %}


The format is aligned with the TOSCA representation:
* **my_property**: The name of the attribute. Replace _my_property_ with the name of your custom attribute (spaces are supported).

* **type**: This is a mandatory definition. Specify the data type of the attribute: _string_, _integer_, _float_, _boolean_ or _cloudshell.datatypes.Password_.

* **default**: The default value of the attribute. If you don’t specify a default value, CloudShell will use the default value according to the data type: empty string for string attributes, ‘0’ for integers, and false for boolean attributes.

* **description**: A short explanation that will be displayed in CloudShell Portal next to the attribute.

* **valid_values**: In TOSCA, properties may have several constraints, CloudShell currently only supports _valid_values_. This definition holds a comma-separated list of values that the attribute may have. Please note that CloudShell enforces this constraint only when creating a new resource or changing existing resources. If you remove a value from a list that is already in use, some resources may still have the old value.


By modifying the _properties_ section, you can add your own custom attributes.

Let’s see how CloudShell presents the Shell inside a sandbox.

**To see the attributes in CloudShell:**

1) Add the following attribute to the _shell-definition.yaml_ file:
{% highlight yaml %}
properties:
  my_attribute:      
    type: string
    description: Some attribute description
{% endhighlight %}

2) After you add the attribute, make sure that the YAML format is kept valid. You can use online tools such as [yamllint](http://www.yamllint.com/) to validate the format.

3) Re-install the Shell by running the following command from your Command Line:
{% highlight bash %}
shellfoundry install
{% endhighlight %}

4) In the **Sandbox** workspace, hover over the Shell resource and select **Attributes**. The **Resource Attributes** pane is displayed, listing the attributes which are visible to end users on the web.

![Shell Image]({{ site.baseurl}}/assets/shell_attributes_pane.png)


#### Determine the usage of custom Shell attributes
In CloudShell, an attribute may have multiple rules that control the attribute’s visibility and behavior. These rules are specified in the tags definition.
By default, all attributes are declared with the _setting_ and _configuration_ tags, which are not visible in the template. We can override the default value as you can see in the example below.

{% highlight yaml %}
properties:
  Att1:
    type: string          
    default: fast
    tags: [setting, configuration, search_filter]
{% endhighlight %}


The available tags are:

* **setting**: This tag indicates that this attribute is a setting that can be controlled from the sandbox or defined in the blueprint by end users. Without this tag, the attribute is assigned to the resource but does not appear in the attributes pane.

* **configuration**: This tag indicates that this attribute is a resource configuration. CloudShell enables administrators to control the value of this attribute from Resource Manager Client but not from CloudShell Portal.

* **search_filter** (Inventory Resources): Users will be able to filter based on that attribute in CloudShell Portal. It’s recommended to allow the filtering of attributes, which are both constrained by a limited set of values and often used to filter resources. Omitting this tag is relevant for attributes with unique values such as serial number or _uniqueid_, since this tag enables filtering.

* **abstract_filter** (Inventory Resources): This attribute can be added to an abstract resource template.

* **include_in_insight**: This attribute’s value is saved in Insight and can be used to later create BI data for the resources linked to it.

* **readonly_to_users**: Only administrators and domain administrators in CloudShell Portal will be able to modify this attribute. Users will be able to see the attribute but not modify it.

* **display_in_diagram**: This attribute will be displayed on the component itself (in the blueprint/sandbox diagram) when using the larger icon size in the diagram.

* **connection_attribute**: This attribute will be displayed in the **Inventory** tab of the **Resource Connections** dialog box. This enables users to specify a specific attribute value (such as Speed) that will apply only to this specific route when it is connected in a sandbox.

* **read_only**: This attribute will be read only and users will not be able to modify it from CloudShell Portal.



It is recommended to only use the tags you need. Adding all attributes as search filters, for example, would cause a lot of UI clutter.


#### Customize the Shell’s Image
The Shell’s image is defined in the artifacts section, and is displayed directly on the Shell resources.

**To change the image:**

* Add your own image file to the Shell project and change the file name in the artifacts section:

{% highlight yaml %}
artifacts:
  icon:
    file: shell-icon.png
    type: tosca.artifacts.File
  driver:
    file: CustomDataModelDriver.zip
    type: tosca.artifacts.File
{% endhighlight %}



#### Optional Shell Capabilities
The Shell supports two capabilities that can be enabled, assuming the Shell's driver supports them: auto discovery and concurrent execution of commands.

The implementation of these capabilities is covered in detail in [Auto Discovery For Inventory Shells]({{site.baseurl}}/shells/{{pageVersion}}/implementing-discovery-for-inventory-shells.html) and the Driver Deep Dive article's [Drivers and concurrency]({{site.baseurl}}/shells/{{pageVersion}}/driver-deep-dive.html#drivers-and-concurrency) section.
