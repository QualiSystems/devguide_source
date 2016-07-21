---
layout: page
title: Modeling the Shell
category: tut
order:  4
---

By defining how a Shell is modeled in CloudShell we can control how its represented in CloudShell. If you've gone through the steps of the
[Getting Started](/devguide/tut/getting-started.html) walkthrough you may have noticed that with little effort we've already managed
to model a new type of entity. In this section we'll take a more in depth look at how we can customize how the Shell resources or deployed
apps are viewed and behave in CloudShell. In the following sections we'll also look into how to add commands by writing a driver, but
its important to note that even this initial step is enough in order to install and use a new Shell in CloudShell.

### Setting the Standard

The first thing to do is to classify the Shell according to one of the CloudShell standards. CloudShell has a growing number of
standards defined which make it easier to create a new Shell without having to re-invent its structure and properties.
Each standard has one or more ShellFoundry templates associated with it, so the best way to create a compliant Shell is to use the ShellFoundry
template parameter.

To get a list of the possible templates, run the following from command line:

{% highlight bash %}
shellfoundry list
{% endhighlight %}

For this example, we'll use the resource-shell-clean template, which is a clean implementation of the Shell basic standard, a generic standard for any
standalone Shell. We'll look into some of the standards at greater depth in future sections of this guide.

Run the following from command line:

{% highlight bash %}
shellfoundry new model_example --template=resource-shell-clean
cd model_example
{% endhighlight %}

To complete the basic setup, create an instance of that Shell in the Inventory page of the CloudShell and reserve
the Shell physical resource. If you'd like to review again the steps of how to do that,
please refer to the [Getting Started](/devguide/tut/getting-started.html) guide.

### The Shell Datamodel

As you may have seen in previous examples, by using ShellFoundry we've generated a Shell project which can be deployed to CloudShell.
This time, however, we'll take a look at some of the important settings of the model and what can be customized.
The main Shell model definition can be found in the shell_model.xml file found in the _datamodel_ directory.

There are two important files located in the _datamodel_ directory. One, _datamodel.xml_ represents the CloudShell Standard.
You should avoid modifying the _datamodel.xml_ file as it represents definitions that are a part of the CloudShell standard relevant
to the Shell type. It is helpful, however, to review this file in order to understand how it is structured
and the type of data it presents.

#### Resource Families

Resource families represent broad categories or abstract types or roles of resources.
Examples of families are: Switch, Router, Firewall or Generic App.
The families in the _datamodel.xml_ file are listed under the _\<ResourceFamilies>_ element. Each of the
families can come predefined with its own attributes and additional metadata. Using the _resource-shell_
standard, we get the _generic_resource_, _port_, and _power_port_ families.

#### Resource models

Models are more specific types of resource and apps in CloudShell. For physical resource Shells the
model corresponds to the specific vendor/OS combination the Shell covers. For deployed apps, the model is usually one to one
with the app itself. There are also more generic models which represent basic components like ports or connectors
which don't always need a high level of detailed modeling. In terms of hierarchy, every resource in CloudShell has
a model and each model belongs to a family

* Examples of resource shell models: Cisco NXOS Switch, Raritan PDU
* Examples of deployed app shell models: Windows OS, MySQL, TeraVM TG Controller, JMeter
* Examples of generic component models: Resource Port, Generic Power Port

In the Shell project structure, the _datamodel.xml_ contains the models which are a part of the Standard. These are by definition
not vendor, device or app specific but more general components. Looking at the models defined in the _datamodel.xml_ file
of our Shell we can similarly see it contains some very basic building blocks like _Resource Port_ and _Power Port_. Again,
each of them has their attribute
The model for the Shell we're developing, is actually not a part of the _datamodel.xml_ file. The reason for that is that our
new Shell we are development is not a part of the standard, it is pointing to or implementing the standard.

Our Shell is actually defined in the _shell_model.xml_ file. The reason for the separation is that the _shell_model.xml_ file
is actually the one we'll mostly want to extend or customize. By default, when we generated the Shell via ShellFoundry,
a ResourceModel was automatically created as the Shell model with the same name of the Shell, which is the convention.
The _shell_model.xml_ file which was automatically generated for our basic resource shell contains the following content:

