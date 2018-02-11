---
layout: page
title: Debugging Shell Driver Commands
category: tut
comments: true
order:  11
version:
    - 8.3.0
---

{% assign pageUrlSplited = page.url | split: "/" %}
{% assign pageVersion = pageUrlSplited[2] %}


As a part of developing the Shell driver you'll probably need to debug it in order to
troubleshoot issues or get actual results from the app/device to understand how the code behaves.
In order to help with this process, CloudShell provides debugging capabilities that you can
use to attach to the driver process and debug it step by step.

#### Prerequisites

1. Install [JetBrains PyCharm](https://www.jetbrains.com/pycharm/) and
[CloudShell's Pycharm plugin](https://github.com/QualiSystemsLab/CloudShell-PyCharm-Plugin).

2. Have a CloudShell SDK developer edition set up. Have an execution server running on the same machine as your IDE.

#### Setting up

To test the debugging capabilities, create a new Shell project using ShellFoundry by running:

{% highlight bash %}
shellfoundry new debugging_example 
cd debugging_example
{% endhighlight %}

Then create an instance of the DebuggingExample resource and add it to a sandbox so we can use it for testing.
These steps are identical to the ones demonstrated in the [Getting Started]({{site.baseurl}}/shells/{{pageVersion}}/getting-started.html) section,
which you can use a reference.

#### Setting up

As part of the generated shell project, a _deployment.xml_ file has been automatically created.
The _deployment.xml_ file contains the mappings required for the PyCharm plugin to know where the source code is,
what is the main driver class, what are the CloudShell credentials etc. Much of that information was automatically configured
when we created the project using ShellFoundry.

There are a few things you do need to configure in order to use the plugin, mainly the CloudShell development server
address and credentials. Fill in the following information in the XML file:

{% highlight xml %}
<!-- The address of the Quali server on which to deploy, mandatory -->
<serverRootAddress>serverlocation</serverRootAddress>

<!-- The port of the Quali server on which to deploy, defaults to "8029" -->
<port>8029</port>
<!-- The server admin username, password and domain to use when deploying -->
<username>user</username>
<password>password</password>
<domain>domain</domain>
{% endhighlight %}

#### Debugging

One of the problems with debugging Python code is that some IDEs such as PyCharm require the script file code the python is running
to be the same file in the same location as the file open in your IDE. When CloudShell is running the driver code it actually
runs the version of the code that's been uploaded to CloudShell on the execution server virtual environment.
To solve this issue, you can set the _runFromLocalProject_ attribute of the _\<Driver>_ element to 'true'. This will change
how CloudShell behaves and cause it to run the same file in your IDE instead. Please be aware that this is a development only
setting and should not be used on your production environment.

{% highlight xml %}

<!-- The drivers to update, holds one or more drivers -->
<drivers>
   <!-- runFromLocalProject - Decides whether to run the driver from the current project directory for debugging purposes, defaults to "false" -->
   <!-- waitForDebugger - When `runFromLocalProject` is enabled, decides whether to wait for a debugger to attach before running any Python driver code, defaults to "false" -->
   <!-- sourceRootFolder - The folder to refer to as the project source root (if specified, the folder will be zipped and deployed instead of the whole project), defaults to the root project folder -->
    <driver runFromLocalProject="true" waitForDebugger="false" sourceRootFolder="src">
        <!-- A list of paths to the driver's files or folders relative to the project's root.
may be a path to a directory, in which case all the files and folders under the directory are added into the driver's zip file.
if the <sources> element is not specified, all the files under the project are added to the driver's zip file -->
        <sources>
             <source>src</source>
        </sources>
        <!-- the driver name of the driver to update -->
        <targetName>ModelExampleDriver</targetName>
    </driver>
</drivers>
{% endhighlight %}

Once you've set the _runFromLocalProject_ attribute to true you'll be able to use the IDE's 'Attach to Process'
feature to debug your code, set breakpoints etc.

One additional issue you may run into is that by the time you're
attaching to the Python process the command is already past the point you need to debug. In other words, the Python function
doesn't 'wait' for you to attach it. This can become critical if you need to debug the driver 'initialize' function
or some basic setup code. To help solve that problem, there is another attribute you can choose to set called 'waitForDebugger'.
Setting that attribute to true will actually cause the driver to pause after its been launched, before even running
the _initialize_ function, and wait for a debugger to attach to it.

#### Testing out debugging

First, make sure you set both 'waitForDebugger' and runFromLocalProject="true" as true in the _deployment.xml_ file.
Then, add some code to the initialize as well as to some of the sample functions in the sample driver in our project.
Once you're done, click on the 'CloudShell' icon to deploy the driver in debug mode:

![Debugging]({{ site.baseurl}}/assets/debugging_ide.png){:class="img-responsive"}

You can now run the function in CloudShell. You'll notice it seems to be 'stuck' but what's really happening behind
the scenes is that the Python process is waiting for a debugger to attach to it in order to proceed.

![Run a command]({{ site.baseurl}}/assets/command_running.png){:class="img-responsive"}

Now set up a breakpoint in the initialize or in one of the other functions and run 'Run/Attach to local process' (in PyCharm).
Select the right Python process based on the path of the virtual environment, which will contain the driver name.
Your IDE should transition to debug mode and you should be able to step over/into functions and access runtime data.

![Debugging]({{ site.baseurl}}/assets/debugging_session.png){:class="img-responsive"}
