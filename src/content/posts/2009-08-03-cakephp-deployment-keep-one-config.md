---
author: admin
comments: true
date: 2009-08-03 21:01:09+00:00
layout: post.html
slug: cakephp-deployment-keep-one-config
title: 'CakePHP deployment: keep one config'
wordpress_id: 122
categories:
- Nerd stuff
tags:
- cakephp
- php
---

For a new project I started using the CakePHP framework. I work on this project on different servers. My laptop and desktop act as development servers and of course a production server. To manage my code I use subversion. Because I also like to check-in all my config files it would be nice to keep them the same in each environment.

To accomplish this I use a environment variable in my httpd.conf. This variable describes which config to use (development/test/production/etc). For now i have only used it on my database config but it would be easy to use for other config parameters.

other/domain.com.conf virtualhost section or httpd.conf
(I like to keep all my domains in separate configs)


<blockquote><VirtualHost *:80>

....

SetEnv APPLICATION_ENV development
</VirtualHost></blockquote>


SetEnv sets the APPLICATION_ENV envrionment variable to development for this virtual host. On your production environment you would set this to "production".

Next change your config/database.php to something like this:


<blockquote><?php
class DATABASE_CONFIG {

var $default = array(
'driver' => 'mysql',
'persistent' => false,
'host' => 'localhost',
'login' => 'DEFAULT_LOGIN',
'password' => 'DEFAULT_PASSWORD',
'database' => 'DEFAULT_DATABASE',
);

var $production = array(
'driver' => 'mysql',
'persistent' => false,
'host' => 'localhost',
'login' => 'PRODUCTION_LOGIN',
'password' => 'PRODUCTION_PASSWORD',
'database' => 'PRODUCTION_DATABASE',
);

var $development = array(
'driver' => 'mysql',
'persistent' => false,
'host' => 'localhost',
'login' => 'DEVELOPMENT_LOGIN',
'password' => 'DEVELOPMENT_PASSWORD',
'database' => 'DEVELOPMENT_DATABASE',
);

function __construct() {
$env = getenv("APPLICATION_ENV");
if( ($env) && isset($this->{$env})) {
$this->default = array_merge($this->default, $this->{$env});
}
}
}
?></blockquote>


Notice the __construct function. This function merges the default database parameters with the current environment parameters.

When I have some time I will also change the core.php config to work like this so you can for example enable debugging on your development environment and disable it on production.
