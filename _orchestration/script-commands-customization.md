---
layout: page
title: Script commands Visibility and Usability
category: orch
date: "2016-04-30 13:02:32 +0300"
order: 6
comments: true
tags:
    - orchestration
---
You can control many aspect of how the orchestration commands appear and behave
in CloudShell by editing the script from the scripts management page.

To demonstrate these capabilities, we'll create a simple script which we'll customize.
The script essentially prints out the parameters it receives and then sets the Sandbox
status to 'Online'.

Create a new Python file and name it _customization_test.py_. Add the following code:

{% highlight python %}

cloudshell.helpers.scripts.cloudshell_scripts_helpers as helpers
import cloudshell.helpers.scripts.cloudshell_dev_helpers as dev_helpers
from cloudshell.api.cloudshell_api import CloudShellAPISession

def print_parameters_values():
    print helpers.get_user_param("first_param")
    print helpers.get_user_param("second_param")

def change_reservation_status_to_online(session):
    """
    :param CloudShellAPISession session:
    :return:
    """
    session.SetReservationLiveStatus(helpers.get_reservation_context_details().id, "Online")

def main():
    session = helpers.get_api_session()
    dev_helpers.attach_to_cloudshell()
    print_parameters_values()
    change_reservation_status_to_online(session)

if __name__ == "__main__":
    main()

{%  endhighlight %}

In the CloudShell portal, open the Management tab. Navigate to the _Scripts_ sub section and select _Environment_.

![Scripts Management Page]({{ site.baseurl}}/assets/environment_scripts.png){:class="img-responsive"}

Drag and drop or add the _customization_test.py_ script. Then click the "Edit" button to customize it.

![Scripts Management Page]({{ site.baseurl}}/assets/orch_script_edit.png){:class="img-responsive"}

### Setting display name, descriptions and category

You can set the script display name or alias by editing the "Alias" field in the edit form.
Note that if you try to execute this script as a command from the API you'll still need to reference it by
its name. Set the alias to _Customization Script_.

The description is also easy to set via the edit form. Enter any text here, it will be displayed as a reference
under the script name in the commands pane.

Categories help improve usability by grouping commands with a similar role or domain under a folder in the sandbox command
panel. This grouping has visual implications only and will not affect API calls. For this example, let's set the category name
to 'Customization'.

### Adding parameters

Our script expects two parameters, but CloudShell has no way of knowing that. We need to add these parameters
in this same form.

Click the "Add Parameter" link at the bottom of the form. Set the _Name_ as 'first_param' and the _Default Value_ as 'None',
finally fill in the description field with any text. If the command parameters don't have default values, they will become
mandatory and the user won't be able to execute the command without filling in values for them.

Repeat the process, this time for the second param which the script expects to be named "second_param".

### Test the new look and feel

To test the script, we need to add it to a blueprint. Go to Lab Management -> Environment. Create a new environment or
select an existing one and attach the script to it from the properties page of the environment.
Reserve the environment and open the command pane in the sandbox.

![Scripts Management Page]({{ site.baseurl}}/assets/scripts_customization.png){:class="img-responsive"}
