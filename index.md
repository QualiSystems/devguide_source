---
layout: default
title: "Introduction"
---

## Welcome

Welcome to the CloudShell developer guide!
These pages will take you through all you need to know to become an expert Shell or orchestration developer.
 The guide is intended both for developers taking their first steps with the platform as well as for seasoned CloudShell developers.

### A Shell in a nutshell

Shells enable CloudShell users to interact with a wide range of components including physical devices, virtual appliances and apps.

From a developer's perspective, a 'Shell' is a plugin which can be used to extend CloudShell. Installing a shell into CloudShell opens up new options for users and administrators. Just to name a few examples:

* New physical components types can be instantiated in CloudShell's inventory.
* New commands can be added to sandbox components
* New apps types can be added to blueprints and deployed in sandboxes

![Shell Discovery]({{ site.url }}/devguide/assets/diagram.png){: .center-image }

### Orchestration Scripts

Orchestration scripts are a feature in CloudShell which allows implementing sandbox workflows.
CloudShell has built in flows for setup and teardown, which ensure sandbox apps and resources are powered on and
connected without having to add additional code. Users can extend or fork these scripts, as well as implement additional
workflows for save/restore, scaling, or more use case specific workflows for anything from performance testing to
failover simulation or traffic generation.


CloudShell's repository of both workflows and Shells has been steadily growing both with user contributed and
out of the box content. By investing in creating clear standards for different CloudShell components, its also becoming
much easier to share and import. The aim of this developer's guide is to share knowledge and expertise, save time
and allow more rapidly onboarding new developers. We hope you find the information useful and are looking forward to your
feedback.
