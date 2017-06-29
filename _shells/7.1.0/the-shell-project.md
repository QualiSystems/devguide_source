---
layout: page
title: The Shell Project Guide
category: tut
order: 3
comments: true
version:
    - 7.1.0
---

{% assign pageUrlSplited = page.url | split: "/" %}
{% assign pageVersion = pageUrlSplited[2] %}


When starting a new Shell, the first thing you'll want to do is generate the Shell project files and directory structure.
Thankfully, this happens automatically when you use the ShellFoundry CLI tool. In this section, we'll look into the generated
files and structure and their different roles. At this stage, we'll only take a bird's eye view of the different files, folders and what they are used for. In the following sections we'll delve deeper into the specific options and format of each file and learn how to customize the driver and shell definition in CloudShell.

Let's begin by generating a new shell project. If you've previously completed the [Getting Started]({{site.baseurl}}/shells/{{pageVersion}}/getting-started.html)
tutorial you should have a reference project. If you haven't completed the initial tutorial, its recommended you do so now. Otherwise, just run the following in your command line:

{% highlight bash %} shellfoundry new linux-server-shell {% endhighlight %}

This will create a new linux_server_shell directory using the default shell template and generate some scaffolding for it. Notice that the generated project is already a valid Shell. From this point on you can further customize it or develop its driver commands but all of the basic components are there already. The suggested workflow is to use this as a baseline and continue to incrementally add functionality on top of the generated shell.

### The Shell project root
* _cloudshell_config.yml_: This file contains the address, username and password of your local development CloudShell Server.
The settings in this file are used by the Shellfoundry CLI tool to install the Shell to CloudShell using the 'shellfoundry install' command. The file structure is pretty simple:
    {% highlight yaml %}
    install:
        host: localhost
        port: 9000
        username: YOUR_USERNAME
        password: YOUR_PASSWORD
        domain: Global
    {% endhighlight %}
Notice that this file shouldn't generally be stored in a public source control index (in fact, its excluded in the auto-generated .gitignore file) as it contains your Dev CloudShell’s administrator login credentials.

* _readme.rst_: Default Shell readme file.
* _shell.yml_: Basic shell metadata such as the name of the shell, the author name/email, create date etc.
* _test_requirements.txt_: Python requirements for running the shell tests
* _version.txt_: The current shell version. You should increment the shell version in this file on each release.

### The _src_ folder

The _src_ folder contains the shell Python driver source files.

* _driver.py_: The main driver file. This file contains the functions that will be published as CloudShell commands. By default, the _driver.py_ file contains a single Python class named <shellname>Driver. You'll see it already contains some example functions.  
* _drivermetadata.xml_: This file contains metadata related to the display and behavior of the driver functions as CloudShell commands.
* _requirements.txt_: A pip requirements file used for setting up the driver virtual environment. Any dependency the shell driver has needs to be in this file.

### The _datamodel_ folder
The _datamodel_ folder contains all of the custom attributes and basic definitions about the shell type in CloudShell. These will allow users to instantiate resource instances of the shell in their inventory (if applicable) and control how these can be filtered, searched, and interacted with.

* _datamodel.xml_: This file describes the standard used for this shell, including attributes, families, models, resource structure and more.
* _shellconfig.xml_: This file defines how users can instantiate shell inventory resource instances from the web portal. It defines which attribute inputs they need to provide and whether the shell driver supports automatic discovery.
* _shell_model.xml_: This file defines the shell 'type' in CloudShell. It links it to one of the CloudShell standards and defines custom attributes.
* _metadata.xml_: You generally don't need to do anything with this file, it will be used as a part of CloudShell's internal API.

### The _docs_ and _tests_ folders

These are placeholders to place shell documentation and shell tests.
Some tests are already automatically generated in the _tests_ folder.
