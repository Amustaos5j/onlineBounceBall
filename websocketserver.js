var gamedata=
{
	object:[],
	collision:[],
	particle:[],
	sound:[]
};

function pointlength(x1,y1,x2,y2)
{
	return Math.sqrt(Math.pow(x1-x2,2)+Math.pow(y1-y2,2));
}

function isWall(target)
{
	for(var i=0;i<gamedata.collision.length;i++)
	{
		var o=gamedata.collision[i];
		if(o.name=="Player")
		{
			if(target.x-o.size<=o.x&&target.x+32+o.size>=o.x&&target.y-o.size<=o.y&&target.y+32+o.size>o.y)
			{
				var fourpointlength=
				[
					pointlength(o.x,o.y,target.x+16,target.y-o.size),
					pointlength(o.x,o.y,target.x+32+o.size,target.y+16),
					pointlength(o.x,o.y,target.x+16,target.y+32+o.size),
					pointlength(o.x,o.y,target.x-o.size,target.y+16)
				];
				var min=0;
				for(var i=1;i<4;i++)
				{
					min=fourpointlength[min]<fourpointlength[i]?min:i;
				}
				
				if(min==0)
				{
					o.physical.v.speedv=-4.2;
					o.y=target.y-o.size;
					gamedata.sound.push(4);
				}
				if(min==1)
				{
					o.physical.v.speed=o.physical.c.bspeed;
					o.x=target.x+32+o.size;
					gamedata.sound.push(4);
				}
				if(min==2)
				{
					o.physical.v.speedv=0;
					o.y=target.y+32+o.size;
					gamedata.sound.push(4);
				}
				if(min==3)
				{
					o.physical.v.speed=-o.physical.c.bspeed;
					o.x=target.x-o.size;
					gamedata.sound.push(4);
				}
			}
		}
	}
}

function isJump(target,power)
{
	for(var i=0;i<gamedata.collision.length;i++)
	{
		var o=gamedata.collision[i];
		if(o.name=="Player")
		{
			if(target.x-o.size<=o.x&&target.x+32+o.size>=o.x&&target.y-o.size<=o.y&&target.y+32+o.size>o.y)
			{
				var fourpointlength=
				[
					pointlength(o.x,o.y,target.x+16,target.y-o.size),
					pointlength(o.x,o.y,target.x+32+o.size,target.y+16),
					pointlength(o.x,o.y,target.x+16,target.y+32+o.size),
					pointlength(o.x,o.y,target.x-o.size,target.y+16)
				];
				var min=0;
				for(var i=1;i<4;i++)
				{
					min=fourpointlength[min]<fourpointlength[i]?min:i;
				}
				
				if(min==0)
				{
					o.physical.v.speedv=power;
					o.y=target.y-o.size;
					gamedata.sound.push(3);
					new particle.jump(
					{
						x:target.x+16,
						y:target.y+48,
						angle:0,
						type:2
					});
				}
				if(min==1)
				{
					o.physical.v.speed=o.physical.c.bspeed;
					o.x=target.x+32+o.size;
					gamedata.sound.push(4);
				}
				if(min==2)
				{
					o.physical.v.speedv=0;
					o.y=target.y+32+o.size;
					gamedata.sound.push(4);
				}
				if(min==3)
				{
					o.physical.v.speed=-o.physical.c.bspeed;
					o.x=target.x-o.size;
					gamedata.sound.push(4);
				}
			}
		}
	}
}

var object=
{
	Player:function(data)
	{
		this.id=data.id;
		this.name="Player";
		this.x=data.x;
		this.y=data.y;
		this.fx=data.x;
		this.fy=data.y;
		this.xcenter=-17;
		this.ycenter=-17;
		this.px=0;
		this.py=0;
		this.size=7;
		this.isdie=false;
		this.movedir=0;
		
		this.physical=
		{
			c:
			{
				speed:0.2,
				maxspeed:2.1,
				bspeed:1.5
			},
			v:
			{
				speed:0,
				speedv:0
			}
		};
		
		this.die=function()
		{
			this.isdie=true;
			gamedata.sound.push(1);
			setTimeout(function(o)
			{
				o.x=o.fx;
				o.y=o.fy;
				o.physical=
				{
					c:
					{
						speed:0.2,
						maxspeed:2.1,
						bspeed:1.5
					},
					v:
					{
						speed:0,
						speedv:0
					}
				};
				o.isdie=false;
			},1000,this);
		};
	
		this.step=function()
		{
			var sp=Math.sign(this.movedir);
			this.physical.v.speed+=sp*this.physical.c.speed;
		
			if(sp)
			{
				this.physical.v.speed=Math.min(Math.max(-this.physical.c.maxspeed,this.physical.v.speed),this.physical.c.maxspeed);
			}
			else
			{
				this.physical.v.speed-=Math.sign(this.physical.v.speed)*(1/10);
				if(Math.abs(this.physical.v.speed)<1/10)
				{
					this.physical.v.speed=0;
				}
			}
			
			this.physical.v.speedv+=0.2;
		};
		
		this.laststep=function()
		{
			this.px=this.x;
			this.py=this.y;
			this.x+=this.physical.v.speed;
			this.y+=this.physical.v.speedv;
			if(this.y>480+32&&!this.isdie)
			{
				this.die();
				return;
			}
		};
	
		gamedata.object.push(this);
		
		gamedata.collision.push(this);
	
		return this;
	},
	NormalBrick:function(data)
	{
		this.name="NormalBrick";
		var x=this.x=data.x;
		var y=this.y=data.y;
		this.index=data.index;
		this.dir=Math.random()*Math.PI*2;
	
		this.step=function()
		{/*
			this.x=x+Math.sin(this.dir)*3;
			this.y=y+Math.cos(this.dir)*3;
			this.dir+=Math.random()/4;*/
		};
		
		this.laststep=function()
		{
			isWall(this);
		};
	
		this.draw=function(ctx)
		{
			drawnormalblock(this.index,this.x,this.y);
		};
	
		gamedata.object.push(this);
	
		return this;
	},
	JumpBrick:function(data)
	{
		this.name="JumpBrick";
		this.x=data.x;
		this.y=data.y;
	
		this.step=function()
		{
			
		};
		
		this.laststep=function()
		{
			isJump(this,-6.6);
		};
	
		gamedata.object.push(this);
	
		return this;
	}
};

