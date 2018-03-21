{% extends 'layout.swig' %}

{% block title %}{{ title }} : Jeroen Wellner{% endblock %}

{% block head %}
  {% parent %}
{% endblock %}

{% block content %}
<article>
	<h1>{{ title }}</h1>
	<p class="date">{{ date|date('F j, Y') }}</p>
	{{ contents | safe }}
</article>
{% endblock %}
