---
layout: page
title: Search Results
---
<section id="search-results" style="display: none;"> </section>


{% raw %}
<script id="search-results-template" type="text/mustache">
  {{#entries}}
    <article>
      <h3>
        <a href="/devguide{{url}}">{{title}}</a>
      </h3>
    </article>
  {{/entries}}
  {% endraw %}
</script>
