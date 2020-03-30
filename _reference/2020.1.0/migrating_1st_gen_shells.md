---
layout: page
title: Converting 1st Gen Shells into 2nd Gen
category: ref
order: 10
comments: true
version:
    - 2020.1.0
tags:
    - migration
    - 1st gen shells
---

{% assign pageUrlSplited = page.url | split: "/" %}
{% assign pageVersion = pageUrlSplited[2] %}

As of version 8.0, CloudShell supports 2nd Generation Shells. In this topic we’ll go through the steps needed to convert a 1st Generation Shell into a 2nd Generation Shell.


### Overview
CloudShell Shells can be thought of as either 1st Generation Shells (1st Gen) or 2nd Generation Shells (2nd Gen). Both types of Shells can coexist inside the same CloudShell sandbox, but they differ in their structure and in the way that they are managed. 

*	**1st Gen Shells** are imported as CloudShell packages that contain the data model and driver for the intended sandbox element. 1st Gen Shells allow extensive control of the family and model, and therefore are not standardized. While they allow maximal flexibility, when using them, some Shell management capabilities may not be available.

*	**2nd Gen Shells** are imported through CloudShell Portal's **Shells** management page. 2nd Gen Shells are based on standardized models and attributes, which streamlines the creation, maintenance and sharing of Shells.



### Prerequisites
Before we start, it is important to understand the requirements:

*	To convert a 1st Gen Shell you need access to the Shell’s source code.
*	You can only convert a Shell that implements the latest standard version.

It is highly recommended to first learn how to create and model a 2nd Gen Shell before trying to convert from 1st Gen. This is described in detail in previous chapters of this guide.

**To convert a 1st Gen Shell to a 2nd Gen Shell:**

1.	Create a 1st Gen Shell
2.	Create a 2nd Generation Shell
3.	Edit the Shell’s data model
4.	Convert the Driver
5.	Test the conversion



### Create a 1st Gen Shell
In the context of this example, we will create a 1st Gen Shell, enable AutoLoad and add additional custom functions.

**To prepare the 1st Gen Shell for conversion:**

1) Create a 1st Gen switch Shell by running the following command in your Command Line:

{% highlight bash %}
shellfoundry new my-switch --template gen1/networking/switch
cd my-switch
{% endhighlight %}


This Shell implements the networking standard v 4.0.1.


2) Enable the _autoload_ by updating the following line in the _shellconfig.xml_ file in the _datamodel_ folder:

{% highlight xml %}
<ShellsConfiguration xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://schemas.qualisystems.com/ResourceManagement/ShellsConfigurationSchema.xsd">
<AutoLoad Enable="true">
{% endhighlight %}

3) Replace the _get_inventory_ function in the _driver.py_ file with this sample of _get_inventory_:

{% highlight python %}
def get_inventory(self, context):
       sub_resources = [ AutoLoadResource(model ='Generic Chassis',name= 'Chassis 1', relative_address='1'),
       AutoLoadResource(model='Generic Module',name= 'Module 1',relative_address= '1/1'),
       AutoLoadResource(model='Generic Port',name= 'Port 1', relative_address='1/1/1'),
       AutoLoadResource(model='Generic Port', name='Port 2', relative_address='1/1/2'),
       AutoLoadResource(model='Generic Power Port', name='Power Port', relative_address='1/PP1')]

       attributes = [ AutoLoadAttribute(relative_address='', attribute_name='Location', attribute_value='Santa Clara Lab'),
                     AutoLoadAttribute('', 'Model', 'Catalyst 3850'),
                     AutoLoadAttribute('', 'Vendor', 'Cisco'),
                     AutoLoadAttribute('1', 'Serial Number', 'JAE053002JD'),
                     AutoLoadAttribute('1', 'Model', 'WS-X4232-GB-RJ'),
                     AutoLoadAttribute('1/1', 'Model', 'WS-X4233-GB-EJ'),
                     AutoLoadAttribute('1/1', 'Serial Number', 'RVE056702UD'),
                     AutoLoadAttribute('1/1/1', 'MAC Address', 'fe80::e10c:f055:f7f1:bb7t16'),
                     AutoLoadAttribute('1/1/1', 'IPv4 Address', '192.168.10.7'),
                     AutoLoadAttribute('1/1/2', 'MAC Address', 'te67::e40c:g755:f55y:gh7w36'),
                     AutoLoadAttribute('1/1/2', 'IPv4 Address', '192.168.10.9'),
                     AutoLoadAttribute('1/PP1', 'Model', 'WS-X4232-GB-RJ'),
                     AutoLoadAttribute('1/PP1', 'Port Description', 'Power'),
                     AutoLoadAttribute('1/PP1', 'Serial Number', 'RVE056702UD')]

       return AutoLoadDetails(sub_resources,attributes)
{% endhighlight %}


4) Add an additional function that prints the ‘vendor’ attribute value:

{% highlight python %}
def sample_command(self, context):
    """
     Restores a saved artifact previously saved by this Shell driver using the orchestration_save function
     :param ResourceCommandContext context: The context object for the command with resource and reservation info
     """
    return context.resource.attributes["Vendor"]
{% endhighlight %}



### Create a 2nd Gen Shell

To convert the Shell, we will first create a new 2nd Gen Shell that implements the same standard version. Then we can edit the data model and update the driver.

**To prepare the 2nd Gen Shell for conversion:**
* Create a 2nd Gen switch Shell by running the following in your Command Line:

{% highlight bash %}
shellfoundry new my-switch-g2 --template gen2/networking/switch
cd my-switch-g2
{% endhighlight %}

It is recommended to change the name of the Shell to enable the 1st Gen Shell and the 2nd Gen Shell to work side by side on the same CloudShell database.


