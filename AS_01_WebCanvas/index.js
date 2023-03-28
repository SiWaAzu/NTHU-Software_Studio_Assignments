var canvas = document.getElementById('art');
var ctx = canvas.getContext('2d');

//var colors = ['crimson', 'royalblue', 'limegreen', 'mediumorchid', 'gold', 'darkorange', 'hotpink', 'black', 'white'];
//var currentColorsIndex=7;
var colors_get = document.getElementById('now_color');

var size = [1, 3, 5, 10, 15, 20];
var sizeNames = ['one', 'two', 'five', 'ten', 'fifteen', 'twenty'];
var currentSizesIndex=0;

var mousePos;
var startMousePos;
var lastMousePos;
var lastStroke;
var imgDataStackBack = [];
var imgDataStackForward = [];
var imgDataBeforeDraw;

var myFont = "Arial";
var myFontSize = "30px";
var myFontWeight = "500";
var textBox = document.getElementById("textBox");
var drawflag = 0;
var textContent = "";

document.getElementById("pen").style.opacity = 0.5;

ctx.strokeStyle=ctx.fillStyle=colors_get.value;
ctx.lineWidth=size[0];

//clear function
function clearCanvas() {
    var canvas = document.getElementById('art');
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

//draw_type
var DrawTypeEnum = Object.freeze({"pen":"pen", "text":"text", "square":"square","circle":"circle","tri":"tri","eraser":"eraser",
"line_f":"line_f","line":"line"});
var drawType=DrawTypeEnum.pen;
document.body.style.cursor = 'default';
var ctxImageStack=[];

//puting word
function drawing() {
  console.log("he");
  var colors = colors_get.value;
      ctx.fillStyle =colors;
      ctx.strokeStyle = colors;
      ctx.save();
      ctx.beginPath();
      ctx.font = myFontWeight +" "+myFontSize + " " + myFont;
      ctx.fillText(textContent, parseInt(textBox.style.left), parseInt(textBox.style.top));

      ctx.restore();
      ctx.closePath();
};

//getting mouse pos
function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y:evt.clientY - rect.top
  };
}

//mouse control
canvas.addEventListener('mousedown', function(evt) {
  mousePos = startMousePos = lastMousePos = getMousePos(canvas, evt);
  ctx.beginPath();

  //undo function
  imgDataBeforeDraw = ctx.getImageData(0,0,canvas.width,canvas.height);
  imgDataStackBack.push(imgDataBeforeDraw);
  //undo function
  if(drawType == DrawTypeEnum.pen || drawType == DrawTypeEnum.eraser) {
    ctx.beginPath();
    ctx.moveTo(mousePos.x, mousePos.y);
  }
  //text operation
  if (drawType == DrawTypeEnum.text && drawflag == 0) {
    textBox.style.left = mousePos.x + 'px';
    textBox.style.top = mousePos.y + 'px';
    textBox.style.display = 'block';
    textBox.style['z-index'] = 6;
    drawflag = 1;
 }
 else if (drawType == DrawTypeEnum.text && drawflag == 1)
 {
  textContent = textBox.value;  
  textBox.style.display = 'none';
    textBox.style['z-index'] = 1;
    drawflag = 0;
    textBox.value = "";
    drawing();
  }
  else if (drawType != DrawTypeEnum.text)
 {
  textContent = textBox.value;  
  textBox.style.display = 'none';
    textBox.style['z-index'] = 1;
    drawflag = 0;
    textBox.value = "";
  }
//text operation
  evt.preventDefault();
  canvas.addEventListener('mousemove', mouseMove, false);
});

canvas.addEventListener('mouseup', function() {
  if(drawType == DrawTypeEnum.pen || drawType == DrawTypeEnum.eraser) ctx.closePath();
  if(drawType == DrawTypeEnum.line) {
   // ctx.lineTo(mousePos.x,mousePos.y);
    ctx.stroke();
    ctx.closePath();
  }
  ctx.globalCompositeOperation ='source-over';
  canvas.removeEventListener('mousemove', mouseMove, false);
});

