awayjs-full
==========

GENERAL ENVIRONMENT SETUP
=========================

1) Install node version is 7.2.0
2) Install npm version is 4.0.3
3) Install webpack version 2.1.0-beta.27
4) Install typescript version 2.2.0-dev.20161130

USING AWAYJS-FULL IN YOUR PROJECT
==========================================================

This is all you need to do to use awayjs-full in your project.

Add the awayjs-full dependency: 
"npm install awayjs-full"

If you want to store this depdency, add it to your npm packages.json dependency array.

LINKING TO AWAYJS-FULL AS A DEVELOPMENT MODULE
==========================================================

This process allows you to not only use awayjs-full, but be able to modify it. It is a rather complex process since awayjs-full needs to link to all its modules, but the modules themselves need to be interliked.

Fortunately, you can use a script for this task. See: "awayjs-full/init_scripts/readme.md".

BUILD OPTION A)

After running the script, all the awayjs modules are properly interlinked, but you still need
to rebuild the main module awayjs-full after making changes to any of the engine's files. This can be done in multiple ways.

In each altered submodule you can run:
"npm run build" 
or if you want to setup a watcher:
"npm run watch"

You can then build your main project (or use a watcher). Note that there is no need to build your local awayjs-full manually.

BUILD OPTION B)

ALternatively, if you don't want to manually build or watch each submodule, you can setup a global
watcher. This is less tedious but its important to note that this could be marginally slower than option A.

In awayjs-full run:
"npm run modules:build" 
or if you want to setup a watcher:
"npm run modules:watch"

This basically builds or starts a watcher in each of the submodules.