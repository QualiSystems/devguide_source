---
layout: page
title: "Getting Started with Cloud Providers"
order: 1
comments: true
version:
    - 9.0.0
---

{% assign pageUrlSplited = page.url | split: "/" %}
{% assign pageVersion = pageUrlSplited[2] %}

In this chapter, we'll learn how to create a Cloud Provider shell. The goal is to demonstrate the end-to-end cycle, from generating a new shell project to implementing the cloud provider interface and automation processes, as well as testing the shell in CloudShell.

### What is a Cloud Provider shell?

The Cloud Provider shell standard is a project used to define a new cloud provider in CloudShell. The Cloud Provider shell is used to extend the system, allowing deployment of applications to an additional L2 or L3 cloud. The Cloud Provider Standard may also be used to implement deployment of applications as part of deployment containers.

A Cloud Provider shell may include more than one deployment type, allowing a variety of options to base the virtual instance on (for example, selecting the image from the marketplace or loading a custom one).


### How is a Cloud Provider shell created?

The basic creation and implementation process is as follows:

1) Create a new Cloud Provider shell.

2) Set up the Cloud Provider interface. In other words, implement the cloud provider driver that will be called by the server when interaction with the cloud provider is needed. 

3) If the shell requires the use of python dependencies, which aren't available in the public PyPi repository, add them to the local PyPi Server repository. See CloudShell Help's <a href="http://help.quali.com/Online%20Help/8.3/Portal/Content/Admn/Pyth-Cnfg-Mds.htm" target="_blank">PyPi Server - Managing Python Driver and Script Dependencies</a>.

4) Debug the shell.

5) In CloudShell, create a resource based on the new shell and make sure it works. 

*Before developing your shell, please watch the following video to determine whether you need to create a new shell or customize an existing one:*

<iframe width="854" height="480" src="https://www.youtube.com/embed/a8yEgOG7-bI?list=PLnWTXOESKY41iU_0InfWSkwYq7IDkv7pH" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

## Supported versions - CloudShell v9.0 and up

As of version 9.0, CloudShell supports the ability to define custom cloud providers (using the `cloud_provider` shell template), as well as the out-of-the-box cloud providers VMware vCenter, AWS EC2, Microsoft Azure and OpenStack. Note that the out-of-the-box cloud provider shells cannot be modified. 

## Prerequisites

* [Get CloudShell](http://info.quali.com/cloudshell-developer-edition-download): Download the latest CloudShell SDK and run it on your machine.  
* [Python](https://www.python.org/downloads/): Make sure Python 2.7.x (latest recommended) is installed on your machine.
* **IDE/Text Editor:** Your preferred IDE editor. We recommend using PyCharm (which offers a free community edition) because of the tooling we’ve already created for that IDE, including a CloudShell developer plugin.
* **Shellfoundry:** Shellfoundry is our CLI tool that allows you to quickly and easily generate and distribute Shells. Make sure to install it on your machine. See [Installing or Updating Shellfoundry]({{site.baseurl}}/shells/{{pageVersion}}/getting-started.html#installing-or-updating-shellfoundry) for details.
