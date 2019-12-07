var canvas=document.getElementById("canvas");

(window.onresize=function()
{
	var ww=window.innerWidth/800;
	var hh=window.innerHeight/450;
	canvas.style.width=800*Math.min(ww,hh)+"px";
	canvas.style.height=450*Math.min(ww,hh)+"px";
})();

function drawnormalblock(id,x,y)
{
	ctx.drawImage(sprite[4],(id%15)*32,Math.floor(id/15)*32,32,32,x,y,32,32);
}
function drawcustomblock(id,x,y)
{
	x*=32;
	y*=32;
	ctx.drawImage(sprite[9],(id%15)*32,Math.floor(id/15)*32,32,32,x,y,32,32);
}
function drawtexturepack(x,y,ix,iy,iw,ih)
{
	ctx.drawImage(sprite[8],ix,iy,iw,ih,x,y,iw,ih);
}

function playsound(id)
{
	audio[id].currentTime=0;
	try
	{
		audio[id].play();
	}
	catch(e)
	{
		
	}
}

function drawparticle(x,y,img,pf)
{
	ctx.drawImage(sprite[img],pf*32,0,32,32,x,y,32,32);
}

var object=
{
	'Player':function(data)
	{
		with(data)
		{
			drawnormalblock(75,x-17,y-17);
		}
	},
	'NormalBrick':function(data)
	{
		with(data)
		{
			drawnormalblock(index,x,y);
		}
	},
	'JumpBrick':function(data)
	{
		with(data)
		{
			drawnormalblock(31,x,y);
		}
	}
};

var particle=
{
	'jump':function(data)
	{
		with(data)
		{
			ctx.translate(x,y);
			ctx.rotate(angle);
			drawparticle(0,0,2,Math.floor(frm/3));
			ctx.rotate(-angle);
			ctx.translate(-x,-y);
		}
	}
};