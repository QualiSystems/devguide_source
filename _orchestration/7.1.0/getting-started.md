---
layout: page
title: Getting Started
category: orch
order: 1
comments: true
version:
    - 7.1.0
tags:
    - orchestration
---
Orchestration scripts can enable automating sandbox workflows. You can use orchestration scripts to create setup
and teardown procedures as well as other custom workflows that can be made available in the sandbox. Examples would include
saving and restoring state, starting test traffic, running a failover scenarios and more.

_**Before developing scripts, please familiarize yourself with CloudShell by taking [Quali U courses](http://courses.quali.com). These courses also include installation instructions for the CloudShell SDK package that deploys a developer edition of CloudShell on which you can perform your training and development activities.**_

### Creating a simple environment script

In your preferred IDE create a new Python file. For now we'll want to keep its functionality very basic.
Simply add some Python code to print 'Hello CloudShell'.
As a side note, in CloudShell the output of a script is displayed in the output widget in the sandbox workspace,
so whatever you print in your script will find its way there.

{% highlight python %}
print 'hello CloudShell'
{% endhighlight %}

Save the file and give it any name, for example 'hello.py'.

### Uploading the orchestration script to CloudShell

In CloudShell portal, open the Manage dashboard. In the left sidebar, click _Scripts_ and select the _Environment_ option.
The page should be similar to this:

![Scripts Management Page]({{site.baseurl}}/assets/environment_scripts.png){:class="img-responsive"}

Click the ‘Add New Script’ button to fill in some basic details on your script and upload it to CloudShell.
For now, just provide a name for the script, click _Browse_ to upload your script and finally hit click _Save_ to seal the deal. Your script is now in CloudShell, all we need now is a blueprint where it can work its magic.

### Attaching the script to an environment

Open the _Lab Management_ dashboard and select _Environments_. Click _Add New_. A new environment will be created and you’ll be taken to the environment workspace.

Take a second to name your environment, you can do that by clicking on the name next to the pencil icon.
Then click on the environment drop down menu to select _Properties_ that is where we’ll connect our new script.

The last stop is the properties page. Here we’ll simply click the ‘Add Script’ button to assign our new script to the environment
and click the ‘Update’ button at the bottom of the page. That’s it! Our script is ready to be used. However, in order to run
it we’ll need to make our environment go live by creating a reservation. Click the ‘Reserve’ button to create a sandbox
from the environment blueprint. Now, to run the script.

### Executing the script on the sandbox.

Click the _Commands_ button on the toolbar to open the environment commands side-pane.
Click the ‘Play’ icon next to the command to launch it!

If the command executed successfully you should see a checkmark appear next to the command name and the output pane
will display the command output.

![Scripts Management Page]({{site.baseurl}}/assets/run_script.png){:class="img-responsive"}

In the scope of this simple tutorial, we’ve seen how to link a trivial Python script with a CloudShell environment.
We'll look into more concrete example and nuances in later sections of the guide.
