---
layout: page
title: "Getting Started"
category: tut
date: "2016-04-30 13:02:32 +0300"
---
### Creating your first Shell

This guide will take you through the basic steps of a creating a new Shell from scratch. We'll go through the following steps:

* Creating the shell project
* Implementing a shell resource command in the shell driver
* Installing the shell to the local CloudShell development installation
* Instantiating a shell resource in CloudShell
* Adding the shell to a blueprint and running a command on the shell in a sandbox

### Prerequisites
* Get CloudShell: Download the latest CloudShell SDK and run it on your machine.  
* **Python**: You must have [Python](https://www.python.org/downloads/) 2.7.x (latest recommended) installed on your machine.
* **IDE/Text Editor:** Any IDE or editor you'd rather use as an IDE. We recommend using PyCharm (which offers a free community edition) because of the tooling we've already created for that IDE, including a CloudShell developer plugin.
* **ShellFoundry** Install ShellFoundry using pip. Run the following command in your local shell: {% highlight bash %} pip install shellfoundry {% endhighlight %}

### Creating the Shell Project
To create the shell project, we'll take advantage of ShellFoundry, a CLI tool for generating and distributing shells. If you installed the prerequisites listed above this tool should already be installed and ready on your system.

To create a new project, simply run the following command in your local shell, which will create a new sub directory containing the basic shell project structure and files:

{% highlight bash %} shellfoundry new linux-server-shell {% endhighlight %}

Navigate to the new directory, you will see the following files have been created for you:

![Directory Structure]({{ site.url }}/devguide/assets/shell_folder.png)

The generated folder contains all of the basic scaffolding needed for the new shell. We will review the shell project structure in a more in-depth manner in later stages of this guide.

Finally, lets make sure all of the basic package requirements for the shell are satisfied. Run the following command:

'python -m pip install .\src\requirements.txt' from the root of the project directory.

### Testing the basic workflow

#### Implement say_hello

The source control for your shell is managed under the _src_ folder. The default shell project scaffolding we've just created already contains a simple example driver under this folder.

Open the file _driver.py_ in your preferred IDE/editor. You'll see it already contains some code for our shell with an example commands already in place. To implement our "say_hello", remove the example 'method_one' function and replace it with the following code:

{% highlight python %}
def say_hello(self, context, name):
    """
    :type context: cloudshell.shell.core.driver_context.ResourceCommandContext
    """
    print "hello {name} from {resource_name}".format(name=name, resource_name=context.resource.name){% endhighlight %}

We'll also want to add basic metadata like aliases and descriptions and such. The way to do that is by editing the drivermetadata.xml file located in the same folder.

Open the drivermetadata.xml file in your preferred IDE and change it contents as follows:

{% highlight xml %}

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

{% endhighlight %}

We'll sail right past explaining what each of the XML fields mean at this stage. We'll dive more deeply into the _drivermetadata.xml_ file in a later section of this guide. For now its sufficient to understand that we use this file to provide more CloudShell specific information regarding how to interpret and display the driver commands and their parameters.

Save the file. We're now ready to install the new Shell.

#### Install the shell to your local CloudShell

ShellFoundry also provides and easy and convenient way to package and install your package to your CloudShell server. To make use of this feature, you'll need to first edit the cloudshell_config.yaml file in the shell root folder with your CloudShell admin user/password and the server address.
Notice that this file should not be added to your source control obvious security reasons. If you're using git you're already covered as this configuration file is included in the automatically generated .gitingore file.

After you've edited and saved the file, run the following command from the shell root directory:

{% highlight bash %} shellfoundry install {% endhighlight %}

This will package and install your shell into your local CloudShell server.

#### Create an instance of your shell in the local CloudShell inventory

Now that we've installed our Shell, we can instantiate a shell resource in the inventory.
Open and login to your local CloudShell portal and navigate the Inventory page using the top navigation bar.

Click on the "Add New" button and instantiate a shell resource by providing a name and an address. For now, since we don't have an address of an actual server, just leave it black.  Click on "Start Discovery" to complete the operation. Later in the scope of this guide, we'll introduce the concept of Shell discovery and how to use it effectively.

#### Hello world finally

Now that we've instantiated our shell resource, we can finally add it to an environment blueprint and reserve it as a sandbox.
Navigate to the Environments page and click on "Create New" to start a new environment blueprint. Next, click on the "Add New" button and drag in the shell resource you've created in the previous step. You can then reserve the blueprint and create a new sandbox.

In the sandbox reservation diagram, select the "commands" icon from the radial menu over the shell resource.
This will open the commands side pane. Click the play button next to the "Say Hello" command to start it. Check the output panel to see the result.

#### What's next

We've successfully gone through the steps of adding a working Shell.
In the following sections we'll review of these steps in depth and review the concepts, available options and customizations and how they interface with CloudShell.
