---
layout: page
title: "Power off and Delete VM"
order: 19
comments: true
version:
    - 9.3.0
---

In this article, we'll learn how to implement the PowerOff and DeleteInstance commands, which shut down and delete the VM from the cloud provider, respectively.

## PowerOff method

The *PowerOff* method shuts down (or powers off) the VM instance. It is run automatically as part of the sandbox's teardown, and can also be run manually by the sandbox end-user from the deployed App's commands pane. When *PowerOff* completes, the green 'online' live status icon is replaced with a grey one on the App resource, indicating it is offline.

**Note:** CloudShell sets the resource state to 'offline' if *PowerOff* completed successfully.

### Signature

{% highlight python %}
def PowerOff(self, context, ports)
{% endhighlight %}

### Inputs

**context**: *context* is a <a href="https://github.com/QualiSystems/cloudshell-shell-core/blob/36009fdec45134ae38cb9273328b7686be66e553/cloudshell/shell/core/driver_context.py#L171-L180" target="_blank">ResourceRemoteCommandContext</a> object that contains:

1. connectivity - CloudShell server connectivity data for authentication with CloudShell Automation API 
2. resource - resource configuration settings entered by the user when creating the Cloud Provider resource in the **Inventory** dashboard
3. remote_reservation – reservation details
4. remote_endpoints - will contain a single <a href="https://github.com/QualiSystems/cloudshell-shell-core/blob/36009fdec45134ae38cb9273328b7686be66e553/cloudshell/shell/core/driver_context.py#L38-L64" target="_blank">ResourceContextDetails</a> object which provides data for the operation.

{% github_sample_ref /QualiSystems/cloudshell-shell-core/blob/36009fdec45134ae38cb9273328b7686be66e553/cloudshell/shell/core/driver_context.py %}
{% highlight python %}
{% github_sample /QualiSystems/cloudshell-shell-core/blob/36009fdec45134ae38cb9273328b7686be66e553/cloudshell/shell/core/driver_context.py 171 180 %}
{% endhighlight %}

**Ports**

Legacy argument. Obsolete for custom cloud providers.

### Error handling

If an error occurs during the *PowerOff* operation, the command should raise an exception.

### PowerOff method implementation

The *PowerOff* method should perform the following steps:

1. Retrieve the cloud provider resource's connection credentials
2. Convert context deployed_app_json string to object
3. Power off the deployed App resource

### PowerOff implementation example

{% github_sample_ref /QualiSystems/cloudshell-shell-core/blob/36009fdec45134ae38cb9273328b7686be66e553/cloudshell/shell/core/driver_context.py %}
{% highlight python %}
{% github_sample /QualiSystems/Custom-L2-Cloud-Provider-Shell-Example/blob/ea88bab874c42d69508ba5b2542e867c5b375d5f/src/driver.py 129 144 %}
{% endhighlight %}

### Return value

None

## DeleteInstance method

The *DeleteInstance* method powers off the VM, deletes the VM from the cloud provider and removes the App from the sandbox. It is run when removing the deployed App from the sandbox or during the sandbox's teardown. 

### Signature

def DeleteInstance(self, context, ports)

### Inputs

**context**: *context* is a <a href="https://github.com/QualiSystems/cloudshell-shell-core/blob/36009fdec45134ae38cb9273328b7686be66e553/cloudshell/shell/core/driver_context.py#L171-L180" target="_blank">ResourceRemoteCommandContext</a> object that contains:

1. connectivity - CloudShell server connectivity data for authentication with CloudShell Automation API 
2. resource - resource configuration settings entered by the user when creating the Cloud Provider resource in the **Inventory** dashboard
3. remote_reservation – reservation details
4. remote_endpoints- will contain a single <a href="https://github.com/QualiSystems/cloudshell-shell-core/blob/36009fdec45134ae38cb9273328b7686be66e553/cloudshell/shell/core/driver_context.py#L171-L180" target="_blank">ResourceContextDetails</a> object which provides data for the operation.

{% github_sample_ref /QualiSystems/cloudshell-shell-core/blob/36009fdec45134ae38cb9273328b7686be66e553/cloudshell/shell/core/driver_context.py %}
{% highlight python %}
{% github_sample /QualiSystems/cloudshell-shell-core/blob/36009fdec45134ae38cb9273328b7686be66e553/cloudshell/shell/core/driver_context.py 171 180 %}
{% endhighlight %}

**Ports**

Legacy argument. Obsolete for custom cloud providers.

### DeleteInstance method implementation

The *DeleteInstance* method should perform the following steps:

1. Retrieve the cloud provider resource's connection credentials.
2. Convert the *deployed_app_json* context string to object.
3. Delete the VM instance from the cloud provider.

### DeleteInstance implementation example

{% github_sample_ref /QualiSystems/Custom-L2-Cloud-Provider-Shell-Example/blob/ea88bab874c42d69508ba5b2542e867c5b375d5f/src/driver.py %}
{% highlight python %}
{% github_sample /QualiSystems/Custom-L2-Cloud-Provider-Shell-Example/blob/ea88bab874c42d69508ba5b2542e867c5b375d5f/src/driver.py 148 163 %}
{% endhighlight %}

### Return value

None


