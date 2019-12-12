---
layout: page
title: Migrating Shells to Python 3
category: ref
order: 29
comments: true
version:
- 9.3.0
---

{% assign pageUrlSplited = page.url | split: "/" %}
{% assign pageVersion = pageUrlSplited[2] %}

In this article, we’ll explain the general process for upgrading a Python 2-based shell to Python 3.

_**Note:** Quali is currently working on updating all Quali-certified Python 2 shells to Python 3, so if you need a Python 3 version of a Quali-certified shell, please contact your Quali Customer Success representative._

1) Open the *shelldefinition.yaml* file and promote the shell version. For example: 

{% highlight yaml %}
template_version: 2.0.0
{% endhighlight %}

3) Open the *drivermetadata.xml* file and add the **PythonVersion="3"** tag:

{% highlight xml %}
<Driver Description="Describe the purpose of your CloudShell shell" MainClass="driver.CloudService2Driver" Name="CloudService2Driver" Version="1.0.0" PythonVersion="3">
{% endhighlight %}

4) In the *requirements.txt* file:

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;a. Replace `cloudshell-core` with `cloudshell-logging`.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;b. Update the rest of the CloudShell packages to the latest versions.

5) In every .py file in the project:

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;a. Update the code syntax to Python 3 format.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;b. Update the import of `cloudshell-core` to `cloudshell-logging` (no need to update the code).

{% highlight python %}
from cloudshell.logging.qs_logger import get_qs_logger
{% endhighlight %}

5) Make sure all non-CloudShell packages support Python 3.

6) Pack and install the shell on CloudShell.
