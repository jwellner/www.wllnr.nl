---
author: admin
comments: true
date: 2013-04-17 16:19:49+00:00
layout: post.swig
slug: nest-hacking-europe-synology
title: Nest Hack with Synology NAS
wordpress_id: 450
categories:
- Nerd stuff
tags:
- hacking
- nest
- synology
- thermostat
---

The [Nest thermostat](http://www.nest.com) is still not fully usable in Europe because it requires a USA/Canada zipcode. After some Internet searching, I found this great blog from [Mot](http://motote.blogspot.nl/2012/09/nest-thermostat-in-europe-hacks-ii.html). He explains how you can manipulate the [www.wunderground.com](http://www.wunderground.com) weather info requests by routing the requests the Nest makes to your own server.

In this blog post I will explain how I got it working using my **Synology NAS**. It may be useful for other people living outside the USA/Canada who want to use the Nest thermostat and also happen to have a Synology NAS.

The first step is to enable your own DNS server. On my NAS I use Dnsmasq. Dnsmasq is a lightweight DNS server. I installed it using the package manager [ipkg](http://forum.synology.com/wiki/index.php/Overview_on_modifying_the_Synology_Server,_bootstrap,_ipkg_etc#Installing_compiled.2Fbinary_programs_using_ipkg).



    ipkg install dnsmasq



By default it will use your providers DSN servers in /etc/resolv.conf to forward DNS requests.

Start dnsmasq:


    /opt/etc/init.d/S56dnsmasq



Now create a new website with a custom config. This can be done by placing a host config in the directory /usr/syno/etc/sites-enabled-user.

I put mine in **/usr/syno/etc/sites-enabled-user/www.wunderground.com.conf** with the following content:



    LoadModule proxy_module modules/mod_proxy.so
    LoadModule proxy_http_module modules/mod_proxy_http.so
    ProxyRequests Off
    ProxyPreserveHost On
    ServerName www.wunderground.com
    DocumentRoot "/var/services/web/wunderground.com"
    ProxyPass /auto/nestlabs/geo/current/i !
    ProxyPass /sniff.php !
    ProxyPass / http://38.102.136.104/




For the virtualhost www.wunderground.com we proxy everything to the original IP address except for /auto/nestlabs/geo/current/i and /sniff.php. After that we rewrite the url auto/nestlabs/geo/current/i to our custom script sniff.php.

Now create the website folder **/var/services/web/wunderground.com** on your NAS (on my NAS it is linked to a share /web). In this folder we put a file sniff.php with the following content:




    $param = $_GET["query"];
    if ($param == "28806") {
            $jsonData = json_decode(file_get_contents('http://38.102.136.104/auto/nestlabs/geo/current/i?query=Utrecht'), true);
            $data = $jsonData["Utrecht"];
            $data["location"]["city"] = "Utrecht";
            $data["location"]["state"] = "Utrecht";
            $data["location"]["zip"] = "28806";
            $data["location"]["country"] = "US";
            $data["location"]["timezone"] = "EDT";
            $data["current"]["timezone"] = "EDT";
            $jsonData = array("28806"=>$data);
    } else {
            $jsonData = json_decode(file_get_contents('http://38.102.136.104/auto/nestlabs/geo/current/i?query=' . $param));
    }
    header('Content-Type: application/json');
    print stripslashes(json_encode($jsonData));




Utrecht is the city where I live. This should be replaced with your own city.

Also add the file .htaccess with the following content:



    RewriteEngine On
    RewriteRule ^auto/nestlabs/geo/current/i$ sniff.php [QSA]




Restart apache:


    /usr/syno/etc/rc.d/S97apache-user.sh restart



Now setup your local DHCP server to use your own DNS. This will be different for each person. I use a Netgear WIFI router and put a screenshot below so you get the idea.

[![](http://www.wllnr.nl/wp-content/uploads/2013/04/Screen-Shot-2013-04-17-at-18.11.31-300x68.png)](http://www.wllnr.nl/wp-content/uploads/2013/04/Screen-Shot-2013-04-17-at-18.11.31.png)
