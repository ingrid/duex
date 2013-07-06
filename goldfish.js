require.config({
    baseUrl:"./jam/",
});

require(["jam", "./lib/sylvester", "../level", "../proto"], function(jam, syl, level, proto) {
  jam.config({dataDir:"data/"});

  var tm = new jam.TileMap(32, "tiles.png");
  tm.x = 20;
  tm.y = 10;
  tm.loadCSV(level);

  var main = function() {
    var g = new jam.Game(320, 240, document.body, 1);
//    var p = new jam.Sprite(60, 40);
    var p = proto.sprite(60, 40);
    var scene = g.root.scene;
    //p.setImage("player_red.png", 16, 17);

    scene.add(p);
    scene.add(tm);

    g.run();
  };

  var preload = function() {
    jam.showPreloader(main);
  };

  preload();

});
