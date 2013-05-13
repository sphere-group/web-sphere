/*******************************/
/* Sphere Game Library for Web */
/*         Radnen 2013         */
/*******************************/

var MOUSE_LEFT = 0;
var MOUSE_RIGHT = 1;

var KEY_UP = 38;
var KEY_LEFT = 37;
var KEY_DOWN = 40;
var KEY_RIGHT = 39;
var KEY_ASTERISK = 106;

var Sphere = (function() {
	"use strict";
	
	var stage;
	var renderer;
	var game;
	var font;
	var showfps = false;
	var FPS = 0;  // actual
	var fps = 0;  // counter
	var time = 0;
	var mouse = [];
	var keys = [];
	var mousepos = { x: 0, y: 0 };
	var width = 0;
	var height = 0;
	
	function Init(w, h, gamefunc) {
		width = w; height = h;
		
		stage = new PIXI.Stage("#000000");
		stage.setInteractive(true);
		stage.mousedown = function() { mouse[0] = true; };
		stage.mouseup = function() { mouse[0] = false; };
		stage.mousemove = function(data) { mousepos = data.global; };
		
		renderer = PIXI.autoDetectRenderer(width, height);
		
		if (!renderer || !renderer.view) {
			console.log("Sphere: could not create renderer, use a supported browser.");
			return 0;
		}
		else {
			window.addEventListener("keydown", KeyDown, true);
			window.addEventListener("keyup", KeyUp, true);
		}
		
		font = GetSystemFont();
		
		try {
			document.body.appendChild(renderer.view);
		}
		catch (e) {
			console.log("Sphere: no <body> in document.");
			return 0;
		}
		
		// call your games game function:
		if (gamefunc && typeof gamefunc == "function") {
		    game = gamefunc;
			requestAnimFrame(Update);
		}
		else {
			console.log("Sphere: invalid game function.");
			return 0;
		}
		
		return 1;
	}
	
	function KeyDown(e) {
		if (e.keyCode == KEY_ASTERISK) { showfps = !showfps; FPS = 0; }
		keys[e.keyCode] = true;
	}

	function KeyUp(e) {
		keys[e.keyCode] = false;
	}
	
	function Update() {
		requestAnimFrame(Render);
		requestAnimFrame(Clear);
		requestAnimFrame(Update);
	}
	
	function Clear() {
		while (stage.children.length)
			stage.removeChild(stage.getChildAt(0));
	}
	
	function Render() {
		game();
		
		if (showfps) {
			font.drawText(0, 0, "FPS: " + FPS);
			fps++;
			if (time + 1000 < GetTime()) {
				FPS = fps;
				fps = 0;
				time = GetTime();
			}
		}
		
		renderer.render(stage);
		renderer.render(stage);
	}
	
	return {
		init: Init,
		get renderer() { return renderer; },
		get stage() { return stage; },
		get mouse() { return mouse; },
		get mousepos() { return mousepos; },
		get keys() { return keys; },
		get width() { return width; },
		get height() { return height; },
		verbose: false,
	};
}());

function FlipScreen() {
	Sphere.render();
}

function LoadImage(img) {
	if (Sphere.verbose) console.log("Sphere: loaded images/" + img);
	var texture = PIXI.Texture.fromImage("images/" + img);
	return new ImageWrapper(texture);
}

function ImageWrapper(tex) {
	this.texture = tex;
	
	Object.defineProperty(this, "width", {
		get: function() {
			return this.baseTexture.width;
		}
	});

	Object.defineProperty(this, "height", {
		get: function() {
			return this.baseTexture.height;
		}
	});
}

function GetTime() { return Date.now(); }

ImageWrapper.prototype.blit = function(x, y) {
	var sprite = new PIXI.Sprite(this.texture);
	sprite.position.x = x;
	sprite.position.y = y;
	Sphere.stage.addChild(sprite);
}

ImageWrapper.prototype.blitMask = function(x, y, color) {
	var sprite = new PIXI.Sprite(this.texture);
	sprite.position.x = x;
	sprite.position.y = y;
	sprite.alpha = color.alpha;
	Sphere.stage.addChild(sprite);
}

function LoadFont(fontname) {
	if (Sphere.verbose) console.log("Sphere: loaded images/" + img);
	this.fontname = fontname;
	return new FontWrapper(fontname);
}

function GetSystemFont() { return new FontWrapper(); }

function CreateColor(r, g, b, a) {
	if (a === undefined) a = 255;
	function Hex(v) { var v = Number(v).toString(16); v = (v.length == 1 ? "0" + v : v); return v;  }
	return { colorcode: "#" + (Hex(r) + Hex(g) + Hex(b)).toUpperCase(), alpha: a/255 };
}

function FontWrapper(fontname) {
	if (!fontname) fontname = "10pt Arial";
	this.fontname = fontname;
	this.color = "#FFFFFF";
}

FontWrapper.prototype.drawText = function(x, y, text) {
	var font = new PIXI.Text(text, { font: this.fontname, fill: this.color });
	font.position.x = x;
	font.position.y = y;
	Sphere.stage.addChild(font);
}

function LoadWindowStyle(filename) {
	var fr = new FileReader();
	var data = fr.readAsArrayBuffer(filename);
	
}

function IsMouseButtonPressed(button) { return Sphere.mouse[button]; };
function GetMouseX() { return Sphere.mousepos.x; };
function GetMouseY() { return Sphere.mousepos.y; };
function IsKeyPressed(code) { return Sphere.keys[code]; };
function GetScreenWidth() { return Sphere.width; };
function GetScreenHeight() { return Sphere.height; };

/* only works in 2d canvas mode :/ */
function Rectangle(x, y, w, h, color) {
	var c = Sphere.renderer.view;
	var rect = c.getContext("2d");
	if (rect) {
		rect.fillStyle = color.colorcode;
		rect.fillRect(x, y, w, h);
	}
}