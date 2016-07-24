---
layout: page
title: Getting information from CloudShell
category: orch
order: 2
---

Information about the sandbox you're script is running on and its components is automatically available in your script
as an environment variable. The standard way to get that information in Python is to use the ‘os’ package.

{% highlight python %}
import os
os.environ['RESERVATIONCONTEXT']
# {"id":"5487c6ce-d0b3-43e9-8ee7-e27af8406905",
#  "ownerUser":"bob",
#  "ownerPass":"nIqm+BG6ZGJjby5hUittVFFJASc=",
#  "domain":"Global",
#  "environmentName":"My environment",
#  "description":"New demo environment",
#  "parameters":
#    { "globalInputs": [],
#      "resourceRequirements":[],
#      "resourceAdditionalInfo":[]}}

{% endhighlight %}

However, we’ve added helpers to make it easier to get that information without having to parse the environment
variables yourself. Just import our helper classes to take advantage of that functionality.
You can use the following code to get an object which contains all of the sandbox information:

{% highlight python %}
import cloudshell.helpers.scripts.cloudshell_scripts_helpers as helpers
helpers.get_reservation_context_details()
{% endhighlight %}

This will return a Python object you can use to query the same reservation information directly:

![Sandbox information]({{ site.url }}/devguide/assets/reservation_context.png){:class="img-responsive"}

### Accessing the sandbox user inputs

The user inputs provided by the user when he reserved the blueprint are also a contextual information that can be
accessed by your script. This data is stored in several environment variables based on the input type:

* Global inputs - These inputs are a part of the reservation form and can represent general data you wish to
collect form the user for your automation. They can also be used to group together multiple other inputs as one data entry.
You can access these using the ‘GLOBALINPUTS“ environment variable.
