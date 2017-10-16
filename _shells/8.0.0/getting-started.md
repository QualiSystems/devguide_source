---
layout: page
title: "Getting Started"
date: "2016-04-30 13:02:32 +0300"
order: 1
comments: true
version:
    - 8.0.0
---

{% assign pageUrlSplited = page.url | split: "/" %}
{% assign pageVersion = pageUrlSplited[2] %}

In this section, we’ll go through the basic steps of creating a new Shell. The goal is to demonstrate the end-to-end cycle, from generating a new Shell project to instancing Shell resources and running commands in CloudShell.


### Supported versions - CloudShell v.8.0 and up
As of version 8.0, CloudShell supports 2nd Gen Shells. This guide includes instructions on developing **2nd Gen Shells only**.

For information on developing 1st Gen Shells, see [CloudShell Developer Guide](https://qualisystems.github.io/devguide_7/) CloudShell v7.1 and below.

To learn more about the  different versions of the Shells used by CloudShell and how to upgrade a 1st Gen Shell, see [Converting 1st Generation Shells]({{site.baseurl}}/shells/{{pageVersion}}/migrating_1st_gen_shells.html)



### Prerequisites
* [Get CloudShell](http://info.quali.com/cloudshell-developer-edition-download): Download the latest CloudShell SDK and run it on your machine.  
* **Python**: Make sure Python [Python](https://www.python.org/downloads/) 2.7.x (latest recommended) is installed on your machine.
* **IDE/Text Editor:** Your preferred IDE editor. We recommend using PyCharm (which offers a free community edition) because of the tooling we’ve already created for that IDE, including a CloudShell developer plugin.


### Installing or Updating Shellfoundry
To create the Shell project, we’ll use Shellfoundry, a CLI tool for generating and distributing Shells.

**To install Shellfoundry:**

* Run the following in your local Command Line:
{% highlight bash %} python -m pip install shellfoundry {% endhighlight %}

**To update Shellfoundry:**

* If ShellFoundry is already installed, run the following command to update:
{% highlight bash %} python -m pip install shellfoundry --upgrade {% endhighlight %}


### Configuring CloudShell Connection Settings
To create the Shell project, we’ll use ShellFoundry, a CLI tool for generating and distributing Shells. However, in order to use Shellfoundry, we’ll need to first configure your CloudShell connection settings in Shellfoundry.

**Note:** 2nd Generation Shells can also be imported into CloudShell Portal.

**To configure CloudShell settings:** 

1) Run the following command in your command Line to see all the available configuration parameters:
{% highlight bash %} shellfoundry config {% endhighlight %}

![Directory Structure]({{ site.baseurl}}/assets/sf_config.png)

The configuration includes some default settings that you can change.

2) To update a default setting, run the _config_ command with two arguments: the parameter name and the new value.
For example, changing the username to “John”:

{% highlight bash %} shellfoundry config username John {% endhighlight %}

 Normally, you would need to set the CloudShell admin user/password and the server address.


### Creating the Shell Project
For windows users, it is recommended to add the path to the folder in which ShellFoundry is installed to your local environment variables. For example, _C:\Python27\Scripts_. This will enable us to run the ShellFoundry commands from any folder of the Shell project.


**To create a new project:**

1) Run the following command in your local Command Line:
{% highlight bash %}
shellfoundry new linux-server-shell
cd linux-server-shell
{% endhighlight %}

A new sub folder containing the basic Shell project’s structure and files will be created.

2) Navigate to the new folder. The following files have been created for you:

![Directory Structure]({{ site.baseurl}}/assets/shell_folder.png)

The generated folder contains all of the basic scaffolding needed for the new Shell. We will review the Shell project’s structure in a more in-depth manner in later stages of this guide.

3) Run the following command from the root of the project folder
{% highlight bash %}
python -m pip install -r .\src\requirements.txt
{% endhighlight %}

This command makes sure all of the basic package requirements for the Shell are satisfied.

### Testing the basic workflow

**To test the basic workflow:**

1.	Make a minor change to the driver
2.	Install the Shell to your local CloudShell
3.	Create an instance of your Shell resource in the local CloudShell inventory
4.	‘Hello world’


#### Make a minor change to the driver

The source control for the Shell is managed under the _src_ folder. When importing the project template, ShellFoundry already created a driver template under this folder.
To make sure everything is in working order, we’ll implement an example command in the _driver.py_ file.
We’ll also want to add basic metadata including an alias and description. The way to do that is by editing the _drivermetadata.xml_ file located in the _src_ folder. For example, we can add a new command category under the _Layout_ element.


**To make changes to the driver:**

1) Open the _driver.py_ file in your preferred IDE. You’ll see that it already contains a driver for the Shell with some example commands already in place.

