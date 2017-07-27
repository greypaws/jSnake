//jSnake.js
//Walter Johnson for jSnake

"use strict";

//one global variable to rule them all
var JSG = {
  cvs: document.getElementById("canvas1"),
  ctx: null, //JSG.cvs.getContext("2d"),
  width: 0, //JSG.cvs.width,
  height: 0, //JSG.cvs.height,
  snake: [],
  prey: [],
  snakeColor: "DimGrey",
  preyColor: "Brown",
  square: 16,
  gridHorz: 0, //Math.floor(JSG.width/JSG.square),
  gridVert: 0, //Math.floor(JSG.height/JSG.square),
  ranLoc: null,
  drawSq: null, 
  drawPrey: null,
  drawSnake:null,
  init: null
};

JSG.ranLoc = function() {
  var x, y, loc;
  x = Math.floor(Math.random() * JSG.gridHorz);
  y = Math.floor(Math.random() * JSG.gridVert);
  loc = {x: x, y: y};
  return loc;
};

JSG.drawSq = function(gridLoc, type) {
  var x, y, size = JSG.square - 2,
    color = (type === "snake") ? JSG.snakeColor : JSG.preyColor;
  x = gridLoc.x * JSG.square;
  y = gridLoc.y * JSG.square;
  JSG.ctx.save();
  JSG.ctx.fillStyle = color;
  JSG.ctx.fillRect(x, y, size, size);
  JSG.ctx.restore();
};

JSG.clearSq = function(gridLoc) {
  var x, y, size = JSG.square - 2;
  x = gridLoc.x * JSG.square;
  y = gridLoc.y * JSG.square;
  JSG.ctx.save();
  JSG.ctx.clearRect(x, y, size, size);
  JSG.ctx.restore();
};

JSG.drawPrey = function() {
  var i, sn = JSG.snake.length,
    location = JSG.ranLoc();
  for (i = 0; i < sn; i += 1) {
    if(location.x === JSG.snake[i].x && location.y === JSG.snake[i].y) {
      location = JSG.ranLoc();
      i = 0;
    }
  }
  JSG.drawSq(location, "prey");
};

JSG.drawSnake = function(location) {
  var length = JSG.snake.unshift(location);
  if (length > 1) {
    JSG.clearSq(JSG.snake[length - 1]);
  }
  JSG.drawSq(location, "snake");
};

JSG.drawBorder = function() {
  JSG.ctx.save();
  JSG.ctx.beginPath;
  JSG.ctx.moveTo(0, 0);
  JSG.ctx.lineTo(JSG.width, 0);
  JSG.ctx.lineTo(JSG.width, JSG.height);
  JSG.ctx.lineTo(0, JSG.height);
  JSG.ctx.lineTo(0, 0);
  JSG.ctx.closePath();
  JSG.ctx.stroke();
  JSG.ctx.restore();
};

JSG.init = function() {
  JSG.ctx = JSG.cvs.getContext("2d");
  JSG.width = JSG.cvs.width;
  JSG.height = JSG.cvs.height;
  JSG.gridHorz = Math.floor(JSG.width/JSG.square);
  JSG.gridVert = Math.floor(JSG.height/JSG.square);
  JSG.drawBorder();
  JSG.drawSnake(JSG.ranLoc());
  JSG.drawPrey();
};

window.onload = function() {
  JSG.init();
};