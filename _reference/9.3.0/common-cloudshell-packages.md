---
layout: page
title: Common CloudShell Packages
category: ref
order: 27
comments: true
version:
    - 9.3.0
---

{% assign pageUrlSplited = page.url | split: "/" %}
{% assign pageVersion = pageUrlSplited[2] %}

This article lists the basic Python packages you would need for shells and scripts. These packages were developed by Quali and are available on public PyPi.

_While there are additional packages for specific needs and capabilities, the packages listed below cover most of the required functionality. For additional information, see [Quali’s Shell Framework (Python 2)]({{site.baseurl}}/reference/{{pageVersion}}/quali-shell-framework.html) for python 2.7 automation and [Quali’s Shell Framework (Python 3)]({{site.baseurl}}/reference/{{pageVersion}}/quali-shell-framework-python-3.html) if you're developing in Python 3.x._ 

**Notes:** 
* *cloudshell-orch-core* is the only package you need for orchestration scripts.
* *cloudshell-orch-core* contains *cloudshell-automation-api*
* While *cloudshell-automation-api* includes several methods that apply to shells, it provides unnecessary access to CloudShell administrative areas and is therefore not recommended to be used in shells.

<style>
table {
    font-family: arial, sans-serif;
    border-collapse: collapse;
    width: 100%;
}

td, th {
    border: 1px solid #dddddd;
    text-align: left;
    padding: 8px;
}

tr:nth-child(even) {
    background-color: #dddddd;
}
</style>


| **Package**                    | **Python version**   |**Description**        | **Links** |
|   cloudshell-orch-core         | Python 2/3           | Package for writing CloudShell orchestration scripts. For additional information, see [Best Practices for working with orchestration scripts]({{site.baseurl}}/orchestration/{{pageVersion}}/getting-started.html). | [PyPi](https://pypi.org/project/cloudshell-orch-core/)/[GitHub](https://github.com/QualiSystems/cloudshell-orch-core) | 
|   cloudshell-automation-api    | Python 2/3           | Package for working with CloudShell Automation API.  | [PyPi](https://pypi.org/project/cloudshell-automation-api/)/[Documentation](https://help.quali.com/Online%20Help/0.0/Python-API/) |
|   cloudshell-logging           | Python 2/3             | Package for creating shell loggers.  | [PyPi](https://pypi.org/project/cloudshell-logging)/[GitHub](https://github.com/QualiSystems/cloudshell-logging) |
|   cloudshell-core              | Python 2 | Legacy logging package (replaced with *cloudshell-logging* in version 9.3).  | [PyPi](https://pypi.org/project/cloudshell-core/)/[GitHub](https://github.com/QualiSystems/cloudshell-core) |
|   cloudshell-snmp              | Python 2/3 | Package for developing shell communication with devices via SNMP.  | [PyPi](https://pypi.org/project/cloudshell-snmp/)/[GitHub](https://github.com/QualiSystems/cloudshell-snmp) |
|   cloudshell-cli               | Python 2/3 | Package for developing shell communication with devices via CLI.              | [PyPi](https://pypi.org/project/cloudshell-cli/)/[GitHub](https://github.com/QualiSystems/cloudshell-cli)  |
|   cloudshell-shell-core        | Python 2/3 | Package containing base shell functionality and interfaces. | [PyPi](https://pypi.org/project/cloudshell-shell-core/)/[GitHub](https://github.com/QualiSystems/cloudshell-shell-core) |

