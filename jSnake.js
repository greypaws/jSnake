//jSnake.js
//Walter Johnson for jSnake

"use strict";

//one global variable to rule them all
var JSG = {
  cvs: document.getElementById("canvas1"),
  scoreEl: document.getElementById("score"),
  highScoreEl: document.getElementById("highScore"),
  ctx: null, //JSG.cvs.getContext("2d"),
  width: 0, //JSG.cvs.width,
  height: 0, //JSG.cvs.height,
  snake: [], //array of locations
  prey: {}, //{x: x, y: y}
  snakeColor: "DimGrey",
  preyColor: "Brown",
  square: 24, //size of the grid squares, should evenly divide width and height
  gridHorz: 0, //number of squares across
  gridVert: 0, //number of squares vertically
  direction: "not", //set by arrow keys: north, south, east, and west
  setIntId: "",
  score: 0,
  highScore: 0,
  rate: 180, //number of milliseconds between snake movements
  ranLoc: null, //random location function
  drawSq: null, // draws squares that makes up snake and prey
  drawPrey: null,
  drawSnake: null,
  drawBorder: null,
  setDirListener: null, // listens for arrow keys to control snake
  slither: null, //moves snake
  gameOver: null, //called when snake bites self
  setStartListener: null, // listens for arrow keys to start snake moving
  start: null,
  init: null //everything needed tp start
};

JSG.ranLoc = function () {
  var x, y, loc;
  x = Math.floor(Math.random() * (JSG.gridHorz + 1));
  y = Math.floor(Math.random() * (JSG.gridVert + 1));
  loc = {x: x, y: y};
  return loc;
};

JSG.drawSq = function (gridLoc, type) {
  var x, y, size = JSG.square - 2,
    color = (type === "snake") ? JSG.snakeColor : JSG.preyColor;
  x = (gridLoc.x * JSG.square) + 1;
  y = (gridLoc.y * JSG.square) + 1;
  JSG.ctx.save();
  JSG.ctx.fillStyle = color;
  JSG.ctx.fillRect(x, y, size, size);
  JSG.ctx.restore();
};

JSG.clearSq = function (gridLoc) {
  var x, y, size = JSG.square - 2;
  x = (gridLoc.x * JSG.square) + 1;
  y = (gridLoc.y * JSG.square) + 1;
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
  var dir = "not",
    keycode = 0, 
    KEY_CODES = {
      37: "left", // <-
      38: "up",
      39: "right", //->
      40: "down",
      65 : "left",  // w
      87 : "up",    // a
      68 : "right", // d
      83 : "down"   // s
    };

  document.addEventListener("keydown", function(e) {
    keycode = (e.keyCode) ? e.keyCode : e.charCode;
    if(KEY_CODES[keycode]) {
      e.preventDefault();
      dir = KEY_CODES[keycode];
    }
    // can't reverse direction
    if(!(dir === "left" && JSG.direction === "right") &&
       !(dir === "right" && JSG.direction === "left") &&
       !(dir === "up" && JSG.direction === "down") &&
       !(dir === "down" && JSG.direction === "up")) {
      JSG.direction = dir;
    }
  });
};

JSG.slither = function () {
  var i, 
    sn = JSG.snake.length,
    next = {},
    flag = true,
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

  //snake eats itself game over
  for(i = 0; i < sn; i += 1) {
    if(next.x === JSG.snake[i].x && next.y === JSG.snake[i].y) {
      JSG.gameOver();
      return;
    }
  }
  
  //remove and erase tail of snake unless the snake eats prey and grows
  if(!(next.x === JSG.prey.x && next.y === JSG.prey.y)) {
    JSG.clearSq(JSG.snake.pop());
    flag = false;
  }

  JSG.drawSnake(next);
  if(flag) {
    JSG.drawPrey();
    JSG.score += 10;
    JSG.scoreEl.innerText = JSG.score;
  }
};

JSG.gameOver = function () {
  var timeout;
  clearInterval(JSG.setIntId);
  JSG.direction = "not";
  timeout = function (locs) {
    setTimeout(function () {
      if(locs.length > 1) {
        JSG.clearSq(locs.pop());
        timeout(locs); 
      } else {
        if(JSG.highScore < JSG.score) {
          JSG.highScore = JSG.score;
          JSG.highScoreEl.innerText = JSG.highScore;
        }
        JSG.score = 0;
        JSG.setIntId = "";
      }
    }, 200);
  };
  setTimeout(timeout, 1000, JSG.snake);
};

JSG.setStartListener = function () {
  var keycode = null;
  document.addEventListener("keyup", function(e) {
    keycode = (e.keyCode) ? e.keyCode : e.charCode;
    if(keycode && (keycode === 37 || keycode === 38 || keycode === 39 || keycode === 40 || keycode === 65 || keycode === 87 || keycode === 68 || keycode === 83) && (JSG.setIntId === "")) {
      e.preventDefault();
      JSG.start();
    }
  });
};

JSG.start = function () {
  JSG.setIntId = setInterval(function () {
    JSG.slither();
  }, JSG.rate);
  JSG.scoreEl.innerText = JSG.score;
};

JSG.init = function () {
  JSG.ctx = JSG.cvs.getContext("2d");
  JSG.width = JSG.cvs.width;
  JSG.height = JSG.cvs.height;
  JSG.gridHorz = Math.ceil(JSG.width/JSG.square) - 1;
  JSG.gridVert = Math.ceil(JSG.height/JSG.square) - 1;
  JSG.drawBorder();
  JSG.drawSnake(JSG.ranLoc());
  JSG.drawPrey();
  JSG.setDirListener();
  JSG.setStartListener();
};

window.onload = function () {
  JSG.init();
};

