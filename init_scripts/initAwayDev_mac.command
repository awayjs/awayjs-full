cd `dirname $0`
cd ..
cd ..
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
npm install
npm link
cd ..

cd stage
git checkout dev
npm install
npm link
npm link ../core
cd ..

cd renderer
git checkout dev
npm install
npm link
npm link ../core
npm link ../stage
cd ..

cd graphics
git checkout dev
npm install
npm link
npm link ../core
npm link ../stage
npm link ../renderer
cd ..

cd materials
git checkout dev
npm install
npm link
npm link ../core
npm link ../stage
npm link ../renderer
cd ..

cd scene
git checkout dev
npm install
npm link
npm link ../core
npm link ../stage
npm link ../renderer
npm link ../graphics
npm link ../materials
cd ..

cd view
git checkout dev
npm install
npm link
npm link ../core
npm link ../stage
npm link ../renderer
npm link ../graphics
npm link ../scene
cd ..

cd parsers
git checkout dev
npm install
npm link
npm link ../core
npm link ../stage
npm link ../renderer
npm link ../graphics
npm link ../materials
npm link ../scene
cd ..

cd player
git checkout dev
npm install
npm link
npm link ../core
npm link ../stage
npm link ../renderer
npm link ../scene
npm link ../parsers
cd ..

cd ..
cd awayjs-full
npm install
npm link
npm link ../@awayjs/core
npm link ../@awayjs/stage
npm link ../@awayjs/renderer
npm link ../@awayjs/graphics
npm link ../@awayjs/materials
npm link ../@awayjs/scene
npm link ../@awayjs/view
npm link ../@awayjs/parsers
npm link ../@awayjs/player