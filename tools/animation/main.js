require.config({
    baseUrl:"../../jam/",
});

require(["jam", "./lib/sylvester"], function(jam, syl) {
  jam.config({dataDir:"data/"});

  var FILE_NAME = "player_red.png";
  var IMAGE_WIDTH = 6*16;
  var IMAGE_HEIGHT = 17;
  var FRAME_WIDTH = 16;
  var FRAME_HEIGHT = 17;
  var NUM_FRAMES = 1;
  var FRAME_RATE = 0.5;


  var main = function() {
    var g = new jam.Game(320, 240, document.body, 1);
    var p = new jam.Sprite(60, 40);
    var scene = g.root.scene;
    p.setImage(FILE_NAME, IMAGE_WIDTH, IMAGE_HEIGHT);
    console.log(p.width);
    scene.add(p);
    console.log(p.width);
    p.test_anim = jam.Sprite.Animation(NUM_FRAMES, FRAME_RATE, FRAME_WIDTH, FRAME_HEIGHT);
    console.log(p.width);
    //    p.playAnimation(p.test_anim);
    p.animation = p.test_anim;
    console.log(p.test_anim);
    //    console.log(p.test_anim.getFrameData());
    console.log(p.width);
    g.run();
  };

  var preload = function() {
    jam.showPreloader(main);
  };

  preload();

});
