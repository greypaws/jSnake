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
  prey: {},
  snakeColor: "DimGrey",
  preyColor: "Brown",
  square: 16, //size of the grid squares
  gridHorz: 0, //Math.floor(JSG.width/JSG.square), //number of squares across
  gridVert: 0, //Math.floor(JSG.height/JSG.square), //number of squares vertically
  direction: "not", //set by arrow keys: north, south, east, and west
  ranLoc: null, //random location function
  drawSq: null, // draws squares that makes up snake and prey
  drawPrey: null,
  drawSnake: null,
  drawBorder: null,
  setDirListener: null,
  slither: null, //moves snake
  init: null //everything needed tp start
};

JSG.ranLoc = function () {
  var x, y, loc;
  x = Math.floor(Math.random() * JSG.gridHorz);
  y = Math.floor(Math.random() * JSG.gridVert);
  loc = {x: x, y: y};
  return loc;
};

JSG.drawSq = function (gridLoc, type) {
  var x, y, size = JSG.square - 2,
    color = (type === "snake") ? JSG.snakeColor : JSG.preyColor;
  x = gridLoc.x * JSG.square;
  y = gridLoc.y * JSG.square;
  JSG.ctx.save();
  JSG.ctx.fillStyle = color;
  JSG.ctx.fillRect(x, y, size, size);
  JSG.ctx.restore();
};

JSG.clearSq = function (gridLoc) {
  var x, y, size = JSG.square;
  x = (gridLoc.x * JSG.square) - 1;
  y = (gridLoc.y * JSG.square) - 1;
  JSG.ctx.save();
  JSG.ctx.clearRect(x, y, size, size);
  JSG.ctx.restore();
};

JSG.drawPrey = function () {
  var i, sn = JSG.snake.length,
    location = JSG.ranLoc();
  for (i = 0; i < sn; i += 1) {
    if(location.x === JSG.snake[i].x && location.y === JSG.snake[i].y) {
      location = JSG.ranLoc();
      i = 0;
    }
  }
  JSG.drawSq(location, "prey");
  JSG.prey = location;
};

JSG.drawSnake = function (location) {
  JSG.snake.unshift(location);
  JSG.drawSq(location, "snake");
};

JSG.drawBorder = function () {
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

JSG.setDirListener = function () {
  var keycode = 0, 
    KEY_CODES = {
      37: "left",
      38: "up",
      39: "right",
      40: "down"
    };

  document.addEventListener("keydown", function(e) {
    keycode = (e.keyCode) ? e.keyCode : e.charCode;
    if(KEY_CODES[keycode]) {
      e.preventDefault();
      JSG.direction = KEY_CODES[keycode];
    }
  });
};

JSG.slither = function () {
  var next = {}, 
    head = JSG.snake[0];
  switch(JSG.direction) {
    case "left":
      next = {x: (head.x === 0 ? JSG.gridHorz : head.x - 1), y: head.y};
      break;
    case "up":
      next = {x: head.x, y: (head.y === 0 ? JSG.gridVert : head.y - 1)};
      break;
    case "right":
      next = {x: (head.x === JSG.gridHorz ? 0 : head.x + 1), y: head.y};
      break;
    case "down":
      next = {x: head.x, y: (head.y === JSG.gridVert ? 0 : head.y + 1)};
      break;
    default:
      next = {x: head.x, y: head.y};
  }
  
  //remove and erase tail of snake unless the snake eats prey and grows
  if(!(next.x === JSG.prey.x && next.y === JSG.prey.y)) {
    JSG.clearSq(JSG.snake.pop());
  }

  JSG.drawSnake(next);
};

JSG.init = function () {
  JSG.ctx = JSG.cvs.getContext("2d");
  JSG.width = JSG.cvs.width;
  JSG.height = JSG.cvs.height;
  JSG.gridHorz = Math.floor(JSG.width/JSG.square);
  JSG.gridVert = Math.floor(JSG.height/JSG.square);
  JSG.drawBorder();
  JSG.drawSnake(JSG.ranLoc());
  JSG.drawPrey();
  JSG.setDirListener();
};

window.onload = function () {
  JSG.init();
  JSG.setDirListener();
};

