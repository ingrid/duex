jam.includeModule("RectCollision");
jam.includeModule("Animation");
jam.includeModule("LevelMap");
jam.includeModule("Debug");

jam.include("data/map.js");

window.onload = function(){
  // Start loading images immediately instead of when they're needed
  jam.preload("data/player.png");
  jam.preload('data/mtlayer1.wav');
  jam.preload('data/mtlayer2.wav');
  jam.preload('data/mtlayer3.wav');
  jam.preload('data/mtlayer4.wav');

  var lost_game = function(){
    /**/
    game.paused=true;
    var lost = jam.Game(640, 480, document.body, game._canvas);
    // Sceen count;
    lost.count = 0;
    lost.moving = false;
    p = jam.AnimatedSprite(320, 240);
    //p.x = 320;
    //p.x = 240;
    p.reading = false;
    p.stop_read = function(){
      p.reading = false;
      var r;
      for (r in txts){
        txts[r].visible = false;
        txts[r].text = "";
      }
      txt_bg.visible = false;
    };

    p.read = function(o, cb){
      if (p.reading === true){
        p.stop_read();
      } else {
        p.reading = true;
        txt_bg.x = 0;
        txt_bg.y = 280;
        var e;
        var w = txt_bg.x;
        for (e in o){
          txts[e].x = w + 20
          txts[e].y = txt_bg.y + 40
          txts[e].visible = true;
          console.log(o[e]);
          txts[e].text = o[e];
          w = txts[e].x;
        }
        txt_bg.visible = true;
        p.inter_cb = cb;
      }
    };

    var stop_sign = new jam.AnimatedSprite(300, 300);
    stop_sign.visible = false;
    stop_sign.setImage('data/stop.png');
    stop_sign.interact = function(){
      var cb = function() {
        p.stop_read();
        lost.paused=true;
        game.paused=false;
      };
      p.read(["STOP"], cb);
    };
    stop
    var width = 20;
    var height = 30;
    var rate = 6;
    lost.dist_moved = 0;
    lost.screens = 0;
    var coords = [
      [0, 0, 92, 85],
      [97, 0, 56, 38],
      [519, 1, 121, 78],
      [0, 374, 71, 105],
      [567, 421, 72, 59]
    ];
    var map_os = [];
    var make_map = function(){
      for (i in coords){
        c = coords[i];
        var s = new jam.Sprite(c[0], c[1]);
        s.width = c[2];
        s.height = c[3];
        s.immovable = true;
        i.image = undefined;
        map_os.push(s);
        lost.add(s);
      }
    };
    make_map();
    lost.move = function(dir){
      lost.screens++;
      lost.moving = true;
      var s = 600;
      lost.s = s;
      lost.dist = 0;
      lost.dist_moved = 0;
      lost.speed = {};
      lost.speed.x = 0;
      lost.speed.y = 0;
      lost.dir = dir;
      //console.log(lost.s = s);
      //console.log(lost.dist = 0);
      //console.log(lost.speed = {});
      //console.log(lost.speed.x = 0);
      //console.log(lost.speed.y = 0);
      //console.log(lost.dir = dir);

      if (dir === 'u'){
        lost.dist = 480;
        lost.speed.x = 0;
        lost.speed.y = -s;
        lost.last = bg1.y;
        bg2.x = 0;
        bg2.y = (480);
        if (lost.screens === 5) {
          stop_sign.x = (0 + 176);
          stop_sign.y = (480 + 92);
          stop_sign.visible = true;
        }
      } else if (dir === 'd') {
        lost.dist = 480;
        lost.speed.x = 0;
        lost.speed.y = s;
        lost.last = bg1.y;
        bg2.x = 0;
        bg2.y = -480;
        if (lost.screens === 5) {
          stop_sign.x = (0 + 176);
          stop_sign.y = (-480 + 92);
          stop_sign.visible = true;
        }
      } else if (dir === 'l') {
        lost.dist = 640;
        lost.speed.x = -s;
        lost.speed.y = 0;
        lost.last = bg1.x;
        bg2.x = (640);
        bg2.y = 0;
        if (lost.screens === 5) {
          stop_sign.x = (640 + 176);
          stop_sign.y = (0 + 92);
          stop_sign.visible = true;
        }
      } else if (dir === 'r') {
        lost.dist = 640;
        lost.speed.x = s;
        lost.speed.y = 0;
        lost.last = bg1.x;
        bg2.x = -640;
        bg2.y = 0;
        if (lost.screens === 5) {
          stop_sign.x = (-640 + 176);
          stop_sign.y = (0 + 92);
          stop_sign.visible = true;
        }
      } else {
        console.log("No dir defined. Panic.");
      }
      var i;
      for (i in moving_objects){
        moving_objects[i].velocity = lost.speed;
      }
      p.velocity = lost.speed;
    };
    p.speed = 200;
    p.setImage("data/shadow.png", width, height);
    p.anim_idle = jam.Animation.Strip([0], width, height, 0);
    p.anim_run = jam.Animation.Strip([4,3,4,5], width, height, rate);
    p.anim_up = jam.Animation.Strip([1,0,1,2], width, height, rate);
    p.anim_down = jam.Animation.Strip([7,6,7,8], width, height, rate);
    p.playAnimation(p.anim_idle);
    p.update = jam.extend(p.update, function(elapsed){
      for (o in map_os) {
	    if (p.collide(map_os[o])){
        }
      }
      if ((lost.moving === false) && (p.reading == false)){
        p.velocity.x = 0;
        p.velocity.y = 0;

	    if(jam.Input.buttonDown("LEFT")){
	      p.velocity.x = -p.speed;
	      p.playAnimation(p.anim_run);
	      p.facing = jam.Sprite.LEFT;
	    }
	    else if(jam.Input.buttonDown("RIGHT")){
	      p.velocity.x = p.speed
          p.playAnimation(p.anim_run);
	      p.facing = jam.Sprite.RIGHT;
	    }
	    else if (jam.Input.buttonDown("UP")){
	      p.velocity.y = -p.speed;
	      p.playAnimation(p.anim_up);
	    } else if (jam.Input.buttonDown("DOWN")){
	      p.velocity.y = p.speed;
	      p.playAnimation(p.anim_down);
        } else if (jam.Input.justPressed("X")) {
          if (p.overlaps(stop_sign)) {
            stop_sign.interact();
          } else {
	        p.playAnimation(p.anim_idle);
          }
        } else{
	      p.playAnimation(p.anim_idle);
        }
        var buff = 5;
        if (p.x < (0 - buff)) {
          lost.move('r');
        } else if (p.x > (640 + buff)) {
          lost.move('l');
        } else if (p.y < (0 - buff)) {
          lost.move('d');
        } else if (p.y > (480 + buff)) {
          lost.move('u');
        }
      } else if (lost.moving == true) {
        p.playAnimation(p.anim_idle);
        if (lost.dist_moved >= (lost.dist - 45)) {
          var i;
          for (i in moving_objects){
            moving_objects[i].velocity = {x:0,y:0};
          }
          lost.moving = false;
          bg1.x = 0;
          bg1.y = 0;
          bg2.x = 0;
          bg2.y = 0;
        } else {
          if ((lost.dir === 'l') || (lost.dir === 'r')){
            lost.dist_moved = lost.dist_moved + Math.abs(lost.last - bg1.x);
            lost.last = bg1.x;
          } else {
            lost.dist_moved += Math.abs(lost.last - bg1.y);
            lost.last = bg1.y;
          }

        }
      } else if (p.reading == true) {
	    if (jam.Input.justPressed("X")) {
          p.inter_cb();
        }
      }
    });
    var bg1 = jam.Sprite(0, 0);
    bg1.setImage("data/lost.png", 640, 480);
    var bg2 = jam.Sprite(0, 0);
    bg2.setImage("data/lost2.png", 640, 480);
    var moving_objects = [bg1, bg2, p, stop_sign];
    //lost.add(txt);
    var u;
    for (u in txts){
      lost.add(txts[u]);
    }
    lost.add(txt_bg);
    lost.add(p)
    lost.add(stop_sign)
    lost.add(bg2);
    lost.add(bg1);
    lost.run();
    /**/
  };

  var collection_game = function(){
    game.paused=true;
    var coll = jam.Game(640, 480, document.body, game._canvas);
    var width = 10;
    var height = width;
    var color = 'black';
    var tmp_canvas = document.createElement("canvas");
    tmp_canvas.width = width;
    tmp_canvas.height = height;
    var tmp_context = tmp_canvas.getContext("2d");
    tmp_context.fillStyle = color;
    tmp_context.fillRect( 0, 0, width, height);

    game.update = jam.extend(game.update, function(elapsed){

    });

    var make_bug = function(x, y){
      var b = new jam.Sprite(x, y);
      b.width = 10;
      b.height = 10;
      b.image = tmp_canvas;
      b.goal = undefined;
      b.speed = 0.5;
      b.update = jam.extend(b.update, function(elapsed){
        if (b.goal === undefined) {
          b.goal = {};
          b.goal.x = Math.floor(Math.random()*640);
          while (Math.abs(b.goal.x - b.x) > 400) {
            b.goal.x = Math.floor(Math.random()*640);
          }
          b.goal.y = Math.floor(Math.random()*480);
          while (Math.abs(b.goal.y - b.y) > 400) {
            b.goal.y = Math.floor(Math.random()*480);
          }
          var vec = {};
          vec.x = b.x - b.goal.x;
          vec.y = b.y - b.goal.y;

          if(((Math.abs(b.x - b.goal.x) > 20 ) || (Math.abs(b.y - b.goal.y) > 20))){
            b.velocity.x = -vec.x * b.speed;
            b.velocity.y = -vec.y * b.speed;
          }
        } else {
          var dist = (((b.goal.x - b.x) * (b.goal.x - b.x))
                      +
                      ((b.goal.y - b.y) * (b.goal.y - b.y)));
          if (dist < 20) {
            b.goal = undefined;
          }

        }
      });
      coll.add(b);
    };
  var bugs = [];
  var i;
  for (i = 0; i < 40; i++) {
    var x = Math.floor(Math.random()*640);
    var y = Math.floor(Math.random()*480);
    var b = make_bug(x, y);
    bugs.push(b);
  }
  var t = make_bug(20, 20);

  coll.run();
  };

  var initialize = function(){
    game = jam.Game(640, 480, document.body);

    jam.Debug.showBoundingBoxes = true;		// Uncomment to see the collision regions

    var objs = [];

    var test_obj = {
      x : 60,
      y : 60,
      width : 16,
      height : 17,
      label : "test",
      img : "data/player_red.png",
      text : "Hi puppy.",
      interact : function() {
        var cb1 = function() {
          player.stop_read();
        }
        player.read(["Hi puppy.","foo", "bar", "biz", "baz", "???"], cb1);
      },
    };

    var coll_obj = {
      x : 120,
      y : 120,
      width : 16,
      height : 17,
      label : "test",
      img : "data/player_red.png",
      text : "Hi puppy.",
      interact : function() {
        game.paused = true;
        collection_game();
      },
    };

    var lost_obj = {
      x : 180,
      y : 180,
      width : 16,
      height : 17,
      label : "test",
      img : "data/player_red.png",
      text : "Hi puppy.",
      interact : function() {
        game.paused = true;
        lost_game();
      },
    };

    var makeObj = function(data){
      var collide_overflow = 8;
      var obj = jam.AnimatedSprite(data.x, data.y);
      obj.setImage(data.img, data.width, data.height);
      obj.setCollisionOffsets(-collide_overflow, -collide_overflow, (collide_overflow * 2) + obj.width, (collide_overflow * 2) + obj.height);
      obj.text = data.text;
      obj.interact = data.interact;
      objs.push(obj);
      return obj;
    };
    var map_os = [];
    var makeMap = function(){
      var coords = [
        [0, 0, 46, 997],
        [48, 1, 1950, 47],
        [452, 49, 95, 247],
        [450, 416, 98, 319],
        [49, 951, 1950, 53],
        [450, 822, 97, 126],
        [229, 85, 218, 123],
        [74, 391, 173, 55,],
        [89, 554, 123, 214],
        [289, 550, 108, 79],
        [554, 477, 108, 132],
        [881, 399, 56, 267],
        [1200, 147, 149, 280],
        [1452, 49, 95, 61],
        [1450, 201, 101, 382],
        [1449, 679, 99, 269],
        [1553, 250, 398, 94],
        [1952, 48, 44, 899],
        [1921, 71, 27, 66],
        [1903, 161, 45, 68],
        [1659, 453, 98, 202],
        [1878, 351, 71, 381],
        [1567, 861, 103, 83],
        [1781, 793, 109, 109]
      ];
      for (i in coords){
        c = coords[i];
        var s = new jam.Sprite(c[0], c[1]);
        s.width = c[2];
        s.height = c[3];
        s.immovable = true;
        i.image = undefined;
        map_os.push(s);
        game.add(s);
      }
    };

    var makePlayer = function(game, map){
      var rate = 5;
      var width = 50;
      var height = 50;
      var frames = 4;
      var img_width = width * frames;
      var img_height = height;
      //var offsetx = width * (23-6);
      var offsetx = 0;
      var player = jam.AnimatedSprite(80, 80);
      player.speed = 50;
      player.reading = false;
      player.setImage("data/bunny.png", width, height);
      // Set up player's animations
      player.anim_idle = jam.Animation.Strip([0], width, height, 0, offsetx);
      player.anim_run = jam.Animation.Strip([0,1,2,3], width, height, rate, offsetx);
      player.playAnimation(player.anim_idle);

      player.setCollisionOffsets(0, 0, 0, 0);
      player.setLayer(1);

      player.lastPositions = [];
      player.smoothX = player.x + player.width/2;
      player.smoothY = player.y + player.height/2;

      player.stop_read = function(){
          player.reading = false;
          txt.visible = false;
          txt.text = "";
          txt_bg.visible = false;
      };

      player.read = function(o, cb){
        if (player.reading === true){
          player.stop_read();
        } else {
          player.reading = true;
          txt_bg.x = player.x - 320;
          txt_bg.y = player.y + 40;
          var e;
          var w = txt_bg.y+ 15;
          for (e in o){
            txts[e].x = txt_bg.x + 20;
            txts[e].y = w + 25;
            txts[e].visible = true;
            txts[e].text = o[e];
            w = txts[e].y;
          }
          //txt.x = txt_bg.x + 20
          //txt.y = txt_bg.y + 40
          //txt.visible = true;
          //txt.text = o;
          txt_bg.visible = true;
          player.inter_cb = cb;
        }
      };

      player.update = jam.extend(player.update, function(elapsed){
	    // Collision
        var inter = undefined;
	    //player.collide(map);
        for (o in map_os) {
	      if (player.collide(map_os[o])){
          }
        }
        for (o in objs) {
	      if (player.overlaps(objs[o])){
            inter = objs[o];
          }
        }

	    // Running / standing
	    player.velocity.x = 0;
	    player.velocity.y = 0;
        if (player.reading == false){
	      if(jam.Input.buttonDown("LEFT")){
	        player.velocity.x = -player.speed;
	        player.playAnimation(player.anim_run);
	        player.facing = jam.Sprite.LEFT;
	      }
	      else if(jam.Input.buttonDown("RIGHT")){
	        player.velocity.x = player.speed
            player.playAnimation(player.anim_run);
	        player.facing = jam.Sprite.RIGHT;
	      }
	      else if (jam.Input.buttonDown("UP")){
	        player.velocity.y = -player.speed;
	        player.playAnimation(player.anim_run);
	      } else if (jam.Input.buttonDown("DOWN")){
	        player.velocity.y = player.speed;
	        player.playAnimation(player.anim_run);
          } else{
	        player.playAnimation(player.anim_idle);
          }
	      if (jam.Input.justPressed("X")) {
            if (inter != undefined) {
              inter.interact();
            }
          }
        } else {
	      if (jam.Input.justPressed("X")) {
            player.inter_cb();
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

    // Mark set.

    txts = [];
    var q;
    nt = 6;
    for (q = 0; q <= nt; q++) {
      var txt = jam.Text(20, 320);
      txt.font = "20pt monospace";
      txt.color = "#fff";
      txt.visible = false;
      txts.push(txt);
    }
    txt = jam.Text(20, 320);
    txt.font = "20pt monospace";
    txt.color = "#fff";
    txt.visible = false;
    // 640, 480
    txt_bg = jam.Sprite(0, 280);
    var tmp_canvas = document.createElement("canvas");
    tmp_canvas.width = 640;
    tmp_canvas.height = 200;
    var tmp_context = tmp_canvas.getContext("2d");
    tmp_context.fillStyle = "#666666";
    tmp_context.fillRect( 0, 0, 640, 200);
    tmp_context.fillStyle = "#fff";
    tmp_context.fillRect( 10, 10, 620, 180);
    tmp_context.fillStyle = "#666666";
    tmp_context.fillRect( 15, 15, 610, 170);
    txt_bg.image = tmp_canvas;
    txt_bg.width = 640;
    txt_bg.height = 200;
    txt_bg.visible = false;

    var nbg = jam.Sprite(0, 0);
    nbg.setImage("data/house.png", 2000, 1000);
    var bg = jam.Sprite(0, 0);
    bg.width = 640;
    bg.height = 480;
    bg.image = document.createElement("canvas");
    bg.image.width = 640;
    bg.image.height = 480;
    erase = false;
    var ctx = bg.image.getContext("2d");

    var map = jam.LevelMap.loadTileMap(50, map1, "data/tiles.png");
    player = makePlayer(game, map);
    game.camera.follow = player;
    var testo = makeObj(test_obj);
    var collo = makeObj(coll_obj);
    var losto = makeObj(lost_obj);

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

    makeMap();
    game.add(txt);
    var u;
    for (u in txts){
      game.add(txts[u]);
    }
    game.add(txt_bg);
    game.add(testo);
    game.add(collo);
    game.add(losto);
    game.add(nbg);
//    game.add(map);
    game.add(player);
//    game.add(bg);

    var l1 = jam.Sound.play('data/mtlayer1.wav');
    l1.loop = true;
    var l2 = jam.Sound.play('data/mtlayer2.wav');
    l2.loop = true;
    var l3 = jam.Sound.play('data/mtlayer3.wav');
    l3.loop = true;
    var l4 = jam.Sound.play('data/mtlayer4.wav');
    l4.loop = true;

    game.run();
  }

  // Show a loading bar until all the preloading is done, at which point
  // call initialize()
  jam.showPreloader(document.body, initialize);
}
