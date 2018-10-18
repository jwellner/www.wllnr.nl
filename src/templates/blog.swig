{% extends 'layout.swig' %}

{% block title %}{{ title }} : Jeroen Wellner{% endblock %}

{% block head %}
  {% parent %}
{% endblock %}

{% block content %}
<section class="content">
	<h1>{{ title }}</h1>
	{{ contents | safe }}
</section>
{% for post in collections.posts %}
	<article class="content">
		<h2><a href="/{{ post.path }}/">{{ post.title }}</a></h2>
		<p class="date">{{ post.date | date('F j, Y') }}</p>
	</article>
{% endfor %}
{% endblock %}
