TITLE Update AwayJS Dev Enviroment
ECHO Pull all updates into the "@awayjs" directory and run build
PAUSE
cd..
cd..
cd @awayjs

cd core
git pull
npm run build
cd..

cd stage
git pull
npm run build
cd..

cd renderer
git pull
npm run build
cd..

cd graphics
git pull
npm run build
cd..

cd materials
git pull
npm run build
cd..

cd scene
git pull
npm run build
cd..

cd view
git pull
npm run build
cd..

cd parsers
git pull
npm run build
cd..

cd player
git pull
npm run build
cd..

cd..
cd awayjs-full
git pull
npm run build

PAUSE
