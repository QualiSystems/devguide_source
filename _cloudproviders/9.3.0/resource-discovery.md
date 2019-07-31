---
layout: page
title: "Resource Discovery"
order: 15
comments: true
version:
    - 9.3.0
---

The *get_inventory* command “discovers” the resource in CloudShell, or in other words, validates the values of the cloud provider attributes that were entered by the user. It is executed when creating the resource in CloudShell, and can be manually run later on, for example, if you change some of the resource’s attribute values.

For example, in a vCenter cloud provider, *get_inventory* would check the value provided in the **Default DataCenter** attribute
to validate that such a datacenter exists in the vCenter Server.

In addition, this is the place to assign values to optional attributes that were not given a value by the CloudShell admin.

### Signature

{% highlight python %}
def get_inventory(self, context)
{% endhighlight %}

### Inputs

**context**: *context* is an *AutoLoadCommandContext* object that contains:

* connectivity - CloudShell server connectivity data for authentication with CloudShell Automation API 
* resource - resource configuration settings entered by the user when creating the new resource in the **Inventory** dashboard

{% github_sample_ref /QualiSystems/cloudshell-shell-core/blob/36009fdec45134ae38cb9273328b7686be66e553/cloudshell/shell/core/driver_context.py %}
{% highlight python %}
{% github_sample /QualiSystems/cloudshell-shell-core/blob/36009fdec45134ae38cb9273328b7686be66e553/cloudshell/shell/core/driver_context.py 133 138 %}
{% endhighlight %}

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**Note:** The convention for specifying *context.resource.attributes* keys in the driver files(s) is: `my_shell_name.attribute_name`.

### Return value

The *AutoloaDetails* class that represents details discovered by the *get_inventory* function. 

{% github_sample_ref /QualiSystems/cloudshell-shell-core/blob/36009fdec45134ae38cb9273328b7686be66e553/cloudshell/shell/core/driver_context.py %}
{% highlight python %}
{% github_sample /QualiSystems/cloudshell-shell-core/blob/36009fdec45134ae38cb9273328b7686be66e553/cloudshell/shell/core/driver_context.py 141 146 %}
{% endhighlight %}

### Error handling
If one of the validations failed, an error indication will be displayed in CloudShell and the resource will be marked as excluded.

### get_inventory method implementation example

{% github_sample_ref /QualiSystems/Custom-L2-Cloud-Provider-Shell-Example/blob/865f356f4aec14e170cd9e5f30b575c48f2dc865/src/driver.py %}
{% highlight python %}
{% github_sample /QualiSystems/Custom-L2-Cloud-Provider-Shell-Example/blob/865f356f4aec14e170cd9e5f30b575c48f2dc865/src/driver.py 42 70 %}
{% endhighlight %}







