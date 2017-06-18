---
layout: page
title: Search Results
---
<section id="search-results" style="display: none;"> </section>


<script id="search-results-template" type="text/mustache">
	<script>	debugger; </script>
{% raw %}
  {{#entries}}
    <article>
      <h3>
        <a href="/devguide/{{url}}">{{title}} - {{url}}</a>
      </h3>
      {{#is_post}}
      <ul>
        {{#tags}}<li>{{.}} </li>{{/tags}}
      </ul>
      {{/is_post}}
    </article>
  {{/entries}}
  {% endraw %}
</script>
