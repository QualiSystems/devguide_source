---
layout: page
title: Ansible Playbook Examples
category: cf
order: 6
comments: true
version:
    - 8.3.0
---

{% assign pageUrlSplited = page.url | split: "/" %}
{% assign pageVersion = pageUrlSplited[2] %}

### Examples
We’ve put together some basic playbook examples to help you get started. If you are new to Ansible development, feel free to test them out.

#### Hello World
A basic playbook that prints “Hello World”, just to make sure we’re communicating with the VM, and are able to run the playbook. When run as part of an App’s deployment in CloudShell, the message will be displayed in the sandbox diagram's **Output** window.

{% highlight bash %}
site.yml
---
- hosts: all
  tasks:
  - name: Print Hello World
    debug: msg="Hello World"
{% endhighlight %}
<a name="ConfigureApps"></a>

#### Parameters
A playbook that prints the parameter defined in an App template or API call (see below). Such playbooks are useful for debugging and making sure parameter variables are set with the correct values. Note that the parameters are stored as environment variables on the App instance in the sandbox.

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

* Parameter defined in the App template:

![Discovery Dialog]({{ site.baseurl}}/assets/cf-ansible-params.png){:class="img-responsive"}

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

**Note:** Since this script uses parameters defined on the App template, it will not work when run manually outside of CloudShell. For this to work, you will need to edit the python code as follows:
* Update the CloudShell settings passed to the `session` variable, if needed.
* Specify the ID of an active sandbox (in the `reservationId` field of the python code).
* Replace 'LinuxVmApp_9cb2-72d6' with the App’s name.<a name="InventoryGroups"></a>

#### Inventory Groups
In some cases, a playbook contains plays that target many different VMs that require configuration. In order to have the playbook run only the plays that are relevant to a specific VM, or to a group of hosts (VMs) that your VM belongs to, you can use the **Inventory Groups** field in the App template. 
In this field, specify the groups that your VM belongs to (more than one group can be provided). Use semicolons ";" to separate multiple groups.

For example , specifying groups "servers/http" and servers/sql":

![Discovery Dialog]({{ site.baseurl}}/assets/cf-ansible-inventory-groups.png){:class="img-responsive"}

This example shows how these groups entered in the App’s **Configuration Management** page should be written in the Ansible *hosts* file.

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