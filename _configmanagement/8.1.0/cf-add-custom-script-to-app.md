---
layout: page
title: Adding Your Script to an App
category: cf
order: 3
comments: true
version:
    - 8.1.0
---

Now that we have tested and debugged our script, the next step is to add it to an App template.

1)	In CloudShell Portal, open the **Manage>Apps** page.

2)	Edit or create an App.

3)	Open the **Configuration Management** tab.

4)	From the **Select Tool** drop-down list, select **Script**.

5)	Select the appropriate **Connection Method**, depending on the VM’s operating system. Select **Windows Remote Management** for Windows machines, or **SSH** for Linux.

6)	Specify the script’s **URL**. Make sure you specify the raw version of the URL.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;If the selected **Connection Method** is WinRM, the script file should have a .ps1 extension. Similarly, if **SSH** is selected, the script file extension can be either .sh or .bash.

If the URL is protected by Basic Authentication, specify the **Username** and **Password**. 

7)	To pass parameters to the script (as environment variables), click **Add Parameter** and enter each parameter’s name and value.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;You may want the parameter value to be taken dynamically from a Global Input, when reserving the blueprint. To do so, just enter the global input’s name in curly brackets as the parameter value, or click the “plus” button to select an available Global Input.

![Discovery Dialog]({{ site.baseurl}}/assets/cf-custom-script-Configuration-Management-page.png){:class="img-responsive"}

8)	Open the **App Resource** tab, and enter the VM's access credentials.

![Discovery Dialog]({{ site.baseurl}}/assets/cf-custom-script-App-Resource-page.png){:class="img-responsive"}
 
9)	Click **Done**.