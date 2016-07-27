---
layout: page
title: Scripts Deep Dive
category: orch
comments: true
order:  6
---

In this section we'll take a more in depth view at scripts and how they can be
used most effectively for CloudShell orchestration.

#### How CloudShell handles scripts

CloudShell executes a Python script in a very simple and straightforward way by simply running it with a Python executable.
To send information to the script, CloudShell sets environment variables in the scope of the script process.
These environment variables include information about the sandbox reservation, as well as the script parameters.
The script output is returned as the command result. If an exception is raised,
or if a non zero result code is returned by the script, the execution will be considered a failure.

#### Using a main function and packaging multiple files

As scripts become more complex, instead of structuring them as one big function, its recommended
to create a _main_ function and separate the rest of the logic to different functions. Python
requires to include some boilerplate code in addition to the _main_ function to make this work.
Here is some example code demonstrating how to use _main_ functions with scripts:

{% highlight python %}

import cloudshell.helpers.scripts.cloudshell_scripts_helpers as helpers
import os

def print_keys():
    for key in os.environ:
        print key + " : " + os.environ[key]

def print_app_names(session):
    reservation_details = session.GetReservationDetails().ReservationDescription
    for app in reservation_details.Apps:
        print app.Name

def main():
    session = helpers.get_api_session()
    print_keys()
    print_app_names(session)

if __name__ == "__main__":
    main()

{% endhighlight %}

As you're writing more complex orchestration scripts, it may become prudent to also separate
the code to multiple files. To do that, we can take advantage of Python's ability to support executing zip files
containing multiple scripts. The only requirement, is that one of the files is name _\_\_main\_\_.py, which is how
the entry point of the Python process is determined.

#### Referencing other packages

As opposed to Shell drivers, CloudShell doesn't look for a requirement.txt file for scripts and doesn't attempt
to retrieve dependencies from Pypi. The script dependencies must be installed on the Python used by the Execution Server.

On windows machines, the ES will by default use the Python included with the ES installation. It can be found in the
_\\Python\\2.7.10_ directory under the ES installation folder. If you're using Linux, the Execution Server will use
the default Python configured in the os. In both cases it is possible, however, to specify a different Python environment. To do so, add the following key
to the execution server _customer.config_ file:

{% highlight xml %}
<add key="ScriptRunnerExecutablePath" value="PATH_TO_EXECUTABLE" />
{% endhighlight %}

To install a dependency, run the following using the Python executable referenced by the ES:

{% highlight bash %}
python -m pip install [PACKAGE_NAME]
{% endhighlight %}

As dependencies can get complex, it is recommended to keep a centralized _requirements.txt_ file where you can catalog
the requirements of all of the orchestration scripts and add new ones if needed. This will both make it easier to keep
track of the dependencies used by the orchestration scrips and avoid version conflicts, and make it easier to deploy new
Execution Servers. Instead of installing each dependency independently you'll then be able to run:

{% highlight bash %}
python -m pip install -r [REQUIREMENTS_FILE_PATH]
{% endhighlight %}

#### Setup and teardown scripts

Setup and teardown are a special types of orchestration scripts. There are two things that make them
special:

1. They can't have any inputs as they are being launched automatically
2. If you use the default 'Python Setup & Teardown' driver, then simply including a teardown or setup
    script in the reservation and setting a duration for the setup/teardown is enough for CloudShell
    to launch it.

To set a script as a teardown or setup script, you need to edit it from the script management page.
One of the fields allows you to select the _Script Type_. By choosing 'Setup/Teardown' the script will take on
that special behavior. Notice that you'll not be able to run it separately from the environment built in setup and teardown
commands and you won't be able to add any inputs to it.

#### Debugging scripts

CloudShell includes some helper functions to make it easier to debug a script by running it
on real sandbox reservation data. The helper functions allow the script to "attach" to a CloudShell
Sandbox, by filling in all of the environment variables of the script so that the same information
is available to it as would be if CloudShell launched it.

To attach to a CloudShel sandbox, first create a sandbox reservation, then add the following code
and fill in the required data for the function parameters.

{% highlight python %}
import cloudshell.helpers.scripts.cloudshell_dev_helpers as dev_helpers
dev_helpers.attach_to_cloudshell_as(user="CLOUDSHELL_USER", password="CLOUDSHELL_PWD", domain="DOMAIN",
                                    reservation_id="RESERVATION_ID", server_address="ADDRESS", command_parameters={"NAME":"VALUE"})
{% endhighlight %}      

If we include the above code in the example script we provided earlier, we'll be able to run it locally as
well as from the CloudShell sandbox. The  _attach_to_cloudshell_as_ function will populate all of the environment data
as CloudShell would so from the code perspective it doesn't make a different where its being run from. Furthermore,
the code will ignore the special _attach_to_cloudshell_as_ function if you run it from CloudShell so that there is no
adverse effect to leaving the statement there.

One drawback of using this strategy is that its probably not a good idea to leave the CloudShell credentials in the code itself
in plain site. That is why we recommend you use a similar function which takes the same information from a file.
Make sure to add that file to the _.gitignore_ list so that it doesn't get on source control of course.
The following code will have the same effect as the lines above, only it will look for the information in a
JSON file named _quali_config.json_ which should be in the project root.

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
    "server_address" : "SERVER_ADDRESS"
    "cloudshell_api_port" :"CLOUDSHELL_API_PORT"
    "reservation_id" = "reservation_id"
    "command_parameters" = { "PARAM_NAME" : "PARAM_VALUE"    }
}
{% endhighlight %}
