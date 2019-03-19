var Canver;
var previouscolor;
var erasered = false;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
Canver = (function() {
  function Canver(canvas, bgColor, retinaMultiplier) {
    this.canvas = canvas;
    this.bgColor = bgColor;
    this.retinaMultiplier = retinaMultiplier != null ? retinaMultiplier : 1;
    this.ctx = this.canvas.getContext("2d");
    this.resizeCanvas();
    this.initTouchable();
    this.repaintBackground(this.bgColor);
    this.colorizer = new Colorizer;
    this.ctx.fillStyle = "#fa0";
    this.canvas.style.display = 'block';
  }
  Canver.prototype.hide = function() {
    return this.canvas.style.display = 'none';
  };
  Canver.prototype.show = function() {
    return this.canvas.style.display = 'block';
  };
  Canver.prototype.repaintBackground = function(fillStyle) {
    var fs;
    fs = this.ctx.fillStyle;
    this.ctx.fillStyle = fillStyle;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    return this.ctx.fillStyle = fs;
  };
  Canver.prototype.initTouchable = function() {
    this.canvas.addEventListener("touchstart", __bind(function(e) {
      e.preventDefault();
      this.applyColor();
      return this.tool.start(e);
    }, this));
    this.canvas.addEventListener("touchmove", __bind(function(e) {
      e.preventDefault();
      this.applyColor();
      return this.tool.move(e);
    }, this));
    return this.canvas.addEventListener("touchend", __bind(function(e) {
      e.preventDefault();
      this.tool.end(e);
      return true;
    }, this));
  };
  Canver.prototype.applyColor = function() {
    var colour;
    colour = this.colorizer.nextColour();
    this.ctx.fillStyle = colour;
    this.ctx.shadowColor = colour;
    return this.ctx.strokeStyle = colour;
  };
  Canver.prototype.resizeCanvas = function() {
    this.canvas.width = window.innerWidth * this.retinaMultiplier;
    return this.canvas.height = window.innerHeight * this.retinaMultiplier;
  };
  Canver.prototype.setTool = function(toolName) {
    if(toolName == 'eraser')
        {    previouscolor = this.colorizer.color;
            eraser();
           erasered =true;
       
          
        }
      else
          {
        if(erasered==true)
            { 
                erasered = false;
               this.colorizer.setColor(previouscolor);
            }
    var toolClass;
    this.tr || (this.tr = new ToolRegister);
    toolClass = this.tr.toolFor(toolName);
    this.tool = new toolClass(this.canvas, this.ctx);
    return this.tool.init();
              
          }
 
  };
  Canver.prototype.setColor = function(color) {
    return this.colorizer.setColor(color);
  };
  Canver.prototype.setSize = function(size) {
    return this.tool.setSize(size);
  };
  Canver.prototype.switchSaveMode = function(imageElm) {
    if (window.navigator.standalone) {
      return alert("iOS does not support image saving in Home Screen mode. You can make a screenshot by holding down Home and Power buttons.");
    } else {
      alert('Tap and hold the image to save. Click menu arrow when finished.');
      imageElm.src = this.canvas.toDataURL();
      return this.hide();
    }
  };
  return Canver;
})();

