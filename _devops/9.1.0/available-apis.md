---
layout: page
title: Available CloudShell APIs
comments: true
order:  1
version:
    - 9.1.0
---

In this article, we'll discuss the different CloudShell APIs. 

CloudShell applications have multiple APIs, which enable you to get services from the Quali Server and to utilize CloudShell's capabilities for Shell automation, blueprint orchestration, sandbox deployment and test automation. CloudShell APIs can be classified as outbound and inbound APIs. In other words, APIs that are used to serve CloudShell in a wider context (our RESTful Sandbox API), like CI/CD processes, and APIs used to extend CloudShell automation and orchestration. For additional information, visit the <a href="https://help.quali.com/Online%20Help/9.1/Api-Guide/Content/API/CS-API-Ovrvew.htm" target="_blank">CloudShell API Guide</a>.

### CloudShell Sandbox API

**CloudShell Sandbox API** is a RESTful API that allows you to use CloudShell sandboxes as part of your CI/CD process. For example, you can start, extend and stop sandboxes, run sandbox orchestration and automation commands, and get information about your sandboxes and execution activity. For additional information, see the CloudShell API Guide's <a href="https://help.quali.com/Online%20Help/9.1/Api-Guide/Content/API/REST-API-Overvw.htm" target="_blank">CloudShell Sandbox API Overview</a>.

#### Examples

For implementation examples, visit our <a href="https://github.com/QualiSystems/Sandbox-TeamCIty-Plugin/blob/master/README.md" target="_blank">TeamCity</a> or <a href="https://plugins.jenkins.io/cloudshell-sandbox" target="_blank">Jenkins</a> plugin documentation, which leverages CloudShell Sandbox API to automate the consumption of sandboxes as part of the devops cycle.

### CloudShell Automation API

**CloudShell Automation API** is a Python open source package you can use to develop CloudShell orchestration and automation capabilities. Using the CloudShell Automation API, you can design orchestration scripts that communicate and run operations on CloudShell, from administrative operations like adding users, to sandbox-level operations like provisioning resources, resolving connectivity and running health check on the sandbox's elements. For additional information, see the <a href="https://help.quali.com/Online%20Help/9.1/API-Guide/Content/API/Pyth-API-Overvw.htm" target="_blank">CloudShell Automation API</a> online help page, and the <a href="https://help.quali.com/Online%20Help/9.1/Python-API/" target="_blank">CloudShell Automation API Reference Guide</a>.

Note that since CloudShell Automation API can perform sandbox and CloudShell-level operations, it mostly applies to orchestration scripts and is not recommended to be used in shells. Having said that, there are two methods in the API that apply directly to shells: *WriteMessageToReservationOutput* allows the driver to print messages in real time to the output console, and *SetResourceLiveStatus* allows the driver to indicate the resource’s state with an icon. For example, online and offline.

#### Examples

* Adding resources to the sandbox, creating resource connections and setting 'online' live status icon on the resources:

{% highlight python %}
import time


def execute():
    from cloudshell.workflow.orchestration.sandbox import Sandbox
    Sandbox = Sandbox()
    Reservation_Id = Sandbox.reservationContextDetails.id

    Resource_List = ['PUT Mock', 'PUT Mock/Port 1', 'Traffic Mock', 'Traffic Mock/Port 1']

    time.sleep(3)

    Sandbox.automation_api.AddResourcesToReservation(reservationId=Reservation_Id, resourcesFullPath=Resource_List)
    time.sleep(1)
    print ""
    Sandbox.automation_api.WriteMessageToReservationOutput(Reservation_Id, "resources added to sandbox")

    time.sleep(3)
    Sandbox.automation_api.SetResourceLiveStatus('PUT Mock', 'Online', "Active")
    Sandbox.automation_api.SetResourceLiveStatus('Traffic Mock', 'Online', "Active")

    time.sleep(1)
    Sandbox.automation_api.WriteMessageToReservationOutput(Reservation_Id, "resources are online")

    time.sleep(3)
    Sandbox.automation_api.CreateRouteInReservation(reservationId=Reservation_Id,
                                                    sourceResourceFullPath='PUT Mock/Port 1',
                                                    targetResourceFullPath='Traffic Mock/Port 1',
                                                    mappingType='bi', routeAlias='API-created route')
    time.sleep(1)
    Sandbox.automation_api.WriteMessageToReservationOutput(Reservation_Id, "resources connected")
{% endhighlight %}

### TestShell API

The **TestShell API** allows designing orchestration and automation using C#, TCL API and XML RPC. It is intended for performing a wide variety of operations within CloudShell; from administrative tasks, such as managing inventory or users, to sandbox operations, such as executing commands and controlling both resource and sandbox live statuses. It is especially useful for writing tests, and obtaining information about resources, blueprints and sandboxes. TestShell API and CloudShell Automation API provide the same capabilities and functionality. 

For additional information, see the appropriate TestShell API Reference Guide:
* <a href="https://help.quali.com/Online%20Help/9.1/testshell-api/TestShell%20API%20Library.html" target="_blank">TestShell API Library Reference Guide</a>
* <a href="https://help.quali.com/Online%20Help/9.1/testshell-api/TestShell%20cSharp%20API.html" target="_blank">TestShell API C# Reference Guide</a>
* <a href="https://help.quali.com/Online%20Help/9.1/testshell-api/TestShell%20TCL%20API.html" target="_blank">TestShell API TCL Reference Guide</a>
* <a href="https://help.quali.com/Online%20Help/9.1/testshell-api/TestShell%20XML%20RPC%20API.html" target="_blank">TestShell API XML RPC Reference Guide</a>

### Quali API

Quali API allows you to automate the scheduling and queuing of test automation suites. It can be used in C# and TCL, and is also used for getting sandbox attachments and execution server details.

For additional information, see the appropriate Quali API Reference Guide:
* <a href="https://help.quali.com/Online%20Help/9.1/quali-api/Quali%20API%20Library.html" target="_blank">Quali API Library Reference Guide</a>
* <a href="https://help.quali.com/Online%20Help/9.1/quali-api/Quali%20cSharp%20API.html" target="_blank">Quali API C# Reference Guide</a>
* <a href="https://help.quali.com/Online%20Help/9.1/quali-api/Quali%20REST%20API.html" target="_blank">Quali API REST Reference Guide</a>

### Packaging API

**CloudShell Packaging API** allows you to automate the creation configuration of CloudShell blueprint packages, which can be used for backup purposes and for sharing blueprints between different CloudShell deployments. For additional information and implementation examples, see the <a href="https://help.quali.com/Online%20Help/9.1/API-Guide/Content/API/Pckg-API/PackagingAPI.htm" target="_blank">CloudShell Packaging API documentation</a>.