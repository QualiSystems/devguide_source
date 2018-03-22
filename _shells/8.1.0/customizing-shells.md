---
layout: page
title: Customizing Shells
category: tut
order: 13
comments: true
version:
    - 8.1.0
---

{% assign pageUrlSplited = page.url | split: "/" %}
{% assign pageVersion = pageUrlSplited[2] %}

In this section, we’ll learn how to create and modify a shell’s commands and attributes.

This article addresses two flows:

* Modifying an existing shell
* Creating a new shell with modifications to the standard

Modifying an existing shell is done using the `shellfoundry extend` command. This command downloads the source code of the shell you wish to modify to your local machine and updates the shell’s Author. Note that extending official shells (shells that were released by Quali) will remove their official tag. Keep in mind that modifying a shell that is being used in CloudShell may affect any inventory resources that are based on a previous version of the shell. In the second flow, since we're creating a new shell from the appropriate shell standard, we will use the `shellfoundry new` command and modify the shell's settings.

The common use cases for customizing a shell are:

* Adding new commands
* Modifying existing commands
* Adding new attributes
* Modifying existing attributes
* Publishing attributes in a service shell
* Associating categories to a service shell

## Customizing a shell’s commands

When customizing an official shell you can add new commands, and also modify or hide existing ones.

* **To add a new command:** Add the command in the shell’s driver.py file, and expose the command in the shell’s *drivermetadata.xml* file.

The command’s logic should be placed either in the driver itself or in a separate python package.

Modifications to a command can include adding some logic either before or after the command or changing the command logic itself. In order to do that, **copy the command code** from the original Quali python package to the shell driver or to the custom python package you created (*the command logic resides either in the vendor package or vendor-os package - for example in “cloudshell-cisco” or “cloudshell-cisco-ios”*).

When modifying an existing command, you can add optional input parameters. Just make sure that the implementation is backwards compatible. Note that adding mandatory inputs or removing one of the original inputs is not supported. In these cases, it is recommended to create an additional command with a different name, instead of modifying an existing one.

For example, in this customized [Cisco NXOS shell](https://github.com/QualiSystemsLab/Extended-Cisco-NXOS-Shell), we modified the commands that configure VLANs on multiple ports and port channels.

It is also possible to hide or remove a command. Hiding a command is done by placing it in an “administrative” [category]({{site.baseurl}}/shells/{{pageVersion}}/customizing-driver-commands.html) in the drivermetadata.xml. Note that removing a command might affect how the shell is used since CloudShell and/or some orchestration scripts might depend on the existing driver’s commands.

When adding or modifying a command, you can leverage Quali’s shell framework to ease the development process. For details, see [Quali's Shell Framework]({{site.baseurl}}/reference/{{pageVersion}}/quali-shell-framework.html).

See some common command extension examples in [Common Driver Recipes]({{site.baseurl}}/shells/{{pageVersion}}/common-driver-recipes.html).<a name="attributes"></a>

## Customizing a shell’s attributes

Modification applies to attributes that are defined in the shell’s standard. To find the attributes defined in the shell’s standard, see the <a href="https://github.com/QualiSystems/cloudshell-standards/tree/master/Documentation" target="_blank">documentation page</a> of your shell’s standard. For such attributes, you can modify the description, default values, possible values and rules.

**Note:** You cannot modify attributes **type**, **name**, and any attributes that are associated with the shell’s family as this will affect other shells that use this family. The family attributes are listed in the shell's standard.

### Deployment-specific vs. shell-specific attributes

CloudShell provides two ways to customize attributes, which differ depending on the attribute's usage:

* **Customizing an existing shell**: Use this option when the attributes are related to a specific device but are not relevant to other shells. This is done by manually editing the shell’s *shell-definition.yaml* file. 
* **Associating custom attributes with a shell that is installed in CloudShell**: Use this option when the additional attributes are deployment-related and relevant to multiple resources of different shells. For example, the Execution Server Selector attribute. *Starting with CloudShell version 8.3, this option applies both to the root model of the shell and to the shell’s sub-resource models, such as blades and ports.*

The second option of associating custom attributes with an already installed shell is done either via CloudShell Portal or by calling the [SetCustomShellAttribute]({{site.baseurl}}/shells/{{pageVersion}}/deploying-to-production.html#SetCustomShellAttributeUsingAPI) API method. For additional information on this method, see [Deploying to Production]({{site.baseurl}}/shells/{{pageVersion}}/deploying-to-production.html).

**Important:** Deleting a 2nd Gen shell’s default attributes (those that come with the standard) is not supported. It is also not possible to customize a 2nd Gen shell’s data model (families and models) and its structure, which is as defined in the shell standard the original shell is based on.

### Adding or modifying attributes in a shell’s root model

This section explains how to add attributes to the shell's root model and to specific models within the shell. To learn how to expose attributes that are required for the discovery of the resource (in the **Inventory** dashboard's **Resource** discovery dialog box), see [Auto-discovery for Inventory Shells]({{site.baseurl}}/shells/{{pageVersion}}/implementing-discovery-for-inventory-shells.html).

**To add/modify a shell's attributes:**

1) Open command-line.

2) To customize a shell that resides on your local machine, make sure command-line is pointing to a different path from the original shell template’s root folder.

