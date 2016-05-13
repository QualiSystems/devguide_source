---
layout: page
title: Introduction
category: sta
---

Welcome to the Shell developer guide!
This guide will take you through all you need to know to become an expert Shell developer. It is intended for developers taking their first steps with the platform as well as for seasoned CloudShell developers.

### A Shell in NutShell

Shells enable CloudShell users to interact with a wide range of components including physical devices, virtual appliances and apps.

From a developer's perspective, a 'Shell' is a plugin which can used to extend CloudShell. Installing a shell into CloudShell opens up new options for users and administrators. Just to name a few examples:

* New physical components types can be instantiated in CloudShell's inventory.
* New commands can be added to sandbox components
* New app shells can be added to blueprints and deployed in sandboxes


### The Shell Structure

A shell is a project containining everything CloudShell needs to know in order to support a specific component type, app, or virtual appliance. The Shell project contains datamodel definitions, attributes and the source code for the component driver.

In the next section of the guide we'll go through the steps of generating a new Shell project for a component and creating a simple driver in a few simple steps.
