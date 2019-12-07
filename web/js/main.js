var ctx=canvas.getContext('2d');

var ws=new WebSocket("ws://"+document.location.host+":8080");

var drawfunction=function(){};

ws.onmessage=function(msg)
{
	msg=msg.data;
	if(msg=="ping")
	{
		ws.send("pong");
	}
	else if(msg.indexOf("eval")==0)
	{
		try
		{
			(1,eval)(msg.substr(4));
		}
		catch(e)
		{
			console.log(e);
		}
	}
	else
	{
		gamedata=JSON.parse(msg);
	}
}

var gamedata=
{
	object:[],
	collision:[],
	particle:[],
	sound:[]
};

var spriteloadcount=0;
var spritelist=[
"./image/background_tile.png",
"./image/chain.png",
"./image/jump.png",
"./image/left.png",
"./image/map_tiles.png",
"./image/right.png",
"./image/shadowPartner.png",
"./image/teleport.png",
"./image/TexturePack.png"
];
var sprite=[];
var spriteonload=function()
{
	spriteloadcount++;
	if(spriteloadcount==spritelist.length)
	{
		resourceload();
	}
};
for(var i=0;i<spritelist.length;i++)
{
	sprite[i]=new Image();
	sprite[i].src=spritelist[i];
	sprite[i].onload=spriteonload;
}

var audioloadcount=0;
var audiolist=[
"./audio/button.ogg",
"./audio/die.ogg",
"./audio/fanfare.ogg",
"./audio/jump.ogg",
"./audio/normalCollision.ogg",
"./audio/star.ogg"
];
var audio=[];
var audioonload=function()
{
	audioloadcount++;
	if(audioloadcount==audiolist.length)
	{
		resourceload();
	}
};
for(var i=0;i<audiolist.length;i++)
{
	audio[i]=new Audio(audiolist[i]);
	audio[i].onload=audioonload;
}

var currenttime;

var resource=2;
var loadresource=0;
function resourceload()
{
	loadresource++;
	if(loadresource==loadresource)
	{
		allresourceload();
	}
}
function allresourceload()
{

ctx.imageSmoothingEnabled=false;

var frametime=new Date().getTime();
var lastframe=1;
var cframe=1;

var lasttime=new Date().getTime();
var htime=new Date().getTime();
currenttime=1;

function loop()
{
	
	for(var y=0;y<15/2;y++)
	{
		for(var x=0;x<25/2;x++)
		{
			ctx.drawImage(sprite[0],x*64,y*64,64,64);
		}
	}
	
	gamedraw();
	cframe++;
	if(frametime+1000<new Date().getTime())
	{
		lastframe=cframe;
		cframe=0;
		frametime=new Date().getTime();
	}
	lasttime=htime;
	htime=new Date().getTime();
	currenttime=htime-lasttime;
	ctx.fillStyle="#000000";
	ctx.fillText(lastframe,20,20);
	ctx.fillText(currenttime,20,40);
	ctx.fillText(currenttime/(1000/40),20,60);
	
	
	if(ws.readyState==ws.OPEN)
	{
		ws.send("movedir"+String(Math.sign((iskeypress(39)-iskeypress(37))||(touchpoint.x==null?0:touchpoint.x>window.innerWidth/2?1:-1))));
	}
	
	requestAnimationFrame(loop);
}
loop();

}

function noevent()
{
	return false;
}

var key=[];
function keydown(e)
{
	key[e.keyCode]=1;
}
function keyup(e)
{
	key[e.keyCode]=0;
}
function iskeypress(n)
{
	return !!key[n];
}

var touchpoint={x:null,y:null};
function touchdown(e)
{
	var touch=e.touches[e.touches.length-1];
	touchpoint.x=touch.clientX;
	touchpoint.y=touch.clientY;
}
function touchup()
{
	touchpoint.x=touchpoint.y=null;
}

function gamedraw()
{
	var o;
	for(var i=0;i<gamedata.object.length;i++)
	{
		o=gamedata.object[i]
		object[o.name](o);
	}
	for(var i=0;i<gamedata.particle.length;i++)
	{
		o=gamedata.particle[i]
		particle[o.name](o);
	}
	for(var i=0;i<gamedata.sound.length;i++)
	{
		playsound(gamedata.sound[i]);
	}
	drawfunction();
}

window.oncontextmenu=noevent;
	
window.onkeydown=keydown;
window.onkeyup=keyup;
window.ontouchstart=touchdown;
window.ontouchmove=touchdown;
window.ontouchend=touchup;