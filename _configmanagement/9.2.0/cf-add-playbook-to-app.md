---
layout: page
title: Adding the Playbook to an App
category: cf
order: 7
comments: true
version:
    - 9.2.0
---

{% assign pageUrlSplited = page.url | split: "/" %}
{% assign pageVersion = pageUrlSplited[2] %}

Now that we have tested and debugged our playbook, the next step is to add it to an App template.

1)	In CloudShell Portal, open the **Manage>Apps** page.

2)	Edit or create an App.

3)	Open the **Configuration Management** tab.

4)	From the **Select Tool** drop-down list, select **Ansible**.

5)	Select the **Connection** Method, depending on the Vm’s operating system. Select **Windows Remote Management** for Windows machines, or **SSH** for Linux.

6)	Specify the playbook’s **URL**. Make sure you specify the raw version of the URL.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The playbook can be a yml file for a single playbook or a zip file containing several playbooks. For simple tasks, a single yml file should be enough, but for more complex configuration logic, and for using roles, a zip file may be required (for a sample zip file, click [here](https://github.com/QualiSystems/app-starter-pack/blob/dev/Playbooks/wordpress-rhel7.zip?raw=true)). The zip file must contain a least one yml (if there are several yml files, the main one must be named *site.yml*). In order to use roles, include in the zip a folder named *roles*, and add the roles to it.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;If the URL is protected, specify the **Username** and **Password**.

7)	In the **Inventory Groups** field, specify the inventory groups, separated by semicolons “;”. For details, see the [Inventory Groups]({{site.baseurl}}/configmanagement/{{pageVersion}}/cf-ansible-examples.html#InventoryGroups) example.

8)	To add parameters to the playbook, click **Add Parameter**, and enter each parameter’s name and value. Note that the parameters are added to the App template.

![Discovery Dialog]({{ site.baseurl}}/assets/cf-ansible-Configuration-Management-page.png){:class="img-responsive"}

You can add parameters to the App template in the following ways:
*  Provide the value as part of the App template, making it the default value for every instance of this App template
*  Specify a static value in the App in the blueprint
*  Specify a dynamic value in the App in the blueprint, linking the parameter to one of the blueprint's Global Inputs. To do so, just enter the global input’s name in curly brackets as the parameter value, or click the “plus” button to select an available Global Input.
*  Pass a value using the API, as illustrated in this [example]({{site.baseurl}}/configmanagement/{{pageVersion}}/cf-ansible-examples.html#ConfigureApps). This will replace any value provided in the App template or in the blueprint.
 
9)	Open the **App Resource** tab, and enter the VM's access credentials.
   
![Discovery Dialog]({{ site.baseurl}}/assets/cf-custom-script-App-Resource-page.png){:class="img-responsive"}

10)	Click **Done**.