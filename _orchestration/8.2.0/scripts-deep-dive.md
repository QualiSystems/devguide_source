---
layout: page
title: Scripts Deep Dive
category: orch
comments: true
version: 
    - 8.2.0
order:  6
---

In this section we’ll take a more in-depth view at scripts and learn how they can be used most effectively for CloudShell orchestration.

#### How CloudShell handles scripts

CloudShell executes a Python script by creating a temporary virtual environment for the script’s execution, downloading all required packages from the script’s requirements.txt file and executing the script using the Execution Server python engine. 

To send information to the script, CloudShell sets environment variables in the scope of the script process. These environment variables include information about the sandbox reservation, as well as the script’s parameters. The script standard output is returned as the command result. If an exception is raised, or if a non-zero process result code is returned, the execution will be considered a failure.


#### Using requirements.txt with CloudShell orchestration scripts

It’s now possible to attach a requirements.txt file to make sure your script will have all dependencies installed on the virtual environment before the script’s execution starts. 

*To use the requirements.txt:*
* Archive this file with the orchestration script in one ZIP file. It will then be possible to upload this ZIP file to CloudShell using the CloudShell Portal.

#### Using a main function and packaging multiple files

As scripts become more complex, instead of structuring them as one big function, it is advisable to create a main function and separate the rest of the logic into different functions. Python requires some boilerplate code in addition to the main function to make this work. Here is an example code demonstrating how to use main functions with scripts:

{% highlight python %}

from cloudshell.workflow.orchestration.sandbox import Sandbox
import os

def print_keys():
    for key in os.environ:
        print key + " : " + os.environ[key]

def print_app_names(sandbox):
    """
    :param Sandbox sandbox:
    :return:
    """
    reservation_details = sandbox.automation_api.GetReservationDetails(sandbox.id).ReservationDescription
    for app in reservation_details.Apps:
        print app.Name

def main():
    sandbox = Sandbox()
    print_keys()
    print_app_names(sandbox)

if __name__ == "__main__":
    main()

{% endhighlight %}

Depending on the complexity of the script, it may be wise to also separate the code into multiple files. To do that, we can take advantage of Python’s ability to support executing .zip archives containing multiple scripts. The only requirement is that one of the files is named ____main____.py, which is how the entry point of the Python process is determined.

#### Setup and teardown scripts

Setup and teardown are special types of orchestration scripts. There are two things that make them special:
1. They can’t have any inputs as they are launched automatically
2. If you use CloudShell’s default *Python Setup & Teardown* driver, then simply including a teardown or setup script in the reservation and setting a duration for the setup/teardown is enough for CloudShell to launch it.

*To set a script as a teardown or setup script:*

1. In the *Scripts - Blueprint* management page, edit the script. 
2. From the script’s *Script Type* dropdown list, select *Setup* or *Teardown*, as appropriate.
The script will take on that special behavior. Note that the script can only run as part of the sandbox Setup or Teardown process. In addition, you won’t be able to add any inputs to it.

#### Logging in orchestration scripts
*To implement logging in your orchestration script:*

* Use Sandbox.logger, which is based on the CloudShell standard logging format. 
The logger lists all the data that is needed for debugging the script, including the Sandbox id, function names, error level, time stamp and more.


{% highlight python %}
from cloudshell.workflow.orchestration.sandbox import Sandbox

Sandbox = Sandbox()

resource_name = 'My_Resource'
try:
    Sandbox.automation_api.IncludeResource(resource_name)
except:
    Sandbox.logger.error('Failed to include resource {0}'.format(resource_name))
{% endhighlight %}

#### Debugging scripts

CloudShell includes some helper functions to make it easier to debug a script by running it on real sandbox reservation data. The helper functions allow the script to be “attached” to a CloudShell sandbox, by filling in all of the script’s environment variables so that the same information is available to it as if it were launched by CloudShell.

*To attach a script to a CloudShell sandbox:*


As you're writing more complex orchestration scripts, it may become prudent to also separate
the code to multiple files. To do that, we can take advantage of Python's ability to support executing _.zip_ archives
containing multiple scripts. The only requirement, is that one of the files is named _\_\_main\_\_.py_, which is how
the entry point of the Python process is determined.

#### Referencing other packages

1. Create a Sandbox reservation. 
2. Add the following code and fill in the required data for the function parameters.

{% highlight python %}
import cloudshell.helpers.scripts.cloudshell_dev_helpers as dev_helpers
dev_helpers.attach_to_cloudshell_as(user="CLOUDSHELL_USER", password="CLOUDSHELL_PWD", domain="DOMAIN",
                                    reservation_id="RESERVATION_ID", server_address="ADDRESS", command_parameters={"NAME":"VALUE"})
{% endhighlight %}


Note that if we include the above code in the example script we provided earlier, we’ll be able to run it locally as well as from the CloudShell Sandbox. The attach_to_cloudshell_as function will populate all of the blueprint data as CloudShell would, so from the code’s perspective, it doesn’t make a different where it is being run from. Furthermore, the code will ignore the special attach_to_cloudshell_as function if you run it from CloudShell so that there is no adverse effect to leaving the statement there.


However, using this strategy will expose your CloudShell credentials in the code. To avoid this, we recommend you use a similar function which takes the same information from a file. Make sure to add that file to the .gitignore list so that it doesn’t get on source control. The following code will have the same effect as the lines above, but will look for the information in a JSON file named quali_config.json, which should be in the project root.

{% highlight python %}
import cloudshell.helpers.scripts.cloudshell_dev_helpers as dev_helpers
dev_helpers.attach_to_cloudshell()
{% endhighlight %}

The _quali_config.json_ should have the following structure:

{% highlight JSON %}
{
    "user" : "USER",
    "password" : "PASSWORD",
    "domain" : "DOMAIN",
    "server_address" : "SERVER_ADDRESS",
    "cloudshell_api_port" :"CLOUDSHELL_API_PORT",
    "reservation_id" : "reservation_id",
    "command_parameters" : { "PARAM_NAME" : "PARAM_VALUE"    }
}
{% endhighlight %}
