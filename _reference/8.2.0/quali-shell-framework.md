---
layout: page
title: Quali’s Shell Framework
category: ref
order: 9
comments: true
version:
    - 8.2.0
---


{% assign pageUrlSplited = page.url | split: "/" %}
{% assign pageVersion = pageUrlSplited[2] %}

In this article, we will familiarize ourselves with the CloudShell shell framework and learn how to leverage it to develop and customize commands. Note that this applies to 1st Gen and 2nd Gen shells.

## Introduction

Every CloudShell shell consists of a data model and a driver. The driver is written in python and can have python package dependencies. Quali’s officially released shells use a common set of python packages developed by Quali, which contain most of the logic of Quali shells, while the driver itself (the “.py” file inside the shell) is the thin layer that defines the interface with CloudShell along with the driver’s python requirements.
Quali’s official shells have a granularity level of Vendor and OS. This means that each official shell supports all devices of a specific vendor and OS. The exact functionality that is exposed by the shell is defined in the relevant shell standard. The structure of the python packages reflects this granularity – for example, any logic that is common to all networking devices resides in cloudshell-networking, while any Cisco-specific logic resides in cloudshell-networking-cisco, and any Cisco IOS-specific logic resides in cloudshell-networking-cisco-ios.
It is possible to use Quali’s shell framework when creating your own shells or customizing existing ones. Note that using the framework is optional.
To work with one or more of the framework’s python packages, you need to list it in your shell project’s requirements, and not fork it or directly edit it. Then you can either write the code, which uses the package, directly in the shell’s driver or create your own python package and add it to the requirements of the driver. Such custom python packages can be loaded into our <a href="http://help.quali.com/Online%20Help/8.2/Portal/Content/Admn/Cnfgr-Pyth-Env-Wrk-Offln.htm?Highlight=pypi" target="_blank">PyPi server</a> and thus be available to your entire CloudShell deployment.


**Important:** It is not recommended to modify Quali python packages as these changes may be overwritten if a newer package that has the same file name is published on the public PyPi repository. Alternatively, you’re welcome to create your own packages, using our python packages as a reference.


## Python package structure

The following diagram shows the python classes used by the shell commands and their dependencies:

![Python Package Structure Diagram]({{ site.baseurl}}/assets/python-package-structure.png)

## Architecture

