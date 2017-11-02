---
layout: page
title: Customizing a 2nd Gen Shell
category: tut
order: 13
comments: true
version:
    - 8.0.0
---

{% assign pageUrlSplited = page.url | split: "/" %}
{% assign pageVersion = pageUrlSplited[2] %}

In this section, we’ll learn how to configure attributes and commands in a Shell and modify attribute rules. 

Customizing an existing Shell is done using the `shellfoundry extend` command. This command downloads the source code of the Shell you wish to customize to your local machine and updates the Shell's Author. Note that extending official Shells (Shells that were released by Quali) will remove their official tag. The common use cases for customizing or extending a Shell are:
* Adding new attributes
* Modifying existing attributes
* Adding new commands
* Modifying existing commands

CloudShell provides two ways to customize attributes:
* Customizing an existing Shell: Use this option when the modifications are related to a specific device but are not relevant to other Shells. 
This is done by manually editing the Shell’s **shell-definition.yaml** file.
* Associating custom attributes with a Shell that is installed in CloudShell: Use this option when the additional attributes are deployment-related and required in multiple Shells. For example, the Execution Server Selector attribute. 

The second option of associating custom attributes with an already installed shell is done by calling the `SetCustomShellAttribute` API method. For additional information on this method, see [Deploying to Production]({{site.baseurl}}/shells/{{pageVersion}}/deploying-to-production.html).
The first option currently only applies to the root model of the Shell, so if you need to customize your Shell’s sub-resource models, such as blades and ports, use the second option. Note that version 9.0 will support sub-resource attribute modifications via the **shell-definition.yaml** file.

Note that deleting a 2nd Gen Shell’s default attributes is not supported. It is also not possible to customize a 2nd Gen Shell's data model (families and models) and its structure, which is as defined in the relevant Shell standard the original Shell is based on.



### Adding attributes to a Shell's model

The Shell's path can be a URL to the Shell template's zip file on GitHub or the filesystem path (prefixed by `local:./`) to the root folder of the Shell. For additional information and examples, see [Shellfoundry]({{site.baseurl}}/reference/{{pageVersion}}/shellfoundry-intro.html).

**To add attributes to a Shell’s root model:**

1) Open command-line.

2) To extend a Shell that resides on your local machine, make sure command-line is pointing to a different path from the original Shell template's root folder.

3) Run the following in command-line:

{% highlight bash %}
shellfoundy extend <URL/path-to-Shell-template>
{% endhighlight %}

4) In the Shell’s download folder, open the _shell-definition.yaml_ file in your preferred editor.

5) Locate `node-types:`.

6) Under the root level model, add the following lines:

{% highlight bash %}
    properties:
     property_name:
       type: string
       default: fast
       description: Some attribute description
       constraints:
         - valid_values: [fast, slow]
       tags: [configuration, setting, not_searchable, abstract_filter, include_in_insight, readonly_to_users display_in_diagram, connection_attribute, read_only]
{% endhighlight %}
  
7) Edit their settings, as appropriate. For  additional information on these settings, see the CloudShell online help.

|  Properties        |  Description 
|  :----------------   | :----------------------------------------------------------------- |            
|  property_name     |  Attribute's name                        |
|  type            |   Type of attribute. Optional values: string, integer, float, boolean, cloudshell.datatypes.Password  |
|  default       |  Default value.                           |
|  description          |  Attribute's description                                   |
|  constraints              |  Permitted values       |
|  tags              |  Attribute rules. For details, see [Modeling Shells with TOSCA]({{site.baseurl}}/shells/{{pageVersion}}/modeling-the-shell.html).            |

8) Remove any unneeded lines.

9) Save the file.

10) In command-line, navigate to the Shell’s root folder.

11) Package the Shell.

{% highlight bash %}shellfoundry pack{% endhighlight %}

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Alternatively, package and import the Shell to CloudShell:

{% highlight bash %}shellfoundry install{% endhighlight %}




### Modifying an existing attribute

**To modify an attribute’s rules:**

1) Download the Shell template, as explained in the above section.

2) In the Shell’s download folder, open the **shell-definition.yaml** file in your preferred editor.

3) Under `node-types:`, add the following lines.

{% highlight bash %}
    properties:
     property_name:
       type: string
       default: fast
       description: Some attribute description
       constraints:
         - valid_values: [fast, slow]
       tags: [configuration, setting, not_searchable, abstract_filter, include_in_insight, readonly_to_users display_in_diagram, connection_attribute, read_only]
{% endhighlight %}

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;For details about the tags, see the [Modeling Shells with TOSCA]({{site.baseurl}}/shells/{{pageVersion}}/modeling-the-shell.html).

4) Replace `property_name` with the attribute’s name. Do not remove the colon (`:`} from the end of the line.

5) Edit the attribute's settings. 

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**Note:** You cannot modify attributes **type**, **name**, and any attributes that are associated with the Shell's family as this will affect other Shells that use this family.

6) Save the file.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The attribute is updated.

7) In command-line, navigate to the Shell's folder and package the Shell.

{% highlight bash %}shellfoundry pack{% endhighlight %}

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Alternatively, package and import the Shell to CloudShell:

{% highlight bash %}shellfoundry install{% endhighlight %}