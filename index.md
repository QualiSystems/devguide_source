---
layout: default
title: "Introduction"
---

## Welcome

Welcome to the CloudShell developer guide!
These pages will take you through all you need to know to become an expert Shell or orchestration developer. The guide is intended both for developers taking their first steps with the platform as well as for seasoned CloudShell developers.

### A Shell in NutShell

Shells enable CloudShell users to interact with a wide range of components including physical devices, virtual appliances and apps.

From a developer's perspective, a 'Shell' is a plugin which can used to extend CloudShell. Installing a shell into CloudShell opens up new options for users and administrators. Just to name a few examples:

* New physical components types can be instantiated in CloudShell's inventory.
* New commands can be added to sandbox components
* New apps types can be added to blueprints and deployed in sandboxes


### The Shell Structure

A shell is a project containing everything CloudShell needs to know in order to support a specific component type, app, or virtual appliance. The Shell project contains data-model definitions and attributes. In addition, the shell can include a driver, written in Python or developed using CloudShell Authoring. The shell driver can automate interactions with the Shell by implementing useful commands the users can invoke from the sandbox.

In the next section of the guide we'll go through the steps of generating a new Shell project for a component and creating a simple driver.
