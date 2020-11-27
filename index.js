"use strict";
var coords = { x: -1, y: 0, targetX: -1, targetY: 0 };
var lerp = function (v0, v1, t) {return v0 * (1 - t) + v1 * t;};
var mapRange = function (aMin, aMax, bMin, bMax, value) {
  var rangeA = Math.abs(aMax - aMin);
  var rangeB = Math.abs(bMax - bMin);
  var distance = Math.abs(value - aMin) / rangeA;
  return bMin + distance * rangeB;
};
var coordinatesToDegrees = function (x, y) {return Math.atan2(y, x) * 180 / Math.PI + 180;};
var GridInput = /** @class */function () {
  function GridInput(size, cells) {
    var _this = this;
    var _a;
    this.size = size;
    this.cells = cells;
    this.container = document.createElement("div");
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.handleMove = function (_a) {
      var clientX = _a.clientX,clientY = _a.clientY,_b = _a.target,offsetTop = _b.offsetTop,offsetLeft = _b.offsetLeft;
      var canvasSize = _this.size / _this.pixelRatio;
      coords.targetX = mapRange(0, canvasSize, -1, 1, clientX - offsetLeft);
      coords.targetY = mapRange(0, canvasSize, -1, 1, clientY - offsetTop);
    };
    this.drawCanvas = function () {
      requestAnimationFrame(_this.drawCanvas);
      _this.ctx.clearRect(0, 0, _this.canvas.width, _this.canvas.height);
      _this.drawGrid();
      coords.x = lerp(coords.x, coords.targetX, 0.025);
      coords.y = lerp(coords.y, coords.targetY, 0.025);
      _this.drawDot(mapRange(-1, 1, 0, _this.size, coords.x), mapRange(-1, 1, 0, _this.size, coords.y));
    };
    this.pixelRatio = (_a = Math.round(devicePixelRatio), _a !== null && _a !== void 0 ? _a : 1);
    this.size = size * this.pixelRatio;
    this.canvas.width = size * this.pixelRatio;
    this.canvas.height = size * this.pixelRatio;
    this.canvas.style.width = size + "px";
    this.canvas.style.height = size + "px";
    this.canvas.style.border = "1px solid rgba(255, 255, 255, 0.25)";
    this.canvas.style.cursor = "crosshair";
    this.drawCanvas();
    this.container.style.width = this.canvas.style.width;
    this.container.style.height = this.canvas.style.height;
    this.container.style.margin = "1em";
    this.container.appendChild(this.canvas);
    this.canvas.addEventListener("mousemove", this.handleMove);
    requestAnimationFrame(this.drawCanvas);
    document.body.appendChild(this.container);
  }
  GridInput.prototype.drawDot = function (x, y) {
    this.ctx.fillStyle = "red";
    this.ctx.shadowBlur = 10 * this.pixelRatio;
    this.ctx.shadowColor = "red";
    this.ctx.beginPath();
    this.ctx.arc(x, y, this.size / this.cells / 2, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.shadowBlur = 0;
  };
  GridInput.prototype.drawGrid = function () {
    // Draw grid units
    var cellSize = this.size / this.cells;
    this.ctx.beginPath();
    this.ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    this.ctx.lineWidth = 1 * this.pixelRatio;
    for (var x = cellSize; x < this.size; x += cellSize) {
      this.ctx.moveTo(x + 0.5, 0);
      this.ctx.lineTo(x + 0.5, this.size);
    }
    for (var y = cellSize; y < this.size; y += cellSize) {
      this.ctx.moveTo(0, y + 0.5);
      this.ctx.lineTo(this.size, y + 0.5);
    }
    this.ctx.stroke();
    // Draw x- and y-axis
    this.ctx.beginPath();
    this.ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
    this.ctx.moveTo(0, this.size / 2 + 0.5);
    this.ctx.lineTo(this.size, this.size / 2 + 0.5);
    this.ctx.moveTo(this.size / 2 + 0.5, 0);
    this.ctx.lineTo(this.size / 2 + 0.5, this.size);
    this.ctx.stroke();
  };
  return GridInput;
}();
var Compass = /** @class */function () {
  function Compass(size) {
    var _this = this;
    var _a;
    this.size = size;
    this.container = document.createElement("div");
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.drawCanvas = function () {
      requestAnimationFrame(_this.drawCanvas);
      // Clear canvas
      _this.ctx.globalCompositeOperation = "source-over";
      _this.ctx.clearRect(0, 0, _this.canvas.width, _this.canvas.height);
      var degrees = coordinatesToDegrees(coords.x, coords.y);
      var WIDTH_90_DEG = _this.canvas.width / 2;
      var WIDTH_360_DEG = _this.canvas.width * 2;
      var offset = WIDTH_90_DEG - degrees / 360 * WIDTH_360_DEG;
      _this.drawMarkings(offset - WIDTH_360_DEG);
      _this.drawMarkings(offset);
      _this.drawMarkings(offset + WIDTH_360_DEG);
      _this.drawHeading(degrees);
    };
    this.pixelRatio = (_a = Math.round(devicePixelRatio), _a !== null && _a !== void 0 ? _a : 1);
    this.size = size * this.pixelRatio;
    this.canvas.width = this.size;
    this.canvas.height = this.size / 4;
    this.canvas.style.width = this.size / this.pixelRatio + "px";
    this.canvas.style.height = this.size / 4 / this.pixelRatio + "px";
    this.canvas.style.margin = "1em";
    this.drawCanvas();
    requestAnimationFrame(this.drawCanvas);
    this.container.appendChild(this.canvas);
    document.body.appendChild(this.container);
  }
  Compass.prototype.drawHeading = function (degrees) {
    var heading = Math.round(degrees).
    toString().
    padStart(3, "0");
    // Mask shapes below fillRect
    this.ctx.globalCompositeOperation = "destination-out";
    this.ctx.fillRect(this.canvas.width / 2 - 30, this.canvas.height / 2 - 30, 60, 25);
    this.ctx.globalCompositeOperation = "source-over";
    // Draw current heading
    this.ctx.font = "18px B612 Mono, monospace";
    this.ctx.fillStyle = "#fff";
    this.ctx.fillText(heading, this.canvas.width / 2 - this.ctx.measureText(heading).width / 2, this.canvas.height / 2 - 10);
  };
  Compass.prototype.drawMarkings = function (offset) {
    // To include the last line, we subtract 0.5
    var WIDTH_6_DEG = (this.canvas.width - 0.5) * 2 / 360;
    this.ctx.fillStyle = "#fff";
    this.ctx.strokeStyle = "#fff";
    for (var i = 0; i < 360; i += 6) {
      var x = WIDTH_6_DEG * i + offset;
      // Draw lines every 6th degree, with a larger one every 30th
      this.ctx.beginPath();
      if (i % 30 === 0) {
        this.ctx.moveTo(x + 0.5, this.canvas.height / 2 + 0);
        this.ctx.lineTo(x + 0.5, this.canvas.height / 2 + 15);
      } else
      {
        this.ctx.moveTo(x + 0.5, this.canvas.height / 2 + 5);
        this.ctx.lineTo(x + 0.5, this.canvas.height / 2 + 10);
      }
      this.ctx.stroke();
      // Draw cardinal points and headings
      this.ctx.font = "16px B612 Mono, monospace";
      if (i === 0 || i === 360) {
        this.ctx.fillText("N", x - this.ctx.measureText("N").width / 2, this.canvas.height / 2 - 10);
      } else
      if (i === 90) {
        this.ctx.fillText("E", x - this.ctx.measureText("E").width / 2, this.canvas.height / 2 - 10);
      } else
      if (i === 180) {
        this.ctx.fillText("S", x - this.ctx.measureText("S").width / 2, this.canvas.height / 2 - 10);
      } else
      if (i === 270) {
        this.ctx.fillText("W", x - this.ctx.measureText("W").width / 2, this.canvas.height / 2 - 10);
      } else
      if (i % 30 === 0) {
        var heading = i > 10 ? Math.round(i / 10) : i;
        this.ctx.font = "12px B612 Mono, monospace";
        this.ctx.fillText(heading, x - this.ctx.measureText(heading).width / 2, this.canvas.height / 2 - 10);
      }
    }
  };
  return Compass;
}();
new Compass(300);
new GridInput(150, 10);