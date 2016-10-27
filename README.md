awayjs-all
==========

OPTIONAL - LINKING TO AWAYJS AS A DEVELOPMENT MODULE
====================================================

NOTE: This is not a simple process, but it allows you to modify the awayjs library your project links to. The instructions below describe how making changes to your local awayjs copy affects 
the project it is linked to, and how those changes can be published for the rest of the awayjs community to use. You can of course just use awayjs as a regular dependency and ignore all this.
If you do chose to do this, this setup should work for all of your awayjs projects. Once you point your project to this folder, the ability to alter the awayjs library will be inherent to all your awayjs projects.

1) Create a folder to hold your awayjs libraries and name it "@awayjs".

2) Checkout the main awayjs repo in this folder: "git clone git@github.com:awayjs/awayjs-full.git".

3) Install the node dependencies of awayjs-full: In "@awayjs/awayjs-full", run "npm install".

4) Link awayjs to the your project: In the main project folder, run "npm link path-to-awayjs-full-repo".

5) Compile the sources to js: In the awayjs-full folder, run "npm run build" or "npm run watch" to setup a watcher.

By now, your project is using your specified awayjs-full version as a dependency, but it itself needs to be linked to its awayjs submodules.

6) In your main project (not in your own @awayjs/awayjs-full), delete all under @awayjs folder.

7) In Finder, inside your @awayjs folder, git clone the rest of the awayjs repositories, i.e. core, display, materials, parsers, player, renderer, stage, view.

8) Switch to the dev branch on each of these repositories.

9) In your awayjs-full folder, run "npm link path-to-module" for each of awayjs' sub modules. For example: npm link ../core, npm link ../display, etc.

Now your awayjs-full project folder properly points to the actual awayjs submodules, but they themselves doint point to each other locally. A bit of interlinking is 
to be done amongst the submodules themselves now.

10) On each of the awayjs module folders (i.e. core, display, etc), inside the node_modules folder, you should be able to see to what other awayjs submodules the module depends on.
npm link to each of these, on all of the modules. This might take a while!

11) You should be all setup locally now. Try altering part of the awayjs library code and running your project. If the awayjs watcher and your project's watcher are active, 
you should see the changes refresh in your browser in a matter of seconds.

12) Any changes that you make to an awayjs module should be published to git via a pull request. If you are merging a request, you can use "npm push" to automatically up the semver numbers.

***IMPORTANT*** 
The watcher from item 5) is less strict than tsc compile, so before pushing any changes (or making a pull request), make sure to run "tsc compile" so that you catch any errors before pushing

13) At some point in the awayjs collaborative development, your pushed changes may be merged into the official awayjs-full module.

TROUBLESHOOTING:
- If you are not able to "npm version", you might need to register a user in npm, then "npm adduser you-user-name". Ask an admin of the awayjs lib
to grant you permission for semver publishing.