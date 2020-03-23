---
layout: page
title: Getting Started
category: orch
order: 1
comments: true
version: 
    - 9.3.0
tags:
    - orchestration
---

{% assign pageUrlSplited = page.url | split: "/" %}
{% assign pageVersion = pageUrlSplited[2] %}

Orchestration scripts can enable automating sandbox workflows. You can use orchestration scripts to create setup
and teardown procedures as well as other custom workflows that can be made available in the sandbox. Examples would include
saving and restoring state, starting test traffic, running a failover scenarios and more. *Please note that sandbox environment automation and enhanced orchestration is available with CloudShell Premium Tier.*

_**Before developing scripts, please familiarize yourself with CloudShell by taking [Quali U courses](http://courses.quali.com). These courses also include installation instructions for the CloudShell SDK package that deploys a developer edition of CloudShell on which you can perform your training and development activities.**_


### Prerequisites
* [Get CloudShell](http://info.quali.com/cloudshell-developer-edition-download): Download the latest CloudShell SDK and run it on your machine. 
* [Python](https://www.python.org/downloads/): Make sure the appropriate Python version - 2.7.x and/or 3.x - (latest recommended) is installed on your machine.
<br>Starting with CloudShell 9.2, CloudShell comes with out-of-the-box support for python 3 for orchestration scripts.
* For python 3 orchestration script automation, make sure to install Microsoft Visual C++ Redistributable 2015 Redistributable on the Execution Server(s).
* **IDE/Text Editor:** Your preferred IDE editor. We recommend using PyCharm (which offers a free community edition) because of the tooling we’ve already created for that IDE, including a CloudShell developer plugin.


### Creating and using orchestration scripts in CloudShell

This procedure shows the basic steps for creating and using orchestration scripts in CloudShell.

1) Create a python script. You can create a single python script, or a more complex orchestration that uses dependencies, as explained in [Scripts Deep Dive]({{site.baseurl}}/orchestration/{{pageVersion}}/scripts-deep-dive.html).

2) If the script requires the use of python dependencies, which aren’t available in the public PyPi repository, add them to the local PyPi Server. See CloudShell Help's <a href="http://help.quali.com/Online%20Help/0.0/Portal/Content/Admn/Updt-Pyth-Libs.htm" target="_blank">Updating Python Dependencies for Shells, Drivers and Scripts</a>.

3) Upload the script to CloudShell. When uploading the script, you can set it as a setup or teardown script, to have it run automatically in the sandbox, or leave it as a manually launched orchestration script.

4) Attach the script to the blueprint. If it’s a setup or teardown script, remove the blueprint’s existing script first.

### Creating a simple blueprint script

In your preferred IDE create a new Python file. For now we'll want to keep its functionality very basic.
Simply add some Python code to print 'Hello CloudShell'.
As a side note, in CloudShell the output of a script is displayed in the output widget in the sandbox workspace,
so whatever you print in your script will find its way there.

{% highlight python %}
print 'hello CloudShell'
{% endhighlight %}

Save the file and give it any name, for example 'hello.py'.

### Uploading the orchestration script to CloudShell

In CloudShell Portal, open the **Manage** dashboard. In the left sidebar, click **Scripts** and select the **Blueprint** option.
The page should be similar to this:

![Scripts Management Page]({{ site.baseurl}}/assets/environment_scripts_9.2.png){:class="img-responsive"}

Click the **Add New Script** button and browse for the script. Once the script is uploaded, click **Edit**. 
For now, just provide a name for the script (the script's file name is the default) and select the script's python version.

![Scripts Management Page]({{ site.baseurl}}/assets/environment_script_hello_9.2.png){:class="img-responsive"}

And click **Save** to seal the deal. Your script is now in CloudShell, all we need now is a blueprint where it can work its magic.

### Attaching the script to a blueprint

Open the **Blueprints** dashboard. Click **Add New**. A new blueprint will be created and you’ll be taken to the blueprint's workspace.

Take a second to name your blueprint, you can do that by clicking the name next to the pencil icon.

The last stop is the properties page. This is where we’ll connect our new script. Click the **Blueprint** drop down menu and select **Properties**. 

Here we’ll simply click the **Add Script** button to assign our new script to the blueprint
and click the **Update** button at the bottom of the page. That’s it! Our script is ready to be used. However, in order to run it, we’ll need to make our blueprint go live by creating a sandbox. Click the **Reserve** button to create a sandbox
from the blueprint. Next, let's run the script.

### Executing the script in the sandbox

Click the **Commands** button on the toolbar to open the **Blueprint Commands** side-pane.

Click the **Run** icon next to the command to launch it!

If the command executed successfully you should see a checkmark appear next to the command name and the **Output** pane
will display the command output.

![Scripts Management Page]({{ site.baseurl}}/assets/run_script.png){:class="img-responsive"}

In the scope of this simple tutorial, we’ve seen how to link a trivial Python script with a CloudShell blueprint.
We'll look into more concrete examples and nuances in later sections of the guide.

### Best Practices for working with orchestration scripts

When developing orchestration scripts, we recommend to download the latest default setup or teardown script from CloudShell Portal's **Manage>Scripts** page, make a copy and modify the contents. This will ensure you are using the right packages and structure.

If you wish to develop an orchestration script from scratch or develop a script for a different CloudShell version, you will need to import the *cloudshell-orch-core* package, which provides the basic features and capabilities needed for CloudShell orchestration scripts. Use this table to decide which version to use:

<style>
table {
    font-family: arial, sans-serif;
    border-collapse: collapse;
    width: 100%;
}

td, th {
    border: 1px solid #dddddd;
    text-align: left;
    padding: 8px;
}

tr:nth-child(even) {
    background-color: #dddddd;
}
</style>

| CloudShell version | cloudshell-orch-core version |
| :--------- | :--------- |
| 8.3 GA | >=1.7.5.0,<1.7.6.0 |
| 9.0 GA | >=2.0.0.0,<2.1.0.0 |
| 9.1 GA | >=2.1.0.0,<2.2.0.0 |
| 9.2 GA | >=3.0.0.0,<3.1.0.0 |
| 9.3 GA | >=3.2.0.0,<3.3.0.0 |

To set a specific version of the package, add a line to the script's requirements.txt file. For example:

{% highlight bash %}
cloudshell-orch-core>=2.1.0.0,<2.2.0.0
{% endhighlight %}

For details about the requirements.txt file, see [Scripts Deep Dive]({{site.baseurl}}/orchestration/{{pageVersion}}/scripts-deep-dive.html).

### Setting the default python version for new orchestration scripts

Starting with CloudShell 9.2, the *DefaultPythonVersion* admin key allows you to control the python version in which all new orchestration scripts are created. For details, see CloudShell help's <a href="https://help.quali.com/Online%20Help/0.0/Portal/Content/Admn/Wrk-wth-Cnfg-Ky.htm" target="_blank">Advanced CloudShell Customizations</a>.

Note that this key also applies to new shells.
