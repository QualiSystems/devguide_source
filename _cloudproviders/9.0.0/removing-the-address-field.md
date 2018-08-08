---
layout: page
title: Removing the Address Field
order: 8
comments: true
version:
    - 9.0.0
---

For some cloud providers, like AWS EC2 and Azure, the **Address** field is irrelevant. If this is the case, you can easily remove the field from the shell by setting the **hide_address** property in the shell-definition.yaml. In the *auto_discovery_capability* section, under `properties`, make sure the property is uncommnented and set it to *true*:

{% highlight yaml %}
hide_address:
  type: string
  default: true
{% endhighlight %}