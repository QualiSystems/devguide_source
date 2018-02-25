---
layout: page
title: Overview
category: cf
order: 1
comments: true
version:
    - 8.2.0
---

{% assign pageUrlSplited = page.url | split: "/" %}
{% assign pageVersion = pageUrlSplited[2] %}

Configuration management allows you to run operations on App VMs during their deployment in CloudShell sandboxes. Such operations may include installing an application or running some configurations on the VM’s software or operating system. Configuration management operations can be configured using custom scripts and Ansible playbooks. Custom scripts are typically used for simple operations, like installing a program on the VM or printing some messages, while Ansible is used for more complex tasks.

### Developing configuration management

The flow for developing configuration management is as follows, with minor differences depending on whether you're using a script or playbook.

1) Write the script or playbook.

2) Manually simulate/debug the script or playbook.

3) Add the script or playbook to an App and deploy the App.
