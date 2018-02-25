---
layout: page
title: Adding the Playbook to an App
category: cf
order: 7
comments: true
version:
    - 8.3.0
---

{% assign pageUrlSplited = page.url | split: "/" %}
{% assign pageVersion = pageUrlSplited[2] %}

Now that we have tested and debugged our playbook, the next step is to add it to an App template.

1)	In CloudShell Portal, open the **Manage>Apps** page.

2)	Edit or create an App.

3)	Open the **Configuration Management** tab.

4)	From the **Select Tool** drop-down list, select **Ansible**.

5)	Select the **Connection** Method, depending on the Vm’s operating system. For Windows machines, select **Windows Remote Management**, or **SSH** for Linux.

6)	Specify the playbook’s **URL**. Make sure you specify the raw version of the URL.

The playbook can be a yml file for a single playbook or a zip file containing several playbooks. For simple tasks, a single yml file should be enough, but for more complex configuration logic, and for using roles, a zip file may be required. The zip file must contain a least one yml (if there are several yml files, the main one must be named “site.yml”). In order to use roles, include in the zip a folder named “roles”, and add the roles to it.

If the URL is protected with username and password, specify these credentials in the fields below. Otherwise leave them empty.

7)	In the **Inventory Groups** field, specify the inventory groups, separated by semicolons“;”. For details, see the [Inventory Groups]({{site.baseurl}}/configmanagement/{{pageVersion}}/cf-ansible-examples.html#InventoryGroups) example.

8)	To pass parameters to the playbook, click **Add Parameter**, and enter each parameter’s name and value.

![Discovery Dialog]({{ site.baseurl}}/assets/cf-ansible-Configuration-Management-page.png){:class="img-responsive"}

You may want the parameter value to be taken dynamically from a Global Input, when reserving the blueprint. To do so, just enter the global input’s name in curly braces as the parameter value, or use the “plus” button when editing the App in a blueprint to link it to available Global Inputs.
 
9)	Open the **App Resource** tab, and enter the credentials for the virtual machine.
   
![Discovery Dialog]({{ site.baseurl}}/assets/cf-custom-script-App-Resource-page.png){:class="img-responsive"}

10)	Click **Done**.
