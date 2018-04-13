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

### Adding custom attributes to the Shell<a name="SetCustomShellAttributeUsingAPI"></a>

In this section, we will explain how to add an attribute to a specific 2nd Gen shell and customize the attribute's defaults. This is done using the `SetCustomShellAttribute` API method, available in the TestShell XML RPC and CloudShell Automation API. 

CloudShell distinguishes between two types of attributes. 
* Attributes related to the device or shell, like Firmware Version or Port Speed
* Attributes related to your CloudShell deployment, like Execution Server Selector. 

Note that deployment-related attributes are added to the shell by the CloudShell system administrator while attributes related to a device are added to the shell by the shell's developer. 

**Notes:** The below configurations only apply to attributes that already exist in CloudShell. When upgrading the Shell, these custom attributes and their association with the Shell will not be overwritten.

The required inputs are:
* modelName = The Shell’s model [the Shell name; case-sensitive]
* attributeName = The attribute’s name [case-sensitive]
* defaultValue = The default value
* restrictedValues = [optional] Comma-separated list of possible values

In this example, we are adding an Execution Server Selector attribute named "Domain_ESS" to a Shell named "ExampleShell" with "Test NY" as the default value:

![Context Object]({{ site.baseurl }}/assets/SetCustomShellAttribute_example.png)

### Enabling Shell commands to run in offline mode

Before deploying to the production environment, it’s important to make sure that Quali Server and the Execution Servers can access the python packages and files required to run the Shell commands. If these machines have an internet connection, CloudShell will automatically download the required dependencies from the public PyPi repository. However, if your CloudShell deployment is configured to run offline or your automation needs to use dependencies that are not in the public PyPi repository, you will have to manually add these dependencies to the local PyPi repository on the Quali Server machine. To do so, if you have access to the local PyPi repository, simply copy the contents of the *offline_requirements* folder to your local PyPi Server repository. If you don’t have access to the repository, you can remotely load the packages using command-line, as explained in this CloudShell Help <a href="http://help.quali.com/Online%20Help/8.2.0.3290/Portal/Content/Admn/Pyth-Cnfg-Mds.htm#Loading" target="_blank">article</a>.

### Deploying to the production CloudShell Server

**To deploy the Shell to the production CloudShell server:**

1) Log in as an administrator.

2) Import the shell into CloudShell. You can use the `shellfoundry install` command-line, or import the package manually. 

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;To manually import a 2nd Gen shell, in the **Manage** dashboard, open the **Shells** page and click **Import**. 

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;For 1st Gen shells, open the **Admin** menu located at the top of the page, and select **Import Package**.

3) Select the Shell zip file created earlier and click **Open**.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;![Simple String Result]({{ site.baseurl}}/assets/Import2ndGenShellsPortal.png)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Your Shell should now be ready for use in the production environment.
