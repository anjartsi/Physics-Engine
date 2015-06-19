var canvas = document.getElementById('actionCanvas');
var ctx = canvas.getContext('2d');
var canvasHeight = 500
var canvasWidth= 500*1.618034 //Estimation of the golden ratio
canvas.height=canvasHeight;
canvas.width=canvasWidth;
ctx.translate(0,canvasHeight);
ctx.scale(1,-1);

/*****
Adding gridlines as a background image
*****/
var gridlines = document.createElement('canvas');
gridlines.height=canvasHeight;
gridlines.width=canvasWidth;
var glctx=gridlines.getContext('2d');

var gridLinePosition=1;
glctx.strokeStyle='rgba(150,150,150,1)';
glctx.setLineDash([2,2])
glctx.beginPath();
glctx.translate(0,0);
while(gridLinePosition<canvasWidth) {
	glctx.moveTo(gridLinePosition,0);
	glctx.lineTo(gridLinePosition,canvasHeight);
	glctx.stroke();
	gridLinePosition+=25;
}
gridLinePosition=1
while(gridLinePosition<canvasHeight) {
	glctx.moveTo(0,gridLinePosition);
	glctx.lineTo(canvasWidth,gridLinePosition);
	glctx.stroke();
	gridLinePosition+=25;
}// End of Gridline Code

// Time Variables\
var elapsedTime=0; // In milliseconds
var t1;
var t2;
var dt; //milliseconds

var timing = function() {
	t2 = new Date();
	dt = t2 - t1;
	t1 = t2;
	elapsedTime +=dt;
}


var playing = null;

var drawEverything = function() {
	if(playing){
		ctx.clearRect(0,0,809,500);
		ctx.drawImage(gridlines,0,0);	 
		timing();

		for (var i=0;i<allThings.length;i++) {
			// Draw Everything
			allThings[i].draw(ctx);
			if(allThings[i] instanceof Mobile){
				// Check for collisions against each immobile object
				for(var j=0;j<allImmobiles.length;j++) {
					allImmobiles[j].checkForCollisions(allThings[i]);
				}
				// Change properties of each mobile object
				allThings[i].incrementTime(dt);
			};
		};
		window.requestAnimationFrame(drawEverything);
	}
}

var minX = 100;
var play = function() {
	playing =true;
	t1 = new Date();
	t2 = new Date();	
	window.requestAnimationFrame(drawEverything);
	console.log('playing')
}

var pause = function() {
	playing = null;
}

var oneFrameForward = function() {
	if(!playing){
		dt=17;
		elapsedTime +=dt;
		ctx.clearRect(0,0,809,500);
		ctx.drawImage(gridlines,0,0);	 
		for (var i=0;i<allThings.length;i++) {
			// Draw Everything
			allThings[i].draw(ctx);
			if(allThings[i] instanceof Mobile){
				// Check for collisions against each immobile object
				for(var j=0;j<allImmobiles.length;j++) {
					allImmobiles[j].checkForCollisions(allThings[i]);
				}
				// Change properties of each mobile object
				allThings[i].incrementTime(dt);
			};
		};
	}
}

document.getElementById('playButton').addEventListener('mousedown', play);
document.getElementById('pauseButton').addEventListener('mousedown', pause);
document.getElementById('oneFrameForwardButton').addEventListener('mousedown', oneFrameForward);