---
layout: page
title: "The CloudShell DevGuide"
order: 1
comments: false
version:
    - 7.1.0
    
---

{% assign pageUrlSplited = page.url | split: "/" %}
{% assign pageVersion = pageUrlSplited[2] %}

Welcome to the CloudShell developer guide!
These pages will take you through all you need to know to become an expert CloudShell developer.
The guide is intended both for developers taking their first steps with the platform as well as for seasoned CloudShell developers.

_**Before developing shells and scripts, please familiarize yourself with CloudShell by taking [Quali U courses](http://courses.quali.com). These courses also include installation instructions for the CloudShell SDK package that deploys a developer edition of CloudShell on which you can perform your training and development activities.**_

### How this guide is organized

The CloudShell developer guide is comprised of three distinct content areas, each describes a different branch of development or integration options possible with CloudShell. Each area of the guide is self contained and includes its own 'getting started' tutorial, examples and articles. You can select which areas are relevant to your development and explore them, there is no specific order to follow in approaching them. The three areas of the DevGuide are:

#### [Extending cloudShell with Shells]({{site.baseurl}}/shells/{{pageVersion}}/getting-started.html)

Developers can extend CloudShell's capabilities to provide additional functionality for apps or physical devices by creating Shells. This includes providing better modeling for these types of apps or devices as well as exposing custom commands providing enhanced functionality for these Shells available to users in the sandbox. This area of the guide will cover the end-to-end flow of creating new Shells and deploying them to CloudShell.

![Shell Discovery]({{site.baseurl}}/assets/diagram.png){: .center-image }

#### [Orchestration Scripts]({{site.baseurl}}/orchestration/{{pageVersion}}/getting-started.html)

Orchestration scripts are a feature in CloudShell which allows implementing sandbox workflows.
CloudShell has built in flows for setup and teardown, which ensure sandbox apps and resources are powered on and
connected without having to add additional code. Users can extend or fork these scripts, as well as implement additional
workflows for save/restore, scaling, or more use case specific workflows for anything from performance testing to
failover simulation or traffic generation.

#### [CloudShell APIs]({{site.baseurl}}/devops/{{pageVersion}}/devops-integration.html)

This area examines how CloudShell can be used in conjunction with other DevOps tools and within the DevOps pipeline. This includes CloudShell’s APIs as well as existing Open Source projects for integrating CloudShell with other products.

### Where to go next

The _[Setting Up the Development IDE]({{site.baseurl}}/introduction/{{pageVersion}}/setting-up-the-development-ide.html)_ section contains important information for tooling and infrastructure you should install before starting development.

You can then proceed to any one of the development areas described above:

* [Extending cloudShell with Shells]({{site.baseurl}}/shells/{{pageVersion}}/getting-started.html)
* [Orchestration Scripts]({{site.baseurl}}/orchestration/{{pageVersion}}/getting-started.html)
* [Integrating CloudShell into the DevOps Cycle]({{site.baseurl}}/devops/{{pageVersion}}/devops-integration.html)