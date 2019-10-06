---
layout: page
title: Enabling Intellisense in Shells and Scripts (using Docstrings)
category: ref
order: 23
comments: true
version:
    - 9.0.0
---

{% assign pageUrlSplited = page.url | split: "/" %}
{% assign pageVersion = pageUrlSplited[2] %}

In this article, we'll learn how to set up Python documentation strings in shells and scripts. 

Python documentation strings (or docstrings) allow you to associate documentation with python modules, functions, classes and methods. This will allow the IDE to recognize the CloudShell elements we want to use, and provide intellisense whenever we type them in our methods. For additional information about docstrings, check out this <a href="https://docs.python.org/3/tutorial/controlflow.html#documentation-strings" target="_blank">Python documentation page</a>.

*To make use of intellisense, we recommend to use an IDE that supports such capabilities, such as PyCharm.*

### Docstrings in shells

Let's start by creating a shell:

{% highlight bash %}
shellfoundry new docstrings-test
{% endhighlight %}

Since we created our shell from a shell template, in this case the generic resource template, we already have docstrings defined for the out of the box method:

![docstrings]({{site.baseurl}}/assets/docstrings.png)

The initialize command's docstring defines the *InitCommandContext* object. Therefore, if we want to use this context in the method, intellisense will recognize the object and display its contents:

![docstrings-context]({{site.baseurl}}/assets/docstrings-context.png)

Note that if you create your own methods in the driver, you will need to manually create the docstrings and fill in the parameter types. First, create a method that uses the shell's *context* object and type six quotes in the method. Note that in Pycharm, when you type in three quotes, the IDE will add an additional three automatically. Make sure the cursor is in the middle (3 quotes before and 3 after) and press the **[Enter]** key. The docstrings section is created, listing the method's referenced parameters (in our case, *context*):

![docstrings-manual-2]({{site.baseurl}}/assets/docstrings-manual-2.png)

At this point, intellisense still doesn't recognize the object, as context can be any one of the driver's imported "context" objects:

![docstrings-context-2]({{site.baseurl}}/assets/docstrings-context-2.png)

So let's fill in the object's type (in our case, *ResourceCommandContext*) and optionally provide an informative description:

![docstrings-manual-3]({{site.baseurl}}/assets/docstrings-manual-3.png)

Now when you write "context" in the method, intellisense will identify it as a *ResourceCommandContext* object and display the appropriate information:

![docstrings-manual-4]({{site.baseurl}}/assets/docstrings-manual-4.png)

Note that the type doesn't have to be a class. It can also be a string or integer and it's a good practice to define your method's parameters this way. For example, if you'd like to define a custom parameter that is a string, you'd write something like this:

![docstrings-manual-5]({{site.baseurl}}/assets/docstrings-manual-5.png)

### Docstrings in orchestration scripts

*sandbox* is the main object we use in CloudShell blueprint and orchestration scripts. The *sandbox* object is provided with the *cloudshell-orch-core* python package so include it in your *requirements.txt* file, import the *sandbox* object into the __main__.py file, and set the docstring in your method as follows:

![docstrings-orchestration-scripts]({{site.baseurl}}/assets/docstrings-orchestration-scripts.png)

### Docstrings in resource scripts

In CloudShell resource scripts, we mainly use the *cloudshell_script_helpers* object. Since *cloudshell_script_helpers* is a module of functions and variables, you can access its contents directly from your method without having to create a docstring. The object is provided with the *cloudshell-automation-api* python package so include it in your *requirements.txt* file and import the object as "script_help" into the __main__.py file and you're good to go.

For example:

![docstrings-resource-scripts]({{site.baseurl}}/assets/docstrings-resource-scripts.png)
