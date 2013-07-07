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

//		  window.setTimeout(self._tick, 1000.0/50);
  var fade = function(snd, cb, speed, g){
    var q;
    if (g === 1){
      q = function(){
        return(snd.volume >= 1)
      };
    }
    if (g === 0){
      q = function(){
        return(snd.volume <= 0)
      };
    }
    var t = function(){
      console.log(q());
      if (q()){

        if (cb != undefined){
          cb();
        }
        return;
      } else {
        if((snd.volume + speed) < 0) {
          snd.volume = 0;
        } else {
          snd.volume = snd.volume + speed;
        }
        window.setTimeout(t, 1000.0/50);
      }
    };
    t();
  };

  var fade_in = function(url, cb){
    fade(url, cb, 0.005, 1);
  };

  var fade_out = function(url, cb){
    fade(url, cb, -0.005, 0);
  };

  var lost_game = function(){
    /**/
    game.paused = true;
    fade_out(l1, function(){
      fade_in(lwm);
    });
    if (l2.volume > 0){
     fade_out(l2);
    }
    if (l3.volume > 0){
     fade_out(l3);
    }
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
      for (r in txts){
        txts[r].text = "";
      }
      p.reading = true;
      txt_bg.x = 0;
      txt_bg.y = 280;
      var e;
      var w = txt_bg.y + 20;
      for (e in o){
        txts[e].x = txt_bg.x + 20;
        txts[e].y = w + 20;
        txts[e].visible = true;
        txts[e].text = o[e];
        w = txts[e].y;
      }
      txt_bg.visible = true;
      p.inter_cb = cb;
    };

    var lw_stop_text = [
      ["I waited for what felt like hours,", "watching the sun change the shadows,", "pretending that the lengthening", "darkness represented the presence of", "giants around me, towers I might one", "day scale & conquer & rule."],
      ["I wanted to find my way out. Instead", "I was found, in shame, a failed", "escapee being brought back in."],
      ["I wanted to push past the edges,", "find the magic portal that only the", "most worthy girls might find. But I", "was beginning to fear the idea of", "impossibility."],
      ["I found only that each house I", "passed would be replaced by another,", "and another, and another, a magic", "forest that I might never escape -,", "no matter how perfectly", "charted"],
      ["I wondered if you ever felt the same"]
    ];
    var tmp_canvas = document.createElement("canvas");
    tmp_canvas.width = 640;
    tmp_canvas.height = 480;
    var tmp_context = tmp_canvas.getContext("2d");
    tmp_context.fillStyle = "#fff";
    tmp_context.fillRect(0, 0, 640, 480);
    var fade_s;
    fade_s = new jam.Sprite(0, 0);
    fade_s.width = 640;
    fade_s.height = 480;
    fade_s.image = tmp_canvas;
    fade_s.alpha = 0;
    var stop_sign = new jam.AnimatedSprite(300, 300);
    stop_sign.visible = false;
    stop_sign.setImage('data/stop.png');
    stop_sign.interact = function(){
      var cbe = function() {
        p.stop_read();
        lost.paused=true;
        game.paused=false;
        console.log('foo');
        counter++;
      };
      var d = function(){
        var car = jam.Sound.play('data/carsfx.wav');
        dia(lw_stop_text, cbe);
      };
      var cb = function(){
        fade_s.update = jam.extend(fade_s.update, function(elapsed){

          if (fade_s.alpha >= 1){

          } else {
            fade_s.alpha = fade_s.alpha + 0.005;
          }
        });
        fade_s._layer=1;
        d();
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
	    if (jam.Input.justPressed("Z")) {
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
    lost.add(fade_s);
    lost.add(p)
    lost.add(stop_sign)
    lost.add(bg2);
    lost.add(bg1);
    var lw_start_text = [
      ["In the stories my grandfather read", "to me when I was young, the children", "can escape when things go wrong."],
      ["The heroine is scared. She runs", "away, and in the forest there is", "someone who knows how capable she", "can be."],
      ["Perhaps there are magical creatures", "perhaps she was a princess the", "entire time, and someone knew it and", "was waiting for her."],
      ["It is unfair that I can't do the", "same, but I can still keep trying, I", "can bolt out the front door and find", "new stories."],
      ["Maybe find one that was right for me", "this whole time. Find strangers to", "watch, imagining they are travelers,", "from far-off places with kinder", "rules."],
      ["But so often I simply found myself", "lost and scared, instead"]
    ];
    var dia =  function(dialogue, f) {
      var i = 1;
      var cb = function() {
        i++;
        if (i == dialogue.length) {
          if (f !== undefined) {
            f();
          }
          p.stop_read();
        } else {
          p.read(dialogue[i], cb);
        }
      };
      p.read(dialogue[0], cb);
    }
    dia(lw_start_text);
    lost.run();
    /**/
  };

  var intro = function () { //TB
    var title = jam.Game(640, 480, document.body, game._canvas);

    var screen = new jam.Sprite(0,0); // spawn coords
    screen.setImage("data/title.png", 680, 480);

    var floater = jam.AnimatedSprite(270,0);
    floater.reading = false;
    floater.visible = false;
    floater.setImage("data/fishFloat.png");

    floater.anim_run = jam.Animation.Strip([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16], 40, 480, 2, 0, 0,
      function (){
        setTimeout(function () {
          title.paused = true;
          game.run();
        }, 500);

      });

    screen.update = jam.extend(screen.update, function(elapsed) {
      if (jam.Input.justPressed("X")){
        floater.visible = true;
        floater.playAnimation(floater.anim_run);
      }
    });

    title.add(floater);
    title.add(screen);
    title.run();
  };

var fishBowl = function () { // TB
    game.pasued = true;
    var bowl = jam.Game(640, 480, document.body, game._canvas);
    var xPresses = 0;

    var theFish = new jam.Sprite(0,0);
    theFish.setImage("data/toiletYesFish.png", 640,480);

    theFish.update = jam.extend(theFish.update, function(elapsed) {
      if (jam.Input.justPressed("X")) {
        xPresses++;
        if (xPresses == 10) {
            theFish.setImage("data/toiletNoFish.png");
          }
      }
    });

    bowl.add(theFish);
    //transition
    //play fish song
    //dialogues with X/interact
    //play flush
    //quickfade white

    bowl.run();
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
    /**/
    var canvasc = document.createElement("canvas");
    canvasc.width = 200;
    canvasc.height = 200;
    var contextc = canvasc.getContext('2d');
    var centerX = canvasc.width / 2;
    var centerY = canvasc.height / 2;
    var radius = 70;

    contextc.beginPath();
    contextc.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    contextc.fillStyle = 'green';
    contextc.fill();
    contextc.lineWidth = 5;
    contextc.strokeStyle = '#003300';
    contextc.stroke();
    var net = new jam.Sprite(0,0);
    net.image = canvasc;
    net.width = canvasc.width;
    net.height = canvasc.height;
    net.visible = false;
    coll.add(net);
    net.layer=1;
/**/
    var sdist = function(v1, v2){
      var s = (((v1.x - v2.x) * (v1.x - v2.x)) +
               ((v1.y - v2.y) * (v1.y - v2.y)));
      return s;
    };
    coll.update = jam.extend(coll.update, function(elapsed){
      if (bcount <= 0) {
        coll.paused = true;
        game.paused = false;
        counter++;
        console.log('bar');
      }
      if (jam.Input.buttonDown('MOUSE_LEFT')){
        if (net.visible === false){
          net.x = jam.Input.mouse.x - 100;
          net.y = jam.Input.mouse.y - 100;
          net.visible = true;
          var g;
          for (g in bugs){
            if (sdist(bugs[g], jam.Input.mouse) < 10000) {
              if (bugs[g].visible === true) {
                bcount -= 1;
                bugs[g].visible = false;
              }
            }
          }
        } else {
        }
      } else {
        net.visible = false;
      }
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
      return b;
    };
  var bugs = [];
  var nbugs = 40;
  var bcount = nbugs;
  var i;
  for (i = 0; i < nbugs + 1; i++) {
    var x = Math.floor(Math.random()*640);
    var y = Math.floor(Math.random()*480);
    var b = make_bug(x, y);
    bugs.push(b);
  }

  coll.run();
  };

  var songs = 0;

  var initialize = function(){
    game = jam.Game(640, 480, document.body);

    jam.Debug.showBoundingBoxes = true;		// Uncomment to see the collision regions
    counter = 0;
    if (jam.Debug.showBoundingBoxes == true) { // TB
      counter = 0;
    }

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
        // About 37 characters per line.
        player.read(["Hi puppy.","foo", "bar", "biz", "baz", "1234567890123456789012345678901234567"], cb1);
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

    var fishObj = { // TB
      x : 1878,
      y : 97,
      label : "fish",
      img : "data/fishObj.png",
      interact : function() {
        game.paused = true;
        fishBowl();
      },
    };

    var carObj = { // TB
      x : 133,
      y : 392,
      label : "car",
      img : "data/carObj.png",
      interact : function() {
        var part1 = [];
        var part2 = [];
        var dialogue = [
          "a", "b", "c"
          //part2 = [ "d", "e", "f" ]
        ]
        var i = 0;
        var cb = function() {
          i++;
          console.log(i);
          if (i == dialogue.length) {
            player.stop_read();
          } else {
            player.read(dialogue[i], cb);
          }
        };
        player.read(dialogue, cb);
      },
    };
    var manObj = {
      // TB 50 x 94
      x : 970,
      y : 835,
      label : "man",
      img : "data/evilMan.png",
      interact : function() {
        var cb = function() {
          player.stop_read();
        };
        player.read("I work!", cb);
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
        [970, 835, 50, 94], // TB
        [48, 454, 400, 90], // TB
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
      if (jam.Debug.showBoundingBoxes == true) { //TB
        player.speed = 500;
      }
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
        var r;
        for (r in txts){
          txts[r].visible = false;
          txts[r].text = "";
        }
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
        if (songs < counter) {
          if (songs === 0){
            l2.volume = 1;
            console.log('2 layers.');
          }
          if (songs === 1){
            l3.volume = 1;
            console.log('3 layers.');
          }
          if (songs === 2){
            l4.volume = 1;
            console.log('4 layers.');
          }
          songs++;
        }
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
	      if (jam.Input.justPressed("Z")) {
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
    var fishObj = makeObj(fishObj); //TB
    var carObj = makeObj(carObj); //TB
    var manObj = makeObj(manObj); //TB

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
    game.add(fishObj); //TB
    game.add(carObj); //TB
    if (counter >= 3) {
      game.add(manObj); //TB
    }
    game.add(losto);
    game.add(nbg);
//    game.add(map);
    game.add(player);
//    game.add(bg);

    lwm = jam.Sound.play('data/lostwoods.wav');
    lwm.volume = 0;

    l1 = jam.Sound.play('data/mtlayer1.wav');
    l1.loop = true;
    l2 = jam.Sound.play('data/mtlayer2.wav');
    l2.loop = true;
    l3 = jam.Sound.play('data/mtlayer3.wav');
    l3.loop = true;
    l4 = jam.Sound.play('data/mtlayer4.wav');
    l4.loop = true;
    l2.volume = 0;
    l3.volume = 0;
    l4.volume = 0;

    if (jam.Debug.showBoundingBoxes == false) {
      intro(); //TB
    } else { game.run(); }

    //game.run();
  }

  // Show a loading bar until all the preloading is done, at which point
  // call initialize()
  jam.showPreloader(document.body, initialize);
}
