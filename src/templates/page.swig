{% extends 'layout.swig' %}

{% block title %}{{ title }} : Jeroen Wellner{% endblock %}

{% block head %}
  {% parent %}
{% endblock %}

{% block content %}
<article class="content">
	<h1>{{ title }}</h1>
	{{ contents | safe }}
</article>
{% endblock %}
