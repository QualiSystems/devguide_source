---
layout: page
title: Tips and Tricks
category: tut
order: 13
comments: true
version:
    - 8.0.0
    - 7.1.0
tags:
    - api
    - logging
---

### Managing the CloudShell session

Creating an instance of CloudShellAPISession can be expensive. Each time such an object is created
a new login request is made, which can impact the performance of the driver/script. In theory
it would be better to create the session once per command and then pass it in a convenient way
to any internal function called in the execution flow.

For Shell drivers, the cloudshell-shell-core contains a convenient object to manage this scope.
We pass this helper the _context_ parameter of the driver command:

{% highlight python %}
from cloudshell.shell.core.session.cloudshell_session import CloudShellSessionContext
with CloudShellSessionContext(context) as session:
         perform_validations(session)
         do_some_logic(session)
         do_some_more_logic(session)
{% endhighlight %}

### Logging

Any logging package can be used with CloudShell. Quali has a customized logging solution
which is thread and process safe, and that organizes logs to different files according to resource
and sandboxes. The Quali logging module is defined in the _cloudshell_core_ package.

The simplest way to get a hold of a logger object is to use the _get_qs_logger_ module:
{% highlight python %}
from cloudshell.core.logger.qs_logger import get_qs_logger
logger = get_qs_logger(log_category=reservation_id,log_group=resource_name)
logger.info("log something")
{% endhighlight %}

For the default logger, the _log_category_ parameter defines the folder under which logs will be grouped
whereas the _log_group_ defines the file. The CloudShell convention is to create a folder for each
reservation id and a file for each resource name. For orchestration scripts, the file name
is the environment name.

![Log Structure]({{ site.baseurl}}/assets/log_structure.png){:class="img-responsive"}

All logs will be saved on the Execution Server where the driver is running. The folder location will be
relative to the driver in the virtual environment location at:
 **_%venv%\\[drivername]\\Lib\\site-packages\\cloudshell\\Logs_**.  (e.g. C:\\ProgramData\\QualiSystems\\venv\\Deployment_Orchestrator_5_2\\Lib\\site-packages\\cloudshell\\Logs.)

Under windows, [venv] will be located at _%programdata%\\qualisystems\\venv_.

You can then use the regular logging level syntax to write messages as a part of the driver
package or script flow:

{% highlight python %}
logger.debug("debug message")
logger.info("info message")
logger.warn("warning message"
logger.error("error message")
{% endhighlight %}

Only messages which are greater than the log level currently set for the driver will be saved to file.
Typically, changing the log level to a more verbose value would be done only in order to debug an issue, as
writing too much to the logs can be expensive. You can change the logging level on the ES or driver level.

To change the log level on the driver level, edit the following configuration file:
**_[venv]\\[drivername]\\Lib\\site-packages\\cloudshell\\core\\logger\qs_config.init_** and change the
log level value. Notice that this change will only be valid for that virtual environment, so if the driver
is recycled due to inactivity the log level will revert to the default value.

To change the log level for the entire ES, without editing any files, add the following key to the ES
_customer.config_ (change 'DEBUG' to the log level you wish to set):

{% highlight xml %}
<add key="DefaultPythonEnvrionmentVariables" value="LOG_LEVEL=DEBUG"/>
{% endhighlight %}

You will need to restart the ES following this change.

Similar to the CloudShell API session, its recommended to create a logger once per command and then pass it
to any internal classes that require it. As with the CloudShell API we've added some helpers in the _cloudshell-shell-core_
package which can reduce some of the repetition around creating a logger and create a more explicit scope for it:

{% highlight python %}
with LoggingSessionContext(command_context) as logger:
    do_something(logger)
    do something_else(logger)
{% endhighlight %}

Another repetitive task is to remember to log any exception raised during the driver execution. Here too,
_cloudshell-shell-core_ provides a handy scope:

{% highlight python %}
with ErrorHandlingContext(logger):
    will_get_automatically_logged_on_exception()
{% endhighlight %}

Using this scope any exception raised within the _ErrorHandlingContext_ will be logged, even if no code remembered
to explicitly call the logger.

### Nested scopes

Finally, nesting the three helpers mentioned in this article makes a lot of sense as they're not mutually exclusive.
This syntax will also work well:

{% highlight python %}
def driver_command(self, command_context, request):
    with LoggingSessionContext(command_context) as logger:
        with ErrorHandlingContext(logger):
            with CloudShellSessionContext(command_context) as session:
                do_the_logic(session, logger)
{% endhighlight %}

If the heavily nested code seems problematic its always possible to create a module that accepts the function to
run as an input and applies these scopes behind the scenes.


{% highlight python %}
def do_with_session_and_logging(self, command_context, function):
    with LoggingSessionContext(command_context) as logger:
        with ErrorHandlingContext(logger):
            with CloudShellSessionContext(command_context) as session:
                function(session, logger)

def driver_command(self, command_context, request):
    do_with_session_and_logging(command_context,
                                lambda session, logger: do_the_logic(session, logger))

{% endhighlight %}
