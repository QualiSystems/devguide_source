---
layout: page
title: Tips and Tricks
category: ref
order: 3
---

### Managing the CloudShell session

Creating an instance of CloudShellAPISession can be expensive. Each time such an object is created
a new login request is made, which can impact the performance of the driver/script. In theory
it would be better to create the session once per command and then pass it in a convenient way
to any internal function called in the execution flow.

For Shell drivers, the cloudshell-shell-core contains a convenient object to manage this scope:

{% highlight python %}
with CloudShellSessionContext(context) as session:
         perform_validations(session)
         do_some_logic(session)
         do_some_more_logic(session)
{% endhighlight %}
