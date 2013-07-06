define(["jam"], function(jam) {
  var self = {};

  self.img = function(width, height, color){
    if (width === undefined){
      width = 10;
    }
    if (height === undefined){
      height = width;
    }
    if (color === undefined){
      color = 'black';
    }
    var tmp_canvas = document.createElement("canvas");
    tmp_canvas.width = width;
    tmp_canvas.height = height;
    var tmp_context = tmp_canvas.getContext("2d");
    tmp_context.fillStyle = color;
    tmp_context.fillRect( 0, 0, width, height);
    return tmp_canvas;
  };

  self.sprite = function(x, y, width, height, color){
    if (x == undefined){
      x = 0;
    }
    if (y == undefined){
      y = 0;
    }
    var s = new jam.Sprite(x, y);
    s.image = self.img(width, height, color);
    s.width = s.image.width;
    s.height = s.image.height;
    return s;
  };

  return self;
});
