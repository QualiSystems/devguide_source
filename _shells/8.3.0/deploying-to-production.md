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

### Adding custom attributes to the Shell<a name="SetCustomShellAttribute"></a>

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

Using the API, you can add attributes to your Shell and customize their defaults for this Shell. This is done using the `SetCustomShellAttribute` API method, available in the TestShell XML RPC and Python APIs.

The required inputs are:
* modelName = The Shell’s model [the Shell name; case-sensitive]
* attributeName = The attribute’s name [case-sensitive]
* defaultValue = The default value
* restrictedValues = [optional] Comma-separated list of possible values

In this example, we are adding an Execution Server Selector attribute named "Domain_ESS" to a Shell named "ExampleShell" with "Test NY" as the default value:

![Context Object]({{ site.baseurl }}/assets/SetCustomShellAttribute_example.png)

### Enabling Shell commands to run in offline mode

Before deploying to the production environment, it's important to make sure that your Execution Servers will be able to execute
the Shell commands, even if your CloudShell deployment is configured to run offline and can't retrieve the Shell dependencies. If this is the case, simply copy the content of the _offline_requirements_ folder to your local PyPi Server repository. For more information, see [Configuring CloudShell to Execute Python Commands in Offline Mode](http://help.quali.com/Online%20Help/8.2.0.3290/Portal/Content/Admn/Cnfgr-Pyth-Env-Wrk-Offln.htm) article.

### Deploying to the production CloudShell Server

To deploy the Shell to the production CloudShell server:

1. Log in as an administrator.
2. Open the _Admin_ menu located on the top of the page, and select _Import Package_
3. Select the Shell zip file created earlier and click _Open_ to import it.

![Context Object]({{ site.baseurl }}/assets/import_package.png){: .center-image }

Your Shell should now be ready for use in the production environment.
