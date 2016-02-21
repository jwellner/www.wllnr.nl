---
author: admin
comments: true
date: 2008-06-28 14:11:21+00:00
layout: post.html
slug: javascript-and-css-minify-for-php
title: javascript and css minify for PHP
wordpress_id: 38
categories:
- Nerd stuff
tags:
- css
- javascript
- minify
- php
---

To give your website visitors the better experience its important to follow Yahoo's [Rules for High Performance Websites
](http://developer.yahoo.com/performance/index.html#rules)

On a project at work I recently used a very nice javascript and css minify solution called [pack:tag](http://www.galan.de/projects/packtag). Because its a JSP-Taglib only solution I started looking for something like that for PHP. After looking at a few solutions I came across [Minify!](http://code.google.com/p/minify/)


<blockquote>Minify is a PHP library for easily building HTTP servers for Javascript and CSS files. It can combine multiple files, compress their contents without affecting functionality (e.g. removal of unnecessary whitespace/comments), and serve the results with HTTP encoding (deflate/gzip/compress) and headers that allow optimal client-side caching. Server-side caching and lazy loading are also used to optimize performance.

The component PHP classes can also be used in other projects to minify content, perform HTTP encoding, or implement smart client-side caching.</blockquote>


**Features :**



	
  * Combines and minifies multiple CSS or JavaScript files into a single download on the fly

	
  * Uses a PHP implementation of Douglas Crockford's excellent JSMin library for JavaScript minification and custom classes to minify CSS and HTML

	
  * Caches server-side to avoid doing unnecessary work

	
  * Responds with an HTTP 304 (Not Modified) response when the browser already has the requested content in its cache

	
  * Most modules are lazy-loaded as needed (304 responses use minimal code)

	
  * Automatically rewrites relative URLs in combined CSS files to point to valid locations

	
  * And [more](http://code.google.com/p/minify/) ....


