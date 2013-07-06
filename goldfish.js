jam.includeModule("RectCollision");
jam.includeModule("Animation");
jam.includeModule("LevelMap");
jam.includeModule("Debug");

jam.include("data/map.js");

window.onload = function(){
  // Start loading images immediately instead of when they're needed
  jam.preload("data/player.png");

  var initialize = function(){
    var game = jam.Game(640, 480, document.body);

    jam.Debug.showBoundingBoxes = true;		// Uncomment to see the collision regions

  var bg = jam.Sprite(0, 0);
    bg.width = 640; bg.height = 480;
    bg.image = document.createElement("canvas");
    bg.image.width = 640;
    bg.image.height = 480;
    erase = false;
    var ctx = bg.image.getContext("2d");

    var map = jam.LevelMap.loadTileMap(32, map1, "data/tiles.png");
    var player = makePlayer(game, map);
    test = makeObj(test_obj);

    bg.color = "rgba(0,128,255,0.75)";

    bg.update = jam.extend(bg.update, function(elapsed){
	  for(var i = 0; i < 7; i++)
	  {
	    ctx.beginPath();
	    if(erase){
		  ctx.arc(player.smoothX + Math.random() * 20 - 10, player.smoothY + Math.random() * 20 - 10, Math.random() * 3 + 2, 0, 2 * Math.PI, false);
		  ctx.fillStyle = "rgba(255,255,255, 0.75)";
	    }
	    else{
		  ctx.arc(player.smoothX + Math.random() * 16 - 8, player.smoothY + Math.random() * 16 - 8, Math.random() * 3 + 1, 0, 2 * Math.PI, false);
		  ctx.fillStyle = bg.color;
	    }
        //			ctx.fill();
	  }
	  ctx.beginPath();
	  ctx.arc(player.smoothX, player.smoothY, 4, 0, 2 * Math.PI, false);
	  ctx.fillStyle = erase ? "rgba(255,255,255, 0.75)" : bg.color;
      // 		ctx.fill();

	  if(jam.Input.justPressed("B")){
	    erase = false;
	  }
	  if(jam.Input.justPressed("E")){
	    erase = true;
	  }
	  if(jam.Input.justPressed("1")){
	    bg.color = "rgba(0,128,255,0.75)";
	  }
	  if(jam.Input.justPressed("2")){
	    bg.color = "rgba(255,0,64,0.75)";
	  }
	  if(jam.Input.justPressed("3")){
	    bg.color = "rgba(0,0,0,0.75)";
	  }
    });

    game.add(map);
    game.add(player);
    game.add(bg);
    game.add(test);

    game.run();
  }


  var makePlayer = function(game, map){
    var rate = 20;
    var width = 16;
    var height = 17;
    var frames = 6;
    var img_width = width * frames;
    var img_height = height;
    var offsetx = width * (23-6);
    var player = jam.AnimatedSprite(20, 20);
    player.setImage("data/player_red.png", width, height);
    // Set up player's animations
    player.anim_idle = jam.Animation.Strip([5], width, height, 0, offsetx);
    player.anim_run = jam.Animation.Strip([0, 1,2,3,4], width, height, rate, offsetx);
    player.playAnimation(player.anim_idle);

    player.setCollisionOffsets(0, 0, 0, 0);
    player.setLayer(1);

    player.lastPositions = [];
    player.smoothX = player.x + player.width/2;
    player.smoothY = player.y + player.height/2;

    player.update = jam.extend(player.update, function(elapsed){
	  // Collision
      var inter = undefined;
	  player.collide(map);
      for (o in objs) {
	    if (player.overlaps(objs[o])){
          inter = objs[o];
        }
      }

	  // Running / standing
	  player.velocity.x = 0;
	  player.velocity.y = 0;
	  if(jam.Input.buttonDown("LEFT")){
	    player.velocity.x = -90;
	    player.playAnimation(player.anim_run);
	    player.facing = jam.Sprite.LEFT;
	  }
	  else if(jam.Input.buttonDown("RIGHT")){
	    player.velocity.x = 90;
	    player.playAnimation(player.anim_run);
	    player.facing = jam.Sprite.RIGHT;
	  }
	  else if (jam.Input.buttonDown("UP")){
	    player.velocity.y = -50;
	    player.playAnimation(player.anim_run);
	  } else if (jam.Input.buttonDown("DOWN")){
	    player.velocity.y = 50;
	    player.playAnimation(player.anim_run);
      } else{
	    player.playAnimation(player.anim_idle);
      }

	  if (jam.Input.justPressed("X")) {
        if (inter != undefined) {
          inter.interact();
        }
      }

	  player.lastPositions.splice(0,0, jam.Vector(player.x + player.width / 2, player.y + player.height / 2));
	  for(var i = 0; i < Math.min(player.lastPositions.length, 10); ++i){
	    player.smoothX += player.lastPositions[i].x;
	    player.smoothY += player.lastPositions[i].y;
	  }
	  player.smoothX /= i+1;
	  player.smoothY /= i+1;
    });
    return player;
  }

  var test_obj = {
    x : 60,
    y : 60,
    width : 16,
    height : 17,
    label : "test",
    img : "data/player_red.png",
    interact : "Hi puppy."
  };

  var objs = [];

  var makeObj = function(data){
    var collide_overflow = 8;
    var obj = jam.AnimatedSprite(data.x, data.y);
    obj.setImage(data.img, data.width, data.height);
    obj.setCollisionOffsets(-collide_overflow, -collide_overflow, data.width + (collide_overflow * 2), data.height + (collide_overflow * 2));
    obj.interact = function() {
      var txt = jam.Text(40, 40);
      game.add(txt);
      txt.font = "40pt calibri";
      txt.color = "red";
      txt.text = data.interact
      console.log(data.interact);
    };
    objs.push(obj);
    return obj;
  };


  // Show a loading bar until all the preloading is done, at which point
  // call initialize()
  jam.showPreloader(document.body, initialize);
}
