---
layout: page
title: Customizing Shells
category: tut
order: 16
comments: true
version:
    - 8.0.0
---

In this section, we'll learn how to modify a Shell's settings. Note that 1st Gen Shells are modified in Resource Manager Client after they are imported into CloudShell, while 2nd Gen Shells are modified in their **shell-definition.yaml** file.



### Modifying a 1st Gen Shell



### Customizing attributes of a 2nd Gen Shell

**Note:** This capability applies to existing 2nd Generation Shells only. 

In this section, we’ll learn how to add attributes to a Shell and modify attribute rules. 

CloudShell provides two ways to customize attributes:
* Customizing an existing Shell: Use this option when the modifications are related to a specific device but are not relevant to other Shells. 
This is done by manually editing the Shell’s **shell-definition.yaml** file.
* Associating custom attributes with a Shell that is installed in CloudShell: Use this option when the additional attributes are deployment-related and required in multiple Shells. For example, the Execution Server Selector attribute. 

This is done by calling the `SetCustomShellAttribute` API method. For additional information on this method, see Deploying to Production.
The first option only applies to the root model of the Shell, so if you need to customize your Shell’s sub-resource models, such as blades and ports, use the second option. Note that version 9.0.0 will support sub-resource modifications via the **shell-definition.yaml** file.

Note that deleting a Shell’s default attributes is not supported.



#### Adding attributes to a Shell's model

**To add attributes to a Shell’s root model:**

1) Download the Shell by running the following in command-line:

{% highlight bash %}
shellfoundy extend <shell template name>
{% endhighlight %}

2) In the Shell’s download folder, open the shell-definition.yaml file in your preferred editor.

3) Locate the node-types: node.

4) Under the root level model, add the following lines:

{% highlight bash %}
        #properties:    
	    #  property_name:	    
	    #    type: string          # optional values: string, integer, float, boolean, cloudshell.datatypes.Password	    
	    #    default: fast	    
	    #    description: Some attribute description	    
	    #    constraints:	    
	    #      - valid_values: [fast, slow]
        #    tags: [configuration, setting, not_searchable, abstract_filter, include_in_insight, readonly_to_users display_in_diagram, connection_attribute, read_only]
{% endhighlight %}
   
5) Edit their settings, as appropriate. 

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;For  information on these settings, see the CloudShell online help. For details about the tags, see the [Modeling Shells with TOSCA]({{site.baseurl}}/shells/{{pageVersion}}/modeling-the-shell.html).

6) Remove any unneeded lines.

7) Save the file.

8) In command-line, navigate to the Shell’s root folder.

9) Package the Shell.

{% highlight bash %}shellfoundry pack{% endhighlight %}

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Alternatively, package and import the Shell to CloudShell:

{% highlight bash %}shellfoundry install{% endhighlight %}



#### Modifying an existing attribute's rules

Note that this is the only modification that is supported for default attributes on 2nd Generation Shells.

**To modify an attribute’s rules:**

1) Download the Shell by running the following in command-line:

    {% highlight bash %}shellfoundy extend <shell template name>{% endhighlight %}

2) In the Shell’s download folder, open the **shell-definition.yaml** file in your preferred editor.

3) Under the `node-types:` node.

4) Add the following lines.

{% highlight bash %}
   property_name:
   tags: [configuration, setting, not_searchable, abstract_filter, include_in_insight, readonly_to_users display_in_diagram, connection_attribute, read_only]
{% endhighlight %}

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;For details about the tags, see the [Modeling Shells with TOSCA]({{site.baseurl}}/shells/{{pageVersion}}/modeling-the-shell.html).

5) Replace property_name with the attribute’s name. Do not remove the colon (`:`} from the end of the line.

6) Remove unneeded rules from the tags line. 

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The attribute is updated.
