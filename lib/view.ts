export * from "@awayjs/view";

import {Loader, WaveAudioParser} from "@awayjs/core";

import {Image2DParser, ImageCubeParser, TextureAtlasParser} from "@awayjs/stage";

//enable parsers
Loader.enableParser(WaveAudioParser);
Loader.enableParser(Image2DParser);
Loader.enableParser(ImageCubeParser);
Loader.enableParser(TextureAtlasParser);