The architecture of a Quali python shell comprises four inter-dependent elements:
* [Runners](#Runners)
* [Flows](#Flows)
* [Command Templates](#CommandTemplates)
* [Command Actions](#CommandActions)

Runners execute Flows and process user inputs, and also define CLI and/or SNMP handlers, which are used in the Flows. Flows sequentially execute a number of Command Actions, while each Command Action runs a specific Command Template.

An additional element that is used by the runners is the communication handler, which allows you to communicate with the device. For details about communication handlers, see this [section](#CommunicationHandlers).
 
## Key Entities<a name="KeyEntities"></a>

There are several objects that must be initialized in the python driver, to allow you to work with Quali's infrastructure:
* **Communication Handlers** – These entities handle the communication between the shell and the device. The most common handlers are cli (`cloudshell-cli`) and snmp (`cloudshell-snmp`). These handlers must be initialized whenever calling a shell command, and passed to the runners.
* **cli** - A Python package that resides in the driver and is used to create the cli handler. This package provides an easy abstraction interface for CLI access and communication (Telnet, TCP, SSH etc.) for network devices. The CLI class instance is provided by `cloudshell.cli.cli`. It must be created when the driver is initializing, since it allows the shell to designate a single session pool for all of the shell’s commands. You are welcome to use the *_get_cli* helper from *driver_helper* mentioned above. *_get_cli* allows you to define the session pool’s size and idle timeout. 
* **api** is an instance of the *cloudshell-automation-API*’s *CloudShellAPISession* class. It must be created on every command execution. This class has a helper named *_get_api*, which is also provided by the *driver_helper* mentioned above.
* **logger** is a logger object from *cloudshell-core*. It is recommended to use the *driver_helper’s get_logger_with_thread_id* function.
* **resource config** – Python implementation of the relevant Quali standard, which defines the shell’s attributes and default values. For example, a *GenericNetworkingResource* class that contains all attributes required by the networking standard. It can be easily created using the `create_networking_resource_from_context` method from 
[cloudshell.devices.standards.networking.configuration_attributes_structure](https://github.com/QualiSystems/cloudshell-networking-devices/blob/dev/cloudshell/devices/standards/networking/configuration_attributes_structure.py).


Note that there is a helper method for each of these objects. For detailed information about each helper method, see [cloudshell.devices.driver_helper](https://github.com/QualiSystems/cloudshell-networking-devices/blob/dev/cloudshell/devices/driver_helper.py).

For reference, see this [example](https://github.com/QualiSystems/Cisco-NXOS-Switch-Shell-2G/blob/dev/src/driver.py).

### Communication Handlers<a name="CommunicationHandlers"></a>

The most common ways to communicate with the device are via:
* CLI – cloudshell-cli
* SNMP – cloudshell-snmp

These handlers need to be initialized and passed to the runners.

#### CLI Handler<a name="CliHandler"></a>

There is a nice guide on how to use *cloudshell-cli* [here](https://github.com/QualiSystems/cloudshell-cli/blob/dev/README.md). However, to simplify the usage of the CloudShell CLI, we implemented a *CliHandlerImpl* base class located [here](https://github.com/QualiSystems/cloudshell-networking-devices/blob/dev/cloudshell/devices/cli_handler_impl.py).

It includes all the typical CLI capabilities you would need from CloudShell CLI. In addition, it knows how to retrieve the device’s username and password, create a session, determine what kind of session to initiate, etc. For reference, see [cisco_cli_handler.py](https://github.com/QualiSystems/cloudshell-networking-cisco/blob/dev/cloudshell/networking/cisco/cli/cisco_cli_handler.py) and [cisco_command_modes.py](https://github.com/QualiSystems/cloudshell-networking-cisco/blob/dev/cloudshell/networking/cisco/cli/cisco_command_modes.py).

In the child class, you only need to implement these methods and properties:

* **enable_mode** – is a property that returns the *CommandMode* class, which enables you to use the **Enable** mode, a mode that grants you root admin access to a Linux device. [Example](https://github.com/QualiSystems/cloudshell-networking-cisco/blob/dev/cloudshell/networking/cisco/cli/cisco_command_modes.py#L46).

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;For details and implementation examples of *CommandMode*, click [here](https://github.com/QualiSystems/cloudshell-cli/blob/dev/README.md).

* **config_mode** – is a property that returns the *CommandMode* class, which enables you to use the **Configuration** mode, which allows you to configure the device’s settings. [Example](https://github.com/QualiSystems/cloudshell-networking-cisco/blob/dev/cloudshell/networking/cisco/cli/cisco_command_modes.py#L83).
* **on_session_start** – is a method that contains the commands you want to automatically execute at the start of each session. [Example](https://github.com/QualiSystems/cloudshell-networking-cisco/blob/dev/cloudshell/networking/cisco/cli/cisco_cli_handler.py#L80).

Example: Cli handler that requires the parameters `cli`, `resource_config`, `logger` and `api`:

![CLI Handler Code Example]({{ site.baseurl}}/assets/cli-handler-code-example.png)

Note that the first parameter, `cli`, needs a CLI instance from *cloudshell.cli.cli* to be initiated. For details about these parameters, see the [Key Entities](#KeyEntities) section.

#### SNMP Handler

Like the CLI handler, the main responsibilities of the SNMP handler are:
* Initialize *QualiSnmp*. It does this by extracting and preparing the *QualiSnmp* parameters provided by the resource driver’s context
* Analyze Enable and Disable SNMP attributes from the command context
* Trigger the appropriate flow. 
To initialize the `SNMPHandler` object, you need to pass the following objects: `resource_config`, `logger`, `api`. To use the handler, you must implement the following properties in your child class:

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;* _create_enable_flow_ 

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;* _create_disable_flow_

For reference, see [cisco_snmp_handler](https://github.com/QualiSystems/cloudshell-networking-cisco/blob/dev/cloudshell/networking/cisco/snmp/cisco_snmp_handler.py). For more information, see the [Flows](#Flows) section.
 
## Runners<a name="Runners"></a>
 This is an abstract class that includes generic implementations for preparing and validating the required parameters. For example, when running the Save command in CloudShell Portal, the runner must validate the folder path provided by the sandbox end-user. Typically, the shell extracts the data for the required parameters from the resource command’s context and user inputs. 

The necessary interfaces are already implemented in the base Runners. However, you can implement your own base runner, e.g. *ConnectivityRunner* implements  the *ConnectivityOperationsInterface* interface. The runner’s interfaces contain commands that are triggered by the resource driver.

Overall, we have six Runners, all base classes and their interfaces are located in [cloudshell-networking-devices](https://github.com/QualiSystems/cloudshell-networking-devices/tree/dev/cloudshell/devices/runners):

**Note:** All runners except for Autoload Runner require the cli-handler parameter to be passed to the runner while it is being initialized. For example, see  [this](https://github.com/QualiSystems/Cisco-IOS-Shell/blob/5.0.2/src/cisco_ios_resource_driver.py#L86-L87).

* **[Connectivity Runner](https://github.com/QualiSystems/cloudshell-networking-devices/blob/dev/cloudshell/devices/runners/connectivity_runner.py)** – Uses multithread logic to speed up the VLAN configuration on the device, especially when the resource needs to undergo a huge request that involves multiple, concurrently run actions. To initialize this runner, you have to provide the logger and cli_handler objects (described in [Key Entities](#KeyEntities)). Use the `apply_connectivity_changes` method to start. The following properties have to be implemented:

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;• add_vlan_flow

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;• remove_vlan_flow

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;For reference, see this [example](https://github.com/QualiSystems/cloudshell-networking-cisco/blob/dev/cloudshell/networking/cisco/runners/cisco_connectivity_runner.py).

* **[Configuration Runner](https://github.com/QualiSystems/cloudshell-networking-devices/blob/dev/cloudshell/devices/runners/configuration_runner.py)** – Prepares and validates the provided path for the `save`, `restore`, `orchestration save` and `orchestration restore` commands. To initialize this runner, you have to pass the *logger*, *resource_config*, *cli_handler* and *api* objects (described in Key Entities). The following properties have to be implemented:

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;• save_flow

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;• restore_flow

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;• file_system – a default filesystem value, see example below.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;For reference, see this [example](https://github.com/QualiSystems/cloudshell-networking-cisco/blob/dev/cloudshell/networking/cisco/runners/cisco_configuration_runner.py).

* **[Firmware Runner](https://github.com/QualiSystems/cloudshell-networking-devices/blob/dev/cloudshell/devices/runners/firmware_runner.py)** – This runner serves as a Configuration Runner, and also validates the firmware’s file path. To initialize this runner, you need to pass the *logger* and *cli_handler* objects. The following property has to be implemented:

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;• load_firmware_flow

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;For reference, see this [example](https://github.com/QualiSystems/cloudshell-networking-cisco/blob/dev/cloudshell/networking/cisco/runners/cisco_firmware_runner.py).

* **[Run Command Runner](https://github.com/QualiSystems/cloudshell-networking-devices/blob/dev/cloudshell/devices/runners/run_command_runner.py)** – As you can see from the name, this Runner handles the `Run Custom Command` and `Run Custom Config Command` driver methods, and doesn’t require anything else to implement. However, if you want to customize the `run_command_flow` property, you are welcome to override it. To initialize this runner, just pass the *logger* and *cli_handler* objects.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;For reference, see this [example](https://github.com/QualiSystems/Cisco-IOS-Shell/blob/5.0.2/src/cisco_ios_resource_driver.py#L79-L87) on how to create the run command runner.

* **[State Runner](https://github.com/QualiSystems/cloudshell-networking-devices/blob/dev/cloudshell/devices/runners/state_runner.py)** – This runner is very similar to the Run Custom Command Runner as it doesn’t require any additional implementations. It contains implementations for the `Health Check` and `Shutdown` commands. To initialize this runner, you need to pass the *logger*, *api*, *cli_handler* and *resource_config* objects mentioned in [Key Entities](#KeyEntities).

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;For reference, see this [example](https://github.com/QualiSystems/Cisco-IOS-Shell/blob/5.0.2/src/cisco_ios_resource_driver.py#L371-L379) on how to create the state runner.

* **[Autoload Runner](https://github.com/QualiSystems/cloudshell-networking-devices/blob/dev/cloudshell/devices/runners/autoload_runner.py)** – Discovers the device’s hardware structure and general details, such as the firmware version and model. This runner requires the *autoload_flow* property to be implemented.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;To initialize this runner, just pass the `resource_config` and `snmp_handler` objects. For reference, see this [example](https://github.com/QualiSystems/Cisco-IOS-Shell/blob/5.0.2/src/cisco_ios_resource_driver.py#L60-L65) on how to create the autoload runner.

## Flows<a name="Flows"></a>

Flow is an organized sequence of Command Actions. All the base Flows are located in the [cloudshell-networking-devices](https://github.com/QualiSystems/cloudshell-networking-devices/blob/dev/cloudshell/devices/flows/action_flows.py) Python package. They are based on the *BaseFlow* interface located in the same place.

Most shells include the following flows:
* Save Configuration Flow
* Restore Configuration Flow
* Add Vlan Flow
* Remove Vlan Flow
* Load Firmware Flow
* Run Command Flow
* Shutdown Flow
* Enable Snmp Flow
* Disable Snmp Flow

Note that *Run Command Flow* doesn’t require you to implement the `execute_flow` method as it’s already implemented there. The only difference between the *Run Command Flow* and the rest is a set of parameters. Run Command Flow has a generic approach to all devices, and doesn’t require any specific implementation. 

For reference, see these [files](https://github.com/QualiSystems/cloudshell-networking-cisco/tree/dev/cloudshell/networking/cisco/flows).

## Command Templates<a name="CommandTemplates"></a>

A Command Template is a constant object of the *CommandTemplate* class, which is located in [cloudshell-cli](https://github.com/QualiSystems/cloudshell-cli/blob/dev/cloudshell/cli/command_template/command_template.py). It contains three elements:
* **command** – A command you want to send to the device. Supports formatting parameters. For example:

{% highlight bash %}copy {src} {dst} [vrf {vrf}]{% endhighlight %}

* **action map** – A dictionary of regex patterns (as keys) and lambda functions (as values). To illustrate this, when you get a “(yes/no)” prompt, you can send an appropriate command by specifying the required lambda function. For example:

{% highlight bash %}
r'\(y/n\)': lambda session, logger: session.send_line('y', logger)
{% endhighlight %}

* **error map** – Similar to action map but for errors. It is a dictionary of regexp pattern and error message test pairs. For example: 

{% highlight bash %}
r"[Ii]nvalid\s*([Ii]nput|[Cc]ommand ":  “Override mode is not supported”
{% endhighlight %}

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;For reference, see this command template [file](https://github.com/QualiSystems/cloudshell-networking-cisco/blob/dev/cloudshell/networking/cisco/command_templates/configuration.py).

## Command Actions<a name="CommandActions"></a>

Command Action is a method or function (depending on your implementation) that runs one or more Command Templates. The [CommandTemplateExecutor](https://github.com/QualiSystems/cloudshell-cli/blob/dev/cloudshell/cli/command_template/command_template_executor.py) is provided for running command templates. For reference, see this [example](https://github.com/QualiSystems/cloudshell-networking-cisco/blob/dev/cloudshell/networking/cisco/command_actions/add_remove_vlan_actions.py).

For example, if we want to execute the CONFIGURE_VLAN command template:

{% highlight bash %}
CONFIGURE_VLAN = CommandTemplate("vlan {vlan_id}", error_map=OrderedDict({"%.*\.": "Error creating vlan")}))
{% endhighlight %}

We need to (1) pass the `session` object, command template and action/error maps to the *CommandTemplateExecutor*, and (2) `vlan_id` to the `execute_command` method. As illustrated below:

{% highlight bash %}
CommandTemplateExecutor(session, CONFIGURE_VLAN, action_map=action_map, error_map=error_map).execute_command(vlan_id=vlan_id)
{% endhighlight %}