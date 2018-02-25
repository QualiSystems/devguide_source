---
layout: page
title: Ansible Playbook Examples
category: cf
order: 6
comments: true
version:
    - 8.2.0
---

{% assign pageUrlSplited = page.url | split: "/" %}
{% assign pageVersion = pageUrlSplited[2] %}

### Examples
We’ve put together some basic playbook examples to help you get started. If you are new to Ansible development, feel free to test them out.

#### Hello World
A basic playbook that prints “Hello World”, just to make sure we’re communicating with the vm, and are able to run the playbook. When run as part of an App’s deployment in CloudShell, the message will be displayed in the Output window.

{% highlight bash %}
site.yml
---
- hosts: all
  tasks:
  - name: Print Hello World
    debug: msg="Hello World"
{% endhighlight %}

#### Parameters
A playbook that prints the parameter defined in the App template (see 2.1) or in API call (se 2.2). Such playbooks are useful for debugging the playbook and making sure variable are set with the correct values from the parameter.

{% highlight bash %}
site.yml
---
- hosts: all
  vars: 
  - msg: "{{P1|default('No Message')}}"
  tasks:
  - name: Print P1
    debug: var=msg
{% endhighlight %}

Below are examples of how to define the parameters, in the CloudShell App and when running manually using a python script.
* Parameter defined in the app template: 
* Parameter defined in the `ConfigureApps` API method:

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

**Note:** Since this script uses parameters defined on the App template, it will not work when run manually outside of CloudShell. For this to work, you need to give the ID of an active sandbox (in the *reservationId* field of the python code.<a name="InventoryGroups"></a>

#### Inventory Groups
To have an App run only certain parts of a playbook , specify the inventory groups these tasks belong to. This example shows how the groups entered in the App’s Configuration Management page should be written in the Ansible hosts file.

Suppose there are 2 groups defined in an App:
 
The corresponding hosts file will look like this:

{% highlight bash %}
hosts
[servers:children]
http
sql

[http]
192.168.1.2

[sql]
192.168.1.2
{% endhighlight %}
