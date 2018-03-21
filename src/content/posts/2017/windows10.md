---
title: Moving from OSX to Windows 10 with WSL
date: 2017-04-29
slug: From OSX to Windows 10 with WSL
layout: post.swig
---

My Macbook Pro 13" has a [screen coating issue](http://www.macworld.com/article/2994479/macbook/report-apple-will-replace-retina-macbook-pro-screens-with-bad-coating.html) and I have to get it replaced at a service center. I need a laptop for work. So I took this as an opportunity to check out alternatives for my Mac.

I have been a Mac user for the past ~10 years. I love the Mac for development. But with the latest
disappointing Macbook updates I started to look around.

Windows 10 has improved tremendously (I have worked with Windows 10 at clients). Last year Microsoft introduced the [Windows Subsystem for Linux (WSL)](https://insights.ubuntu.com/2016/03/30/ubuntu-on-windows-the-ubuntu-userspace-for-windows-developers/). Bash on Windows runs Ubuntu user-mode binaries provided by Canonical. This means the command-line utilities are the same as those that run within a native Ubuntu environment.

The Windows 10 Creators Update seems to [resolve a lot of issues](https://blogs.msdn.microsoft.com/commandline/2017/04/11/windows-10-creators-update-whats-new-in-bashwsl-windows-console/
) I might have as a developer. So I think the time is ripe to give it a try!

Currently I mainly do front-end development and use nodejs. On my Mac I already switched from Webstorm to Vscode. I also do some PHP development which shouldn't be an issue with all available Ubuntu packages.

So yesterday I ordered the [Asus Zenbook BX410UA](https://www.asus.com/Notebooks/ASUS-ZenBook-UX410UA/), received it today and currently setting it up as my main development machine for next week. Lets see if it works out! Below is my installation log for future references.

## Setup

### Update Windows 10

Update Windows 10 with all the latest update. And make sure you get the Window 10 Creators Update (version 1703). I needed to download the [Update Assistant](https://www.microsoft.com/en-us/software-download/windows10) to get it installed.

### Turn on Developer mode

- Go to ***Settings -> Update and Security -> For Developers***
- Select the ***Developer mode*** radio button.

### Enable Windows Subsystem for Linux

- From start search for ***turn windows features on or off***
- Select ***Windows Subsystem for Linux (beta)***
- Restart your computer when prompted

### Run bash on Windows

- From start search for ***bash***
- Follow the instructions on screen

It's working! We have a linux shell on windows!

Now setup my DEV enviroment.

### Vscode + Bash

- Go to ***File -> Preferences -> Settings***
- Add the following to user settings:

```
{
    "terminal.integrated.shell.windows": "C:\\Windows\\sysnative\\bash.exe"
}
```

### NodeJS

Install [NodeJS](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions) :

```
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install -y nodejs
```

And install build tools:

```
sudo apt-get install -y build-essential
```

### Yarn

Install [Yarn](https://yarnpkg.com/lang/en/docs/install/#linux-tab):

```
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
```

### Git

Install git

```
sudo apt-get install git
```

Also installed this great [bash git prompt](https://github.com/magicmonty/bash-git-prompt).
