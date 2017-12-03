---
layout: page
title: Deploying to Production
category: tut
comments: true
order: 12
version:
    - 8.2.0
---
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

Using the API, you can add attributes to your Shell and customize their defaults for this Shell. This is done using the `SetCustomShellAttribute` API method, available in the TestShell XML RPC and Python APIs. 

**Notes:** This only applies to attributes that already exist in CloudShell. When upgrading the Shell, these custom attributes and their association with the Shell will not be overwritten.

The required inputs are:
* modelName = The Shell’s model (the Shell name; case-sensitive)
* attributeName = The attribute’s name (case-sensitive)
* defaultValue = The default value
* restrictedValues = (optional) Comma-separated list of possible values

In this example, we are adding an Execution Server Selector attribute named "Domain_ESS" to a Shell named "ExampleShell" with "Test NY" as the default value:

![Context Object]({{ site.baseurl }}/assets/SetCustomShellAttribute_example.png)

### Configuring offline Execution Servers

Before deploying to the production environment, its important to make sure that all Execution Servers will be able to execute
the Shell commands, even if they're configured to offline access and can't retrieve the Shell dependencies.

If some of the Execution Servers in your production environment are running in offline mode, simply copy the content of the _offline_requirements_ folder to the offline repository folder. The offline repo folder is defined in the Execution Server customer.config file under _PythonOfflineRepositoryPath_. For more information on how to configure the offline Execution Server,
consult the relevant [CloudShell Documentation](http://help.qualisystems.com/Online%20Help/7.1.0.0/Portal/Content/Admn/Cnfgr-Pyth-Env.htm?Highlight=execution%20server) article.

### Deploying to the production CloudShell Server

To deploy the Shell to the production CloudShell server:

1. Log in as an administrator.
2. Open the _Admin_ menu located on the top of the page, and select _Import Package_
3. Select the Shell zip file created earlier and click _Open_ to import it.

![Context Object]({{ site.baseurl }}/assets/import_package.png){: .center-image }

Your Shell should now be ready for use in the production environment.
