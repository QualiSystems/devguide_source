---
layout: page
title: Setting up the Development Environment
category: set
date: "2016-04-30 13:02:32 +0300"
order: 5
comments: true
---

In this section we'll go over the recommended steps for setting up a development environment for developing CloudShell Shells and orchestration scripts.

### Get the latest Python 2.7.x
![Python]({{ site.url }}/devguide/assets/python-logo.png){:class="img-responsive"}

Download and install the latest version of Python from the [official website](https://www.python.org/downloads/).
We also recommend installing pip (even though technically its included in the latest versions of Python). Follow the instructions on this website: [https://pip.pypa.io/en/stable/installing/](https://pip.pypa.io/en/stable/installing/)

### Pick and install an IDE

In the scope of this guide we'll discuss developing shells and scripts using standard
Python, which means that there are many great options for an IDE.
Some free IDEs to consider:

* [Microsoft Visual Studio Code](https://code.visualstudio.com/)
* [JetBrains PyCharm](https://www.jetbrains.com/pycharm/)
* [GitHub Atom ](https://atom.io/)
* [Sublime Text ](https://www.sublimetext.com/)

These are all great IDEs. At this point we recommend using PyCharm simply because you'll be able to use
Quali's developer plugin developed for that IDE in the community. This plugin is not a must but will make
your life a little easier by automating some steps required to upload your driver or set it up for debugging.

### Install Git

![Git]({{ site.url }}/devguide/assets/git-logo.png){:class="img-responsive"}

Some CloudShell developer tools require Git to be installed.
Follow the installation instructions on the [official website](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).

### Install ShellFoundry (for Shells development)

To shorten the Shell development cycle and reduce much of the boilerplate of setting up new
shell projects we recommend installing the [ShellFoundry](https://github.com/QualiSystems/shellfoundry) package.
To install ShellFoundry, simply open a new shell window and type in the following:

{% highlight bash %} python -m pip install shellfoundry {% endhighlight %}

### Install and setup the CloudShell SDK

![CloudShell]({{ site.url }}/devguide/assets/cloudshell-logo.png){:class="img-responsive"}

To deploy, test and debug your automation you'll need to have a working CloudShell SDK.
The CloudShell SDK is free for developers and can be downloaded from our
[community website](http://community.quali.com/spaces/12/index.html).
Follow the instructions on the [download page](https://qualisystems-staging.cloud.answerhub.com/spaces/365/index.html) to get a local development installation of CloudShell up and running.

### (Optional) Install the CloudShell PyCharm plugin (PyCharm)

If you've selected to use PyCharm as your IDE, you can take advantage of the community contributed CloudShell plugin.
Follow the installation instructions on the [project repo](https://github.com/QualiSystemsLab/CloudShell-PyCharm-Plugin).
From the _Step-by-step installation guide_ section perform steps 1-6 only. Don't continue to configure the plugin usage further yet, we'll get to that part later in this guide.
