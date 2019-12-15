---
layout: page
title: Custom Sandbox Metadata
category: ref
order: 19
comments: true
version:
    - 9.3.0
---

{% assign pageUrlSplited = page.url | split: "/" %}
{% assign pageVersion = pageUrlSplited[2] %}

Starting with CloudShell 9.2, it is possible to store information for later use in the sandbox using the API. This feature is related to this <a href="https://community.quali.com/idea/655/storing-reservation-specific-information-for-later" target="_blank">idea</a>.

This capability can be used to store sandbox-specific information that is required for your orchestration processes and shells, like user details, unique IDs returned from 3rd party systems, or data created during the setup process that is needed for teardown.

The data is stored as key-value pairs in a container that is attached to the sandbox and can only be inserted/retrieved via CloudShell Automation API. Note that we don't impose any limitations on the data and its format, and the data isn’t stored encrypted. Also, for completed sandboxes, the data is kept but cannot be modified.

The following API methods are provided:

+ *SetSandboxData*: sets the key-value pairs in the custom data container.
* *GetSandboxData*: retrieves custom data from the sandbox
* *ClearSandboxData*: clears the custom data container

Note that only sysadmins and domain admins can get/set/clear the sandbox data. 

So let's start by setting two key-value pairs: Key1 and Key2:

{% highlight python %}
import cloudshell.api.cloudshell_api as api

session = api.CloudShellAPISession('localhost', 'admin', 'admin', 'Global')

res_id = 'f45905f5-1b67-431b-a813-6a4873966245'

data1 = api.SandboxDataKeyValue('Key1', 'Value1')
data2 = api.SandboxDataKeyValue('Key2', 'Value2')

all_data = [data1, data2]

session.SetSandboxData(res_id, all_data)
{% endhighlight %}

Now that we have some custom data on the sandbox, let's learn how to retrieve it:

{% highlight python %}
import cloudshell.api.cloudshell_api as api

session = api.CloudShellAPISession('localhost', 'admin', 'admin', 'Global')

res_id = 'f45905f5-1b67-431b-a813-6a4873966245'

data = session.GetSandboxData(res_id)

for keyValue in data.SandboxDataKeyValues:
    print keyValue.Key + " :: " + keyValue.Value
{% endhighlight %}

And finally, let's learn how to remove the data we stored on the container:

{% highlight python %}
import cloudshell.api.cloudshell_api as api

session = api.CloudShellAPISession('localhost', 'admin', 'admin', 'Global')

res_id = 'de035c9c-75b0-4eca-b797-698b0f26675f'

session.ClearSandboxData(res_id)
{% endhighlight %}


### End-to-end example: Managing registration keys for AWS services

In this example, we'll use a customized setup script to store an authentication key for an AWS CDN service on the sandbox and a customized teardown script that will unregister the CDN service and then clear the metadata from the sandbox. In this example, we assume that a CloudShell service called **CDN Service** is used to perform the actual registration to Amazon.

**Custom setup script that registers an Amazon CDN service:**

{% highlight python %}
from cloudshell.workflow.orchestration.setup.default_setup_orchestrator import DefaultSetupWorkflow
from cloudshell.workflow.orchestration.sandbox import Sandbox
from cloudshell.api.cloudshell_api import SandboxDataKeyValue


def set_registration_keys(sandbox, components=None):
    """
    orchestration stage functions MUST have (sandbox, components) signature
    :param Sandbox sandbox:
    :return:
    """
    api = sandbox.automation_api
    res_id = sandbox.id

    # register to CDN service using a CloudShell service component
    service_key_value = api.ExecuteCommand(reservationId=res_id,
                       targetName='CDN Service',
                       targetType='Service',
                       commandName='register_cdn').Output

    # store key in sandbox metadata
    registration_data = SandboxDataKeyValue('cdn_key', service_key_value)
    all_data = [registration_data]
    api.SetSandboxData(res_id, all_data)


sandbox = Sandbox()
DefaultSetupWorkflow().register(sandbox)
sandbox.workflow.on_configuration_ended(set_registration_keys, None)
sandbox.execute_setup()

{% endhighlight %}

**Custom teardown script that unregisters the CDN service and clears the sandbox metadata:**

{% highlight python %}
from cloudshell.workflow.orchestration.teardown.default_teardown_orchestrator import DefaultTeardownWorkflow
from cloudshell.workflow.orchestration.sandbox import Sandbox
from cloudshell.api.cloudshell_api import InputNameValue


def unregister_cdn(sandbox, components=None):
    """
    Functions passed into orchestration stage MUST have (sandbox, components) signature
    :param Sandbox sandbox:
    :return:
    """
    api = sandbox.automation_api
    res_id = sandbox.id
    api.ClearSandboxData(res_id)

    # get sandbox metadata list
    sandbox_data = api.GetSandboxData(reservationId=res_id).SandboxDataKeyValues

    # filter for 'cdn_key' value
    cdn_key_value = [data for data in sandbox_data if data.Key == 'cdn_key'][0].Value

    # unregister cdn service
    command_inputs = [InputNameValue(Name='cdn_service_key', Value=cdn_key_value)]
    api.ExecuteCommand(reservationId=res_id,
                       targetName='CDN Service',
                       targetType='Service',
                       commandName='unregister_cdn',
                       commandInputs=command_inputs)

    # clear sandbox metadata
    api.ClearSandboxData(reservationId=res_id)


sandbox = Sandbox()
DefaultTeardownWorkflow().register(sandbox)
sandbox.workflow.before_teardown_started(unregister_cdn, None)
sandbox.execute_teardown()

{% endhighlight %}


## Using custom sandbox data in JSON format

JSON is a very common data format so we figured we'd include some code samples.

**Storing custom sandbox data in JSON format**

{% highlight python %}
import cloudshell.api.cloudshell_api as api
import json

session = api.CloudShellAPISession('localhost', 'admin', 'admin', 'Global')

res_id = 'f45905f5-1b67-431b-a813-6a4873966245'

with open("C:\Json Examples\jsonExample1.json", "r") as myfile:
    data_file = myfile.read()


with open("C:\Json Examples\jsonExample2.json", "r") as myfile:
    data_file2 = myfile.read()

big_data = api.SandboxDataKeyValue('jsonExample1', data_file)
big_data2 = api.SandboxDataKeyValue('jsonExample2', data_file2)

all_data = [big_data, big_data2]

session.SetSandboxData(res_id, all_data)
{% endhighlight %}

**Retrieving custom sandbox data in JSON format**

{% highlight python %}
import cloudshell.api.cloudshell_api as api
import json

# method to Get the sandbox data by key
def GetSandboxDataValueByKey(sandboxData, key):
    value = [attr.Value for attr in sandboxData.SandboxDataKeyValues if attr.Key == key]
    if value.__len__() >= 1:
        return value[0]

# creating a cloudshell session
session = api.CloudShellAPISession('localhost', 'admin', 'admin', 'Global')

sandbox_id = 'f45905f5-1b67-431b-a813-6a4873966245'

# using the session to get all the sandbox data from a specific sandbobx
sandbox_data = session.GetSandboxData(sandbox_id)
key = 'jsonExample1'

# getting a specific value from the sandbox data using a key
wanted_value = GetSandboxDataValueByKey(sandbox_data, key)

# formatting the value as json
wanted_value_as_json = json.loads(wanted_value)

# manipulating the json - getting to specific info inside the json
specific_inner_value = wanted_value_as_json['widget']['image']

# printing the value as string
print json.dumps(specific_inner_value)
{% endhighlight %}