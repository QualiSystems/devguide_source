---
layout: page
title: Shellfoundry
category: ref
order: 8
comments: true
version:
    - 8.3.0
---

{% assign pageUrlSplited = page.url | split: "/" %}
{% assign pageVersion = pageUrlSplited[2] %}


Shellfoundry is a command-line utility that allows you to easily create, package and install Shells in CloudShell.  It allows creating basic Shells or Shells based on a common 1st or 2nd generation Shell template. 

**Note:** Shellfoundry must be installed on an online computer as creating shells from a template requires downloading the templates from the internet.


In his article:

* [Usage](#usage)
* [Version History](#version-history)


### Usage<a name="usage"></a>


#### Installation
This command installs Shellfoundry on your computer. For more information, see [Getting Started]({{site.baseurl}}/shells/{{pageVersion}}/getting-started.html).

**Syntax:**

{% highlight bash %}
pip install shellfoundry
{% endhighlight %}


#### Upgrade

If you already have shellfoundry installed on your computer, run this command to upgrade it to the latest version. For more information, see [Getting Started]({{site.baseurl}}/shells/{{pageVersion}}/getting-started.html).

**Note:** To prevent backwards compatibility issues, old versions of shellFoundry are disabled with every new shellfoundry release.

**Syntax:**

{% highlight bash %}python -m pip install shellfoundry ––upgrade{% endhighlight %}


#### Configuring CloudShell settings

(Required) This command sets the CloudShell Portal settings and user access credentials in Shellfoundry. For more information, see [Getting Started]({{site.baseurl}}/shells/{{pageVersion}}/getting-started.html).

|  Key               |  Value 
|  :----------------   | :----------------------------------------------------------------- |            
|  username          |  CloudShell username. For example: “admin”.                        |
|  domain            |  CloudShell domain. Note that for 2nd Generation Shells, the domain must be “Global”.  |
|  defaultview       |  Set the default view. Possible values are: **gen**, **gen2**, **all** and **layer1**. Default is **gen2**.                           |
|  password          |  CloudShell password (encrypted).                                   |
|  host              |  The hostname or IP address of the CloudShell Portal machine.       |
|  port              |  The port to be used for Quali API. Default is “9000”.              |

**Syntax:**

Run this command from the Shell’s root folder.

{% highlight bash %}shellfoundry config <key name> <key value>{% endhighlight %}

**Example:**

{% highlight bash %}shellfoundry config username admin{% endhighlight %}


#### Creating a Shell

This command creates a Shell that is based on the **gen2/resource** template. Use this if you want to create a Shell to customize or experiment on. For more information, see [The Shell Project Guide]({{site.baseurl}}/shells/{{pageVersion}}/the-shell-project.html).

**Syntax:**

Run this command in the Shell’s root folder.

{% highlight bash %}shellfoundry new <Shell-name>{% endhighlight %}

**Example:**

{% highlight bash %}shellfoundry new my-basic-shell{% endhighlight %}


#### Creating a Shell from a template

This command creates a Shell that features the template’s settings, attributes and driver. For more information, see [Modeling Shells with TOSCA]({{site.baseurl}}/shells/{{pageVersion}}/modeling-the-shell.html). 

**Syntax:**

Run this command in the Shell’s root folder.

{% highlight bash %}shellfoundry new <Shell-name> --template <template>{% endhighlight %}

**Example:**

{% highlight bash %}shellfoundry new my-switch-g2 --template=gen2/networking/switch{% endhighlight %}

**Note:** This command creates a Shell that is based on the latest version of the specified template, which is supported by your CloudShell version. However, you can also create a Shell based on a different version of the template, by adding `--version <version_number>` to the command. 


#### Creating Shells from a local template

This article explains how to create Shells using a Shell template that isn’t online for some reason. For example, you want to use a Shell template you are currently developing.

**Syntax:**

Run this command from the directory that will contain the new Shell:

{% highlight bash %}shellfoundry new <new-shell-name> --template local:<path-to-template’s-root-folder> {% endhighlight %}

The path can be a URL to the Shell template's zip package on GitHub or the filesystem path (prefixed by `local:./`) to the extracted zip folder:

![Shell Commands]({{ site.baseurl}}/assets/download_shell_zip.png)

**Example:**
{% highlight bash %}shellfoundry new my-service-ext --template local:C:\Temp\shell-pdu-standard-master {% endhighlight %}

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The new shell is added to the path from which you ran the `shellfounfry new` command. 


#### Listing available Shell templates

This command lists the 1st and 2nd generation Shell templates you can use for your new Shell. For more information, see [Modeling Shells with TOSCA]({{site.baseurl}}/shells/{{pageVersion}}/modeling-the-shell.html).

**Syntax:**

{% highlight bash %}shellfoundry list{% endhighlight %}

To view templates of a specific type, add the appropriate flag to the command: `--gen1`, `--gen2`, `--layer1`, `--all` (lists all available templates).


#### Listing versions of a Shell template

To display a list of the versions for a given template, run the following in command-line:

{% highlight bash %}shellfoundry show <template_name>{% endhighlight %}

The versions are displayed in descending order from latest to earliest.


#### Packaging a Shell

This command packs the shell's source code, data model and configuration into a ZIP package, which can be uploaded into CloudShell. For additional information, see [Deploying to Production]({{site.baseurl}}/shells/{{pageVersion}}/deploying-to-production.html).

**Syntax:**

Run this command from the Shell’s root folder.

{% highlight bash %}shellfoundry pack{% endhighlight %}

A ZIP package is created in the Shell’s *dist* directory with the name "nutshell.zip".

**Note:** The `pack` command requires the presence of a *shell.yml* file, which is created by default in Shells created using Shellfoundry. However, if your shell was created elsewhere, make sure to add a *shell.yml* file with the following structure:

 {% highlight bash %}
 ###shell.yml

 shell:

     name: nutshell
{% endhighlight %}


#### Packaging and importing a Shell into CloudShell

This command creates a distributable zip file for the Shell and imports it into CloudShell using the CloudShell Portal and user defined by the `shellfoundry configure` command. For more information, see [Getting Started]({{site.baseurl}}/shells/{{pageVersion}}/getting-started.html).

**Syntax:**

Run this command from the Shell’s root folder.

{% highlight bash %}shellfoundry install{% endhighlight %}


#### Creating the Shell’s data model file

The shell’s data model (*data_model.py* file) consists of the standard specifications and the extended data model, which is defined in the *shell-definition.yaml* file. When creating a new Shell, you will also need to import its data model. For additional information, see [Managing the Shell’s Data Model]({{site.baseurl}}/shells/{{pageVersion}}/generating-shell-data-model.html).

**Syntax:**

Run this command from the Shell’s root folder.

{% highlight bash %} shellfoundry generate {% endhighlight %}


#### Customizing a 2nd Gen Shell

This command downloads the source code of the Shell you wish to customize to your local machine and updates the Shell’s Author with the author specified in Shellfoundry. Note that extending official Shells (Shells that were released by Quali) will remove their official tag. For more information, see [Customizing a 2nd Gen Shell]({{site.baseurl}}/shells/{{pageVersion}}/customizing-shells.html).


**Syntax:**

Run this command from the directory that will contain the new Shell:

{% highlight bash %}
shellfoundy extend <URL/path-to-Shell>
{% endhighlight %}

The path can be a URL to the Shell's source code on [Quali Community's Integrations](https://community.quali.com/integrations) page or the filesystem path (prefixed by `local:./`) to the extracted source code folder:

![Shell Commands]({{ site.baseurl}}/assets/download_shell_source_code.png)


**Examples:**

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Extending a Shell residing on GitHub:
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{% highlight bash %}
shellfoundry extend https://github.com/QualiSystems/Juniper-JunOS-Router-Shell-2G/archive/1.0.0.zip
{% endhighlight %}

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Extending a local Shell:
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{% highlight bash %}
shellfoundry extend local:C:\Temp\my-shells\JuniperJunOSRouterShell2G
{% endhighlight %}

Before extending a local Shell, make sure the Shell's destination folder is different from the original Shell's root folder.

### Version History<a name="version-history"></a>

**1.1.5 (2018-03-01)**
* Added new online template for Traffic Generator Controller Service

**1.1.4 (2018-02-21)**
* Added new 2nd Gen online template for Traffic Generator Chassis

**1.1.2 (2018-01-09)**
* Enhanced `extend` command logic

**1.1.1 (2017-11-14)**
* Added new online templates
* Added specific error message to Layer 1 Shell `pack` and `install` commands

**1.1.0 (2017-10-30)**
* Added `author` field to shellfoundry configuration
* Added `extend` command behavior
* Added verification when upgrading an official shell to unofficial

**1.0.4 (2017-08-28)**
* Fixed some inconsistencies relating to the `extend` and `new` commands, specifically around the shell name

**1.0.3 (2017-06-28)**
* `list` command aborts if there is a new major version on pypi
* Old Shellfoundry versions are NOT supported anymore. Therefore, in order to upgrade to the newest version, please run this command:
{% highlight bash %} pip install shellfoundry -U  {% endhighlight %}

**1.0.2 (2017-06-27)**
* `new` command aborts if there is a new major version on pypi

**1.0.1 (2017-06-26)**
* `new` command now conforms to CloudShell naming rules

**1.0.0 (2017-06-19)**
* `list` command now shows templates that are installable on your cloudshell
* `new` command now creates the latest version of the template that matches the standards installed on your cloudshell
* When running `new` or `list` commands, a notification is displayed if a new Shellfoundry version is available

**0.2.7 (2017-05-16)**
* Shellfoundry now packs *categories.xml*, if it exists

**0.2.6 (2017-03-14)**
* Minor bug fixes

**0.2.2 (2017-01-22)**
* **gen2/resource** is the now the default template for the `new` command instead of **gen1/resource**

**0.2.0 (2017-01-17)**
* `list` command filtering parameters have changed (legacy => **gen1**, TOSCA => **gen2**)
* Added another filtering parameter: **--layer1**
* Minimum CloudShell version column appears in the `list` command's output table
* **gen2** is now the default view for list command

**0.1.3 (2016-12-27)**
* `config` now echoes all default configurations if they have not been overridden by the user

**0.1.2 (2016-12-26)**
* `config` command now encrypts the password

**0.1.0 (2016-12-14)**
* `show` command was added to display all available versions of a template
* A new option was added to the `new` command called **--version**. It enables template versioning on Shellfoundry.

**0.0.44 (2016-12-12)**
* Fixed a bug with the `config` command, which caused Shellfoundry to crash if a config file was missing

**0.0.43 (2016-12-11)**
* `list` command is now able to filter results based on shell type (**--tosca**, **--legacy**, **--all**)

**0.0.41 (2016-12-08)**
* `config` command was added to allow setting configuration globally for all Shells in addition to local configuration

**0.0.39 (2016-10-09)**
* Pack Shell icon if specified in the *shell-definition.yml* file under `metadatatemplate_icon` for TOSCA based shells

**0.0.38 (2016-09-28)**
* Update reference to *cloudshell-rest-api 7.2.0.7* to use PUT method in update shell

**0.0.35 (2016-09-15)**
* TOSCA support was added to the `pack` and `install` commands
* `generate` command was added to generate the Shell driver's data model in Python

**0.0.32 (2016-08-10)**
* `pack` command downloads dependencies into *dist* directory
* Dependency for git was removed
* Local Shell templates are supported
* Proxy support was added for access to github

**0.0.31 (2016-08-04)**
* git prerequisite were removed. Shellfoundry now works even if git is not preinstalled

**0.0.28 (2016-07-07)**
* Bug pertaining to the installation of packages in CloudShell was fixed

**0.0.26 (2016-06-23)**
* Images copied to the *DataModel* folder (Issue #21)

**0.0.17 (2016-05-25)**
* Fixed anj error message that is displayed when `install` command fails in logging in into CloudShell

**0.0.1 (2016-05-02)**
* First release on PyPI
