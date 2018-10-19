<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>{% block title %}Jeroen Wellner{% endblock %}</title>

    <meta name="description" content="Jeroen Wellner - Freelance Mobile &amp; Web Developer">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta name="theme-color" content="#1258A5">

    <link rel="icon" type="image/png" href="/favicon-32x32.png" sizes="32x32">

    {% block head %}
    <link rel="stylesheet" href="/css/index.css" inline>
    {% endblock %}
</head>
<body class="page">
<header class="header">
    <div class="header__title-container">
      <h1 class="header__title"><a href="/" class="header__title-link">Jeroen Wellner</a></h1>
      <p class="header__tagline">Mobile &amp; Web Development</p>
    </div>
    <nav class="header__navigation-container">
        <ul class="navigation">
            <li class="navigation__item"><a href="/about/" class="navigation__item-link">About me</a></li>
            <li class="navigation__item"><a href="/projects/" class="navigation__item-link">Projects</a></li>
            <li class="navigation__item"><a href="/blog/" class="navigation__item-link">Blog</a></li>
        </ul>
    </nav>
</header>
<main class="main">
    <section class="main__content">
      {% block content %}{% endblock %}
    </section>
    <aside class="main__aside">
			<div class="content">
        <h3>Latest posts</h3>
        <ul>
            {% for post in collections.lastPosts %}
            <li><a href="/{{ post.path }}/">{{ post.title }}</a></li>
            {% endfor %}
        </ul>
			</div>
    </aside>
</main>
<footer class="footer">
    <div class="footer__section">
       If needed, <a href="https://github.com/jwellner/www.wllnr.nl/issues/new" class="footer__link">leave some feedback</a>
    </div>
    <div class="footer__section">
      <small><a href="https://github.com/jwellner/www.wllnr.nl/blob/master/src/{{ original_filename }}" class="footer__link">src/{{ original_filename }}</a></small>
    </div>
</footer>
</body>
</html>