{% prism xml linenos=5-125  %}
<Shell>
    <ShellAttributes>
    </ShellAttributes>

    <ShellModel Family="Generic Resource">
        <ResourceModel Name="ModelExample" Description="" SupportsConcurrentCommands="true">
            <AttachedAttributes>
                <AttachedAttribute Name="User" IsOverridable="true" IsLocal="true">
                  <AllowedValues />
                </AttachedAttribute>
                <AttachedAttribute Name="Password" IsOverridable="true" IsLocal="true">
                  <AllowedValues />
                </AttachedAttribute>
                <AttachedAttribute Name="Power Management" IsOverridable="true" IsLocal="true">
                  <AllowedValues />
                </AttachedAttribute>
                <AttachedAttribute Name="Enable Password" IsOverridable="true" IsLocal="true">
                  <AllowedValues />
                </AttachedAttribute>
                <AttachedAttribute Name="System Name" IsOverridable="true" IsLocal="true">
                  <AllowedValues />
                </AttachedAttribute>
                <AttachedAttribute Name="Vendor" IsOverridable="true" IsLocal="true">
                  <AllowedValues />
                </AttachedAttribute>
                <AttachedAttribute Name="Location" IsOverridable="true" IsLocal="true">
                  <AllowedValues />
                </AttachedAttribute>
                <AttachedAttribute Name="Backup Location" IsOverridable="true" IsLocal="true">
                  <AllowedValues />
                </AttachedAttribute>
                <AttachedAttribute Name="Model" IsOverridable="true" IsLocal="true">
                  <AllowedValues />
                </AttachedAttribute>
                <AttachedAttribute Name="SNMP Read Community" IsOverridable="true" IsLocal="true">
                  <AllowedValues />
                </AttachedAttribute>
                <AttachedAttribute Name="SNMP Write Community" IsOverridable="true" IsLocal="true">
                  <AllowedValues />
                </AttachedAttribute>
                <AttachedAttribute Name="SNMP V3 Password" IsOverridable="true" IsLocal="true">
                  <AllowedValues />
                </AttachedAttribute>
                <AttachedAttribute Name="SNMP V3 Private Key" IsOverridable="true" IsLocal="true">
                  <AllowedValues />
                </AttachedAttribute>
                <AttachedAttribute Name="SNMP V3 User" IsOverridable="true" IsLocal="true">
                  <AllowedValues />
                </AttachedAttribute>
                <AttachedAttribute Name="SNMP Version" IsOverridable="true" IsLocal="true">
                  <AllowedValues />
                </AttachedAttribute>
                <AttachedAttribute Name="Sessions Concurrency Limit" IsOverridable="true" IsLocal="true">
                  <AllowedValues />
                </AttachedAttribute>
                <AttachedAttribute Name="Console Server IP Address" IsOverridable="true" IsLocal="true">
                  <AllowedValues />
                </AttachedAttribute>
                <AttachedAttribute Name="Console User" IsOverridable="true" IsLocal="true">
                  <AllowedValues />
                </AttachedAttribute>
                <AttachedAttribute Name="Console Password" IsOverridable="true" IsLocal="true">
                  <AllowedValues />
                </AttachedAttribute>
                <AttachedAttribute Name="Console Port" IsOverridable="true" IsLocal="true">
                  <AllowedValues />
                </AttachedAttribute>
                <AttachedAttribute Name="CLI Connection Type" IsOverridable="true" IsLocal="true">
                  <AllowedValues />
                </AttachedAttribute>
            </AttachedAttributes>
            <AttributeValues>
                <AttributeValue Name="User" Value="" />
                <AttributeValue Name="Password" Value="3M3u7nkDzxWb0aJ/IZYeWw==" />
                <AttributeValue Name="Enable Password" Value="3M3u7nkDzxWb0aJ/IZYeWw==" />
                <AttributeValue Name="System Name" Value="" />
                <AttributeValue Name="Contact Name" Value="" />
                <AttributeValue Name="OS Version" Value="" />
                <AttributeValue Name="Vendor" Value="" />
                <AttributeValue Name="Location" Value="" />
                <AttributeValue Name="Model" Value="" />
                <AttributeValue Name="Backup Location" Value="" />
                <AttributeValue Name="SNMP Read Community" Value="" />
                <AttributeValue Name="SNMP Write Community" Value="" />
                <AttributeValue Name="SNMP V3 Password" Value="" />
                <AttributeValue Name="SNMP V3 Private Key" Value="" />
                <AttributeValue Name="SNMP V3 User" Value="" />
                <AttributeValue Name="SNMP Version" Value="" />
                <AttributeValue Name="Console Server IP Address" Value="" />
                <AttributeValue Name="Console User" Value="" />
                <AttributeValue Name="Console Password" Value="3M3u7nkDzxWb0aJ/IZYeWw==" />
                <AttributeValue Name="Console Port" Value="0" />
                <AttributeValue Name="CLI Connection Type" Value="Auto" />
                <AttributeValue Name="Power Management" Value="False" />
              </AttributeValues>
            <ParentModels />
            <Drivers>
                <DriverName>ModelExampleDriver</DriverName>
            </Drivers>
            <Scripts />
        </ResourceModel>
    </ShellModel>
