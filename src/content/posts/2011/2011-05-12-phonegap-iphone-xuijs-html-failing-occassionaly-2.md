---
author: admin
comments: true
date: 2011-05-12 19:18:27+00:00
layout: post.html
slug: phonegap-iphone-xuijs-html-failing-occassionaly-2
title: PhoneGap + iPhone + xuijs .html() failing occassionaly
wordpress_id: 352
categories:
- Nerd stuff
---

Today I finally fixed a bug that was chasing me for days. I hope this article will save other people some time.





When loading a view in my [PhoneGap](http://www.phonegap.com/) + [xuijs](http://xuijs.com/) app I'm displaying data from a database, but 50% of the time the data was not visible on the screen. When I loaded the screen again data was not show on different random places.



<!-- more -->



This was all working perfectly from a browser. Only when I loaded it with PhoneGap on the iPhone it occurred. After searching the internet I found there happens to be some (old?) WebkitÂ bug where setting innerHTML is failing "occasionally". Xuijs .html method is using innerHTML to add a HTML string to the DOM.





Because Apple uses a different Webkit version for PhoneGaps UIWebView this only occurs when you load your app with PhoneGap. It looks like it is fixed in the Webkit browser on the same device.Â This article from [John mc Kerrell](http://blog.johnmckerrell.com/2007/03/07/problems-with-safari-and-innerhtml/) in 2007 points out its a really old bug. He suggests adding a timer andÂ try to set the innerHTML a few times but I dont think that is the best solution.



For the time being i'm using the following solutions:



	
  * When I only need to set text I use the **.innerText** property to set the text.

	
  * When I need to add HTML I create **new DOM elements** and add it to the DOM.




## Examples


**problem**

    
    x$('#someul').html("bottom","<li>With text</li>");


**solution**

    
    var li = document.createElement("li");
    li.innerText = "With text";
    x$("#someul").html("bottom",li);


**problem**

    
    x$("#somediv").html("Talk the talk");


**solution**

    
    x$("#someul")[0].innerText = "Talk the talk";






Also see the [phonegap mailinglist](http://comments.gmane.org/gmane.comp.handhelds.phonegap/4301)

