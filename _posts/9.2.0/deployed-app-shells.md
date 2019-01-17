---
layout: page
title: Authoring a Deployed App Shell
comments: true
order:  4
version:
    - 9.2.0
---

As we've discussed previously, there are two base types of Shells in CloudShell: Inventory Resources and Apps.
As opposed to Inventory Resources, which are cataloged and exist in the CloudShell inventory regardless of their
usage in sandboxes, Apps are deployed and exist within the Sandbox. They also follow a different lifecycle - each App is first
defined as a blueprint in the Apps catalog, the deployed app Shell is only created once the app blueprint is deployed and finally the deployed app is deleted when the sandbox ends. Before we discuss Deployed App Shells development, let's cover that process in more depth.

### The App blueprint

The App Blueprint is the spec or plan describing how to create and configure the Deployed App. Viewed schematically,
its comprised of the following layers:

![App Architecture]({{ site.baseurl }}/assets/app_architecture.png){: .center-image }

The App Blueprint is created in the App Dashboard. In CloudShell portal, open the Manage dashboard. In the left sidebar, click _Apps_.

* **Deployment Type** - The app deployment type includes the technology which should be used to deploy the App as well as the relevant parameters. When you create a new App Blueprint in the catalog, in addition to naming the app, specifying the deployment type and parameters are the initial steps. For example, these are the options for a vCenter Linked Clone deployment type:

![App Architecture]({{ site.baseurl }}/assets/deployment_type.png){: .center-image }

* **Installation Script** - The installation script is run after the deployment is complete. A prerequisite to running
the script is that the OS is up and connected to the network. The role of the installation script is to complete any
configuration/installation of the app following the deployment of the image. The installation script may also have parameters
and these are provided when it is selected.

* **Deployed App Shell** - The last stage is selecting the specific Deployed App Shell. This step is optional as by default the App will just use the 'Generic App' Shell. This will provide no special App commands or attributes, but can provide the basic functions like remote connectivity and power. To select the Deployed App Shell, click on the 'Advanced' link and select the Family/Model of the Deployed App you wish to use.

### The App lifecycle

The following diagram illustrates the App lifecycle:
![App Architecture]({{ site.baseurl }}/assets/app_lifecycle.png){: .center-image }

App Blueprints are created in the Catalog. They can then be added to Environment blueprints and customized there, or directly to a sandbox. The App becomes a a deployed app as a result of two processes only: The Sandbox setup, or when the user manually select to deploy it.

The Deployed App Shell becomes relevant at that stage. It shouldn't assume anything about the App Blueprint or the deployment process that preceded its creation. The main function of the Deployed App Shell is to manage the App and provide support for controlling its basic functionality, running health checks, configuration tasks etc.

### A simple example

We can create a deployed app Shell to test its behavior.
From the Command-line, run the following:

{% highlight bash %}
shellfoundry new example-couchbase-app --template=deployed-app
cd example_deployed_app
{% endhighlight %}

We've just created a new Shell project for the deployed app. Before we can proceed, we need to configure the App blueprint
to make sure we have a viable deployment option for this App to experiment on.

### Create the CouchBase App blueprint

There are various deployment options we can use for the App Blueprint. We'll present two options, if you'd rather
configure Couchbase in another way that makes sense in your environment.

#### Option 1: AWS Deployment Type (Requires CloudShell 7.1 or newer)

If you have an AWS account, you can use it to easily start a Couchbase server.
First you'll need to configure
