---
layout: page
title: Creating an L1 Switch Shell
category: ref
order: 12
comments: true
version:
    - 8.2.0
---

{% assign pageUrlSplited = page.url | split: "/" %}
{% assign pageVersion = pageUrlSplited[2] %}

This article provides a high level overview of the L1 switch shell.

An L1 switch shell is provided as a self-executable application which runs on CloudShell.
It listens to the specified port and waits for a connection from CloudShell. CloudShell communicates with the shell using XML commands. The shell converts command data and calls specific methods of the `DriverCommands` class, which are associated with the command name.

These shells are based on the <a href="https://github.com/QualiSystems/shell-L1-template" target="_blank">L1 shell template</a>. Unlike 1st and 2nd generation shells, this is a special kind of shell with its own mechanism and is created a little differently.

### Creating the L1 switch shell

1) Create a new shell project:

{% highlight bash %}
$ shellfoundry new DriverName --template layer-1-switch
{% endhighlight %}

2) Create a new Python virtual environment in the project's folder. Specify the same python executable which is used by CloudShell.

{% highlight bash %}
virtualenv --python="c:\Program Files (x86)\QualiSystems\CloudShell\Server\python\2.7.10\python.exe" --always-copy .\cloudshell-L1-DriverName
{% endhighlight %}

3) Activate the project's virtualenv

{% highlight bash %}
.\cloudshell-L1-DriverName\Scripts\activate.bat
{% endhighlight %}

4) Edit and install requirements (from the new project folder):

{% highlight bash %}
$ pip install -r .\cloudshell-L1-DriverName\requirements.txt
{% endhighlight %}

5) Save your changes.

### Implementing the shell commands

1) Implement methods of the `DriverCommands` class in *<project_slug>/driver_commands.py*.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Follow the <a href="https://github.com/QualiSystems/shell-L1-template/blob/dev/DEVGUIDE.md" target="_blank">L1 shell Developer guide</a> and docstrings with description. 

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;For an example of an L1 shell with CLI usage you can refer to the <a href="https://github.com/QualiSystems/cloudshell-L1-mrv" target="_blank">cloudshel-L1-mrv</a> project. 

2) To debug the driver use the <a href="https://github.com/QualiSystems/shell-L1-template/blob/dev/DEBUGGING.md" target="_blank">L1 shell Debugging guide</a>.

3) Update the driver version and metadata in the shell's *version.txt* file.

### Installing the shell on CloudShell and compiling the driver executable

1) Copy the project's *Cloudshell-L1-DriverName* folder to the Quali Server's */Drivers* folder.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The drivers folder's path is usually "C:\Program Files (x86)\QualiSystems\CloudShell\Server\Drivers").

2) Compile the shell's exe file using your preferred bat to exe converter. For example, iExpress is provided with Windows 2000 and later. 

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Make sure you give the exe the same name as the bat file (for example, *Cloudshell-L1-DriverName.exe*) and save it to your L1 driver’s project folder.

### Testing in CloudShell

1) Use this help <a href="http://help.quali.com/Online%20Help/8.1/Portal/Content/Admn/Cnct-Ctrl-L1-Swch.htm" target="_blank">article</a> to import the shell, create a resource, set the timeout period, Autoload and configure its physical connections.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**Note:** When running Autoload (or any other shell command at a later time), the log files are created under the *~Server\Logs* folder

2) Build a blueprint with 2 resources and a route.

3) Reserve this blueprint and connect the route.