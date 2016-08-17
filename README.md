# CloudShell DevGuide Source

This is the home repo of the CloudShell DevGuide. The CloudShell Developer's Guide is an open
source documentation initiative. Pull requests and issues submissions for enhancements and bus
are welcome.

## Installing locally

The DevGuide is running on [Jekyll](https://jekyllrb.com/). To run the DevGuide locally, you'll first need to [install Ruby](https://www.ruby-lang.org/en/documentation/installation/). Then, clone the repo and run the _bundle_ command to install all required gems, including Jekyll.

Finally, run the 'bundle' command to install [Jekyll](https://jekyllrb.com/) and all dependencies.

To start Jekyll run:

```bash
bundle exec jekyll build
bundle exec jekyll serve
```

You'll be able to see the DevGuide site at the default Jekyll URL (127.0.0.1:4000/devguide)
