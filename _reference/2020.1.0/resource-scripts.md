---
layout: page
title: Resource Scripts
category: ref
order: 15
comments: true
version:
    - 2020.1.0
---

{% assign pageUrlSplited = page.url | split: "/" %}
{% assign pageVersion = pageUrlSplited[2] %}

Resource scripts allow you to add automation to specific sandbox components. These scripts are intended to add simple functionality, or to be used for testing and debugging activities. Note that in order to add automation to a shell, the best practice is to use the component's driver.

### Using the script_helper

Resource scripts get information from the sandbox component using the script_helper.

**To use the script helper:** 

Import the *cloudshell-automation-api* python package and add it to your script, as illustrated in the example below. Note that the package is automatically imported when your sandbox starts. In this example, the following code gets an object that contains all of the sandbox’s information:

{% highlight python %}
import cloudshell.helpers.scripts.cloudshell_scripts_helpers as script_help
{% endhighlight %}

To execute this code from within CloudShell, you will also need to include a *requirements.txt* file with your script, and rename the resource script to **__main__.py**. The **__main__.py** file is used as the script's entry point, when the script is a package containing multiple files. Finally, zip the two files together, upload the zip package to CloudShell Portal's **Manage>Scripts>Resource** page and make sure to specify the **Models** of the resources this script applies to.

If you want to write your own packages and use them in your script, make sure to place them in the local PyPi Server repository on the Quali Server machine. For details, see CloudShell Help's <a href="http://help.quali.com/Online%20Help/8.3/Portal/Content/Admn/Pyth-Cnfg-Mds.htm" target="_blank">PyPi Server - Managing Python Driver and Script Dependencies</a>.

To facilitate writing and debugging activities, it is recommended to use advanced IDEs such as PyCharm, which provide autocomplete functionality, as illustrated below. 

![Resource information]({{site.baseurl}}/assets/resource_context.png){:class="img-responsive"}

### Accessing the sandbox component

Use the *get_resource_context* method to access and use the sandbox component in your resource script. 

For example, let's assume we want to get metadata information from the component, such as name and address:

{% highlight python %}
resource_name = script_help.get_resource_context_details().name
resource_address = script_help.get_resource_context_details().address
{% endhighlight %}

Or to get information from attributes on the component:

* For global attributes, use the attributes element. For example, "Region" and "Execution Server Selector":

{% highlight python %}
resource_region = script_help.get_resource_context_details().attributes.Region
resource_ess = script_help.get_resource_context_details().attributes["Execution Server Selector"]
{% endhighlight %}

* For namespaced attributes (i.e. attributes that exist on a 2nd Gen shell only), provide the full attribute name, including the namespace. For example, "Vendor" and "OS Version":

{% highlight python %}
resource_vendor = script_help.get_resource_context_details().attributes['CS_Switch.Vendor']
resource_os_version = script_help.get_resource_context_details().attributes['CS_Switch.OS Version']
{% endhighlight %}

### Using API from the resource script

To use the API, create a session variable that uses the helper's get_api_session method:

{% highlight python %}
session = script_help.get_api_session()
{% endhighlight %}

### Getting reservation context details

The *get_reservation_context_details* helper provides the reservation context. 

![get_reservation_context_from_resource_scripts]({{ site.baseurl}}/assets/resource_reservation_context_details.png)

To get this object, include this line in your script:

{% highlight python %}
from cloudshell.helpers.scripts.cloudshell_scripts_helpers import get_reservation_context_details
{% endhighlight %}

Note that starting with CloudShell 9.2, you can also get the CloudShell user who ran the command using the *get_reservation_context_details* helper.

For example:

{% highlight python %}
user = get_reservation_context_details().running_user
{% endhighlight %}

### Returning outputs from a resource script

In order to return outputs, use `print`. This applies to flat scripts and methods nested within resource scripts. 

The script standard output is returned as the command result. However, if an exception is raised, or if a non-zero process result code is returned, the execution will be considered a failure. As a side note, in CloudShell, the output of a script is displayed in the **Output** console in the sandbox workspace, so whatever you print in your script will find its way there.

For example:

{% highlight python %}
import cloudshell.helpers.scripts.cloudshell_scripts_helpers as script_help

def print_output():
    resource_address = script_help.get_resource_context_details().address
    print(resource_address)
 {% endhighlight %}

### Associating a resource script to a CloudShell resource

1) Place the python script(s) and requirements.txt files in a folder.

2) From within the folder, select the two files and zip.

3) In CloudShell Portal's **Scripts** management page, open the **Resource Scripts** page and add the zip file.

4) **Edit** the script and from the **Models** drop-down list, select the models of the resources and services.

![Resource information]({{site.baseurl}}/assets/resource_script-add-to-cloudshell.png){:class="img-responsive"}

5) Click **Save**.

### Example

In this example, we use the CloudShell Automation API to get the resource's vendor and OS version:

**requirements.txt**

{% highlight bash %}
cloudshell-automation-api>=9.3,<9.4
{% endhighlight %}

**__main__.py**

{% highlight python %}
import cloudshell.helpers.scripts.cloudshell_scripts_helpers as script_help

session = script_help.get_api_session()

resource_vendor = script_help.get_resource_context_details().attributes['CS_Switch.Vendor']
resource_os_version = script_help.get_resource_context_details().attributes['CS_Switch.OS Version']

session.WriteMessageToReservationOutput(
    reservationId=script_help.get_reservation_context_details().id,
    message='the resource vendor is {}'.format(resource_vendor)
)

session.WriteMessageToReservationOutput(
    reservationId=script_help.get_reservation_context_details().id,
    message='the resource OS version is {}'.format(resource_os_version)
)
{% endhighlight %}


