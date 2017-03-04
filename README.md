# AwayJS

AwayJS is a graphics library for javascript written in typescript.

# Features

TODO

# Examples

* For running examples:
[http://awayjs.github.io/examples](http://awayjs.github.io/examples)
* For source code:
[https://github.com/awayjs/awayjs-examples](https://github.com/awayjs/awayjs-examples)

# Installation		
 		
## Flat Installation		
 		
AwayJS can be installed as a flattened package using 
[awayjs-full](https://github.com/awayjs/awayjs-full) or 
[awayjs-lite](https://github.com/awayjs/awayjs-lite) via npm.		

```typescript	
npm install --save @awayjs/awayjs-full		 
```

or
		
```typescript		
npm install --save @awayjs/awayjs-lite		
```
 		
## Modular Installation		
 		
AwayJS can be installed as a series of interdependant modules (see below) 
that can be configured, depending on the specific requirements of the application. 		
This configuration should provide the best experience for typed development 
using typescript.		
 		
First, clone [awayjs-full](https://github.com/awayjs/awayjs-full), then run 
the script [InitAwayDev_mac.command]() *TODO links neededs* or [InitAwayDev_win.bat]().		
The script will clone all the dependencies, and interlink them in the awayjs-full 
installation.		
 		
In your application, install awayjs-full via npm:		
 		
```typescript		
npm install --save @awayjs/awayjs-full		
```
 		
You can then link your awayjs-full package to your local configuration:		
 		
```typescript		
npm link path/to/your/@awayjs/folder		
```