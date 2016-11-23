TITLE Init AwayJS Dev Enviroment
ECHO Clone and links all AwayJS-modules into a directory "@away" next to the AwayJS-full directory
PAUSE
cd..
cd..
mkdir @away
cd @away
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
call npm install
call npm link
cd..

cd graphics
git checkout dev
call npm install
call npm link
call npm link ../core
cd..

cd scene
git checkout dev
call npm install
call npm link
call npm link ../core
call npm link ../graphics
cd..

cd stage
git checkout dev
call npm install
call npm link
call npm link ../core
call npm link ../graphics
call npm link ../scene
cd..

cd renderer
git checkout dev
call npm install
call npm link
call npm link ../core
call npm link ../graphics
call npm link ../scene
call npm link ../stage
cd..

cd materials
git checkout dev
call npm install
call npm link
call npm link ../core
call npm link ../graphics
call npm link ../renderer
call npm link ../scene
call npm link ../stage
cd..

cd view
git checkout dev
call npm install
call npm link
call npm link ../core
call npm link ../graphics
call npm link ../renderer
call npm link ../scene
call npm link ../stage
cd..

cd player
git checkout dev
call npm install
call npm link
call npm link ../core
call npm link ../renderer
call npm link ../scene
call npm link ../stage
cd..

cd parsers
git checkout dev
call npm install
call npm link
call npm link ../core
call npm link ../graphics
call npm link ../materials
call npm link ../player
call npm link ../renderer
call npm link ../scene
call npm link ../stage
cd..

cd..
cd awayjs-full
call npm install
call npm link ../@away/core
call npm link ../@away/graphics
call npm link ../@away/scene
call npm link ../@away/stage
call npm link ../@away/renderer
call npm link ../@away/materials
call npm link ../@away/view
call npm link ../@away/player
call npm link ../@away/parsers
call npm link

PAUSE
