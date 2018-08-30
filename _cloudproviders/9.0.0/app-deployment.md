---
layout: page
title: "App Deployment"
order: 17
comments: true
version:
    - 9.0.0
---

In this article, we'll learn how to implement the App's deployment.

To deploy an App successfully, you need to implement the following 4 methods:

1. [Deploy](#Deploy) creates the App's VM instance.
2. [PowerOn](#PowerOn) spins up the VM.
3. [remote_refresh_ip](#RemoteRefreshIp) updates the deployed App's IP address. 
4. [GetVmDetails](#GetVmDetails) gets information about the VM itself, its operating system, specifications and networking information.

These methods are executed in the above order during the deployment of an App in the sandbox (either automatically as part of the default sandbox setup script that runs when reserving a sandbox or manually by the user after adding an App to an active sandbox). Once the App is deployed, these methods can be run as individual commands from the deployed App's commands pane.<a name="Deploy"></a>.

## Deploy method

Creates the App's VM instance.

### Signature

The *deploy* method accepts three inputs: *context*, *request*, and *cancellation_context*.

{% highlight python %}
def Deploy(self, context, request=None, cancellation_context=None)
{% endhighlight %}

### Inputs

**context**

**Context:** *context* is a *ResourceCommandContext* object that contains:

1. connectivity - CloudShell server connectivity data for authentication with CloudShell Automation API 
2. resource - resource configuration settings entered when creating the Cloud Provider resource in the **Inventory** dashboard
3. reservation - current reservation details
4. connectors – details of any visual connectors between the Cloud Provider App and other endpoints in the sandbox

{% github_sample_ref /QualiSystems/cloudshell-shell-core/blob/36009fdec45134ae38cb9273328b7686be66e553/cloudshell/shell/core/driver_context.py %}
{% highlight python %}
{% github_sample /QualiSystems/cloudshell-shell-core/blob/36009fdec45134ae38cb9273328b7686be66e553/cloudshell/shell/core/driver_context.py 9 18 %}
{% endhighlight %}

Here's a sample code that extracts the cloud provider data from the context:

{% highlight python %}
cloud_provider_resource = HeavenlyCloudsShell.create_from_context(context)
{% endhighlight %}

**Request**

*Request* object that contains the resource deployment path and deployed App configuration (in the App template's **App Resource** page).

**cancellation_context**

CloudShell supports the canceling of App command executions. 

{% github_sample_ref /QualiSystems/cloudshell-shell-core/blob/36009fdec45134ae38cb9273328b7686be66e553/cloudshell/shell/core/driver_context.py %}
{% highlight python %}
{% github_sample /QualiSystems/cloudshell-shell-core/blob/36009fdec45134ae38cb9273328b7686be66e553/cloudshell/shell/core/driver_context.py 127 130 %}
{% endhighlight %}

To allow the cancellation of a command on the Cloud Provider's Apps, we need to:

1. Check for cancellation before each operation. If cancelled, delete cloud objects created by operation.
3. Return the appropriate result.

Usage example

{% highlight python %}
if cancellation_context.is_cancelled:
    self.rollback()
    return DeployAppResult(actionId=deploy_app_action.actionId, success=False,
                           errorMessage='Operation canceled')
{% endhighlight %}

Output

*DriverResponse* object that contains a list of action results.

### Error handling

If App deployment fails, return a "success false" action result.

### Deploy method implementation

The deploy method should perform the following steps:

1. <a href="https://github.com/QualiSystems/Custom-L2-Cloud-Provider-Shell-Example/blob/a9a14e87570fdc52d9994950e161b104c62401fb/src/driver.py#L91" target="_blank">Retrieve the cloud provider resource's connection credentials</a>.
2. <a href="https://github.com/QualiSystems/Custom-L2-Cloud-Provider-Shell-Example/blob/a9a14e87570fdc52d9994950e161b104c62401fb/src/driver.py#L92-L95" target="_blank">Retrieve the *Deploy* action</a>.
3. <a href="https://github.com/QualiSystems/Custom-L2-Cloud-Provider-Shell-Example/blob/a9a14e87570fdc52d9994950e161b104c62401fb/src/driver.py#L99-L106" target="_blank">Call the *Deploy* logic of the selected deployment type</a>.

4. *(Steps 4 - 8 are performed within the deploy logic)* <a href="https://github.com/QualiSystems/Custom-L3-Cloud-Provider-Shell-Example/blob/4aa0c863da205686952e414e16a0baea954b2bfa/src/heavenly_cloud_service_wrapper.py#L22" target="_blank">Generate a unique name for the App</a>. 
5. <a href="https://github.com/QualiSystems/Custom-L2-Cloud-Provider-Shell-Example/blob/a9a14e87570fdc52d9994950e161b104c62401fb/src/heavenly_cloud_service_wrapper.py#L47-L48" target="_blank">Create a VM instance using the deployment path attributes</a> (the HeavenlyCloud service represents your custom cloud SDK). 
6. If VM deployment is successful: 
* <a href="https://github.com/QualiSystems/Custom-L2-Cloud-Provider-Shell-Example/blob/a9a14e87570fdc52d9994950e161b104c62401fb/src/heavenly_cloud_service_wrapper.py#L78-L79" target="_blank">Collect VM details</a> (operating system, specifications, networking information).
* Optionally, <a href="https://github.com/QualiSystems/Custom-L2-Cloud-Provider-Shell-Example/blob/a9a14e87570fdc52d9994950e161b104c62401fb/src/heavenly_cloud_service_wrapper.py#L59-L62" target="_blank">override App resource attribute values</a>. For <a href="https://github.com/QualiSystems/Custom-L2-Cloud-Provider-Shell-Example/blob/a9a14e87570fdc52d9994950e161b104c62401fb/src/heavenly_cloud_service_wrapper.py#L51-L58" target="_blank">example</a>, if we generate a unique password for each VM instance, we will also want to update this password in the Password attribute on the Deployed App Resource for future use (to allow the sandbox end-user to connect to the VM).
* If needed, <a href="https://github.com/QualiSystems/Custom-L2-Cloud-Provider-Shell-Example/blob/a9a14e87570fdc52d9994950e161b104c62401fb/src/heavenly_cloud_service_wrapper.py#L84-L88" target="_blank">add additional data to the action result</a>. This key-value data will be available from all API resource queries. It can be useful for implementing custom logic during the lifecycle of the sandbox. <a href="https://github.com/QualiSystems/Custom-L2-Cloud-Provider-Shell-Example/blob/a9a14e87570fdc52d9994950e161b104c62401fb/src/heavenly_cloud_service_wrapper.py#L245-L249" target="_blank">Example</a>.
7. If VM deployment fails, <a href="https://github.com/QualiSystems/Custom-L2-Cloud-Provider-Shell-Example/blob/a9a14e87570fdc52d9994950e161b104c62401fb/src/heavenly_cloud_service_wrapper.py#L74-L76" target="_blank">return a "fail" result</a>.
8. <a href="https://github.com/QualiSystems/Custom-L2-Cloud-Provider-Shell-Example/blob/a9a14e87570fdc52d9994950e161b104c62401fb/src/heavenly_cloud_service_wrapper.py#L92-L99" target="_blank">Return *DeployAppResult*</a>.
9. <a href="https://github.com/QualiSystems/Custom-L2-Cloud-Provider-Shell-Example/blob/a9a14e87570fdc52d9994950e161b104c62401fb/src/driver.py#L112" target="_blank">Return *DriverResponse*</a>.

Note that the links in the above workflow pertain to a driver of an L3 implementation. However, the only difference between L2 and L3 driver implementations is that L2 implements *ApplyConnectivityChanges* while L3 uses *PrepareSandboxInfra* and the *CleanSandboxInfra* methods.

### DeployAppResult JSON example

{"actionId":"aac7cc0c-a215-4aee-8fc1-f79025034423","deployedAppAdditionalData":{},"deployedAppAddress":"192.168.0.5","deployedAppAttributes":[{"attributeName":"Password","attributeValue":"123456"},{"attributeName":"User","attributeValue":"super user"}],"errorMessage":"","infoMessage":"","success":true,"type":"DeployApp","vmDetailsData":{"appName":"","errorMessage":"","vmInstanceData":[{"hidden":false,"key":"Cloud Name","value":"white"},{"hidden":false,"key":"Cloud Index","value":"0"},{"hidden":false,"key":"Cloud Size","value":"not so big"},{"hidden":false,"key":"Instance Name","value":"angel vm__ca11f5"},{"hidden":true,"key":"Hidden stuff","value":"something not for UI"}],"vmNetworkData":[{"interfaceId":0,"isPredefined":false,"isPrimary":true,"networkData":[{"hidden":false,"key":"MaxSpeed","value":"1KB"},{"hidden":false,"key":"Network Type","value":"Ethernet"}],"networkId":0,"privateIpAddress":"10.0.0.0","publicIpAddress":"8.8.8.0"},{"interfaceId":1,"isPredefined":false,"isPrimary":false,"networkData":[{"hidden":false,"key":"MaxSpeed","value":"1KB"},{"hidden":false,"key":"Network Type","value":"Ethernet"}],"networkId":1,"privateIpAddress":"10.0.0.1","publicIpAddress":"8.8.8.1"}]},"vmName":"angel vm__ca11f5","vmUuid":"027ad770-9ecb-4936-a7df-aeaf526dfc34"}

#### DeployAppResult properties

| **Name**                    |**Type**      | **Description** |
| actionId                    | string       | (Mandatory) The action GUID as received (deploy_app_action.actionId) result must include the action id it results for, so server can match result to action. |
|deployedAppAddress           | string       | (Mandatory) The primary ip address of the VM instance. This value will be set as the deployed App’s resource address in CloudShell. |
|errorMessage                 | string       | (Optional) Error message to be displayed to the sandbox end-user if VM deployment fails. |
| infoMessage                 | string       | (Optional) Info message to be displayed to the sandbox end-user if VM deployment succeeds. |
| success                     | bool         | (Mandatory) |
| type                        | string       | (Read only) *DeployApp* object type. It is automatically set in *DeployAppResult* object type (in cloudshell-cp-core). |
| vmName                      | string       | Unique name of the resource in CloudShell. |
| vmUuid                      | string       | Unique resource id. Populate *vmUuid* with the unique id of the resource in your custom cloud provider. Cloudshell does not use this id, but will keep it for other method calls. |
| deployedAppAdditionalData   | dictionary   | Container used to persist custom data in resource, similar to AWS Tags. Included in all resource API query results. For <a href="https://github.com/QualiSystems/Custom-L2-Cloud-Provider-Shell-Example/blob/ac94224fd2368aaa9b589bcdfd30e449a53c90ce/src/heavenly_cloud_service_wrapper.py#L209-L213" target="_blank">example</a>, reading the custom data and returning it in the VM Details.|
| deployedAppAttributes       | array        | Contains data describing the deployed app attributes, and are displayed in the App's **Attributes** pane in the sandbox. It should be used to change default values of the deployed app resource attributes. For example User & Password attributes exist as part of the default deployed app model. If your custom CLP generates a password in runtime for the VM than you should update the *deployedAppAttributes* property accordingly. |

| vmDetailsData               | array        | Array of cloudshell-cp-core attribute objects. Contains data describing the deployed App's attributes. It should be used to change default values of the deployed App resource attributes. For example the User and Password attributes exist as part of the default Deployed App shell. If your custom cloud provider generates a password in runtime for the VM, please update the **deployedAppAttributes** property accordingly. |
| vmDetailsData               | object        | Contains vmNetworkData and vmInstanceData. Displayed in the App's VM Details pane. See the* vmDetailsData* table below. |

#### vmDetailsData properties

*vmDetailsData* is used to describe the App's VM. All properties are optional.

| **Name**        |**Type**  | **Description** |
| appName         | String   | The App's name. No need to assign it in the deploy operation. Must be assigned in *getVmDetails* method. |
| errorMessage    | string   | Indication message to be displayed to the sandbox end-user when getting the vmDetails. |
| vmNetworkData   | array    | Array of cloudshell-cp-core  VmDetailsNetworkInterface object. Create a *vmNetworkData* object for each VM NIC you wish to associate with resource. See the VmDetailsNetworkInterface table below. |
| vmInstanceData  | array    | Array of cloudshell-cp-core's *VmDetailsProperty*. Contains data about the VM instance attributes. It should be used to change persist values of the VM resource. For example to persist Storage and operating system data use it. See the VmDetailsProperty table below.  |

#### VmDetailsNetworkInterface

| **Name**         |**Type**  | **Description** |
| interfaceId      | String   | The network interface id with which the address is associated. |
| networkId        | string   | The unique id of the network associated with the network interface. |
| isPrimary        | bool     | Determines if NIC is primary. Primary affects the default selected network in VmDetailsTab in cloudshell |
|isPredefined      | bool     | Determines if NIC is predefined. Predefined means that the network existed before the sandbox reservation. for example, a Static Management network that is not modeled in the blueprint. |
| networkData      | array    | Array of cloudshell-cp-core VmDetailsProperty. Contains data describing the NIC. Examples of network properties include Device Index and MAC Address. |
| privateIpAddress | string   | NIC address. |
| publicIpAddress  | string   | The public ip associated with the NIC's private ip.

#### VmDetailsProperty

| **Name**  |**Type**  | **Description** |
| key       | string   |                  |
| value     | string   |                  |
| hidden    | bool     |  Determines if the property is displayed to the sandbox end-user. |

<a name="PowerOn"></a>

## PowerOn method

The *PowerOn* method spins up the VM. It is run autoamtically when reserving the sandbox, as part of CloudShell's default sandbox setup script, and can also be run manually by the sandbox end-user from the deployed App's commands pane. When *PowerOn* completes successfully, the VM's IP address and a green live status icon are displayed on the App in sandbox. 

You don't have to implement this method if the *deploy* method has been configured to spin up the VM.
If *PowerOn* does not fail, CloudShell will set resource state to "online" once the VM is up.

### Signature

{% highlight python %}
def PowerOn(self, context, ports)
{% endhighlight %}

### Inputs

**context:** *context* is a *ResourceRemoteCommandContext* object that contains:

1. connectivity - CloudShell server connectivity data for authentication with CloudShell Automation API 
2. resource - resource configuration settings entered by the user when creating the Cloud Provider resource in the **Inventory** dashboard
3. remote_reservation – reservation details
4. remote_endpoints- will contain a single <a href="https://github.com/QualiSystems/cloudshell-shell-core/blob/36009fdec45134ae38cb9273328b7686be66e553/cloudshell/shell/core/driver_context.py#L38-L64" target="_blank">ResourceContextDetails</a> object which provides data for the operation.

**Ports**

Legacy argument. Obsolete for custom cloud providers.

### PowerOn method implementation

The *PowerOn* method should perform the following steps:

1. Retrieve cloud provider resource connection credentials.
2. Convert the *deployed_app_json* context from string to object.
3. Power off the deployed App resource.

### Return values

None

### Error handling

In case of an error, the command should raise an exception.

<a name="RemoteRefreshIp"></a>

## remote_refresh_ip

The *remote_refresh_ip* method retrieves the VM's updated IP address from the cloud provider and sets it on the deployed App resource. The IP of the main network interface also needs to be retrieved from the cloud provider. Both private and public IPs are retrieved, as appropriate.

*remote_refresh_ip* is called during the sandbox's setup, after the VM is created and connected to networks. It is also called when the user manually triggers the App's **Refresh Ip** command in the sandbox.

**Note:** You can choose not to implement this method, depending on your needs. You should implement this method if the VM address will not be allocated during the **deploy** method or you plan on changing the address via another command.

### Signature

{% highlight python %}
def remote_refresh_ip(self, context, ports, cancellation_context):
{% endhighlight %}

### Inputs

**Context**: *context* is a *ResourceRemoteCommandContextobject* that contains:

1. connectivity - CloudShell server connectivity data for authentication with CloudShell Automation API 
2. resource - resource configuration settings entered when creating the Cloud Provider resource in the **Inventory** dashboard
3. remote_reservation – reservation details
4. remote_endpoints - will contain a single <a href="https://github.com/QualiSystems/cloudshell-shell-core/blob/36009fdec45134ae38cb9273328b7686be66e553/cloudshell/shell/core/driver_context.py#L38-L64" target="_blank">ResourceContextDetails</a> object which provides data for the operation.

{% github_sample_ref /QualiSystems/cloudshell-shell-core/blob/36009fdec45134ae38cb9273328b7686be66e553/cloudshell/shell/core/driver_context.py %}
{% highlight python %}
{% github_sample /QualiSystems/cloudshell-shell-core/blob/36009fdec45134ae38cb9273328b7686be66e553/cloudshell/shell/core/driver_context.py 171 180 %}
{% endhighlight %}

**Ports**

Legacy argument. Obsolete for custom cloud providers.

**Cancellation context**

{% github_sample_ref /QualiSystems/cloudshell-shell-core/blob/36009fdec45134ae38cb9273328b7686be66e553/cloudshell/shell/core/driver_context.py %}
{% highlight python %}
{% github_sample /QualiSystems/cloudshell-shell-core/blob/36009fdec45134ae38cb9273328b7686be66e553/cloudshell/shell/core/driver_context.py 127 130 %}
{% endhighlight %}

### Return values

None.

Unlike other methods that update data using the result, *remote_refresh_ip* updates the deployed App resource by calling *cloudshell-core-api*.

### Error handling

If the operation fails, the command should raise an exception.

### remote_refresh_ip method implementation

This method should perform the following steps:

1. <a href="https://github.com/QualiSystems/Custom-L2-Cloud-Provider-Shell-Example/blob/a8a2f48952e4daaf563e75a32692d280f750a414/src/driver.py#L200" target="_blank">Retrieve the Cloud Provider resource's connection credentials</a>.
2. <a href="https://github.com/QualiSystems/Custom-L2-Cloud-Provider-Shell-Example/blob/a8a2f48952e4daaf563e75a32692d280f750a414/src/driver.py#L201" target="_blank">Convert the *deployed_app_json* context from string to object</a>.
3. <a href="https://github.com/QualiSystems/Custom-L2-Cloud-Provider-Shell-Example/blob/a8a2f48952e4daaf563e75a32692d280f750a414/src/driver.py#L202-L212" target="_blank">Retrieve previously known private/public IPS (if there are any), VM instawnce id</a>.
* <a href="https://github.com/QualiSystems/Custom-L2-Cloud-Provider-Shell-Example/blob/7b97c9d21c1de3946f1ed6b6d715127684638e59/src/heavenly_cloud_service_wrapper.py#L292-L293" target="_blank">Allocate a new private IP to the VM instance</a>.
* If the operation succeeds, <a href="https://github.com/QualiSystems/Custom-L2-Cloud-Provider-Shell-Example/blob/7b97c9d21c1de3946f1ed6b6d715127684638e59/src/heavenly_cloud_service_wrapper.py#L295-L296" target="_blank">update the deployed App resource's private ip in CloudShell via API</a>.
* If the operation fails, display an error to the sandbox end-user.
6. <a href="https://github.com/QualiSystems/Custom-L2-Cloud-Provider-Shell-Example/blob/7b97c9d21c1de3946f1ed6b6d715127684638e59/src/heavenly_cloud_service_wrapper.py#L298-L300" target="_blank">Allocate a new public IP to the VM instance</a>.
* If the operation succeeds, <a href="https://github.com/QualiSystems/Custom-L2-Cloud-Provider-Shell-Example/blob/7b97c9d21c1de3946f1ed6b6d715127684638e59/src/heavenly_cloud_service_wrapper.py#L301" target="_blank">update the deployed App resource's public ip in CloudShell via API</a>.
* If the operation fails, throw error.

<a name="GetVmDetails"></a>

## GetVmDetails method

The *GetVmDetails* method gets information about the App's VM, operating system, specifications and networking information. It is called by the default setup script when reserving the sandbox, after the *RefreshIp* method is called, and can also be run manually by the sandbox end-user on deployed Apps from the App's command pane.

**Note:** The implementation is expected to query the cloud provider for the details, but not return any cached or stored data.

### Signature

{% highlight python %}
def GetVmDetails(self, context, requests, cancellation_context):
{% endhighlight %}

### Inputs

**Context**: *context* is a *ResourceCommandContext* object that contains:

1. connectivity - CloudShell server connectivity data for authentication with CloudShell Automation API 
2. resource - resource configuration settings entered when creating the Cloud Provider resource in the **Inventory** dashboard
3. reservation – reservation details
4. connectors – details of any visual connectors between the Cloud Provider App and other endppoints in the sandbox

{% github_sample_ref /QualiSystems/cloudshell-shell-core/blob/36009fdec45134ae38cb9273328b7686be66e553/cloudshell/shell/core/driver_context.py %}
{% highlight python %}
{% github_sample /QualiSystems/cloudshell-shell-core/blob/36009fdec45134ae38cb9273328b7686be66e553/cloudshell/shell/core/driver_context.py 9 18 %}
{% endhighlight %}

**Requests**

JSON string that contains a list of items containing App requests and deployed App data. This method can be called for a set of VMs.

**Cancellation request**

{% github_sample_ref /QualiSystems/cloudshell-shell-core/blob/36009fdec45134ae38cb9273328b7686be66e553/cloudshell/shell/core/driver_context.py %}
{% highlight python %}
{% github_sample /QualiSystems/cloudshell-shell-core/blob/36009fdec45134ae38cb9273328b7686be66e553/cloudshell/shell/core/driver_context.py 127 130 %}
{% endhighlight %}

### Return values

*VmDetailsData* object in a serialized JSON.

{% github_sample_ref /QualiSystems/cloudshell-cp-core/blob/d58c094d9600b5a6232da16dada1d3a408a88ac9/package/cloudshell/cp/core/models.py %}
{% highlight python %}
{% github_sample /QualiSystems/cloudshell-cp-core/blob/d58c094d9600b5a6232da16dada1d3a408a88ac9/package/cloudshell/cp/core/models.py 281 293 %}
{% endhighlight %}
