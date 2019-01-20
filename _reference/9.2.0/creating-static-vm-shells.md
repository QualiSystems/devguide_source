---
layout: page
title: Customizing a Shell to Load Static VMs
category: ref
order: 16
comments: true
version:
    - 9.2.0
---

{% assign pageUrlSplited = page.url | split: "/" %}
{% assign pageVersion = pageUrlSplited[2] %}

In this section, we'll learn how to create a shell that declares a static VM as a resource in CloudShell. A static VM is a VM whose lifecycle is not managed through CloudShell sandboxes. For example, a VM that provides critical services or data, like a database, switch or bridge.


The only difference between a static VM resource and a regular resource is that the static VM needs to find the VM in vCenter and create a link between the CloudShell resource and the vCenter resource, thus giving it the vCenter Shell's capabilities. This is done by modifying the desired shell's `get_inventory` command to load the VM's details into CloudShell, using a CloudShell vCenter resource to access the vCenter server. Using this implementation, CloudShell developers can customize any shell to model static VMs in CloudShell, without altering the shell's behavior and capabilities.
 

In the below example, the `get_inventory` command gets this information from attributes on the root model ("vCenter Name" and "vCenter VM"). However, a static VM resource can have any modeling in CloudShell and be created by a 1st Gen or 2nd Gen shell as long as the shell's `get_inventory` command gets the relevant information and creates the link to the vCenter resource.

{% github_sample_ref /QualiSystems/vCenterShell/blob/master/static_vm_package/VCenterAutoloadStaticVMDriver/app_discovery/vm_autoload_driver.py %}
{% highlight python %}
{% github_sample /QualiSystems/vCenterShell/blob/master/static_vm_package/VCenterAutoloadStaticVMDriver/app_discovery/vm_autoload_driver.py 24 64  %}
{% endhighlight %}
 
### Implementing Static VM support in a shell

This procedure assumes you are creating or customizing a 2nd gen shell.

**To create/customize a shell to support static VMs:**

1) Run the appropriate command in command-line:

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**To modify an existing shell:**

{% highlight bash %}shellfoundry extend <URL/path-to-shell>{% endhighlight %}

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The path can be a URL to the Shell's source code on [Quali Community's Integrations](https://community.quali.com/integrations) page or the filesystem path (prefixed by `local:./`) to the extracted source code folder.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**To create a new shell based on a specific shell standard:**

{% highlight bash %}shellfoundry new <Shell-name> --template <template-name>{% endhighlight %}

2) In the shell’s download folder, open the *shell-definition.yaml* file in your preferred editor.

3) If you are customizing an existing shell and don't want to override any existing versions of the shell in CloudShell, update the `template version`.

4) Locate `node-types:`.

5) Add the **vCenter Name** and **vCenter VM** attributes to the shell. Under the root level model, add the following lines:

{% highlight yaml %}
properties:
  vCenter Name:
    type: string
    description: vCenter resource to use for authentication against vCenter server.
  vCenter VM:
    type: string
    description: vCenter resource to use for authentication against vCenter server.
{% endhighlight %}

6) Also add the lines under the `capabilities:` section.

7) Save the file.

8) Open the *driver.py* file.

9) Add the following lines to the beginning of the file:

{% github_sample_ref /QualiSystems/vCenterShell/blob/master/static_vm_package/VCenterAutoloadStaticVMDriver/app_discovery/vm_autoload_driver.py %}
{% highlight python %}
{% github_sample /QualiSystems/vCenterShell/blob/master/static_vm_package/VCenterAutoloadStaticVMDriver/app_discovery/vm_autoload_driver.py 0 12  %}
{% endhighlight %}

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Note that the get_qs_logger is only needed if you decide to implement logging.

10) Add the highlighted code to the `get_inventory` function:

{% highlight yaml %}
        Will locate vm in vcenter and fill its uuid
        :type context: cloudshell.shell.core.context.ResourceCommandContext
        """
        vcenter_vm_name = context.resource.attributes['vCenter VM']
        vcenter_vm_name = vcenter_vm_name.replace('\\', '/')
        vcenter_name = context.resource.attributes['vCenter Name']

        self.logger.info('start autoloading vm_path: {0} on vcenter: {1}'.format(vcenter_vm_name, vcenter_name))

        with CloudShellSessionContext(context) as cloudshell_session:
            session = cloudshell_session

        vcenter_api_res = session.GetResourceDetails(vcenter_name)
        vcenter_resource = self.model_parser.convert_to_vcenter_model(vcenter_api_res)
{% endhighlight %}

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;For reference, check out the Static VM example shell's [driver file](https://github.com/QualiSystems/vCenterShell/blob/master/static_vm_package/VCenterAutoloadStaticVMDriver/app_discovery/vm_autoload_driver.py#L17-L64). Feel free to add logging functionality, as shown in the file.

11) In the same file, add the following function:

{% github_sample_ref /QualiSystems/vCenterShell/blob/master/static_vm_package/VCenterAutoloadStaticVMDriver/app_discovery/vm_autoload_driver.py %}
{% highlight python %}
{% github_sample /QualiSystems/vCenterShell/blob/master/static_vm_package/VCenterAutoloadStaticVMDriver/app_discovery/vm_autoload_driver.py 65 70  %}
{% endhighlight %}

12) Scroll down to the bottom of the file, and add the following code:

{% github_sample_ref /QualiSystems/vCenterShell/blob/master/static_vm_package/VCenterAutoloadStaticVMDriver/app_discovery/vm_autoload_driver.py %}
{% highlight python %}
{% github_sample /QualiSystems/vCenterShell/blob/master/static_vm_package/VCenterAutoloadStaticVMDriver/app_discovery/vm_autoload_driver.py 87 111  %}
{% endhighlight %}

13) Save the file.

14) In command-line, navigate to the shell’s root folder and package the shell.

{% highlight bash %}shellfoundry pack{% endhighlight %}
