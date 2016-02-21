---
author: admin
comments: true
date: 2013-12-04 10:34:03+00:00
layout: post.html
slug: nginx-node-js-unix-socket-and-socket-io
title: Nginx Node.js unix socket and socket.io
wordpress_id: 499
categories:
- Nerd stuff
---

A couple of months ago I started developing a realtime sales dashboard for our big office TV. This was a nice project to use Node.js for the first time. It's build with Express, Mysql and Socket.io for realtime streaming of data to clients. The client side is build with AngularJS and of course it needed to plays sounds using the Web Audio API (using Howler.js).

This article is a reminder to myself how I setup the production environment. The first thing you need to know is that Websocket proxying is supported in Nginx since version 1.3.13. The following configuration is needed to proxy websockets, inside your server block you need to put the following configuration:


    
    
    location / {
            proxy_pass http://upstream;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
    }
    



When you proxy Websockets you have to use HTTP 1.1 because it uses the Upgrade header that is only available in version 1.1. 

The upstream block is configured outside your server block. Here I have configured my unix socket.


    
    
    upstream upstream {
            server unix:/tmp/node_realtimedashboard.sock;
    }
    



My complete configuration can be found below.


    
    
    upstream realtimedashboard {
            server unix:/tmp/node_realtimedashboard.sock;
    }
    
    server {
            listen 80;
    
            server_name realtimedashboard.somedomain.com;
    
            access_log /var/log/nginx/realtimedashboard-access.log;
            error_log /var/log/nginx/realtimedashboard-error_log;
    
            location / {
                    proxy_pass http://realtimedashboard;
                    proxy_http_version 1.1;
                    proxy_set_header Upgrade $http_upgrade;
                    proxy_set_header Connection "upgrade";
                    proxy_set_header Host $host;
            }
    
    }
    





