---
author: admin
comments: true
date: 2014-03-25 21:36:00+00:00
layout: post.swig
slug: cordova-file-plugin-tonativeurl
title: Cordova file plugin toNativeURL
wordpress_id: 505
categories:
- Nerd stuff
tags:
- cordova
---

In the latest org.apache.cordova.file plugin there is a new method toNativeURL() on FileEntry. You have to use this URL to link to the file in your Cordova App instead of fullPath of toURL().

This took me some time to find and I hope this note will help some people get on the right track.

See also [Getting device independent path to an image in Phonegap](http://stackoverflow.com/questions/22432238/getting-device-independent-path-to-an-image-in-phonegap) on StackOverflow.

