---
layout: page
title: Removing the Address Field
order: 8
comments: true
version:
    - 9.0.0
---

For some cloud providers, like AWS EC2 and Azure, the **Address** field is irrelevant. If this is the case, you can easily remove the field by setting the **hide_address** property in the shell-definition.yaml. In the *auto_discovery_capability* section, under `properties`, set the property to *true*:

{% highlight yaml %}
hide_address:
  type: string
  default: true
{% endhighlight %}