---
author: admin
comments: true
date: 2006-10-30 10:47:30+00:00
layout: post.swig
slug: pc-aanzetten-op-afstand
title: PC aanzetten op afstand
wordpress_id: 15
categories:
- Nerd stuff
---

Omdat ikÂ vaak viaÂ remote desktop thuis op mijn PC wil werken , en dan wel eens vergeet om hem 's ochtends aan te zetten heb ik vorig weekend een beetje met WakeOnLan zitten prutsen...

Mijn server staat altijd aan en onder (ubuntu) linux bestaat er een handig tooltje "wakeonlan" (apt-get install wakeonlan) .

Onder apache heb ik een vhostÂ X.www.wllnr.nl aangemaakt, met daarop een php scriptje wat mijn PC aanzet :Â 

`

echo exec('/usr/bin/wakeonlan -i 192.168.254.255 -p 7 00:16:17:6F:FC:FD');

`

Â 
