---
title: Moved to static website
date: 2016-02-20
layout: post.html
---

Today I moved **www.wllnr.nl** from Wordpress to a static website hosted on [google cloud storage](https://cloud.google.com/storage/).

Wordpress required me to run a web server with PHP and a database. While I always liked to run my own servers, it was always a lot of work when you need to update, migrate every other year and a half. 

After trying a few static site generators I decided to go for [Metalsmith](http://www.metalsmith.io/). I liked the simple and pluggable nature. Metalsmith works nicely with Gulp using [gulpsmith](https://github.com/pjeby/gulpsmith). 

### Gulp build

The build system builds .html pages from a content directory with .md (markdown) files. The content directory has a pages and posts folder. The .md files have metadata (title, date, layout) in them in YAML format. 

**Metadata example for this page:**

	---
	title: Moved to static website
	date: 2016-02-20
	layout: post.html
	---

The pages are build to static .html files with the pattern `:title`. The blog files are build to static .html files with the pattern `blog/:date/:title`.

### rsync to Google cloud storage
After the static files are build I can deploy the site with a simple rsync to Google cloud storage. And the result is this super fast snappy website! :)

I will go more in detail in a next blog post!



