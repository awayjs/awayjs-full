TITLE Init AwayJS Dev Enviroment
ECHO Clone and links all AwayJS-modules into a directory "@awayjs" next to the AwayJS-full directory
PAUSE
cd..
cd..
mkdir @awayjs
cd @awayjs
git clone ssh://git@github.com:awayjs/core.git
git clone ssh://git@github.com:awayjs/graphics.git
git clone ssh://git@github.com:awayjs/scene.git
git clone ssh://git@github.com:awayjs/stage.git
git clone ssh://git@github.com:awayjs/renderer.git
git clone ssh://git@github.com:awayjs/materials.git
git clone ssh://git@github.com:awayjs/view.git
git clone ssh://git@github.com:awayjs/player.git
git clone ssh://git@github.com:awayjs/parsers.git

cd core
git checkout dev
call npm install
call npm link
cd..

cd stage
git checkout dev
call npm install
call npm link
call npm link ../core
cd..

cd renderer
git checkout dev
call npm install
call npm link
call npm link ../core
call npm link ../stage
cd..

cd graphics
git checkout dev
call npm install
call npm link
call npm link ../core
call npm link ../stage
call npm link ../renderer
cd..

cd materials
git checkout dev
call npm install
call npm link
call npm link ../core
call npm link ../stage
call npm link ../renderer
cd..

cd scene
git checkout dev
call npm install
call npm link
call npm link ../core
call npm link ../stage
call npm link ../renderer
call npm link ../graphics
call npm link ../materials
cd..

cd view
git checkout dev
call npm install
call npm link
call npm link ../core
call npm link ../stage
call npm link ../renderer
call npm link ../graphics
call npm link ../scene
cd..

cd parsers
git checkout dev
call npm install
call npm link
call npm link ../core
call npm link ../stage
call npm link ../renderer
call npm link ../graphics
call npm link ../materials
call npm link ../scene
cd..

cd player
git checkout dev
call npm install
call npm link
call npm link ../core
call npm link ../stage
call npm link ../renderer
call npm link ../scene
call npm link ../parsers
cd..

cd..
cd awayjs-full
call npm install
call npm link
call npm link ../@awayjs/core
call npm link ../@awayjs/stage
call npm link ../@awayjs/renderer
call npm link ../@awayjs/graphics
call npm link ../@awayjs/materials
call npm link ../@awayjs/scene
call npm link ../@awayjs/view
call npm link ../@awayjs/parsers
call npm link ../@awayjs/player

PAUSE
