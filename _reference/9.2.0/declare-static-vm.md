---
layout: page
title: Modifying a Shell to Declare a VM as a Resource
category: ref
order: 21
comments: true
version:
    - 9.2.0
---

{% assign pageUrlSplited = page.url | split: "/" %}
{% assign pageVersion = pageUrlSplited[2] %}

In this article, we will learn how to configure a shell to load an existing static VM as a resource in CloudShell. For additional details about static VMs, see the CloudShell Help's <a href="https://help.quali.com/Online%20Help/9.2/Portal/Content/CSP/INVN/Load-vCenter-VM-Rsrc.htm?Highlight=static" target="_blank">Static VMs Overview</a> article.

This is done by modifying the driver's *get_inventory* command to return the `ApiVmDetails` in the response. 

The `ApiVMDetails` class is included in the *cloudshell-shell-core* lib version 3.1.x, so add this line to the *requirement.txt*:

{% highlight bash %}
cloudshell-shell-core>=3.1.0,<3.2.0
{% endhighlight %}

In the shell's driver, we'll need to import the VM Details class and the *json* lib:

{% highlight python %}
from cloudshell.shell.core.driver_context import ApiVmDetails, ApiVmCustomParam
import json
{% endhighlight %}

*You can remove ApiVmCustomParam from the import if you don't plan on setting custom parameters directly in the driver.*

As we said before, to declare a VM as a static VM, the shell needs to return the *ApiVmDetails* in the response. Here's an example implementation for declaring a vCenter VM as a static VM:

{% highlight python %}
def get_inventory(self, context):
    """
    Will locate vm in vcenter and fill its uuid
    :type context: cloudshell.shell.core.context.ResourceCommandContext
    """
    # get stuff from my cloud provider
    # ...
    uuid = 'my_vm_uuid'
    my_clp_name = 'my_clp_resource_name'

    vm_details = ApiVmDetails()

    vm_details.UID = uuid
    vm_details.CloudProviderName = my_clp_name

    param1 = ApiVmCustomParam() # remove if no custom params
    param1.Name = 'param1' # remove if no custom params
    param1.Value = 'value1' # remove if no custom params
    vm_details.VmCustomParams = [param1]  # remove if no custom params
    str_vm_details = json.dumps(vm_details)

    # return vm_details
    autoload_atts = [AutoLoadAttribute('', 'VmDetails', str_vm_details)]
    return AutoLoadDetails([], autoload_atts)
{% endhighlight %}

Make sure you pass the right details to the *get_inventory* command. Generally speaking, these are the CloudShell cloud provider resource (my_clp_name variable) that will run the process and the VM's identification details (uuid variable). As illustrated above, to identify vCenter VMs, it's enough to pass the VM's path on vCenter. However, for other cloud providers, different details may need to be passed. For example, a similar implementation for Azure would need the VM name and the resource group name.

If you want to allow the admin to provide the details when they discover the resource in CloudShell Portal's **Inventory** dashboard, you will need to dynamically pull them from the context.

First, generate the shell's data model by running the following command-line from the shell's root folder:

{% highlight bash %}
shellfoundry generate
{% endhighlight %}

Then, replace the following lines:

{% highlight python %}
uuid = 'my_vm_uuid'
my_clp_name = 'my_clp_resource_name'
{% endhighlight %}

With these:

{% highlight python %}
uuid = context.resource.attributes['StaticVm1.vCenter VM']
my_clp_name = context.resource.attributes['StaticVm1.vCenter Name']
{% endhighlight %}

And third, in the *shell-definition.yaml*, add the attributes as discovery attributes. For example:

{% highlight yaml %}
node_types:

  vendor.resource.StaticVm1:
    derived_from: cloudshell.nodes.GenericResource
    properties:
      vCenter Name:
        type: string
        tags: [setting, configuration]
      vCenter VM:
        type: string
        tags: [setting, configuration]
    capabilities:
      auto_discovery_capability:
        type: cloudshell.capabilities.AutoDiscovery
        properties:
          vCenter Name:
            type: string
            tags: [setting, configuration]
          vCenter VM:
            type: string
            tags: [setting, configuration]
{% endhighlight %}
