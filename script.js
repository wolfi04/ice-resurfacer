const canvas=document.getElementById('gameCanvas');
const ctx=canvas.getContext('2d');

const speedDisplay=document.getElementById('speedDisplay');
const percentDisplay=document.getElementById('percentDisplay');
const timerDisplay=document.getElementById('timerDisplay');

let keys={};
let startTime=Date.now();
let gameFinished=false;

let machine={x:500,y:300,angle:0,speedLevel:0,width:70,height:38};

const speedValues=[0,1.2,2,2.8,3.6,4.5];

const cleanCanvas=document.createElement('canvas');
cleanCanvas.width=canvas.width;
cleanCanvas.height=canvas.height;
const cleanCtx=cleanCanvas.getContext('2d');

document.addEventListener('keydown',e=>{
keys[e.key]=true;
if(e.key==='ArrowUp') machine.speedLevel=Math.min(5,machine.speedLevel+1);
if(e.key==='ArrowDown') machine.speedLevel=Math.max(0,machine.speedLevel-1);
});

document.addEventListener('keyup',e=>keys[e.key]=false);

function update(){
let speed=speedValues[machine.speedLevel];
if(keys['ArrowLeft']) machine.angle-=0.035;
if(keys['ArrowRight']) machine.angle+=0.035;

machine.x+=Math.cos(machine.angle)*speed;
machine.y+=Math.sin(machine.angle)*speed;

machine.x=Math.max(30,Math.min(canvas.width-30,machine.x));
machine.y=Math.max(30,Math.min(canvas.height-30,machine.y));

cleanIce();

const percent=calculateCleanedPercent();
percentDisplay.textContent=percent;
speedDisplay.textContent=machine.speedLevel;

if(percent>=100 && !gameFinished){
gameFinished=true;
setTimeout(()=>alert('🏆 Ice Fully Resurfaced!\n\nTime: '+timerDisplay.textContent),100);
}
}

function updateTimer(){
if(gameFinished) return;
const elapsed=Math.floor((Date.now()-startTime)/1000);
const m=Math.floor(elapsed/60);
const s=elapsed%60;
timerDisplay.textContent=String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');
}

function drawIceRink(){
ctx.fillStyle='#dff7ff';
ctx.fillRect(0,0,canvas.width,canvas.height);
ctx.drawImage(cleanCanvas,0,0);

ctx.strokeStyle='rgba(0,80,180,0.6)';
ctx.lineWidth=4;
ctx.beginPath();
ctx.arc(500,300,80,0,Math.PI*2);
ctx.stroke();

ctx.beginPath();
ctx.moveTo(500,0);
ctx.lineTo(500,600);
ctx.stroke();
}

function drawMachine(){
ctx.save();
ctx.translate(machine.x,machine.y);
ctx.rotate(machine.angle);

ctx.fillStyle='#cc2222';
ctx.fillRect(-35,-19,70,38);

ctx.fillStyle='#77cfff';
ctx.fillRect(5,-14,25,28);

ctx.restore();
}

function cleanIce(){
cleanCtx.save();
cleanCtx.translate(machine.x,machine.y);
cleanCtx.rotate(machine.angle);
cleanCtx.fillStyle='rgba(160,230,255,0.8)';
cleanCtx.fillRect(-45,-28,90,56);
cleanCtx.restore();
}

function calculateCleanedPercent(){
const img=cleanCtx.getImageData(0,0,canvas.width,canvas.height);
let count=0;
for(let i=3;i<img.data.length;i+=4){
if(img.data[i]>0) count++;
}
return Math.min(100,Math.round(count/(canvas.width*canvas.height)*100));
}

function loop(){
update();
updateTimer();
drawIceRink();
drawMachine();
requestAnimationFrame(loop);
}
loop();