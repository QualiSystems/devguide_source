---
layout: page
title: "Getting Started"
date: "2016-04-30 13:02:32 +0300"
order: 1
comments: true
version:
    - 7.1.0
---

{% assign pageUrlSplited = page.url | split: "/" %}
{% assign pageVersion = pageUrlSplited[2] %}

This section will take you through the basic steps of a creating a new Shell. The goal is to demonstrate the end-to-end cycle, from generating a new Shell project to instancing Shell resources and running commands in CloudShell. 

_**Before developing shells, please familiarize yourself with CloudShell by taking a course in [Quali University](http://university.quali.com). These courses also include installation instructions for the CloudShell SDK package that deploys a developer edition of CloudShell on which you can perform your training and development activities.**_

### Prerequisites
* [Get CloudShell](http://info.quali.com/cloudshell-developer-edition-download): Download the latest CloudShell SDK and run it on your machine.  
* **Python**: You must have [Python](https://www.python.org/downloads/) 2.7.x (latest recommended) installed on your machine.
* **IDE/Text Editor:** Any IDE or editor you'd rather use as an IDE. We recommend using PyCharm (which offers a free community edition) because of the tooling we've already created for that IDE, including a CloudShell developer plugin.


### Installing or Updating Shellfoundry
To create the Shell project, we’ll use ShellFoundry, a CLI tool for generating and distributing Shells.

**To install Shellfoundry:**

* Run the following in your local Command Line:
{% highlight bash %} python -m pip install shellfoundry {% endhighlight %}

**To update Shellfoundry:**

* If ShellFoundry is already installed, run the following command to update:
{% highlight bash %} python -m pip install shellfoundry --upgrade {% endhighlight %}


### Creating the Shell Project

To create a new project, simply run the following command in your local shell, which will create a new sub directory containing the basic shell project structure and files:

{% highlight bash %} shellfoundry new linux-server-shell {% endhighlight %}

Navigate to the new directory, you will see the following files have been created for you:

![Directory Structure]({{site.baseurl}}/assets/shell_folder.png)

The generated folder contains all of the basic scaffolding needed for the new shell. We will review the shell project structure in a more in-depth manner in later stages of this guide.

Finally, let's make sure all of the basic package requirements for the shell are satisfied. Run the following command
from the root of the project directory:

{% highlight bash %}
python -m pip install -r .\src\requirements.txt
{% endhighlight %}

### Testing the basic workflow

#### Make a minor change to the driver

The source control for your shell is managed under the _src_ folder. When generating the project template, ShellFoundry already created a driver template as well under this folder. Open the file _driver.py_ in your preferred IDE/editor. You'll see it already contains a driver for our shell with an example command already in place. We'll soon implement our first command in this file. For now, let's just make sure everything is in working order by adding a simple 'hello world'.

Remove the 'example_function' function and replace it with the following code:
{% highlight python %}
def say_hello(self, context, name):
    """
    :param ResourceCommandContext context: the context the command runs on
    :param str name: A user parameter
    """
    return "hello {name} from {resource_name}".format(name=name, resource_name=context.resource.name){% endhighlight %}

We'll also want to add basic metadata including aliases and descriptions. The way to do that is by
editing the drivermetadata.xml file located in the same folder.

Open the drivermetadata.xml file in your preferred IDE and replace the highlighted section so that it matches
the test below:

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

There is no need to get into too many details at this stage. We'll dive more deeply into the drivermetadata.xml file in a later section of this guide. For now its sufficient to understand that we use this file to provide more CloudShell specific information regarding how to interpret and display the driver commands and their parameters.

Save the file. We're now ready to install the new Shell.

#### Install the shell to your local CloudShell

ShellFoundry also provides and easy and convenient way to package and install your package to your CloudShell server.
To make use of this feature, you'll need to first edit the cloudshell_config.yaml file, which is located root folder
of the Shell Project. Update the file with your CloudShell admin user/password and the server address.
**Notice** that this file should not be added to your source control obvious security reasons.
If you're using git you're already covered as this configuration file is included in the automatically generated
.gitingore file.

After you've edited and saved the file, run the following command from the shell root directory:

{% highlight bash %} shellfoundry install {% endhighlight %}

This will package and install your shell into your local CloudShell server.

#### Create an instance of your shell resource in the local CloudShell inventory

The shell is installed in your development CloudShell. We can now create resources of that Shell in our
inventory.

1.	Open and login to your local CloudShell portal.
2.	In the top menu, click the Inventory dashboard.
3.	Click Add New and provide a name and an address for your shell resource. For now, since we don’t have an address of an actual server, just leave the address field blank.
4.	Click on Start Discovery to complete the operation.

![Shell Discovery]({{site.baseurl}}/assets/hello_world_shell.png)

#### Hello world finally

Now that we've instantiated our shell resource, we can finally add it to an environment blueprint and reserve it as a sandbox.

1.	In CloudShell, from the top menu,  click Lab Management>  Environments
2.	To create a new environment blueprint, click + Create Environment and then click the Create New Environment button.
3.	Click Add New and drag in the shell resource you’ve created earlier.
4.	Reserve the blueprint and create a new sandbox.
5.	In the sandbox, hover over the shell resource and from the radial menu select Commands.
The commands pane opens.
6.	To run the “Say Hello” command, in the commands pane, click the play button next to the “Say Hello” command.

The common output will appear in the environment output pane.

![Shell Discovery]({{site.baseurl}}/assets/hello_world.png)

### Development process summary

In this tutorial we've seen the basic flow involved in developing a Shell. It can be illustrated in the below diagram:

![Context Object]({{site.baseurl}}/assets/shell_development_workflow.png)

The basic flow is:

1. Create a new Shell project by running _shellfoundry new_
2. Configure your CloudShell credentials in the _cloudshell_config.yml_ file located in the Shell project root
3. Import the Shell to the development server using _shellfoundry install_
4. Create an instance of the Shell for testing

    a. For an **_inventory resource_** Shell: Create a Shell inventory resource in CloudShell using its _Resource Template_.

    b. For a **_deployed app_** Shell: Define the App template in CloudShell including the deployment type and parameters, set the App model to the Shell model.
3. Create a sandbox for testing in the development server. Either add the Shell resource to the sandbox or deploy the App in the sandbox.
4. Make incremental changes to the Shell and update the development server each time with your changes by running _shellfoundry install_
5. Rinse and repeat!

For more information on how to deploy the Shell to production, refer to the [Deploying to Production]({{site.baseurl}}/shells/{{pageVersion}}/deploying-to-production.html) section.

#### What's next

We've successfully gone through the steps of adding a working, if naive, Shell.
In the following sections we'll review all of these steps in depth and review the concepts, available options
and customizations and how they interface with CloudShell.