3) Run the appropriate command in command-line:

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**To modify a shell:**
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{% highlight bash %}shellfoundry extend <URL/path-to-shell-template>{% endhighlight %}

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The shell’s path can be a URL to the shell template’s zip file on GitHub or the filesystem path (prefixed by `local:./`) to the root folder of the shell. For additional information and examples, see [Shellfoundry]({{site.baseurl}}/reference/{{pageVersion}}/shellfoundry-intro.html).

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**To create a new shell based on a specific shell standard:**
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{% highlight bash %}shellfoundry new <Shell-name> --template <template>{% endhighlight %}

4) In the shell’s download folder, open the *shell-definition.yaml* file in your preferred editor.

5) Update the `template version`.

6) Locate `node-types:`.

7) Under the root level model, add the following lines:

{% highlight yaml %}
properties:
  my_property:
    type: string
    default: fast
    description: Some attribute description
    constraints:
      - valid_values: [fast, slow]
    tags: [configuration, setting, not_searchable, abstract_filter, include_in_insight, readonly_to_users, display_in_diagram, connection_attribute, read_only]
{% endhighlight %}

8) Edit their settings, as appropriate. For additional information on these settings, see the CloudShell online help.

|  &nbsp;&nbsp;&nbsp;Properties        |  Description 
|  :-------------------   | :----------------------------------------------------------------- |            
|  &nbsp;&nbsp;&nbsp;`properties`         |  Header for the shell's attributes. Needs to be added only once.
|  &nbsp;&nbsp;&nbsp;`<property_name>`&nbsp;&nbsp;&nbsp;    |  (Relevant when adding an attribute) Replace `my_property` with the new attribute’s display name. For example: "My new attribute:". **Do not remove the colon (:) from the end of the line.**         |
|  &nbsp;&nbsp;&nbsp;`type`            |   (Relevant when adding an attribute) Type of attribute. Optional values: string, integer, float, boolean, cloudshell.datatypes.Password  |
|  &nbsp;&nbsp;&nbsp;`default`       |  Default value.                           |
|  &nbsp;&nbsp;&nbsp;`description`          |  Attribute's description                                   |
|  &nbsp;&nbsp;&nbsp;`constraints`              |  Permitted values       |
|  &nbsp;&nbsp;&nbsp;`tags`              |  Attribute rules. For details, see [Modeling Shells with TOSCA]({{site.baseurl}}/shells/{{pageVersion}}/modeling-the-shell.html). Note that for service shells, the only applicable rule is `user_input`. For details, see [Publishing a service shell's attributes](#publish_attributes).           |

9) Remove any unneeded lines.

10) Save the file.

11) In command-line, navigate to the shell’s root folder.

12) Package the shell.

{% highlight bash %}shellfoundry pack{% endhighlight %}

13) Import the shell into CloudShell. 

**Important:** If a previous version of the shell already exists in CloudShell, upgrade the existing shell with the new one in CloudShell Portal's **Shells** management page. This capability is available for 2nd Gen shells.

## Customizing a service shell

Customizing a service shell’s commands is the same as for resource shells, while customizing attributes largely follows the same procedure. The only difference is in how you publish a service’s attribute and associate a service shell to service categories.<a name="publish_attributes"></a>

### Publishing a service shell's attributes

Publishing an attribute displays that attribute in the service's settings dialog box when a CloudShell user adds or edits a service in a blueprint or sandbox diagram.

**To publish a service shell's attribute:**

1) Add or modify an existing attribute as explained in the [Customizing a Shell's attributes]() section above.

2) If you want the service’s attribute to be exposed in the blueprint and sandbox, replace the tags line with the following:

{% highlight yaml %}
    tags: [user_input]
{% endhighlight %}

3) Save the *shell-definition.yaml* file, package and import the shell into CloudShell.

### Associating categories to a service shell

This procedure explains how to add service categories to a 2nd Gen service Shell. Service categories appear in the services catalog and are used to expose services in specific domains in CloudShell. This is done by associating a service category, which is linked to specific domains, to a service shell.

**To associate service categories to a service shell:**

1) Open command-line.

2) To customize a shell that resides on your local machine, make sure command-line is pointing to a different path from the original shell template’s root folder.

3) Run the appropriate command in command-line:

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**To modify a shell:**

{% highlight bash %}
shellfoundry extend <URL/path-to-shell-template>
{% endhighlight %}

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The shell’s path can be a URL to the shell template’s zip file on GitHub or the filesystem path (prefixed by local:./) to the root folder of the shell. For additional information and examples, see [Shellfoundry]({{site.baseurl}}/reference/{{pageVersion}}/shellfoundry-intro.html).

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**To create a new shell based on a specific shell standard:**

{% highlight bash %}
shellfoundry new <Shell-name> --template <template>
{% endhighlight %}

4) In the shell’s download folder, open the `shell-definition.yaml` file in your preferred editor.

5) Update the template version.

6) Under `node-types:`, locate `properties:`, and add the following lines underneath:

{% highlight yaml %}
Service Categories:
  type: list
  default: [My Category 1, My Category 2]  
{% endhighlight %}

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**Note:** The `properties:` line needs to be added only once, so do not add it if it already exists uncommented in the *shell-definition.yaml*.

7) Specify the categories in the `default:` line (comma-separated list).

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The shell’s categories will be added to the Global domain, even if CloudShell already includes categories with the same name in other domains.

8) Package and import the shell into CloudShell.

9) To make the service available in other domains, in CloudShell Portal’s **Categories** management page, add those domains to the service’s categories.