---
layout: page
title: Common Driver Recipes
category: tut
comments: true
order:  14
version:
    - 9.3.0
---

{% assign pageUrlSplited = page.url | split: "/" %}
{% assign pageVersion = pageUrlSplited[2] %}

In this section we'll provide a few handy examples of common driver operations. 

The intention is to grow this into a good source to copy paste common code from. Most of the examples are available in the [DevGuide Examples](https://github.com/QualiSystems/devguide_examples) repository under the _common_driver_recipes_ folder. The following topics are reviewed in this article:

* [Decrypting a password attribute](#decrypting-a-password-attribute)

* [Updating the resource live status](#updating-the-resource-live-status)

* [Sending a message to the sandbox console](#sending-a-message-to-the-sandbox-console)

* [Sending commands to a networking device](#sending-commands-to-a-networking-device)

* [Mapping connections using App sub-resources](#mapping-connections-using-app-sub-resources)

* [Defining a connected command (which runs on another resource)](#defining-a-connected-command-which-runs-on-another-resource)

### Decrypting a password attribute

The password for logging into the device/app will be passed as an encrypted value to the driver
as a part of the context object. In order to be able to use it to log in you'll most likely
need to decrypt it. To do that, you can use the CloudShellAPI function **_DecryptPassword_**.

See the code below for an example:

{% github_sample_ref /QualiSystems/devguide_examples/blob/driver_deep_dive/adding_examples/common_driver_recipes/src/driver.py %}
{% highlight python %}
{% github_sample /QualiSystems/devguide_examples/blob/driver_deep_dive/adding_examples/common_driver_recipes/src/driver.py 28 38 %}
{% endhighlight %}

Note that in Python 3 shells, you no longer need to decrypt passwords as this is done out of the box by the [cloudshell-shell-networking-standard](https://pypi.org/project/cloudshell-shell-networking-standard/) python package.

### Updating the resource live status

The resource live status can be used to indicate the current state of the resource on the diagram.
CloudShell comes with a pre-built collection of statuses you can use, and this collection of icons can also
be extended if needed.

The following code will update the resource live status from offline to online:

{% github_sample_ref /QualiSystems/devguide_examples/blob/driver_deep_dive/adding_examples/common_driver_recipes/src/driver.py %}
{% highlight python %}
{% github_sample /QualiSystems/devguide_examples/blob/driver_deep_dive/adding_examples/common_driver_recipes/src/driver.py 40 55 %}
{% endhighlight %}

The full list of statuses can be found in the _ServerUniversalSettings.xml_ file which you can find on the Quali Server
machine under the  %programdata%\\QualiSystems\\Settings\\Global directory:

{% highlight xml %}
  <ResourcesLiveStatus>
    <key name="Online">C:\ProgramData\QualiSystems\Portal\Content\Images\online.png</key>
    <key name="Stopped">C:\ProgramData\QualiSystems\Portal\Content\Images\online.png</key>
    <key name="Offline">C:\ProgramData\QualiSystems\Portal\Content\Images\offline.png</key>
    <key name="Error">C:\ProgramData\QualiSystems\Portal\Content\Images\error.png</key>
    <key name="Progress 0">C:\ProgramData\QualiSystems\Portal\Content\Images\progress0.png</key>
    <key name="Progress 10">C:\ProgramData\QualiSystems\Portal\Content\Images\progress10.png</key>
    <key name="Progress 20">C:\ProgramData\QualiSystems\Portal\Content\Images\progress20.png</key>
    <key name="Progress 30">C:\ProgramData\QualiSystems\Portal\Content\Images\progress30.png</key>
    <key name="Progress 40">C:\ProgramData\QualiSystems\Portal\Content\Images\progress40.png</key>
    <key name="Progress 50">C:\ProgramData\QualiSystems\Portal\Content\Images\progress50.png</key>
    <key name="Progress 60">C:\ProgramData\QualiSystems\Portal\Content\Images\progress60.png</key>
    <key name="Progress 70">C:\ProgramData\QualiSystems\Portal\Content\Images\progress70.png</key>
    <key name="Progress 80">C:\ProgramData\QualiSystems\Portal\Content\Images\progress80.png</key>
    <key name="Progress 90">C:\ProgramData\QualiSystems\Portal\Content\Images\progress90.png</key>
    <key name="Progress 100">C:\ProgramData\QualiSystems\Portal\Content\Images\progress100.png</key>
  </ResourcesLiveStatus>

 {% endhighlight %}

### Sending a message to the sandbox console

Another way to update the sandbox regarding an operation progress is to use the _WriteMessageToReservationOutput_
function to display a message in the Sandbox console pane.
We can easily modify the previous code to do that instead:

{% github_sample_ref QualiSystems/devguide_examples/blob/master/common_driver_recipes/src/driver.py %}
{% highlight python %}
{% github_sample QualiSystems/devguide_examples/blob/master/common_driver_recipes/src/driver.py 57 70 %}
{% endhighlight %}

### Sending commands to a networking device
When adding a new command that requires communication with a networking device, such as a switch or router, you need to open a session to the device. An easy way to do that is by leveraging Quali’s shell framework (*cloudshell-cli* package). The framework can provide a session from a session pool via Telnet, SSH or TCP, based on the configuration saved in the **CLI Connection Type** attribute on the root resource.

See the code below for an example:

{% github_sample_ref QualiSystemsLab/Extended-Cisco-NXOS-Shell/blob/master/Ext_Cisco_NXOS_Shell_Package/Resource%20Drivers%20-%20Python/Generic%20Cisco%20NXOS%20Driver%20Version3%20Extended/cisco_nxos_resource_driver.py %}
{% highlight python %}

{% github_sample QualiSystemsLab/Extended-Cisco-NXOS-Shell/blob/master/Ext_Cisco_NXOS_Shell_Package/Resource%20Drivers%20-%20Python/Generic%20Cisco%20NXOS%20Driver%20Version3%20Extended/cisco_nxos_resource_driver.py 120 133 %}
{% endhighlight %}

### Mapping connections using App sub-resources
Starting with CloudShell 8.3, developers can map connections between sub-resources residing on deployed Apps. This applies to scenarios where you want to map the port connections between virtual devices residing in App VMs. For example, to map the connection between port 1 residing on a virtual switch and port 2 residing on another virtual switch. For details, see [Mapping Connections using App Sub-resources]({{site.baseurl}}/reference/{{pageVersion}}/mapping-sub-resource-connections.html).

### Defining a connected command (which runs on another resource)

In some scenarios, a command that runs on a specific resource logically requires the use of a different resource. These types of commands are called connected commands. They are executed on a resource in CloudShell Portal but in reality run on the connected resource (for example, a power switch) that performs the action.

There are two types of connected commands:
* **Power commands**: Let's say you have a target resource that is controlled by a power switch (PDU). When you run a **Power On** command on the target resource, the user may think the command is running on that resource but it actually runs on the PDU that is connected to the resource.
* **Generic resource commands**: A remote command is similar to a power command but is not limited to power commands only. For example, you could have a command, which modifies a target resource's settings, but is actually running on the server that performs the modifications.

To create a connected command, you need to use a shell based on a standard that supports connected commands, currently, only [PDU](https://github.com/QualiSystems/cloudshell-standards/blob/master/Documentation/pdu_standard.md) for power commands and the [Generic Resource with Connected Commands](https://github.com/QualiSystems/cloudshell-standards/blob/master/Documentation/Generic%20Resource%20with%20Connected%20Commands.md). These commands need to be defined in two places, in the *drivermetadata.xml* and in the *driver.py* file.

In the driver’s *drivermetadata.xml*, you define which commands are connected, as follows:

* For power commands, the command must include the `Tags="power"` flag and the driver must include all three power commands (Power On, Power Off and Power Cycle):

{% highlight xml %}
<Driver Description="Describe the purpose of your CloudShell shell" MainClass="driver.MyPduShellDriver" Name="MyPduShellDriver" Version="1.0.0">
    <Layout>
        <Category Name="Hidden Commands">
            <Command Description="" DisplayName="Orchestration Save" Name="orchestration_save" />
            <Command Description="" DisplayName="Orchestration Restore" Name="orchestration_restore" />
        </Category>
        <Command Name="PowerOn" DisplayName="Power On" Tags="power" Description="Power on device">
        </Command>
        <Command Name="PowerOff" DisplayName="Power Off" Tags="power" Description="Power off device">
        </Command>
        <Command Name="PowerCycle" DisplayName="Power Cycle" Tags="power" Description="Power off, then power on device">
            <Parameters>
                <Parameter Name="delay" DisplayName="Delay" Type="String" Mandatory="False" DefaultValue="0"/>
            </Parameters>
        </Command>
    </Layout>
</Driver>
{%  endhighlight %}

* For generic connected commands, you must use a shell that is based on a supporting standard and include the `Tags="remote_connectivity"` flag on the command:

{% highlight xml %}
<Driver Description="Describe the purpose of your CloudShell shell" MainClass="driver.MyRemoteResourceDriver" Name="MyRemoteResourceDriver" Version="1.0.0">
    <Layout>
         <Category Name="Hidden Commands">
            <Command Description="" DisplayName="Orchestration Save" Name="orchestration_save" />
            <Command Description="" DisplayName="Orchestration Restore" Name="orchestration_restore" />
        </Category>
        <Command Name="MyConnectedCommand" Description="" DisplayName="My Connected Commmand" Tags="remote_connectivity">
        </Command>
        <Command Name="MyCommand" Description="" DisplayName="My Commmand">
        </Command>
    </Layout>
</Driver>
{%  endhighlight %}

And finally, in the *driver.py* file, define the connected commands. In this case, PowerOn, PowerOff and PowerCycle:

{% highlight python %}
def PowerOn(self, context, ports):
    """
    :type context: cloudshell.shell.core.driver_context.ResourceRemoteCommandContext 
    """
    Pass
{%  endhighlight %}

To enable intellisense, on the *driver.py*, include the `ResourceRemoteCommandContext` context in the command's definition, as shown above.

**Notes:**
* Connected command definitions must include a **ports** parameter. You don't need to actually use it in your command. Just make sure it's included as it allows the connected command to run on multiple resources at the same time.
* Power commands only apply to unshared resources while generic resource commands can run on both shared and unshared resources.
* In CloudShell, the resource containing the connected command and the target resource must be directly connected to each other. If you have a switch resource in between, the connected command will not show on the target resource.
* You can use the CloudShell Automation API's *ExecuteResourceConnectedCommand* and "power management" commands to add connected commands to other shells.

**Example - power commands on a PDU shell:**

`SetPortState` should be a driver helper function that implements the specific logic of how to change the power port state for the specific PDU.

{% highlight python %}
import cloudshell.api.cloudshell_api as api

def PowerOn(self, context, ports):
    """
    :type context: drivercontext.ResourceRemoteCommandContext
    """
    api = self.__initApiSession__(context)
    output = ''
    for i in range(len(ports)):
        self.SetPortState(context, ports[i].split('/')[-1], "Online")  # Split the port number from its full address
        api.SetResourceLiveStatus(context.remote_endpoints[i].fullname, "Online", "The Resource is powered on")
        output += "Powered On {0}\n".format(context.remote_endpoints[i].fullname)
    return output

def PowerOff(self, context, ports):
    api = self.__initApiSession__(context)
    output = ''
    for i in range(len(ports)):
        self.SetPortState(context, ports[i].split('/')[-1], "Offline")  # Split the port number from its full address
        api.SetResourceLiveStatus(context.remote_endpoints[i].fullname, "Offline", "The Resource is powered off")
        output += "Powered Off {0}\n".format(context.remote_endpoints[i].fullname)
    return output

def PowerCycle(self, context, ports, delay):
    self.PowerOff(context, ports)
    sleep(int(delay))
    self.PowerOn(context, ports)
{% endhighlight %}

For reference, see the <a href="https://github.com/QualiSystems/shellfoundry-tosca-pdu-template" target="_blank">PDU shell template</a> or <a href="https://github.com/QualiSystems/shellfoundry-tosca-resource_with_connected_commands-template" target="_blank">Generic resource with connected commands shell template</a>.
