---
layout: page
title: "The CloudShell DevGuide"
date: "2016-04-30 13:02:32 +0300"
order: 1
comments: false
version:
    - 8.0.0
    - 7.1.0
    
---

{% assign pageUrlSplited = page.url | split: "/" %}
{% assign pageVersion = pageUrlSplited[2] %}

Welcome! In the following pages you will learn all you need to know to become an expert CloudShell developer. The guide is intended both for developers taking their first steps with the platform and seasoned CloudShell developers.


### How this guide is organized

The CloudShell developer guide is comprised of three distinct content areas. Each one describes a different branch of development or possible integration options with CloudShell. Each area of the guide is independent of the other two and includes its own ‘getting started’ tutorial, examples and articles. You don’t have to follow a specific order so feel free to explore the areas that are relevant to your development. The three areas of the DevGuide are:

#### [Shells: Extending CloudShell’s functionality]({{site.baseurl}}/shells/{{pageVersion}}/getting-started.html)

Developers can extend CloudShell’s capabilities to provide additional functionality for Apps or physical devices by creating Shells. This includes better modeling for these components as well as custom commands that can be used in the sandbox to integrate the component in CloudShell. This area of the guide covers the end-to-end flow of creating new Shells and importing them into CloudShell.


#### [Orchestration Scripts: Implementing sandbox workflows]({{site.baseurl}}/orchestration/{{pageVersion}}/getting-started.html)

Orchestration scripts are a feature in CloudShell that enables the implementation of sandbox workflows. CloudShell has built-in flows for setup and teardown, which deploy and tear down Apps, resources and connections between components in the sandbox without having to add additional code. Users can extend or fork these scripts, as well as implement additional workflows for save/restore operations, scaling, or more use case-specific workflows for anything from performance testing to failover simulation or traffic generation.


#### [Integrating CloudShell into the DevOps Cycle]({{site.baseurl}}/devops/{{pageVersion}}/devops-integration.html)

This area examines how CloudShell can be used in conjunction with other DevOps tools and within the DevOps pipeline. This includes CloudShell’s APIs as well as existing Open Source projects for integrating CloudShell with other products.

### Where to go next

The _[Setting Up the Development Environment]({{site.baseurl}}/introduction/{{pageVersion}}/setting-up-the-development-ide.html)_ section contains important information for tooling and infrastructure you should install before starting development.

You can then proceed to any one of the development areas described above:

* [Extending cloudShell with Shells]({{site.baseurl}}/shells/{{pageVersion}}/getting-started.html)
* [Orchestration Scripts]({{site.baseurl}}/orchestration/{{pageVersion}}/getting-started.html)
* [Integrating CloudShell into the DevOps Cycle]({{site.baseurl}}/devops/{{pageVersion}}/devops-integration.html)
