---
layout: page
title: Common Driver Recipes
category: tut
comments: true
order:  14
version:
    - 8.2.0
---
In this section we'll provide a few handy examples of common driver operations.
The intention is to grow this into a good source to copy paste common code from.
All of the examples will be available in the
[DevGuide Examples](https://github.com/QualiSystems/devguide_examples) repository
under the _common_driver_recipes_ folder.

#### Decrypting a password attribute

The password for logging into the device/app will be passed as an encrypted value to the driver
as a part of the context object. In order to be able to use it to log in you'll most likely
need to decrypt it. To do that, you can use the CloudShellAPI function **_DecryptPassword_**.

See the code below for an example:

{% github_sample_ref /QualiSystems/devguide_examples/blob/driver_deep_dive/adding_examples/common_driver_recipes/src/driver.py %}
{% highlight python %}
{% github_sample /QualiSystems/devguide_examples/blob/driver_deep_dive/adding_examples/common_driver_recipes/src/driver.py 28 38 %}
{% endhighlight %}

#### Updating the resource live status

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

#### Sending a message to the sandbox console

Another way to update the sandbox regarding an operation progress is to use the _WriteMessageToReservationOutput_
function to display a message in the Sandbox console pane.
We can easily modify the previous code to do that instead:

{% github_sample_ref QualiSystems/devguide_examples/blob/master/common_driver_recipes/src/driver.py %}
{% highlight python %}
{% github_sample QualiSystems/devguide_examples/blob/master/common_driver_recipes/src/driver.py 57 70 %}
{% endhighlight %}

#### Sending commands to a networking device
When adding a new command that requires communication with a networking device, such as a switch or router, you need to open a session to the device. An easy way to do that is by leveraging Quali’s shell framework (*cloudshell-cli* package). The framework can provide a session from a session pool via Telnet, SSH or TCP, based on the configuration saved in the **CLI Connection Type** attribute on the root resource.

See the code below for an example:

{% highlight bash %}
def some_command(self, command)
    logger = get_logger_with_thread_id(context)
    api = get_api(context)

    resource_config = create_networking_resource_from_context(shell_name=self.SHELL_NAME,
                                                                  supported_os=self.SUPPORTED_OS,
                                                                  context=context)

    cli_handler = CliHandler(self._cli, resource_config, logger, api)
    with self._cli_handler.get_cli_service(self._cli_handler.enable_mode) as session:
        session.send_command("some command")
        with session.enter_mode(self._cli_handler.config_mode) as config_session:
            config_session.send_command("some config command")
            {% endhighlight %}
