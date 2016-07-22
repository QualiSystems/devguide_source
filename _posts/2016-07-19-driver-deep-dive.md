---
layout: page
title: Driver Deep Dive
category: tut
order:  5
---

In this section we'll take a look at some of the design principles mechanics of
Shell drivers. To get started, we should first create a Shell project to experiment with.
Once again we'll use ShellFoundry.

{% highlight bash %}
shellfoundry new driver-example --template=resource-shell-clean
cd driver_example
{% endhighlight %}

#### The driver structure

The **_src_** folder in the Shell project is the driver source code root. On some IDEs
you need to set that manually when opening the Shell project.

Every Shell driver is required to have one main driver class. This class represents
the main driver interface and is the file CloudShell introspects to get and validate
the list of commands for the Shell. Every ShellFoundry template will generate the
driver main file in the **_driver.py_** file and a main driver class with the name
**_[ShellName]Driver_**, both of which are the convention. Any public function added to
this driver will be considered a Shell command. Any private function (prefixed by Python convention
by an underscore) added to the main class will be considered an internal helper function and will be ignored by CloudShell.

The **_drivermetadata.xml_** file, also located in the _src_ directory provides additional
information on the driver functions and how CloudShell should expose and display them as CloudShell
Commands. More information about this file and how to customize CloudShell commands can be found in the
[Commands visibility and usability](/devguide/tut/getting-started.html) section.

The driver can contain additional files and folders which you can reference in your driver class.
In order to reference a file in a nested folder you need to add an  **_\_\_init\_\_.py_** file according
to Python convention so that the folder is considered a package with its own namespace.

#### Referencing other packages

A driver can also have a **_requirements.txt_** file to declare any dependencies on external packages
just like any Python package. When CloudShell creates a virtual environment to run the driver,
it will use **_pip_** to pull those requirements and prepare the environment.

The requirements file follows the normal pip rules
 and [file format](https://pip.pypa.io/en/stable/reference/pip_install/#requirements-file-format).

As the requirements are pulled each time a driver virtual environment is created, it is recommended to either
pin the external package version in the requirement file, or at least use semantic versioning
convention to limit the automatic updates to patch releases only. If you link to an external package by name only
and without any version constraints and a new version of the package with breaking changes is released, the
driver code may break as well. All Quali released drivers either pin the dependency version or specify
a range allowing patch version updated only. For example, if you look at the generated requirements file for
our project:

{% highlight python %}
cloudshell-shell-core>=2.0.0,<2.1.0
{% endhighlight %}

According to this constraint, pip will not automatically install any minor version beyond 2.0 but patch versions are allowed.

#### Returning Results

Any result returned by the Python driver command function will be considered the command result by CloudShell.
Objects will be serialized to a string if possible. Its not advisable to return complex objects that cannot be serialized
such as sessions or connections as that would most likely result in an error.

To demonstrate this, lets add a couple of functions to the driver:

{% github_sample_ref /bwillis/versioncake/989237901cb873f96df12be48cbf1239be496bd7/Appraisals %}
{% highlight ruby %}
{% github_sample /bwillis/versioncake/989237901cb873f96df12be48cbf1239be496bd7/Appraisals 0 5 %}
{% endhighlight %}


#### Cancellation and termination

#### Logging
#### Using the CloudShell API
#### Concurrency
