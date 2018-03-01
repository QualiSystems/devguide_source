---
layout: page
title: Custom Scripts
category: cf
order: 2
comments: true
version:
    - 8.1.0
---

{% assign pageUrlSplited = page.url | split: "/" %}
{% assign pageVersion = pageUrlSplited[2] %}

This article will take you through the development process of a custom script for CloudShell App deployment. CloudShell supports PowerShell scripts for Windows VMs, and bash or sh scripts for Linux VMs. When developing your script, we recommend you first simulate/debug it by running it manually on a similar machine.

### Examples

Here are several examples of custom scripts to help you get started. If you are new to script development, feel free to test them out.

#### Hello World

A basic script, just to make sure we’re communicating with the VM and are able to run a script. When run with an App, the output should be shown in the sandbox diagram's **Output** window.

{% highlight bash %}
Windows / Linux
echo “Hello World“
{% endhighlight %}<a name="CustomScriptParams"></a>

#### Parameters

A basic script that prints out the parameter defined in an App template or API call (see below). This is useful for debugging the script and making sure the parameter is received with the correct value. Note that the parameters are stored as environment variables on the App instance in the sandbox.

{% highlight bash %}
Windows
echo $env:P1
Linux
echo $P1
{% endhighlight %}

* Specified in the App template: 
![Discovery Dialog]({{ site.baseurl}}/assets/cf-custom-script-params.png){:class="img-responsive"}

* Specified in the ConfigureApps API method:

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

**Note:** Since this script uses parameters defined on the App template, it will not work when run manually outside of CloudShell. For this to work, you will need to edit the python code as follows:
* Update the CloudShell settings passed to the `session` variable, if needed.
* Specify the ID of an active sandbox (in the `reservationId` field of the python code).
* Replace 'LinuxVmApp_9cb2-72d6' with the App’s name.

#### Linux privilege escalation

If the deployed App resource is set with the credentials of a “regular” user, you may specify the root credentials in the parameters (see the Parameters example above), to use them in the script.

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