2) Add a simple ‘hello world’ command to the driver:

{% highlight python %}
def say_hello(self, context, name):
    """
    :param ResourceCommandContext context: the context the command runs on
    :param str name: A user parameter
    """
    return "hello {name} from {resource_name}".format(name=name, resource_name=context.resource.name){% endhighlight %}

3) Open the _drivermetadata.xml_ file in your preferred IDE and replace the highlighted section so that it matches the test below:

{% prism python linenos=3-12 %}
<Driver Description="Describe the purpose of your CloudShell shell" MainClass="driver.LinuxServerShellDriver" Name="LinuxServerShellDriver" Version="1.0.0">
    <Layout>
        <Category Name="Samples">
            <Command Description="Simple hello world function" DisplayName="Say Hello" Name="say_hello" >
                <Parameters>
                    <Parameter Name="name" Type="String" Mandatory = "True" DefaultValue="" DisplayName="Your name"
                               Description="Enter your full name here"/>
                </Parameters>
            </Command>
        </Category>
    </Layout>
</Driver>

{% endprism %}

There is no need to get into too many details at this stage. We’ll dive more deeply into the _drivermetadata.xml_ file in a later section of this guide. For now it’s sufficient to understand that we use this file to provide more CloudShell-specific information regarding how to interpret and display the driver’s commands and their parameters.


4) Save the _driver.py_ and _drivermetadata.xml_ files.

We’re now ready to install the new Shell.


#### Install the Shell on CloudShell

ShellFoundry provides an easy and convenient way to create the Shell package and install it on your CloudShell server. 

**Note:** 2nd Generation Shells can also be imported into CloudShell Portal.

* To package the Shell and install it on your local CloudShell server, run the following command:
{% highlight bash %} shellfoundry install {% endhighlight %}



#### Create an instance of your Shell resource in the local CloudShell inventory

The Shell is installed in your development CloudShell. We can now create resources of that Shell in our inventory.

1) Log in to your CloudShell Portal.

2) Click the **Inventory** menu.

3) In the **Inventory** dashboard, click **Add New**, select the **LinuxServerShell**.

4) Provide a name and an address for the shell resource, for example “HelloWorld_Shell”. For now, since we don’t have an address of an actual server, you can provide any value for the address.

5) Click **Create**.

6) Click **Start discovery** to complete the operation.


![Shell Discovery]({{ site.baseurl}}/assets/hello_world_shell.png)

#### ‘Hello world’

Now that we’ve added the Shell resource, we can finally add it to a blueprint and reserve it as a sandbox.

1) In CloudShell Portal, from the main menu, click **Lab Management > Blueprints**.

2) Create a new blueprint or open an existing one. To create a new blueprint, click the + **Create Blueprint link**.

3) Click the toolbar’s **Resource** button and drag the new Shell resource into the diagram.

4) Click **Reserve** to create a new sandbox.

5) In the **Sandbox** workspace, hover over the Shell resource and select **Commands**. The **Resource Commands** pane is displayed.

6) To run the Say Hello command, in the Resource Commands pane, click the play button next to the command.

![Shell Discovery]({{ site.baseurl }}/assets/getting_started_hello_world.png)

The common output is displayed in the **Output console**.
![Shell Discovery]({{ site.baseurl }}/assets/getting_started_hello_world_output.png)



### Development process summary

In this tutorial we’ve covered the basic steps to develop a Shell. The process is illustrated in the below diagram:

![Context Object]({{ site.baseurl }}/assets/shell_development_workflow.png)


The basic flow is:

1) Create a new Shell project by running _shellfoundry new_.

2) Configure the Shell in the _shell-definitions.yaml_ file located in the Shell project’s root folder.

3) Import the Shell to the development server using _shellfoundry install_.

4) Create a resource of the Shell for testing:
  a. For an *inventory resource* Shell: Create a Shell inventory resource in CloudShell using its *Resource Template*.
  b. For a *deployed app* Shell: Define the App template in CloudShell including the deployment type and parameters, set the App model to the Shell model.

5) 	Create a sandbox for testing in the development server: either add the inventory resource to the sandbox or deploy the App in the sandbox.

6) Make incremental changes to the Shell and update the development server each time with the changes by running _shellfoundry install_.

7) Rinse and repeat!

For more information on how to deploy the Shell to production, refer to the [Deploying to Production]({{ site.baseurl }}/shells/{{pageVersion}}/deploying-to-production.html) section.

#### What's next

We’ve successfully gone through the steps of adding a basic, working Shell. In the following sections, we’ll review all of these steps in depth as well as the concepts, available options and customizations, and see how they  interface with CloudShell.