### Edit the Shell’s data model

**To edit the Shell’s data model:**
* In the _shell-definition.yaml_ file, update the metadata section and make sure that the Shell imports the same CloudShell standard version as the 1st Gen shell.

{% highlight yaml %}
metadata:
  template_name: MySwitch
  template_author: Anonymous
  template_version: 0.1.0
  template_icon: shell-icon.png

description: >
 Sample TOSCA based shell

imports:
  - cloudshell_standard: cloudshell_networking_standard_4_0_1.yaml
{% endhighlight %}

*	If the Shell includes custom attributes, see [Modeling the Shell]({{site.baseurl}}/shells/{{pageVersion}}/modeling-the-shell.html) to learn how to model them in 2nd Gen Shell format.

*	If the Shell includes custom attributes in the discovery process, see [Auto Discovery For Inventory Shells]({{site.baseurl}}/shells/{{pageVersion}}/implementing-discovery-for-inventory-shells.html) to learn how to customize the Auto-discovery process.

### Convert the Driver
To convert the driver, we need to update the driver files and then update the code.

#### Updating the driver
To update the driver, we need to copy the 1st Gen driver into the 2nd Gen Shell project. However, since the name of the Shell may be different, we need to copy the files and keep all the references of the Shell’s name.

**To update the driver:**

1) In a text editor, open the 2nd Gen driver files in the **src** folder and save the lines that include references to the Shell’s name:
  * In the _drivermetadata.xml_ file, copy line #1 (_MainClass_ and _Name_)
{% highlight xml %}
<Driver Description="Describe the purpose of your CloudShell shell" MainClass="driver.MySwitchG2Driver" Name="MySwitchG2Driver" Version="1.0.0">
{% endhighlight %}

* In the _driver.py_ file, copy the _class name_
{% highlight python %}
class MySwitchG2Driver (ResourceDriverInterface):
{% endhighlight %}

2)	Replace the files in the 2nd Gen Shell’s _src_ folder with the files from the 1st Gen Shell’s _src_ folder.

3)	To ensure that the original Shell’s name is used, open the files (_drivermetadata.xml_ and _driver.py_) and replace the relevant lines with the lines we saved.


At this point, it is recommended to install the Shell and make sure that we don’t get any error message. If the installation fails, make sure that the name references match the new Shell’s name and that you copied all the driver files properly.

4) To test the modeling of the 2nd Gen Shell, run the following command in your Command Line to install the Shell:

{% highlight bash %}
shellfoundry install
{% endhighlight %}


#### Updating the Code – The Shell’s data model

To convert the 1st Gen Shell code to 2nd Gen, we need to modify it to match the 2nd Gen Shell’s data model.

**To update the driver data model code:**

1) Generate the Shell’s data model by running the following command in your Command Line:
{% highlight bash %}
shellfoundry generate
{% endhighlight %}

2) Add the following to the driver.py file to import the Shell date model into the new driver:
{% highlight python %}
from data_model import *
{% endhighlight %}

The Shell’s data model should be used in all the places in the driver where we refer to an attribute by name.
* For our example, replace the _sample_command_ with the code below.

{% github_sample_ref QualiSystems/devguide_examples/blob/master/2nd%20gen%20shells%20-%20migration/src/driver.py %}
{% highlight python %}
{% github_sample QualiSystems/devguide_examples/blob/master/2nd%20gen%20shells%20-%20migration/src/driver.py 198 201 %}
{% endhighlight %}

This code converts the _context_ object that CloudShell provides to an instance of the Shell’s data model, which is saved in the resource variable, then retrieves the value of the vendor attribute by referring to the _resource.vendor_ property.


#### Updating the code – Auto-Discovery
To simplify the conversion process, CloudShell provides a special python class that transforms 1st Gen discovery code to the 2nd Gen discovery’s structure without having to rewrite the existing code.

The class is called _LegacyUtils_ and it is automatically generated with the Shell’s data model.

The example below shows how to use the _LegacyUtils_ class:


{% github_sample_ref QualiSystems/devguide_examples/blob/master/2nd%20gen%20shells%20-%20migration/src/driver.py %}
{% highlight python %}
{% github_sample QualiSystems/devguide_examples/blob/master/2nd%20gen%20shells%20-%20migration/src/driver.py 204 229 %}
{% endhighlight %}


In this example, you can see that the code creates two arrays: _sub_resources_ and _attributes_, which are saved in the _autoload_details_ object. This 1st Gen structure is using explicit attribute names and model names in string format and needs to be transformed to 2nd Gen format.

With the _LegacyUtils().migrate_autoload_details_ method, we convert the _autoload_details_ object into a new object _migrated_details_. Then the function returns the new formatted structure by calling the _migrated_details.create_autoload_details()_ object.


{% highlight python %}
migrated_details = LegacyUtils().migrate_autoload_details(autoload_details, context)
return migrated_details.create_autoload_details()
{% endhighlight %}


By using _LegacyUtils_ we can avoid rewriting the _get_invontory_ function. However, in the long term, it is recommended to refactor the code to use the Shell’s data model, as defined in   [Auto Discovery For Inventory Shells]({{site.baseurl}}/shells/{{pageVersion}}/implementing-discovery-for-inventory-shells.html)


### Test the conversion
**To test the conversion:**

1)	Install the Shell by running the following in Command-Line:
{% highlight bash %}
shellfoundry install
{% endhighlight %}

2)	Log in as administrator to CloudShell Portal, create a Shell resource.
Make sure that the Auto-discovery successfully creates the resource with all of its sub-resources.

3)	Add the resource to a sandbox and run the _sample_command_.

4)	Check the **Output** console to see that the command successfully printed the value of the vendor attribute.


