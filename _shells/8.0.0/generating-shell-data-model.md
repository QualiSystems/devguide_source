---
layout: page
title: Managing the Shell’s Data Model
category: tut
order:  5
comments: true
version:
    - 8.0.0
    - 7.1.0
tags:
    - data model
---
Shells often have a complex data model, which consists of multiple levels of hierarchy and many attributes. CloudShell provides a way to generate Python classes that represent the data model. These classes enable some Python IDEs (like PyCharm) to provide auto complete support to facilitate the development of the Shell’s driver.

### Generating the Shell’s data model
As you know from previous chapters, the Shell’s data model consists of the standard specifications and the extended data model, which is defined in the _shell-definition.yaml_ file. In this topic, we will explain the process of generating the _data_model.py_ file and how to use it in your driver.

Let’s start by creating a new Switch type resource based on the [Networking Shell Standard](https://github.com/QualiSystems/cloudshell-standards/blob/master/Documentation/networking_standard.md).

**To generate the Shell data model:**

1) Run the following command in your Command Line to create a new Shell project

{% highlight bash %}
shellfoundry new generating-data-model --template=gen2/networking/switch
cd data-model-example
{% endhighlight %}

The Shell project includes the _shell-definition.yaml_ file, which contains the information needed for importing the Shell’s data model according to the relevant TOSCA Shell standard.

For a detailed explanation on how to customize the Shell using TOSCA, see [Modeling Shells with TOSCA]({{site.baseurl}}/shells/modeling-the-shell.html)

2) Add the following example properties _custom_property_1_ and _custom_property_2_ to the  _shell-definition.yaml_ file:

{% highlight yaml %}
imports:
  - cloudshell_standard: cloudshell_networking_standard_4_0_1.yaml

node_types:

  vendor.ShellModeling:
    derived_from: cloudshell.nodes.Switch
    properties:
      custom_property_1:
        type: string
      custom_property_2:
        type: string

{% endhighlight %}


3) Save the file and make sure that the YAML format is valid. You can use online tools such as [yamllint](http://www.yamllint.com/) to validate the format.


4) Run the following command in your Command Line to create the _data_model.py_ file:
{% highlight bash %}
shellfoundry generate
{% endhighlight %}

ShellFoundry sends the _shell-definition.yaml_ file to CloudShell and creates a new code file with the Shell’s data model - _data_model.py_, which is then copied into the project’s _src_ folder.


### Using the Shell data model
To use the Shell’s data model in the driver, we need to first import the data model into the driver.

**To use data model in the driver:**
* Add the following to _driver.py_:
{% highlight python %}
from data_model import *
{% endhighlight %}

After importing the _data_model_, PyCharm (and some other IDEs) will recognize the docstring code-hint annotations and will enable autocomplete as you can see below:

![Directory Structure]({{ site.baseurl}}/assets/auto_complete_demo.png)

The _data_model.py_ is mainly used to work with resource attributes and implement the Auto-discovery process.

For more information see the following related topics:

* [Getting Information From CloudShell]({{site.baseurl}}/shells/getting-information-from-cloudshell.html)
* [Auto Discovery For Inventory Shells]({{site.baseurl}}/shells/implementing-discovery-for-inventory-shells.html)


### Updating the Shell’s data model
After you change the Shell’s data model, by changing the custom attributes in the _shell-definition.yaml_ file or the reference to the CloudShell standard, you need to refresh the _data_model.py_ file.

**To update the data_model.py file:**
* Run again the following command in your Command Line:

{% highlight bash %}
shellfoundry generate
{% endhighlight %}
