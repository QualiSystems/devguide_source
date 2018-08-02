---
layout: page
title: Configuration Management Overview
category: cf
order: 1
comments: true
version:
    - 7.1.0
---

Starting with CloudShell 8.0, we redesigned the way CloudShell Apps install and configure applications on the App-deployed VM. The **Installation** service was replaced with a **Configuration Management** page in the App template, featuring an easy-to-use UI for setting up the configuration management to be executed on the VM.

![Discovery Dialog]({{site.baseurl}}/assets/cf-custom-script-Configuration-Management-page.png){:class="img-responsive"}

Configuration Management allows you to run scripts that install applications on the virtual machines (VMs) deployed in the sandbox or run post-deployment configuration. This configuration can be executed as part of the sandbox setup, or later on in a live sandbox. Configuration management operations can be performed using custom scripts or Ansible playbooks. Custom scripts are typically used for simple operations, like installing a program on the VM or printing some messages, while Ansible is used for more complex tasks.

For details, see <a href="https://devguide.quali.com/configmanagement/9.0.0/cf-overview.html" target="_blank">CloudShell Dev Guide version 9.0.0</a>.