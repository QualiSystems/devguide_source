---
layout: page
title: Associating Categories to 1st Gen Service Shells
category: tut
order: 17
comments: true
version:
    - 8.2.0
---

This article explains how to associate service categories to a service Shell. CloudShell exposes services to CloudShell users via service categories, which are associated to the CloudShell domains in which the services are required. The service categories of a specific domain constitute that domain’s services catalog. By default, each service Shell template is associated to a category in the Global domain. 

There are two ways to associate service Shells to categories:

* Add the desired categories to the service’s family in Resource Manager Client
* Define the association in the service Shell’s data model

In this article, we’ll learn how to associate categories via the Shell’s data model. 

**To associate a category to a service Shell:**

1) Make sure you are running Shellfoundry with the Global admin user. Run `shellfoundry config` to see which user you are using.

2) Create a new Shell from a template using `shellfoundry new`.

3) Open the Shell’s root folder.

4) Edit the categories in the _datamodel.xml_ and _category.xml_ files.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**To edit the datamodel.xml:**

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;a) In the _/datamodel_ folder, edit the _datamodel.xml_. 

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;b) Under `<Categories>`, create a duplicate of the commented `<Category>` line.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;c) Change the category name as appropriate.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;d) Uncomment the line. 

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;e) Repeat to add additional categories. 

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;f) Save the file.
 
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**To edit the categories.xml (required if the categories do not exist in CloudShell):**

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;a) In the _/categories_ folder, edit the _categories.xml_. 

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;b) Under `<Categories>`, create a copy of the lines that start with the `<!--<Category Name` line and end with `</Category>-->`. 

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;For example:

{% highlight bash %}  <!--<Category Name="{{ cookiecutter.service_category }}" Catalog="Service">
    <ChildCategories />
  </Category>-->{% endhighlight %}

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;c) Specify the category name. Optionally specify child categories, which are nested under parent categories.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;d) Save the file.
