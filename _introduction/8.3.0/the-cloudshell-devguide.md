---
layout: page
title: "The CloudShell DevGuide"
date: "2016-04-30 13:02:32 +0300"
order: 1
comments: false
version:
    - 8.3.0
    
---

{% assign pageUrlSplited = page.url | split: "/" %}
{% assign pageVersion = pageUrlSplited[2] %}

Welcome! In the following pages you will learn all you need to know to become an expert CloudShell developer. The guide is intended both for developers taking their first steps with the platform and seasoned CloudShell developers.

_**Before developing shells and scripts, please familiarize yourself with CloudShell by taking [Quali U courses](http://courses.quali.com). These courses also include installation instructions for the CloudShell SDK package that deploys a developer edition of CloudShell on which you can perform your training and development activities.**_

### How this guide is organized

The CloudShell developer guide is comprised of several distinct content areas. Each one describes a different branch of development or possible integration options with CloudShell. Each area of the guide is independent of the other two and includes its own ‘getting started’ tutorials, examples, instructional videos and articles. You don’t have to follow a specific order so feel free to explore the areas that are relevant to your development. The areas of the DevGuide are:

#### [Shells: Extending CloudShell’s functionality]({{site.baseurl}}/shells/{{pageVersion}}/getting-started.html)

Developers can extend CloudShell’s capabilities to provide additional functionality for Apps or physical devices by creating Shells. This includes better modeling for these components as well as custom commands that can be used in the sandbox to integrate the component in CloudShell. This area of the guide covers the end-to-end flow of creating new Shells and importing them into CloudShell.


#### [Orchestration Scripts: Implementing sandbox workflows]({{site.baseurl}}/orchestration/{{pageVersion}}/getting-started.html)

Orchestration scripts are a feature in CloudShell that enables the implementation of sandbox workflows. CloudShell has built-in flows for setup and teardown, which deploy and tear down Apps, resources and connections between components in the sandbox without having to add additional code. Users can extend or fork these scripts, as well as implement additional workflows for save/restore operations, scaling, or more use case-specific workflows for anything from performance testing to failover simulation or traffic generation.


#### [Custom Cloud Providers: Implementing support for cloud providers]({{site.baseurl}}/cloudproviders/9.0.0/getting-started-with-cloud-providers.html)

CloudShell 9.0 provides support for the Cloud Provider shell, which enables you to integrate CloudShell with the cloud provider of your choice. CloudShell provides out-of-the-box support for cloud providers AWS EC2, Microsoft Azure, VMware vCenter and OpenStack. However, to deploy VMs on other cloud providers, such as Kubernetes or Oracle Cloud, or create a modified version of one of our out-of-the-box cloud providers, you will need to create a shell that allows this to happen. Learn all about it in the 9.0.0 dev guide's [Developing Cloud Providers]({{site.baseurl}}/cloudproviders/9.0.0/getting-started-with-cloud-providers.html) chapter.


#### [Configuration Management: Developing configuration scripts for App VMs]({{site.baseurl}}/configmanagement/{{pageVersion}}/cf-overview.html)
Configuration management extends CloudShell Apps by allowing the running of scripts, which install applications on virtual machines (VMs) deployed in the sandbox or run post-deployment configuration. This configuration can be executed as part of the sandbox setup, or later on in a live sandbox. Configuration management operations can be performed using custom scripts or Ansible playbooks.

#### [CloudShell APIs]({{site.baseurl}}/devops/{{pageVersion}}/devops-integration.html)

This chapter describes the different APIs CloudShell offers, the uses for each as well as useful links and implementation examples.

In addition, this area examines how CloudShell can be used in conjunction with other DevOps tools and within the DevOps pipeline. This includes CloudShell’s APIs as well as existing Open Source projects for integrating CloudShell with other products.

### Where to go next

The _[Setting Up the Development Environment]({{site.baseurl}}/introduction/{{pageVersion}}/setting-up-the-development-ide.html)_ section contains important information for tooling and infrastructure you should install before starting development.

You can then proceed to any one of the development areas described above:

* [Extending CloudShell with Shells]({{site.baseurl}}/shells/{{pageVersion}}/getting-started.html)
* [Orchestration Scripts]({{site.baseurl}}/orchestration/{{pageVersion}}/getting-started.html)
* [Configuration Management]({{site.baseurl}}/configmanagement/{{pageVersion}}/cf-overview.html)
* [CloudShell APIs]({{site.baseurl}}/devops/{{pageVersion}}/available-apis.html)
