[![Stories in Ready](https://badge.waffle.io/QualiSystems/devguide_source.svg?label=ready&title=Ready)](http://waffle.io/QualiSystems/devguide_source)
[![Build Status](https://travis-ci.org/QualiSystems/devguide_source.svg?branch=master)](https://travis-ci.org/QualiSystems/devguide_source)

[![Quali](https://github.com/QualiSystems/devguide_source/raw/master/logo.png)

# CloudShell DevGuide Source

This is the home repo of the CloudShell DevGuide. The CloudShell Developer's Guide is an open
source documentation initiative. You can submit pull requests with articles or bug fixes or post issues for enhancement suggestions, corrections and feedback.

## How to contribute

To provide feedback or request enhancements simply create an issue in the repository. You can use the [Waffle Board](https://waffle.io/QualiSystems/devguide_source) to add issues directly and catch up on the current backlog progress.

You're welcome to submit new documentation articles or suggestions modification or fixes to existing articles.
Simply clone or fork the repo and submit pull request to the master branch.


### Posting code samples

Any code samples should be posted on the the [devguide_examples](https://github.com/QualiSystems/devguide_examples) repository. You can submit a PR to that repository with any code you'd like to include in an article. This DevGuide uses the [jekyll-github-sample](https://github.com/bwillis/jekyll-github-sample) plugin to link to code posted separately.

You can find more info on the plugin website, generally you include the "**github_sample_ref**" tag to provide a reference to the file on the github repo and the "**github_sample**" to include specific lines in the article. Here's a simple example:

```Liquid
{% github_sample_ref /QualiSystems/devguide_examples/blob/driver_deep_dive/adding_examples/driver_deep_dive/src/driver.py %}
{% highlight python %}
{% github_sample /QualiSystems/devguide_examples/blob/driver_deep_dive/adding_examples/driver_deep_dive/src/driver.py 22 35 %}
{% endhighlight %}
```

## Installing locally

The DevGuide is running on [Jekyll](https://jekyllrb.com/). To run the DevGuide locally, you'll first need to [install Ruby](https://www.ruby-lang.org/en/documentation/installation/). Then, clone the repo and run the _bundle_ command to install all required gems, including Jekyll.

Finally, run the 'bundle' command to install [Jekyll](https://jekyllrb.com/) and all dependencies.

To start Jekyll run:

```bash
bundle exec jekyll build
bundle exec jekyll serve
```

You'll be able to see the DevGuide site at the default Jekyll URL at http://127.0.0.1:4000/devguide.
