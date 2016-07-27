---
layout: page
title: Getting Started
category: orch
order: 1
comments: true
tags:
    - orchestration
---
Orchestration scripts can enable automating sandbox workflows. You can use orchestration scripts to create setup
and teardown procedures as well as other custom workflows that can be made available in the sandbox. Examples would include
saving and restoring state, starting test traffic, running a failover scenarios and more.

### Creating a simple environment script

In your preferred IDE create a new Python file. For now we'll want to keep what it does very basic.
Simply add some Python code to print 'Hello CloudShell'.
As a side note, in CloudShell the output of a script is displayed in the output widget in the sandbox workspace,
so whatever you print in your script will find its way there.

{% highlight python %}
print 'hello CloudShell'
{% endhighlight %}

Save the file and give it any name, for example 'hello.py'.

### Uploading the orchestration script to CloudShell

Open the management tab on the CloudShell portal. Navigate to the _Scripts_ sub section and select _Environment_.
The page should be similar to this:

![Scripts Management Page]({{ site.url }}/devguide/assets/environment_scripts.png){:class="img-responsive"}

Click the ‘Add New Script’ button to fill in some basic details on your script and upload it to CloudShell.
For now, just provide a name to the script and click the ‘browse’ button to upload your script and finally hit the ‘Save’
button to seal the deal. Your script is now in CloudShell, all we need now is a blueprint where it can work its magic.

### Attaching the script to an environment

Click on the ‘Lab Management’ tab and choose ‘Environments’ . Click the ‘Add New’ link to create a new environment.
A new environment will be created and you’ll be taken to the environment workspace.

Take a second to name your environment, you can do that by clicking on the name next to the pencil icon.
Then click on the environment drop down menu to select ‘Properties’ that is where we’ll connect our new script.

The last stop is the properties page. Here we’ll simply click the ‘Add Script’ button to assign our new script to the environment
and click the ‘Update’ button at the bottom of the page. That’s it, our script is ready to be used. However, in order to run
it we’ll need to make our environment go live by creating a reservation. Click the ‘Reserve’ button to create a sandbox
from the environment blueprint. Now, to run the script.

### Executing the script on the sandbox.

Click on the ‘Commands’ button on the toolbar to open the environment commands side-pane.
Click the ‘Play’ icon next to the command to launch it!

If the command executed successfully you should see a checkmark appear next to the command name and the output pane
will display the command output.

![Scripts Management Page]({{ site.url }}/devguide/assets/run_script.png){:class="img-responsive"}

In the scope of this simple walkthrough, we’ve seen how to link a trivial Python script with a CloudShell environment.
We'll look into more concrete example and nuances in later sections of the guide.
