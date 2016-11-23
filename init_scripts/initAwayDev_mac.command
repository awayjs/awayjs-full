cd `dirname $0`
cd ..
cd ..
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
npm install
npm link
cd ..

cd graphics
git checkout dev
npm install
npm link
npm link ../core
cd ..

cd scene
git checkout dev
npm install
npm link
npm link ../core
npm link ../graphics
cd ..

cd stage
git checkout dev
npm install
npm link
npm link ../core
npm link ../graphics
npm link ../scene
cd ..

cd renderer
git checkout dev
npm install
npm link
npm link ../core
npm link ../graphics
npm link ../scene
npm link ../stage
cd ..

cd materials
git checkout dev
npm install
npm link
npm link ../core
npm link ../graphics
npm link ../renderer
npm link ../scene
npm link ../stage
cd ..


cd view
git checkout dev
npm install
npm link
npm link ../core
npm link ../graphics
npm link ../renderer
npm link ../scene
npm link ../stage
cd ..

cd player
git checkout dev
npm install
npm link
npm link ../core
npm link ../renderer
npm link ../scene
npm link ../stage
cd ..


cd parsers
git checkout dev
npm install
npm link
npm link ../core
npm link ../graphics
npm link ../materials
npm link ../player
npm link ../renderer
npm link ../scene
npm link ../stage
cd ..

cd ..
cd awayjs-full
npm install
npm link ../@away/core
npm link ../@away/graphics
npm link ../@away/scene
npm link ../@away/stage
npm link ../@away/renderer
npm link ../@away/materials
npm link ../@away/view
npm link ../@away/player
npm link ../@away/parsers
npm link
