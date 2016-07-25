---
layout: page
title: Search
---
<form action="/devguide/search.html" method="get">
  <input class="main_search" type="text" id="search-query" name="q" placeholder="Search" autocomplete="off">
</form>

<section id="search-results" style="display: none;"> </section>

{% raw %}
<script id="search-results-template" type="text/mustache">
  {{#entries}}
    <article>
      <h3>
        <a href="/devguide/{{url}}">{{title}}</a>
      </h3>
      {{#is_post}}
      <ul>
        {{#tags}}<li>{{.}} </li>{{/tags}}
      </ul>
      {{/is_post}}
    </article>
  {{/entries}}
</script>
{% endraw %}

<script src="{{ site.baseurl }}/js/search.min.js" type="text/javascript" charset="utf-8"></script>

<script type="text/javascript">
  $(function() {
    $('#search-query').lunrSearch({
      indexUrl  : '/devguide/js/index.json',           // url for the .json file containing search index data
      results   : '#search-results',          // selector for containing search results element
      template  : '#search-results-template', // selector for Mustache.js template
      titleMsg  : '<h1>Search results<h1>',   // message attached in front of results (can be empty)
      emptyMsg  : '<p>Nothing found.</p>'     // shown message if search returns no results
    });
  });
</script>
