---
date: 2014-04-23 11:14:12+00:00
layout: post.html
title: App factory using Ionic, AngularJS and Cordova
slug: app-factory-ionic-angular-cordova
categories:
- Nerd stuff
---

Last 2 months i've been helping [XACT](http://www.xacte.com) building a new App factory to expand their services. XACT is a messaging platform designed as a service, Xact Raceday Alerts sends progress alerts to athletes and their friends/family during participatory sporting events.

Events using XACT's software are now able to build and manage their own iOS/Android App. The main focus of these Apps is live tracking athletes on timed events. In addition we have created a broad scala of so called "widgets" the event organizers can add to the App. A few examples of widgets include: Tracking, Leaderboard, News, Schedule, FAQ, Pages, Facebook, Twitter, Instagram, Flickr, Menu (Folders)

Events can arrange, add and remove widgets from the management portal without sending a new app to the Appstore. Installed app's will dynamic sync these changes.

### Technology

The cool thing is that all Apps are build from the same codebase. Each event can override the default app look and feel with their own styling. The event organisers themselves can manage and test the app via the management portal. The App is build on HTML5 technology using [Ionic Framework](http://www.ionicframework.com), [AngularJS](https://angularjs.org/) and also works in a normal browser. To get the app promoted in the Android and iOS App stores we build a native version using [Cordova](http://cordova.apache.org).

To streamline the development and build process we use [Gulp.js](http://www.gulpjs.com) 'The streaming build system'. This helped us to quickly switch to different event apps in development mode and build a different Cordova projects for each event app and make a App-store-ready release.


### Screenshots

Screenshots (from my browser) of the Indianapolis Mini-Marathon App.

[gallery columns="4" link="file" ids="525,524,523,522"]


### AppStore links

Some links to App's build with the "App Factory".
	
* [500 Festival Mini Marathon](https://play.google.com/store/apps/details?id=com.xacte.eventapp.indymini) (Android)
* [500 Festival Mini-Marathon](https://itunes.apple.com/nl/app/oneamerica-500-festival-mini/id860841885?mt=8) (iOS)
* [Marine Corp Historic Half](https://play.google.com/store/apps/details?id=com.xacte.eventapp.mchh) (Android)
* [Broad Street Run](https://play.google.com/store/apps/details?id=com.xacte.eventapp.bsr) (Android)
