---
author: admin
comments: true
date: 2009-08-18 20:30:36+00:00
layout: post.html
slug: cakephp-javascript-link-in-elements
title: CakePHP javascript->link in elements
wordpress_id: 132
categories:
- Nerd stuff
tags:
- cakephp
- javascript
- php
---

For my[ CakePHP](http://www.cakephp.org) project I wanted to use the Javascript helper in a element. This element needs a javascript include (which i only use for this element) so I thought to it would be a good place to add it using the Javascript helper in the element template. To my surprise the javascript did not end up in the $scripts_for_layout variable. After hours of searching and debugging I found [issue #6323](https://trac.cakephp.org/ticket/6323) in CakePHP trac :


<blockquote>scripts_for_layout is generated _before_ the layout is rendered. Therefore it cannot contain scripts from elements that are included in the layout as that would require bending of space time. As templates are just plain PHP, and are parsed by the PHP interpreter only.

There are alternative solutions for this in the works, but at this time rebuilding space time is a too large of a task. :)</blockquote>


I think the CakePHP team will find some solution for this. Before that you can use the solution_ therma_lobsterdore_ provided:


<blockquote>

> 
> 

You can get around this problem by manually recreating scripts_for_layout. Remove $scripts_for_layout from your view and replace it with this...

>     
>     echo join("\n\t", $this->__scripts);
> 
> 

> 
> </blockquote>


I hope this helps some people experiencing the same problem :)
