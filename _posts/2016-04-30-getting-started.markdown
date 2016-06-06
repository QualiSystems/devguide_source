---
layout: page
title: "Getting Started"
category: tut
date: "2016-04-30 13:02:32 +0300"
---
## Creating your first Shell

This guide will take you through the basic steps of a creating a new Shell from scratch. We'll go through the following steps:

* Creating the shell project
* Implementing a shell resource command
* Customizing the shell with additional attributes
* Packaging the distributing the shell

## Prerequisites
* Get CloudShell: Download the latest CloudShell SDK and run it on your machine.  
* **Python**: You must have [Python](https://www.python.org/downloads/) 2.7.x (latest recommended) installed on your machine.
* **IDE/Text Editor:** Any IDE or editor you'd rather use as an IDE. We recommend using PyCharm (which offers a free community edition) because of the tooling we've already created for that IDE, including a CloudShell developer plugin.
* Install ShellFoundry using pip. Run {% highlight bash %} pip install shellfoundry {% endhighlight %}

## Creating the Shell Project
To create the shell project, we'll take advantage of ShellFoundry. A CLI tool for generating and distributing shells. If you installed the prerequisites listed above this tool should already be installed and ready on your system.

To create a new project, simply run the following command in your local shell, which will create a new sub directory containing the basic shell project structure and files:

{% highlight bash %} shellfoundry new linux-server-shell {% endhighlight %}

Navigate to the new directory, you will see the following files have been created for you:

![Directory Structure]({{ site.url }}/devguide/assets/shell_folder.png)

The generated folder contains all of the basic scaffolding needed for the new shell. We will review the shell project structure in a more in-depth manner in later stages of this guide.

Finally, lets make sure all of the basic package requirements for the shell are satisfied. Run the follwing command:

'python -m pip install .\src\requirements.txt' from the root of the project directory.

## Testing the basic workflow

#### Make a minor change to the driver

The source control for your shell is managed under the _src_ folder. The generating the project template, ShellFoundry already created a driver template as well under this folder. Open the file _driver.py_ in your preferred IDE/editor. You'll see it already contains a driver for our shell with an example commands already in place. We'll soon implement our first command in this file. For now, lets just make sure everything is in working order by adding a simple 'hello world'.

Change the 'method_one' function to have the following content:
{% highlight python %}
def method_one(self, context, request):
    """
    :type context: cloudshell.shell.core.driver_context.ResourceCommandContext
    """
    print "hello from {resource_name}".format(resource_name=context.resource.name){% endhighlight %}

#### Install the shell to your local CloudShell

ShellFoundry also provides and easy and convenient way to package and install your package to your CloudShell server. To make use of this feature, you'll need to first edit the cloudshell_config.yaml file in the shell root folder with your CloudShell admin user/password and the server address.
Notice that this file should not be added to your source control obvious security reasons. If you're using git you're already covered as this configuration file is included in the automatically generated .gitingore file.

After you've edited and saved the file, run the following command from the shell root directory:

{% highlight bash %} shellfoundry install {% endhighlight %}

#### Create an instance of your shell in the local inventory

#### Hello world Finally


## A more real life example
