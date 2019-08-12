<h2>Latest Notes</h2>

{% for post in site.posts %}
<ul>
  <li>
    <a href="{{ post.url | relative_url }}">{{ post.title }}</a> &mdash; <time datetime="{{ post.date | date: "%Y-%m-%d" }}">{{ post.date | date_to_long_string: "ordinal" }}</time>
  </li>
</ul>
{% endfor %}
