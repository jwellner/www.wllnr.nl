{% extends 'layout.swig' %}

{% block title %}{{ title }} : Jeroen Wellner{% endblock %}

{% block head %}
  {% parent %}
{% endblock %}

{% block content %}
<section class="row row--sm">
	<div class="col">
		<div class="content">
			<h3>About me</h3>

			<p>Building things for the Internet since 1995.</p>

			<a href="/about/">About me</a>
		</div>
	</div>
	<div class="col">
		<div class="content">
			<h3>Projects</h3>

			<p>What am I currently working on?</p>

			<a href="/projects/">Projects</a>
		</div>
	</div>
	<div class="col">
		<div class="content">
			<h3>Blog</h3>

			<p>Technology, cycling and other stuff that keeps me busy.</p>

			<a href="/blog/">Blog</a>
		</div>
	</div>
</section>
{% endblock %}
