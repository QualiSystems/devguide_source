---
layout: page
title: "The Cloud Provider Interface"
order: 13
comments: true
version:
    - 9.3.0
---

{% assign pageUrlSplited = page.url | split: "/" %}
{% assign pageVersion = pageUrlSplited[2] %}

The rest of this chapter is dedicated to implementing the cloud provider driver that will be called by the server when interaction with the cloud provider is needed. This includes setting up communication between CloudShell and the cloud provider of choice, implementing the driver commands required from the resource, such as Deploy App, Power On and Refresh IP, and setting the resource’s live status icon (for example, "online" and "offline").

The articles are:

* [Resource Discovery (get_inventory)]({{site.baseurl}}/cloudproviders/{{pageVersion}}/resource-discovery.html)
* [App Deployment (Deploy)]({{site.baseurl}}/cloudproviders/{{pageVersion}}/app-deployment.html)
* [Power off and Delete VM]({{site.baseurl}}/cloudproviders/{{pageVersion}}/power-off-and-delete.html)
* [L2 Network Connectivity]({{site.baseurl}}/cloudproviders/{{pageVersion}}/L2-networking-management.html)
* [L3 Network Connectivity]({{site.baseurl}}/cloudproviders/{{pageVersion}}/L3-networking-management.html)

*For illustration purposes, we will use a mock shell called HeavenlyCloud, which demonstrates the use and implementation of a custom cloud provider. We've created two versions of the shell, **L2HeavenlyCloudShell** for L2 clouds <a href="https://github.com/QualiSystems/Custom-L2-Cloud-Provider-Shell-Example" target="_blank">(download here)</a> and **L3HeavenlyCloudShell** for L3 clouds <a href="https://github.com/QualiSystems/Custom-L3-Cloud-Provider-Shell-Example" target="_blank">(download here)</a>. The difference between the two is in the networking connectivity implementation.*

To see how the HeavenlyCloud cloud provider works, let’s create a resource using the HeavenlyCloud shell in CloudShell Portal. First, download the appropriate mock shell .zip file from GitHub and extract it to your computer.

![Shell Commands]({{ site.baseurl}}/assets/cp-heavenly-cloud-project.png)

Install the shell on CloudShell by running this command-line from the extracted shell project folder:

{% highlight yaml %}
shellfoundry install
{% endhighlight %}

In CloudShell Portal, open the **Inventory** dashboard and create a resource from the **HeavenlyCloud** shell.

In the **Manage>Apps** page, create a new App template. Note that two new deployment types have been added, HeavenlyCloudAngelDeployment and HeavenlyCloudManDeployment. Select a deployment type and carry on setting the App template. 

![Shell Commands]({{ site.baseurl}}/assets/cp-heavenly-cloud-deployment-paths.png)

In the **Deployment Paths** page of the dialog box, make sure to select the new HeavenlyCloud cloud provider resource you created.

Next, let’s implement the *get_inventory* function, which discovers and validates the resource against the cloud provider of choice.

