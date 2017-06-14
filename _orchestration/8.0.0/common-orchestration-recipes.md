---
layout: page
title: Common Orchestration Script Recipes
category: orch
comments: true
order:  9
version: 
    - 8.0.0
    - 7.1.0
---

In this section we'll provide a few handy examples of common script operations.
The intention is to grow this into a good source to copy paste common code from.
All of the examples will be available in the
[DevGuide Examples](https://github.com/QualiSystems/devguide_examples) repository
under the _script_driver_recipes_ folder.

#### Executing commands on sandbox resources

The following script will try to execute a command only on resources that support it.
If a resource does not support the command it will simply ignore it and move to the next
resource.

{% github_sample_ref /QualiSystems/devguide_examples/blob/master/orchestration_scripts_examples/try_execute_commands/try_execute_commands.py %}
{% highlight python %}
{% github_sample /QualiSystems/devguide_examples/blob/master/orchestration_scripts_examples/try_execute_commands/try_execute_commands.py 8 28 %}
{% endhighlight %}
