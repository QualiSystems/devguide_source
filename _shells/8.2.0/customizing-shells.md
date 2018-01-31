---
layout: page
title: Customizing Shells
category: tut
order: 13
comments: true
version:
    - 8.2.0
---

{% assign pageUrlSplited = page.url | split: "/" %}
{% assign pageVersion = pageUrlSplited[2] %}

In this section, we’ll learn how to create and modify a shell’s commands and attributes.

Customizing an existing shell is done using the `shellfoundry extend` command. This command downloads the source code of the shell you wish to customize to your local machine and updates the shell’s Author. Note that extending official shells (shells that were released by Quali) will remove their official tag. 

The common use cases for customizing or extending a shell are:

* Adding new attributes
* Modifying existing attributes
* Adding new commands
* Modifying existing commands


## Customizing a shell’s commands

When customizing an official shell you can add new commands, and also modify or hide existing ones.

* **To add a new command:** Add the command in the shell’s driver.py file, and expose the command in the shell’s *drivermetadata.xml* file.

The command’s logic should be placed either in the driver itself or in a separate python package.

Modifications to a command can include adding some logic either before or after the command or changing the command logic itself. In order to do that, **copy the command code** from the original Quali python package to the shell driver or to the custom python package you created (*the command logic resides either in the vendor package or vendor-os package - for example in “cloudshell-cisco” or “cloudshell-cisco-ios”*).

When modifying an existing command, you can add optional input parameters. Just make sure that the implementation is backwards compatible. Note that adding mandatory inputs or removing one of the original inputs is not supported. In these cases, it is recommended to create an additional command with a different name, instead of modifying an existing one.

For example, this [Cisco NXOS shell](https://github.com/QualiSystemsLab/Extended-Cisco-NXOS-Shell) was extended with commands that configure VLANs on multiple ports and port channels.

It is also possible to hide or remove a command. Hiding a command is done by placing it in an “administrative” [category]({{site.baseurl}}/shells/{{pageVersion}}/customizing-driver-commands.html) in the drivermetadata.xml. Note that removing a command might affect how the shell is used since CloudShell and/or some orchestration scripts might depend on the existing driver’s commands.

When adding or modifying a command, you can leverage Quali’s shell framework to ease the development process. For details, see [Quali's Shell Framework]({{site.baseurl}}/reference/{{pageVersion}}/quali-shell-framework.html).

See some common command extension examples in [Common Driver Recipes]({{site.baseurl}}/shells/{{pageVersion}}/common-driver-recipes.html).


## Customizing a shell’s attributes

CloudShell provides two ways to customize attributes:

* **Customizing an existing shell**: Use this option when the modifications are related to a specific device but are not relevant to other shells. This is done by manually editing the shell’s *shell-definition.yaml* file.
* **Associating custom attributes with a shell that is installed in CloudShell**: Use this option when the additional attributes are deployment-related and required in multiple shells. For example, the Execution Server Selector attribute.

The second option of associating custom attributes with an already installed shell is done by calling the [SetCustomShellAttribute]({{site.baseurl}}/shells/{{pageVersion}}/deploying-to-production.html#SetCustomShellAttribute) API method. For additional information on this method, see [Deploying to Production]({{site.baseurl}}/shells/{{pageVersion}}/deploying-to-production.html). The first option currently only applies to the root model of the shell, so if you need to customize your shell’s sub-resource models, such as blades and ports, use the second option. Note that CloudShell version 9.0 will support sub-resource attribute modifications via the *shell-definition.yaml* file.

**Important:** Deleting a 2nd Gen shell’s default attributes is not supported. It is also not possible to customize a 2nd Gen shell’s data model (families and models) and its structure, which is as defined in the shell standard the original shell is based on.


### Adding attributes to a shell’s model

The shell’s path can be a URL to the shell template’s zip file on GitHub or the filesystem path (prefixed by `local:./`) to the root folder of the shell. For additional information and examples, see [Shellfoundry]({{site.baseurl}}/reference/{{pageVersion}}/shellfoundry-intro.html).

**To add attributes to a shell’s root model:**

1)  Open command-line.

2) To customize a shell that resides on your local machine, make sure command-line is pointing to a different path from the original shell template’s root folder.

3) Run the following in command-line:

{% highlight bash %}shellfoundry extend <URL/path-to-shell-template>{% endhighlight %}

4) In the shell’s download folder, open the *shell-definition.yaml* file in your preferred editor.

5) Locate `node-types:`

6) Under the root level model, under `properties:`, add the following lines:

{% highlight bash %}
     <property_name>:
       type: string
       default: fast
       description: Some attribute description
       constraints:
         - valid_values: [fast, slow]
       tags: [configuration, setting, not_searchable, abstract_filter, include_in_insight, readonly_to_users, display_in_diagram, connection_attribute, read_only]
{% endhighlight %}

7) Edit their settings, as appropriate. For additional information on these settings, see the CloudShell online help.

|  Properties        |  Description 
|  :----------------   | :----------------------------------------------------------------- |            
|  `<property_name>`     |  Replace `<property_name>` with the new attribute’s display name. _**Do not remove the colon (:) from the end of the line.**_            |
|  `type`            |   Type of attribute. Optional values: string, integer, float, boolean, cloudshell.datatypes.Password  |
|  `default`       |  Default value.                           |
|  `description`          |  Attribute's description                                   |
|  `constraints`              |  Permitted values       |
|  `tags`              |  Attribute rules. For details, see [Modeling Shells with TOSCA]({{site.baseurl}}/shells/{{pageVersion}}/modeling-the-shell.html).            |

8) Remove any unneeded lines.

9) Save the file.

10) In command-line, navigate to the shell’s root folder.

11) Package the shell.

{% highlight bash %}shellfoundry pack{% endhighlight %}

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Alternatively, package and import the shell to CloudShell:

{% highlight bash %}shellfoundry install{% endhighlight %}

### Modifying an existing attribute

This method should be used when you wish to modify an attribute that is defined in the shell’s standard. To find the attributes defined in the shell’s standard see the [documentation page](https://github.com/QualiSystems/cloudshell-standards/tree/master/Documentation) of your shell’s standard. For such attributes, you can modify the description, default values, possible values and rules. However, it is not possible to modify the attribute’s name or type.

**To modify an attribute:**

1) Download the shell template, as explained in the above section.

2) In the shell’s download folder, open the *shell-definition.yaml* file in your preferred editor.

3) Under `node-types:`, under `properties:`, add the following lines.

{% highlight bash %}
     <property_name>:
       type: string
       default: fast
       description: Some attribute description
       constraints:
         - valid_values: [fast, slow]
       tags: [configuration, setting, not_searchable, abstract_filter, include_in_insight, readonly_to_users, display_in_diagram, connection_attribute, read_only]
{% endhighlight %}


&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;For details about the tags, see [Modeling Shells with TOSCA]({{site.baseurl}}/shells/{{pageVersion}}/modeling-the-shell.html).

4) Replace `<property_name>` with the attribute’s name. _**Do not remove the colon (:) from the end of the line.**_

5) Edit the attribute’s settings.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**Note:** You cannot modify properties **type** and **name**.

6) Save the file.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The attribute is updated.

7) In command-line, navigate to the shell’s folder and package the shell.

{% highlight bash %}shellfoundry pack{% endhighlight %}

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Alternatively, package and import the shell to CloudShell:

{% highlight bash %}shellfoundry install{% endhighlight %}
