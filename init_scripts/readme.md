# Helper scripts to clone and link AwayJS modules for Dev

After cloning this repo, run "npm install".
Than run the correct script for your platform by doubleclicking the file.

Tested on win7 and OSX 10.11.6

The script will perform the following actions:

* creates a folder named "@away" next to the "awayjs-full" root folder.
* clones all awayjs-modules into the "@away" folder
* for every module, the modules repo is switch to "dev" branch
* for every module, the "npm install" is performed
* for every module "npm link" is performed, 
* links between modules as needed
* links all modules to awayjs-full
* performs "npm link" on awayjs-full

All thats left to do is to npm link "awayjs-full" to your project.