</Shell>
{% endprism %}

As you can see in the XML code above, our new Shell defines a unique model (highlighted). The model already has some
associated with it which are defined in the Standard. We can customize the Shell datamodel in several way in this file.

### Changing the Shell image and description

First copy the image to the _datamodel_ folder. To set the Shell image, add the following attribute to the
_\<ResourceModel>_ element:

{% prism xml  %}
<ResourceModel Name="ModelExample" Description="" SupportsConcurrentCommands="true" ImagePath="example_model_image.png">
{% endprism %}

To update the Shell description change the value in the "Description" attribute in the above xml.

Apply changes by running:

{% highlight bash %}
shellfoundry install
{% endhighlight %}

Refreshing the reservation reservation, our shell resource will now show the updated image and description:

![Shell Image]({{ site.url }}/devguide/assets/shell_custom_image.png)


### Adding a custom attribute to the Shell

The _shell_model.xml_ file located in the _datamodel_ directory contains the basic shell attributes.
As you can see our new Shell model already contains a lot of attribute associations, defined in the _\<AttachedAttributes>_ and
_\<AttributeValues>_ sections.

However, the _shell_model.xml_ also has a dedicated element just for custom attributes which you might want to add to the Shell
in addition to those provided by the standard. This element is currently empty and is the _\<ShellAttributes>_ element.
We can add some attribute definitions here to extend the Shell with some custom attributes.

If we open up the attributes side pane in the sandbox page for the Shell resource we'll see the default attributes which are
as visible to end users on the web.

![Shell Image]({{ site.url }}/devguide/assets/shell_attributes_pane.png)

To add a simple attribute to the shell we first need to add an _\<AttributeInfo>_ element to this element like so:

{% prism xml linenos=2-6 %}
<ShellAttributes>
    <AttributeInfo Name="ModelExample Custom Att" Type="String" DefaultValue="" IsReadOnly="false">
      <Rules>
        <Rule Name="Setting" />
      </Rules>
    </AttributeInfo>
</ShellAttributes>
{% endprism %}

By adding this element, we've defined a new attribute. Next, we'll want to associated the new custom attribute to our Shell model and
set the value for it. We do this by adding both an _\<AttachedAttribute>_ and a _\<AttributeValue>_ elements.

First, under the _\<AttachedAttributes>_ element, append the following xml code (before, after or between the existing _AttachedAttribute_
elements)

{% prism xml linenos=4-7 %}
<ShellModel Family="Generic Resource">
      <ResourceModel Name="ModelExample" Description="" SupportsConcurrentCommands="true">
          <AttachedAttributes>
              <AttachedAttribute Name="ModelExample Custom Att" IsOverridable="true" IsLocal="true">
                <AllowedValues />
              </AttachedAttribute>
              <AttachedAttribute Name="User" IsOverridable="true" IsLocal="true">
.... (more content here) ...
{% endprism %}

Lastly, add the following _\<AttributeValue>_ under the  _AttributeValues_ element. Please notice that even if you don't
want to specify a default value, you should still add this element with a blank value.

{% prism xml linenos=5 %}
.... (more content here) ...
          </AttachedAttribute>
      </AttachedAttributes>
      <AttributeValues>
          <AttributeValue Name="ModelExample Custom Att"  Value="Default Value" />
          <AttributeValue Name="User" Value="" />
.... (more content here) ...
{% endprism %}

To test whether this worked lets re-install the Shell from command line:
{% highlight bash %}
shellfoundry install
{% endhighlight %}

After refreshing the sandbox diagram and re-opening the attributes pane, you should be able to see the new attribute:

![Shell Image]({{ site.url }}/devguide/assets/shell_custom_attribute.png)


### Fine tuning custom shell attributes
