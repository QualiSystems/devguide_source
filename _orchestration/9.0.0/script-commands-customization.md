---
layout: page
title: Script commands Visibility and Usability
category: orch
date: "2016-04-30 13:02:32 +0300"
order: 6
comments: true
version: 
    - 9.0.0
tags:
    - orchestration
---

{% assign pageUrlSplited = page.url | split: "/" %}
{% assign pageVersion = pageUrlSplited[2] %}

You can control many aspects of how the orchestration commands appear and behave in CloudShell by editing the script from the Scripts management page.

To demonstrate these capabilities, we’ll create a simple script, which we’ll later customize. The script essentially prints out the parameters it receives and then sets the status of the sandbox to ‘Downloading’.

1) Create a new Python file and name it customization_test.py. Add the following code:

{% highlight python %}

from cloudshell.workflow.orchestration.sandbox import Sandbox
import cloudshell.helpers.scripts.cloudshell_dev_helpers as dev_helpers

def print_parameters_values(sandbox):
    """
    :param Sandbox sandbox:
    :return:
    """
    print sandbox.get_user_param('first_param')
    print sandbox.get_user_param('second_param')

def change_reservation_status_to_online(sandbox):
    """
    :param Sandbox sandbox:
    :return:
    """
    sandbox.automation_api.SetReservationLiveStatus(sandbox.id, "Downloading")

def main():
    dev_helpers.attach_to_cloudshell()
    sandbox = Sandbox()
    print_parameters_values(sandbox)
    change_reservation_status_to_online(sandbox)

if __name__ == "__main__":
    main()

{%  endhighlight %}

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Note that you can get the Sandbox id by using **sandbox.id**. The Sandbox name is also available via the **sandbox.name** property.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Since this script has imports, you'll need a *requirements.txt* file and a *main.py* function. For details, see [Scripts Deep Dive]({{site.baseurl}}/orchestration/{{pageVersion}}/scripts-deep-dive.html).

2) In CloudShell Portal, open the **Manage** dashboard.

3) Navigate to the _Scripts_ sub section and select **Blueprint**.

![Scripts Management Page]({{ site.baseurl}}/assets/environment_scripts.png){:class="img-responsive"}

4) Add the script into CloudShell by dragging the script into the **Scripts – Blueprint** page or add the customization_test.py script. 

5) To customize the script, click the Edit button.
![Scripts Management Page]({{ site.baseurl}}/assets/orch_script_edit.png){:class="img-responsive"}


### Setting display name, descriptions and category

* You can set the script’s display name or alias by editing the **Alias** field in the edit form. Note that if you try to execute this script as a command from the API, you’ll still need to reference it by its name.
* **Script Type** allows you to set the script as an orchestration script that CloudShell will run accordingly. 
* The **Description** is also easy to set via the edit form. Enter any text here, it will be displayed as a reference under the script name in the commands pane. This does not apply to orchestration scripts.
* Categories help improve usability by grouping commands with a similar role or domain under a folder in the sandbox’s command pane. This grouping is for visual purposes only and does not affect API calls. For this example, let’s set the category name to ‘Customization’.


### Adding parameters

Our script expects two parameters, but CloudShell has no way of knowing that. We need to add these parameters in this same form.

1. Click the **Add Parameter** link at the bottom of the form. 

2. Set the **Name** as ‘first_param’ and the **Default Value** as ‘None’. 
Note that if the command parameters don’t have default values, they will become mandatory and the user won’t be able to execute the command without filling in values for them.

3. Then, enter a meaningful **Description**. 

4. Repeat the process, this time for the second param, which the script expects to be named “second_param”.


### Test the new look and feel

To test the script, we need to add it to a blueprint. 
1. In CloudShell Portal, click **Blueprints**.

   The **Blueprint Catalog** is displayed.

2. Create a new blueprint or select an existing one.

3. In the blueprint’s **Properties** page, associate the script with the blueprint. 

4. Reserve the blueprint and open the **Commands** pane in the sandbox.

![Scripts Management Page]({{ site.baseurl}}/assets/scripts_customization.png){:class="img-responsive"}
