var cluster=require("cluster");

if(cluster.isMaster)
{
	var workers=new Array(4);
	var processs=new Array(4);
	for(var i=processs.length-1;i>=0;i--)
	{
		var worker=cluster.fork();
		if(i==0)
		{
			worker.send("ws");
		}
		else
		{
			worker.send("http");
		}
		processs[i]=(workers[i]=worker).process.pid;
		console.log(`worker${i} pid:${worker.process.pid} process create`);
	}
	cluster.on('exit',function(worker,code,signal)
	{
		var id=processs.indexOf(worker.process.pid);
		console.log(`worker${id} pid:${worker.process.pid} died`);
		if(id==0)
		{
			worker.send("ws");
		}
		else
		{
			worker.send("http");
		}
		processs[id]=(workers[i]=cluster.fork()).process.pid;
	});
	
	const readline=require("readline");
 
	const rl=readline.createInterface(
	{
		input:process.stdin,
		output:process.stdout
	});
 
	rl.setPrompt("> ");
 
	rl.prompt();
	rl.on("line",(data)=>
	{
		workers[0].send("eval"+data);
		rl.prompt();
	});
}
else
{
	process.on('message',function(e)
	{
        if(e=="http")
		{
			require("./httpserver.js");
		}
		else if(e=="ws")
		{
			require("./websocketserver.js");
		}
		
		if(e.indexOf("eval")==0)
		{
			sendevalall(e);
		}
    });
}