function mouseMove(evt) {
  var ctx = canvas.getContext('2d');
  mousePos = getMousePos(canvas, evt);
  console.log(mousePos.y);
  ctx.fillStyle = ctx.strokeStyle = colors_get.value;
  switch(drawType) {
  case DrawTypeEnum.pen:
    ctx.lineTo(mousePos.x, mousePos.y);
    ctx.stroke();
  break;
  case DrawTypeEnum.eraser:
    ctx.lineTo(mousePos.x, mousePos.y);
    ctx.stroke();
    ctx.globalCompositeOperation = 'destination-out';
    //ctx.clearRect(mousePos.x-(size[currentSizesIndex]/2),mousePos.y-(size[currentSizesIndex]/2),size[currentSizesIndex],size[currentSizesIndex]);
  break;
  case DrawTypeEnum.square:
    var width;
    var height;
    ctx.putImageData(imgDataBeforeDraw,0,0);
    width = mousePos.x-startMousePos.x;
    height = mousePos.y-startMousePos.y;
    ctx.fillRect(startMousePos.x,startMousePos.y,width,height);
    ctx.stroke();
  break;
  case DrawTypeEnum.circle:
    var width;
    var height;
    ctx.putImageData(imgDataBeforeDraw,0,0);
    width = mousePos.x-startMousePos.x;
    height = mousePos.y-startMousePos.y;
    var circle = new Path2D();
    circle.arc(startMousePos.x, startMousePos.y, parseInt(Math.sqrt(width*width+height*height)),0, 2 * Math.PI);
    ctx.fill(circle);
    break;
  case DrawTypeEnum.tri:
    var width;
    var height;
    ctx.putImageData(imgDataBeforeDraw,0,0);
    width = mousePos.x-startMousePos.x;
    height = mousePos.y-startMousePos.y;
    var ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(startMousePos.x,startMousePos.y);
    ctx.lineTo(startMousePos.x+width/2, startMousePos.y+height/2);
    ctx.lineTo(startMousePos.x-width/2, startMousePos.y+height/2);
    ctx.fill();
  break;
  case DrawTypeEnum.line_f:
    ctx.putImageData(imgDataBeforeDraw,0,0);
    ctx.moveTo(startMousePos.x,startMousePos.y);
    ctx.lineTo(mousePos.x,mousePos.y);
    ctx.stroke();
    break;
    case DrawTypeEnum.line:
      ctx.putImageData(imgDataBeforeDraw,0,0);
      ctx.beginPath();
      ctx.moveTo(startMousePos.x,startMousePos.y);
      ctx.lineTo(mousePos.x,mousePos.y);
      
      break;
  }
 // console.log(startMousePos.x," ",startMousePos.y," ",lastMousePos.x," ",lastMousePos.y," ",mousePos.x," ",mousePos.y);
  lastMousePos = mousePos;
}




function changeDrawType(type) {
    document.getElementById(drawType).style.opacity = 1;
    drawType = type;
    document.getElementById(drawType).style.opacity = 0.5;
    ctx.strokeStyle = lastStroke;
    switch(drawType){
     case DrawTypeEnum.pen:
        document.body.style.cursor = 'default';
        break;
     case DrawTypeEnum.square:
        document.body.style.cursor = 'crosshair';
        break;
     case DrawTypeEnum.circle:
        document.body.style.cursor = 'crosshair';
        break;
     case DrawTypeEnum.tri:
       document.body.style.cursor = 'crosshair';
       break;
       case DrawTypeEnum.line_f:
        document.body.style.cursor = 'crosshair';
        break;
        case DrawTypeEnum.line:
        document.body.style.cursor = 'crosshair';
        break;
     case DrawTypeEnum.text:
       document.body.style.cursor = 'text';
       break;
     case DrawTypeEnum.eraser:
       lastStroke = ctx.strokeStyle;
       document.body.style.cursor = 'grabbing';
       break;
    }
 }

 //line size
 for(var i = 0; i < size.length; i++) {
  lineSizeListener(i);
}	

function lineSizeListener(i) {
  var canvas = document.getElementById('art');
  var ctx = canvas.getContext('2d');
  document.getElementById(sizeNames[i]).addEventListener('click', function() {
  ctx.lineWidth=size[i];
  currentSizesIndex = i;
  }, false);
}

 //undo redo mehod
 function undo(){
  var c=document.getElementById("art");
  var ctx=c.getContext("2d");
  var oldImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  if (imgDataStackBack.length>0) {
    var imgData = imgDataStackBack.pop();
    imgDataStackForward.push(oldImageData);
    ctx.putImageData(imgData,0,0);
  }
  else
  alert("Nothing to Undo");
}
function redo(){
  var c=document.getElementById("art");
  var ctx=c.getContext("2d");
  var oldImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  if (imgDataStackForward.length>0) {
  var imgData = imgDataStackForward.pop();
  imgDataStackBack.push(oldImageData);
  ctx.putImageData(imgData,0,0);
  }
  else
  alert("Nothing to Redo");
}

//image things
document.getElementById('inp').onchange = function(e) {
  var img = new Image();
  img.onload = function(e){
  var canvas = document.getElementById('art');
  var ctx = canvas.getContext('2d');
  ctx.drawImage(this, 0,0,img.width,img.height);
};
 img.onerror = function(e){
  console.error("It isn't an image!!");
};
 img.src = URL.createObjectURL(this.files[0]);
};

download_img = function(el) {
  var image = canvas.toDataURL("image/png");
  el.href = image;
}

function changeFontType(){
  myFont = document.getElementById("mySelect").value;
}

var slider = document.getElementById("myRange");
slider.oninput = function() {
  myFontSize = this.value +"px";
}

var slider = document.getElementById("myFontWeight");
slider.oninput = function() {
  myFontWeight = this.value ;
}

 