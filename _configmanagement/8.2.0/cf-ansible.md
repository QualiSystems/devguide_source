---
layout: page
title: Ansible
category: cf
order: 5
comments: true
version:
    - 8.2.0
---

{% assign pageUrlSplited = page.url | split: "/" %}
{% assign pageVersion = pageUrlSplited[2] %}

This article will take you through the development process of an Ansible playbook for CloudShell App deployment.

### Prerequisites
* Execution Server installed on Linux machine, with the `ansible` attribute enabled.
* Ansible 2.2 installed (not provided – should be installed manually by the user).

This can be easily done by deploying the <a href="http://help.quali.com/doc/8.2/VA-Linux/Content/Linux/Home.htm" target="_blank">Linux Virtual Appliance</a>, which installs the Execution Server and Ansible on a Linux machine.

#### Ansible playbooks for Apps
Before running the playbook in an App, it is recommended to test it manually. To do that, follow these steps:

1) On a Linux machine, access the `/etc/ansible/ansible.cfg` file and uncomment the line:

{% highlight bash %}
host_key_checking = False
{% endhighlight %}

2) Create a folder that will be the root of your test. This folder will contain the Ansible playbook as well as any additional folders and files required by the playbook.

3) Add an inventory file with hosts and their groups (optional) for testing.

![Discovery Dialog]({{ site.baseurl}}/assets/cf-ansible-hosts-file.png){:class="img-responsive"}
 
4) Add one or more playbook files.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**Note:** If you plan on using several playbook files in the App, make sure the main one is named *site.yml*.

![Discovery Dialog]({{ site.baseurl}}/assets/cf-ansible-site-yml-file.png){:class="img-responsive"}

5) [Optional] Add a “roles” folder.

   ![Discovery Dialog]({{ site.baseurl}}/assets/cf-ansible-add-roles-folder.png){:class="img-responsive"}

6) [Optional] And populate it with the desired roles. 

![Discovery Dialog]({{ site.baseurl}}/assets/cf-ansible-roles-definitions-folder.png){:class="img-responsive"}

6) Test the playbook by running `ansible-playbook –i <InventoryFile> <MainPlaybookFile.yml>`. For some sample playbooks, see [Ansible Playbook Examples]({{site.baseurl}}/configmanagement/{{pageVersion}}/cf-ansible-examples.html).

![Discovery Dialog]({{ site.baseurl}}/assets/cf-ansible-run-playbook.png){:class="img-responsive"}

7) Once you are done developing your playbook, zip the playbook files along with the *roles* folder, upload it to a repository, and set the URL in the App template, as explained in [Adding the Playbook to an App]({{site.baseurl}}/configmanagement/{{pageVersion}}/cf-add-playbook-to-app.html).