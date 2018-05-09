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
yarn
yarn link
cd ..

cd stage
git checkout dev
yarn
yarn link
yarn link @awayjs/core
cd ..

cd renderer
git checkout dev
yarn
yarn link
yarn link @awayjs/core
yarn link @awayjs/stage
cd ..

cd graphics
git checkout dev
yarn
yarn link
yarn link @awayjs/core
yarn link @awayjs/stage
yarn link @awayjs/renderer
cd ..

cd materials
git checkout dev
yarn
yarn link
yarn link @awayjs/core
yarn link @awayjs/stage
yarn link @awayjs/renderer
cd ..

cd scene
git checkout dev
yarn
yarn link
yarn link @awayjs/core
yarn link @awayjs/stage
yarn link @awayjs/renderer
yarn link @awayjs/graphics
yarn link @awayjs/materials
cd ..

cd view
git checkout dev
yarn
yarn link
yarn link @awayjs/core
yarn link @awayjs/stage
yarn link @awayjs/renderer
yarn link @awayjs/graphics
yarn link @awayjs/scene
cd ..

cd parsers
git checkout dev
yarn
yarn link
yarn link @awayjs/core
yarn link @awayjs/stage
yarn link @awayjs/renderer
yarn link @awayjs/graphics
yarn link @awayjs/materials
yarn link @awayjs/scene
cd ..

cd player
git checkout dev
yarn
yarn link
yarn link @awayjs/core
yarn link @awayjs/stage
yarn link @awayjs/renderer
yarn link @awayjs/scene
yarn link @awayjs/parsers
cd ..

cd ..
cd awayjs-full
yarn
yarn link
yarn link @awayjs/core
yarn link @awayjs/stage
yarn link @awayjs/renderer
yarn link @awayjs/graphics
yarn link @awayjs/materials
yarn link @awayjs/scene
yarn link @awayjs/view
yarn link @awayjs/parsers
yarn link @awayjs/player