var accelx = 0;
var accely = 0;
var velx = 500;
var vely = 0;


var redX = canvasWidth/2-100;
var blueX =  canvasWidth/2+100;
var redY = canvasHeight/2+50;
var blueY = canvasHeight/2+50;

var yellowX = canvasWidth/2-100;
var greenX =  canvasWidth/2+100;
var yellowY = canvasHeight/2-50;
var greenY = canvasHeight/2-50;

var shadow = new Thing(redX,redY);
shadow.bigness=25;
shadow.col='black';
shadow.path.rect((shadow.pos[0]-shadow.bigness),(shadow.pos[1]-shadow.bigness),(2*shadow.bigness),(2*shadow.bigness))
shadow.initialize();

var shadow2 = new Thing(blueX,blueY);
shadow2.bigness=25;
shadow2.col='black';
shadow2.path.rect((shadow2.pos[0]-shadow2.bigness),(shadow2.pos[1]-shadow2.bigness),(2*shadow2.bigness),(2*shadow2.bigness))
shadow2.initialize();

var shadow3 = new Thing(yellowX,yellowY);
shadow3.bigness=25;
shadow3.col='black';
shadow3.path.rect((shadow3.pos[0]-shadow3.bigness),(shadow3.pos[1]-shadow3.bigness),(2*shadow3.bigness),(2*shadow3.bigness))
shadow3.initialize();

var shadow4 = new Thing(greenX,greenY);
shadow4.bigness=25;
shadow4.col='black';
shadow4.path.rect((shadow4.pos[0]-shadow4.bigness),(shadow4.pos[1]-shadow4.bigness),(2*shadow4.bigness),(2*shadow4.bigness))
shadow4.initialize();

var red = new Mobile(redX,redY);
red.bigness = [25,25];
red.m = 1;
red.v= [velx,-vely];
red.f=[accelx,-accely]
red.shap='square';
red.col='red';
red.initialize();

var blue = new Mobile(blueX,blueY);
blue.bigness = [25,25];
blue.m = 1;
blue.v= [-velx*2,-vely];
blue.f=[-accelx,-accely]
blue.shap='square';
blue.col='blue';
// blue.initialize();
// 
var yellow = new Mobile(yellowX,yellowY);
yellow.bigness = [25,25];
yellow.m = 1;
yellow.v= [velx,vely];
yellow.f=[accelx,accely]
yellow.shap='square';
yellow.col='yellow';
// yellow.initialize();

var green = new Mobile(greenX,greenY);
green.bigness = [25,25];
green.m = 1;
green.v= [-velx,vely];
green.f=[-accelx,accely]
green.shap='square';
green.col='green';
// green.initialize();


var wall = new Wall(23,25,canvasHeight-50);
wall.initialize();

var wall2 = new Wall(canvasWidth-23,25,canvasHeight-50);
wall2.initialize();

var wall3 = new Wall(400,10,canvasHeight-300);
wall3.initialize();

var floor = new Platform(25,23,canvasWidth-50);
floor.initialize();

var ceiling = new Platform(25,canvasHeight-23,canvasWidth-50);
ceiling.initialize();


// Draw everything 
if(gl) {ctx.drawImage(gridlines,0,0);}
for (var i = 0; i < allThings.length; i++) {
	allThings[i].draw(ctx);
};
showTime(ctx,elapsedTime);