# COYA_Helper

# Project Overview

## Description

​		The goal of this project is to create a stand alone engine for experiencing old Choose Your Own Adventure style books as though they are a text adventure game played on an older terminal style computer but with modern conveniences. If you're wondering why I'm doing this, I just thought it would be cool. And I'm right.

To get started just download the latest release and boot it up. If you're unsure where to start run 'help' or run 'ls -book' to see they currently available adventures.

## Current Features

- Book loading and parsing
- Terminal interaction
- Book-specific Custom Style packs
- A Collapsible Notes Section
- A fully playable adventure

## Planned features

- Tab-completion in the terminal interface
- A way to save/load the current notes
- A way to save/load the current terminal output
- A write-up on how to build custom books
- A better experience for creating new books
  - There may be an external tool for this, it is just a JSON file after all

# How to Build a local version

I would recommend using the most recent stable release [(found here)](https://github.com/EzraSkwarka/COYA_Helper/releases/), otherwise follow the steps below

## Pre-Requisites

- [Git bash](https://git-scm.com/download/win)
- [NodeJS 14.x or higher](https://github.com/nodejs/Release)
- [Electron](https://www.electronjs.org/)

## Steps

​		Once you have those just open a git window in the download directory and run the command 'npm run start'. This Will open a new chromium window with the game ready to play. For the most up-to-date version check-out the dev branch; for a more stable experience download the main branch; for the most stable experience download the most recently published release.

# Contributing
This is an open source project for a reason. The more eyes the better! :)

## Creating Issues
If you find an issue or have an idea for a new feature, please let me know! Just head over to the Issues tab and write one up. I only ask you to be kind and follow a few guidelines: 
- If its a bug report please start your issue title with 'Bug: ' and include both steps to reproduce the issue and a description of what you expected to happen.
- If its a feature request start your issue title with 'FR: ' and provide as much detail as you can.

## Formatting Books
[A guide to formatting books can be found here](src/Assets/GuideToBuildingBooks.md). Note, this guide is still a WIP, but covers the basics needed to make a new book.