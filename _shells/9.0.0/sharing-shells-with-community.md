---
layout: page
title: Sharing a Shell with the Community
category: tut
order: 16
comments: true
version:
    - 9.0.0
---

{% assign pageUrlSplited = page.url | split: "/" %}
{% assign pageVersion = pageUrlSplited[2] %}

In this article, we’ll learn how to share our shell with the Quali Community, to allow others to use it as well. This applies to brand new shells and customized versions of existing shells.

## Publishing a new shell

To share a shell with the Quali Community, all you need to do is post it in our community. 
Sign in to <a href="https://community.quali.com/integrations" target="_blank">Quali’s Community Integrations</a> page with a community user, click the **Share an Integration** button and fill in the details. 

For example:

![Directory Structure]({{site.baseurl}}/assets/new-integration-shell.png)

Some of the fields are optional, so please check one of our certified shells to see which fields to fill in, like the <a href="https://community.quali.com/repos/1336/cisco-nxos-switch-shell-2g-1" target="_blank">Cisco NXOS Switch 2G Shell</a>.

To allow community developers to create modified copies of your shell, copy the shell’s repository URL to the **GitHub User/Repository** field, as illustrated above. We recommend using this field since it also allows us to automatically build the **GitHub URL** and **Download URL** links as well as show more details about this repository.

However, if your shell doesn’t have release versions, use the **Download Url** or **GitHub User/Repository** fields. And if your repository has multiple projects and you want to link into a specific folder, use the **GitHub Url** field. In the **Integrations** page, the URLs will be used as follows:

![Directory Structure]({{site.baseurl}}/assets/new-integration-post.png)

The shell’s repository should be displayed shortly in the **Integrations** page as a **Community** grade shell.

## Publishing a customized version of an existing shell

In the relevant shell GitHub repository, open a pull request or issue that briefly explains why we should merge the change(s).
