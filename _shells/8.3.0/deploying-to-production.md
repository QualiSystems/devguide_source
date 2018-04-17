---
layout: page
title: Deploying to Production
category: tut
comments: true
order: 12
version:
    - 8.3.0
---

{% assign pageUrlSplited = page.url | split: "/" %}
{% assign pageVersion = pageUrlSplited[2] %}

In this section we'll discuss the procedure of packaging and readying a Shell for deployment in a production environment.
This diagram, that we've visited before, illustrates the development flow for Shells:

![Context Object]({{ site.baseurl }}/assets/shell_development_workflow.png)

We'll be concentrating on the last two phases in the above diagram - creating a distributable package and deploying it to the production server.



### Creating a distributable package

To create a distributable package which can be imported to CloudShell, run the following from Command Line, make sure
you are in the root directory of the Shell project:

{% highlight bash %}
shellfoundry pack
{% endhighlight %}

This will create two artifacts in the 'dist' sub-folder of the Shell project:

1. A zip file archive called _\<shellname\>.zip_ - This is the Shell distributable package
2. A folder named _offline_requirements_ - The Python packages required by the Shell. This folder should be used with any offline execution servers, i.e. execution servers where pip will not be able to reach the internet to download the packages specified in requirements.txt

### Adding custom attributes to the Shell<a name="SetCustomShellAttributeUsingAPI"></a>

In this section, we will explain how to add an existing attribute to a specific shell. You can do this using CloudShell Portal and the API. 

CloudShell distinguishes between two types of attributes: 
* Attributes related to your CloudShell deployment, like Execution Server Selector
* Attributes related to the device or shell, like Firmware Version or Port Speed 

In this section, we will explain how to add deployment-related attributes (attributes that already exist in CloudShell). When upgrading the Shell, these custom attributes and their association with the Shell will not be overwritten. For details about adding shell or device-specific attributes, see [Customizing Shells]({{site.baseurl}}/shells/{{pageVersion}}/customizing-shells.html).

Note that deployment-related attributes are added to the shell by the CloudShell system administrator while attributes related to a device are added to the shell by the shell's developer. 

#### Using CloudShell Portal

1. Click the Shell's menu button and select **Details/Edit**. The Details/Edit Resource dialog box is displayed.

2. Click the **Add Custom Attribute** link at the bottom. A New Attribute is added to the list of attributes.

3. Select the **Attribute Name**.

4. Select the **Model Name** that will contain the attribute.

5. Optionally specify a **Default Value**.

6. (For Lookup attributes) Use the **Restricted Values** field to optionally determine the attribute's possible values in this resource.

#### Using API<a name="SetCustomShellAttributeUsingAPI"></a>

Using the API, you can add attributes to your Shell and customize their defaults for this Shell. This is done using the `SetCustomShellAttribute` API method, available in the TestShell XML RPC and CloudShell Automation API.

The required inputs are:
* modelName = The Shell’s model [the Shell name; case-sensitive]
* attributeName = The attribute’s name [case-sensitive]
* defaultValue = The default value
* restrictedValues = [optional] Comma-separated list of possible values

In this example, we are adding an Execution Server Selector attribute named "Domain_ESS" to a Shell named "ExampleShell" with "Test NY" as the default value:

![Context Object]({{ site.baseurl }}/assets/SetCustomShellAttribute_example.png)

### Enabling Shell commands to run in offline mode

Before deploying to the production environment, it’s important to make sure that Quali Server and the Execution Servers can access the python packages and files required to run the Shell commands. If these machines have an internet connection, CloudShell will automatically download the required dependencies from the public PyPi repository. However, if your CloudShell deployment is configured to run offline or your automation needs to use dependencies that are not in the public PyPi repository, you will have to manually add these dependencies to the local PyPi repository on the Quali Server machine. To do so, if you have access to the local PyPi repository, simply copy the contents of the *offline_requirements* folder to your local PyPi Server repository. If you don’t have access to the repository, you can remotely load the packages using command-line, as explained in this CloudShell Help <a href="http://help.quali.com/Online%20Help/8.3/Portal/Content/Admn/Pyth-Cnfg-Mds.htm#Loading" target="_blank">article</a>.

### Deploying to the production CloudShell Server

**To deploy the Shell to the production CloudShell server:**

1) Log in as an administrator.

2) Import the shell into CloudShell. You can use the `shellfoundry install` command-line, or import the package manually. 

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;To manually import a 2nd Gen shell, in the **Manage** dashboard, open the **Shells** page and click **Import**. 

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;For 1st Gen shells, open the **Admin** menu located at the top of the page, and select **Import Package**.

3) Select the Shell zip file created earlier and click **Open**.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;![Simple String Result]({{ site.baseurl}}/assets/Import2ndGenShellsPortal.png)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Your Shell should now be ready for use in the production environment.

### Share status

Each resource family within a shell has a share status, which it passes to its model. The share status determines whether a specific resource or sub-resource of a particular model can be used in different sandboxes at the same time. A family's share status is determined by the Locked By Default rule, which defines the family as unshared. To find out the share status of a specific family in your shell, have a look at the shell's standard. For example, the Shell Resource Standard's <a href="https://github.com/QualiSystems/cloudshell-standards/blob/master/Documentation/shell_resource_standard.md#data-model-structure" target="_blank">Data Model Structure</a> section indicates its families' settings. 
