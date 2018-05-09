TITLE Init AwayJS Dev Enviroment
ECHO Clone and links all AwayJS-modules into a directory "@awayjs" next to the AwayJS-full directory
PAUSE
cd..
cd..
mkdir @awayjs
cd @awayjs
git clone https://github.com/awayjs/core.git
git clone https://github.com/awayjs/graphics.git
git clone https://github.com/awayjs/scene.git
git clone https://github.com/awayjs/stage.git
git clone https://github.com/awayjs/renderer.git
git clone https://github.com/awayjs/materials.git
git clone https://github.com/awayjs/view.git
git clone https://github.com/awayjs/player.git
git clone https://github.com/awayjs/parsers.git

cd core
git checkout dev
call yarn
call yarn link
cd..

cd stage
git checkout dev
call yarn
call yarn link
call yarn link @awayjs/core
cd..

cd renderer
git checkout dev
call yarn
call yarn link
call yarn link @awayjs/core
call yarn link @awayjs/stage
cd..

cd graphics
git checkout dev
call yarn
call yarn link
call yarn link @awayjs/core
call yarn link @awayjs/stage
call yarn link @awayjs/renderer
cd..

cd materials
git checkout dev
call yarn
call yarn link
call yarn link @awayjs/core
call yarn link @awayjs/stage
call yarn link @awayjs/renderer
cd..

cd scene
git checkout dev
call yarn
call yarn link
call yarn link @awayjs/core
call yarn link @awayjs/stage
call yarn link @awayjs/renderer
call yarn link @awayjs/graphics
call yarn link @awayjs/materials
cd..

cd view
git checkout dev
call yarn
call yarn link
call yarn link @awayjs/core
call yarn link @awayjs/stage
call yarn link @awayjs/renderer
call yarn link @awayjs/graphics
call yarn link @awayjs/scene
cd..

cd parsers
git checkout dev
call yarn
call yarn link
call yarn link @awayjs/core
call yarn link @awayjs/stage
call yarn link @awayjs/renderer
call yarn link @awayjs/graphics
call yarn link @awayjs/materials
call yarn link @awayjs/scene
cd..

cd player
git checkout dev
call yarn
call yarn link
call yarn link @awayjs/core
call yarn link @awayjs/stage
call yarn link @awayjs/renderer
call yarn link @awayjs/scene
call yarn link @awayjs/parsers
cd..

cd..
cd awayjs-full
call yarn
call yarn link
call yarn link @awayjs/core
call yarn link @awayjs/stage
call yarn link @awayjs/renderer
call yarn link @awayjs/graphics
call yarn link @awayjs/materials
call yarn link @awayjs/scene
call yarn link @awayjs/view
call yarn link @awayjs/parsers
call yarn link @awayjs/player

PAUSE
