---
layout: page
title: Custom Scripts
category: cf
order: 2
comments: true
version:
    - 8.0.0
---

{% assign pageUrlSplited = page.url | split: "/" %}
{% assign pageVersion = pageUrlSplited[2] %}

This article will take you through the development process of a custom script for CloudShell App deployment. CloudShell supports PowerShell scripts for Windows VMs, and bash or sh scripts for Linux VMs. When developing your script, we recommend you first simulate/debug it by running it manually on a similar machine. Once it completes successfully, you may associate it to the App.

### Examples

Here are several examples of custom scripts to help you get started. If you are new to script development, feel free to test them out.

#### Hello World

A basic script, just to make sure we’re communicating with the vm, and able to run a script. The output should be shown in the diagram output window.

{% highlight bash %}
Windows / Linux
echo “Hello World“
{% endhighlight %}<a name="CustomScriptParams"></a>

#### Parameters

A basic script that print out the parameter defined in the app template (see 2.1) or in API call (se 2.2). This is useful for debugging the script and making sure the parameter is received with the correct value. 

{% highlight bash %}
Windows
echo $env:P1
Linux
echo $P1
{% endhighlight %}

Below are examples of how to define the parameters, in the CloudShell App and when running manually using a python script.
* Specified in the app template: 
![Discovery Dialog]({{ site.baseurl}}/assets/cf-custom-script-params.png){:class="img-responsive"}
* Specified in ConfigureApps API method:

{% highlight bash %}
Python
from cloudshell.api.cloudshell_api import *

session = CloudShellAPISession('localhost', 'admin', 'admin', 'Global')
session.ConfigureApps(
    reservationId='dfb2df41-334e-4630-8bc6-ec846eb072d6',
    appConfigurations=[AppConfiguration('LinuxVmApp_9cb2-72d6', [ConfigParam('P1', 'Hello World From Here!')])],
    printOutput=True
)
{% endhighlight %}

**Note:** Since this script uses parameters defined on the App template, it will not work when run manually outside of CloudShell. For this to work, you need to edit the python code as follows:
* Update the CloudShell settings in the session line.
* Give the ID of an active sandbox (in the `reservationId` field of the python code.
* Replace 'LinuxVmApp_9cb2-72d6' with the App’s name.

#### Linux privilege escalation

If the deployed App resource is set with a “regular” user credentials, you may specify the root credentials in the parameters (see previous example), and use in the script.

{% highlight bash %}
Linux
echo $pass | su $user –c ‘ls /root’
or
Linux
su - $user <<Block
$pass
ls /root
Block
{% endhighlight %}