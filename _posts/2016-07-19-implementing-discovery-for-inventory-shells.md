---
layout: page
title: Implementing Discovery for Inventory Shells
category: tut
order:  7
---
Automated discovery makes it easy to import physical inventory devices into CloudShell
by using automation to read their internal structure and attributes.

#### Shell sub-resources

Physical resources Shells are defined with a certain internal structure which can be
found in their CloudShell Standard. A basic physical resource can have _Resource Port_ sub-resources,
for example, whereas a _Switch_ can have blades and port channels according to the
[Networking Shell Standard](https://github.com/QualiSystems/shell-networking-standard/blob/master/spec/networking_standard.md).

In the context of this example, we'll create a new Switch type device based on the
[Networking Shell Standard](https://github.com/QualiSystems/shell-networking-standard/blob/master/spec/networking_standard.md).
Run the following command to create a new Shell project:

{% highlight bash %}
shellfoundry new implementing-discovery --template=networking/switch
cd implementing_discovery
{% endhighlight %}

#### Resource templates and discovery

Auto-discovery can be automatically triggered when adding resources for Shells that support it.
To do that, you can take advantage of the _Shell resource templates_ feature. This feature provides
a template for creating instances of resources for that Shell from the Inventory page of the CloudShell
portal. When the administrator creates a resource this way, he is first prompted to fill out any mandatory
attributes defined in the template, and then the discovery process is launched automatically.

A _resource_template_ has been generated automatically as a part of the ShellFoundry template.
The _shellconfig.xml_ file located in the _datamodel_ directory has the following content:

{% highlight xml %}
<?xml version="1.0" encoding="utf-8"?>
<ShellsConfiguration xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://schemas.qualisystems.com/ResourceManagement/ShellsConfigurationSchema.xsd">
<ResourceTemplates>
    <ResourceTemplate Name="ImplementingDiscovery" Model="ImplementingDiscovery" Driver="ImplementingDiscoveryDriver">
        <Description></Description>
        <AutoLoad Enable="false">
            <Description>Description for autoload </Description>
        </AutoLoad>
        <Attributes>
            <Attribute Name="User" Value="" />
            <Attribute Name="Password" Value="" />
        </Attributes>
    </ResourceTemplate>    
</ResourceTemplates>
</ShellsConfiguration>
{% endhighlight %}

As you can see, it currently defines two attributes as mandatory for the user to supply when creating a Shell resource.
This will mean that when the discovery process will run it can count on already having that information and be able
to login to the device with it. You can add additional attributes by adding additional _\<Attribute>_ elements under
the _\<Attributes>_ element.

For this example, we'd like discovery to also be triggered automatically when adding new resources. To change that,
set _\<AutoLoad Enable=**"true"**>_ in the XML and save the changes.

#### Implementing the get_inventory function

The goal of the _get_inventory_ function is to query the device and return a list of sub-resources
and attribute values back to CloudShell.

After querying the device, the function should return a specific result to CloudShell to allow
creating the right resources.

Add the following code to the driver:

{% github_sample_ref /QualiSystems/devguide_examples/blob/driver_deep_dive/adding_examples/implementing_discovery/src/driver.py %}
{% highlight python %}
{% github_sample /QualiSystems/devguide_examples/blob/driver_deep_dive/adding_examples/implementing_discovery/src/driver.py 31 43 %}
{% endhighlight %}

As you can see, the _get_inventory_ code creates a list of _AutoLoadResource_ objects which are the sub-resources to be
imported/synched with CloudShell. Each _AutoLoadResource_ object needs to be initialized with three parameters:

* The _name_ of the resources
* The _model_ of the resource according to the standard. The [Networking Shell Standard](https://github.com/QualiSystems/shell-networking-standard/blob/master/spec/networking_standard.md).
defines a list of possible models, among them the ones used in this example.
* The _relative_address_ of the resource. This field is also used to derive the hierarchy of the sub-resources. As you can
see in the above example, 'Chassis 1' has the address "1" whereas the resource 'Generic Module' has the address of '1/1' which
is all we need to do to indicate the module is nested under the chassis in the resource structure.

Notice that we're only returning information about sub-resources. The root resource at this stage already exists, with the
mandatory attributes defined by the template already assigned to it.

#### Adding attribute information

So far we've seen how to return information about sub-resources. We also may want to populate some of the resource attributes
at this point with values we've loaded from the device. We can update both the root resource and the sub-resources attributes,
again referencing them by their addresses which we've provided previously.

After populating the attributes information, we need to return the result object with both sub-resources and attributes:

{% github_sample_ref /QualiSystems/devguide_examples/blob/driver_deep_dive/adding_examples/implementing_discovery/src/driver.py %}
{% highlight python %}
{% github_sample /QualiSystems/devguide_examples/blob/driver_deep_dive/adding_examples/implementing_discovery/src/driver.py 45 62 %}
{% endhighlight %}

Notice that we're using an empty string ('') to refer to the root resource when setting its attribute values.

#### Adding validations

A common enhancement for discovery functions that greatly improves the process usability is to validate that the attributes
the user provided are correct. For example, trying to log in with the address and credentials and reporting back any error,
or validating the that text doesn't contain illegal characters.

Any exceptions you raise in the get_inventory flow will pop up the error message to the user so he/she can correct
their input and try again.

#### Create a resource with the template

To test our code, first install the Shell using ShellFoundry.
Next, go to the inventory page and click on the "Create New" button. A dialog will appear where you'll be asked
to select the template you wish to use and choose a resource name. Select the "ImplementingDiscovery" template, enter
a name for the resource and click create.

The following dialog will pop up:

![Discovery Dialog]({{ site.url }}/devguide/assets/discovery_page.png){:class="img-responsive"}

Enter some values for the Username/Password attributes and click start discovery. This will run the _get_inventory_ function
we've created and if everything works correctly create the entire device structure and a message should pop up indicating
the discovery processes completed successfully.

To validate, enter the name of the new resource in the inventory search box. You should see a list of sub-resources with the
discovered attributes:

![Discovery Dialog]({{ site.url }}/devguide/assets/inventory_search.png){:class="img-responsive"}
