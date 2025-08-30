var radius = 280; // menos separación
var autoRotate = true;
var rotateSpeed = 20; // velocidad rotación
var imgWidth = 220;
var imgHeight = 300;

var odrag = document.getElementById('drag-container');
var ospin = document.getElementById('spin-container');
var aImg = ospin.getElementsByTagName('img');
var aEle = [...aImg];

ospin.style.width = imgWidth + "px";
ospin.style.height = imgHeight + "px";

var ground = document.getElementById('ground');
ground.style.width = radius * 3 + "px";
ground.style.height = radius * 3 + "px";

var tX = 0, tY = 10, desX = 0, desY = 0, sX, sY, nX, nY;

function init(delayTime){
  for(var i=0;i<aEle.length;i++){
    aEle[i].style.transform = `rotateY(${i*(360/aEle.length)}deg) translateZ(${radius}px)`;
    aEle[i].style.transition = `transform 1s`;
    aEle[i].style.transitionDelay = (delayTime || (aEle.length-i)/4) + 's';
  }
}

function applyTransform(obj){
  if(tY>180) tY=180;
  if(tY<0) tY=0;
  obj.style.transform = `rotateX(${-tY}deg) rotateY(${tX}deg)`;
}

function playSpin(yes){
  ospin.style.animationPlayState = yes?'running':'paused';
}

// Animación rotación automática
if(autoRotate){
  let deg = 0;
  setInterval(()=>{
    deg += rotateSpeed * 0.017;
    tX = deg;
    applyTransform(odrag);
  },17);
}

// Drag
document.onpointerdown = function(e){
  clearInterval(odrag.timer);
  sX = e.clientX; sY = e.clientY;

  this.onpointermove = function(e){
    nX = e.clientX; nY = e.clientY;
    desX = nX - sX;
    desY = nY - sY;
    tX += desX*0.1;
    tY += desY*0.1;
    applyTransform(odrag);
    sX = nX; sY = nY;
  }

  this.onpointerup = function(e){
    odrag.timer = setInterval(()=>{
      desX *= 0.95; desY *= 0.95;
      tX += desX*0.1; tY += desY*0.1;
      applyTransform(odrag);
      playSpin(false);
      if(Math.abs(desX)<0.5 && Math.abs(desY)<0.5){
        clearInterval(odrag.timer);
        playSpin(true);
      }
    },17);
    this.onpointermove = this.onpointerup = null;
  }
  return false;
}

document.onmousewheel = function(e){
  var d = e.wheelDelta/20 || -e.detail;
  radius += d;
  init(1);
};

init();
