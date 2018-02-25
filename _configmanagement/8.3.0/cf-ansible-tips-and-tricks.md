---
layout: page
title: Tips and Tricks for Ansible Playbooks
category: cf
order: 8
comments: true
version:
    - 8.3.0
---

{% assign pageUrlSplited = page.url | split: "/" %}
{% assign pageVersion = pageUrlSplited[2] %}

* Make sure the Execution Server can access the script’s raw URL.
* When setting the VM user’s credentials in the App, make sure you provide the credentials of a user that has the necessary permissions to successfully execute all the playbook tasks.
* If the App’s virtual machine takes a long time to fully load, you may want to adjust the maximum time for the machine to respond, by setting the **Timeout Minutes** attribute on the **Custom Script Configuration** resource model (in Resource Manager Client’s **Resource Families** explorer).
* Use the **Ansible Additional Arguments** attribute to specify more parameters that should run along with the `ansible-playbook` command (e.g. `-vvv` for easier debugging).
* When using a Windows virtual machine with an Ansible playbook, make sure WinRM is configured and loaded automatically to allow the playbook to communicate with that VM. A script for this is provided in [CloudShell’s online help](http://help.quali.com/Online%20Help/8.2.0.3290/Portal/Content/Admn/Cnfg-WinRM-for-Ansible.htm?Highlight=winrm). 
* For Apps deploying a Windows VM, make sure WinRM is configured and loaded automatically to allow Ansible to communicate with that VM. A script for this is provided in CloudShell’s online help.
