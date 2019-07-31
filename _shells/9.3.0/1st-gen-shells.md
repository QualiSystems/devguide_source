---
layout: page
title: 1st Gen Shells
category: tut
order: 17
comments: true
version:
    - 9.3.0
---

{% assign pageUrlSplited = page.url | split: "/" %}
{% assign pageVersion = pageUrlSplited[2] %}

1st Gen Shells are imported as CloudShell packages that contain the data model and driver for the intended sandbox element. 1st Gen Shells allow extensive control of the family and model, and therefore are not standardized. While they allow maximal flexibility, when using them, some Shell management capabilities may not be available.

However, unlike 2nd Gen Shells, 1st Gen Shells carry several limitations:

* Shell integrity isn’t enforced by CloudShell
* No way to uninstall a shell
* Versions are not managed
* Data model is shared, which may cause conflicts between shells

Today you can still find 1st Gen Shells in our community but all new official shells are released as 2nd Gen Shells only. "2nd Gen" is the “code name” for shell entity, a new feature introduced in 8.0. For more information about 2nd Gen Shells, see the <a href="http://help.quali.com/Online%20Help/8.3/Portal/Content/CSP/LAB-MNG/Shells.htm" target="_blank">CloudShell online help</a>.

Note that the same 2nd Gen Shell standards apply to 1st Gen (but are not enforced by CloudShell). There are 1st Gen Shell templates available for Shell development in [Shellfoundry]({{site.baseurl}}/reference/{{pageVersion}}/shellfoundry-intro.html). However, it is recommended to develop only 2nd Gen Shells using the official Shell templates and guidelines. 

The following articles relate to 1st Gen Shells:

* [Converting 1st Gen Shells into 2nd Gen Shells]({{site.baseurl}}/reference/{{pageVersion}}/migrating_1st_gen_shells.html)

* [Associating Categories to 1st Gen Service Shells]({{site.baseurl}}/reference/{{pageVersion}}/associating-service-categories.html)


