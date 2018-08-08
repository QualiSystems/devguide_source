---
layout: page
title: "Extending the Shell's Data Model"
order: 7
comments: true
version:
    - 9.0.0
---

{% assign pageUrlSplited = page.url | split: "/" %}
{% assign pageVersion = pageUrlSplited[2] %}

In this article, we will learn how to add attributes to our shell or modify existing ones. 

Attributes can be added to the cloud provider shell or to the deployment path on the App template. Attributes on the shell are for general authentication/authorization purposes and for setting general configurations for the cloud provider integration, while attributes on the deployment path are typically settings that apply to the App's VM. For example, Region applies to the cloud provider shell and Image ID applies to the deployment path. We will cover deployment path attributes in the next article.

_**Notes:**_
* *You cannot modify attributes **type**, **name**, and any attributes that are associated with the shell’s family as this will affect other shells that use this family. The family attributes are listed in the shell’s standard. To find the attributes defined in the shell’s standard, see the <a href="https://github.com/QualiSystems/cloudshell-standards/tree/master/Documentation" target="_blank">documentation page</a> of your shell’s standard.*

* *CloudShell does not allow upgrading shells with deleted/modified attributes. Therefore, if you need to make an unsupported change to an attribute (for example, deleting an attribute or changing its type), you will need to remove the shell from CloudShell before you install the updated version.*

### Deployment-specific vs. shell-specific attributes

CloudShell provides two ways to customize attributes, which differ depending on the attribute's usage:

* **Customizing an existing shell**: Use this option when the attributes are related to this specific cloud provider shell but are not relevant to other shells. This is done by manually editing the shell’s *shell-definition.yaml* file. 
* **Associating custom attributes with a shell that is installed in CloudShell**: Use this option when the additional attributes are deployment-related and relevant to multiple resources of different shells. For example, the Execution Server Selector attribute.

The second option of associating custom attributes with an already installed shell is done either via CloudShell Portal or by calling the [SetCustomShellAttribute]({{site.baseurl}}/shells/{{pageVersion}}/deploying-to-production.html#SetCustomShellAttributeUsingAPI) API method.

**Important:** Deleting a 2nd Gen shell’s default attributes (those that come with the standard) is not supported. It is also not possible to customize a 2nd Gen shell’s data model (families and models) and its structure, which is as defined in the Cloud Provider Shell Standard.

### Add an attribute to the shell

Adding attributes to the shell is done in the shell's *shell-definition.yaml* file. 

Let's start by adding the **Networking Type** attribute from the standard. Attributes that are included on the shell's standard, like this attribute, need to be added to the `capabilities` section:

{% highlight yaml %}
capabilities:
auto_discovery_capability:
type: cloudshell.capabilities.AutoDiscovery
properties:
  VLAN Type:
    type: string       # supported types are: string, integer, float, boolean, cloudshell.datatypes.Password
{% endhighlight %}

Let's see how it looks on CloudShell. Install the shell:

{% highlight bash %}
shellfoundry install
{% endhighlight %}

Open CloudShell Portal, in the **Inventory** dashboard, create a resource from the shell.
The attribute is displayed:

![Resource information]({{site.baseurl}}/assets/cp-discovery-attribute.png){:class="img-responsive"}

Note that since the **VLAN Type** attribute is defined on the family, the attribute's settings (possible values in this case) are inherited from the standard itself. The attribute's name and type are required, but you can also set the attribute's default value, description, and [rules]({{site.baseurl}}/shells/{{pageVersion}}/modeling-the-shell.html#determine-the-usage-of-custom-shell-attributes) (`tags` property). For example:

{% highlight yaml %} 
properties:
  VLAN Type:
    type: string
    default: VLAN
    description: "Select the VLAN type to use - VLAN or VXLAN"
    tags: [setting, configuration]      # supported tags are: configuration, setting, search_filter, abstract_filter, include_in_insight, readonly_to_users, display_in_diagram, connection_attribute, read_only
{% endhighlight %}

However, if the attribute is not included in the shell's family, you will need to set it both in the `properties:` section, and in the `capabilities:` section’s properties. We’ll add an attribute called “my discovery attribute”.

First we'll add it to the capabilities section:

{% highlight yaml %}
capabilities:
  concurrent_execution:
    type: cloudshell.capabilities.SupportConcurrentCommands
  auto_discovery_capability:
    type: cloudshell.capabilities.AutoDiscovery
    properties:
      my discovery attribute:
        type: string
{% endhighlight %}

And then we'll add it to the `properties:` section as well (note that this section is missing, so you'll need to add it directly under the `derived_from:` line:

{% highlight yaml %}
node_types:
 vendor.resource.MyCustomClp1:
    derived_from: cloudshell.nodes.CustomCloudProvider
    properties:
      my discovery attribute:
      	type: string
{% endhighlight %}

You can also set additional settings. Since this attribute is not included on the family, you can also set possible values (`constraints` property).

For example:

{% highlight yaml %} 
properties:
  my discovery attribute:
    type: string
    default: value 3
    description: "This is my discovery attribute."
    constraints: [value 1, value 2, value 3]
    tags: [setting, configuration]
{% endhighlight %}
