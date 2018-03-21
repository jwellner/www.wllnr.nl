---
author: admin
comments: true
date: 2008-11-23 20:26:04+00:00
layout: post.swig
slug: webkit-css-transformation-and-radius
title: 'Webkit css: transformation and radius'
wordpress_id: 77
categories:
- Nerd stuff
tags:
- chrome
- css
- safari
- webkit
---

Today i changed my layout a little. I came around some webkit only css functions: Transformations. Webkit is the browser engine for Apple's Safari and Google's Chrome. Its still awaiting CSS3 approval so it wont work in other browsers yet.

In my menu i've added :Â 



    .menu a {
      -webkit-transition: -webkit-transform 0.2s ease-out;
    }
    .menu a:hover {
      color: #9ED728;
      -webkit-transform: scale(1.2);
    }




Check my menu for the result!

I also added some rounded corners on the date box. This will work for Mozilla and Webkit browsers:




    dl.date {
    	-moz-border-radius:10px;
    	-webkit-border-radius: 10px;
    }




You can als rotate and translate your block items, check this post at [The Art of Web](http://www.the-art-of-web.com/css/css-animation/) for more cool stuff!
