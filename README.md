# ![Logo](./src/assets/logo_white_48.png) Pathfinder

[![build](https://github.com/Reterics/pathfinder/actions/workflows/npm-build-test.yml/badge.svg)](https://github.com/Reterics/pathfinder/actions/workflows/npm-build-test.yml)


Chrome Extension to assist for development and day to day tasks.
It is based on Vite, React, TailwindCSS, and TypeScript.


## Getting started

For installing and building both Chrome and Firefox browsers, you can use the following:
```bash
npm install
npm run build
```

### Chrome
 - Open [chrome://extensions/](chrome://extensions/) page
 - Enable **Developer mode** by toggling the switch in the top right corner of the page.
 - Import the extension with **Load unpacked** button


### Firefox
 - Open [about:debugging#/runtime/this-firefox](about:debugging#/runtime/this-firefox)
 - import the **firefox** folder via the **Load Temporary Add-on...** button.
   ![FrontPage](./docs/firefox.png)


## User Interface

### Quick Access Toolbar - Home Page

![QuickAccessToolbar](./docs/qat.png)

If we have defined scripts on the home page, then we can "quick execute them" them there by clicking them. 

### Scripts

![Scripts Page](./docs/scripts.png)
We can declare and save pre-defined scripts that will run on the current open tab via **keyup** events or the **Quick Access Toolbar**


![Editor Page](./docs/editor.png)
Editing scripts is possible using the internal _limited_ Javascript editor that is available with the **Edit** button.


![Notes Page](./docs/notes.png)
We can add new notes while we are browsing with the contextmenu, and edit them later in the extension.

## Contribute

There are many ways to [contribute](./CONTRIBUTING.md) to Chromate Extension.
* [Submit bugs](https://github.com/Reterics/pathfinder/issues) and help us verify fixes as they are checked in.
* Review the [source code changes](https://github.com/Reterics/pathfinder/pulls).
* [Contribute bug fixes](https://github.com/Reterics/pathfinder/blob/main/CONTRIBUTING.md).