var particle=
{
	jump:function(data)
	{
		this.name="jump";
		this.x=data.x-16;
		this.y=data.y-16;
		this.angle=data.angle;
		this.type=data.type;
		this.frm=0;
		this.maxfrm=12;
		
		this.step=function()
		{
			this.frm++;
		};
		
		gamedata.particle.push(this);
		
		return this;
	}
};

function gamestep()
{
	for(var i=0;i<gamedata.object.length;i++)
	{
		gamedata.object[i].step();
	}
}

function gamelaststep()
{
	for(var i=0;i<gamedata.object.length;i++)
	{
		gamedata.object[i].laststep();
	}
}

function gameparticlestep()
{
	for(var i=0;i<gamedata.particle.length;i++)
	{
		gamedata.particle[i].step();
		if(gamedata.particle[i].frm>gamedata.particle[i].maxfrm)
		{
			gamedata.particle.splice(i,1);
			i--;
		}
	}
}

var SocketIOServerPort=8080;

var WebSocket=require("ws");
var wss=WebSocket.Server;
wss=new wss({port:SocketIOServerPort});
var client={};
var life=3;
wss.on("connection",function(ws)
{
	var id=String(new Date().getTime())+String(Math.floor(Math.random()*1000));
	console.log("connect web socket id:"+id);
	client[id]=ws;
	ws.id=id;
	ws.isAlive=life;
	ws.player=new object.Player(
		{
			x:400,
			y:0,
			id:id
		}
	);
	ws.on("message",function(msg)
	{
		if(msg=="pong")
		{
			ws.isAlive=life;
		}
		if(msg.indexOf("movedir")==0)
		{
			msg=msg.substr(7);
			ws.player.movedir=isNaN(Number(msg))?0:Number(msg);
		}
	});
});

sendevalall=function(data)
{
	for(var id in client)
	{
		ws=client[id];
		if(ws.readyState===WebSocket.OPEN)
		{
			ws.send(data);
		}
	}
};

setInterval(function()
{
	gamestep();
	gamelaststep();
	gameparticlestep();
},1000/60);

var binarygamedata;

setInterval(function()
{
	for(var id in client)
	{
		ws=client[id];
		if(ws.readyState===WebSocket.OPEN)
		{
			ws.send(JSON.stringify(gamedata));
		}
	}
	gamedata.sound=[];
},1000/60)

setInterval(function()
{
	for(var id in client)
	{
		ws=client[id];
		if(ws.isAlive==0||ws.readyState===WebSocket.CLOSED)
		{
			console.log("disconnect web socket id:"+ws.id);
			for(var o in gamedata.object)
			{
				if(gamedata.object[o]==ws.player)
				{
					gamedata.object.splice(o,1);
				}
			}
			for(var o in gamedata.collision)
			{
				if(gamedata.collision[o]==ws.player)
				{
					gamedata.collision.splice(o,1);
				}
			}
			for(var o in client)
			{
				if(client[o]==ws)
				{
					delete client[o];
				}
			}
			ws.terminate();
		}
		else if(ws.readyState===WebSocket.OPEN)
		{
			ws.isAlive--;;
			ws.send("ping");
		}
	}
},1000);

var map=[
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,1,0,0],
[0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,1,1,1,1,0],
[0,2,0,0,1,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,1,0,0,0],
[1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,1,0],
[1,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,1,0,0,0,1,0,0,0],
[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0],
[1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,1,0,0,1,0,0,0],
[1,1,2,0,0,1,0,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];
for(var y=0;y<15;y++)
{
	for(var x=0;x<25;x++)
	{
		switch(map[y][x])
		{
			case 1:
				new object.NormalBrick(
					{
						x:x*32,
						y:y*32,
						index:0
					}
				);
			break;
				case 2:
					new object.JumpBrick(
						{
							x:x*32,
							y:y*32,
						}
					);
			break;
		}
	}
}