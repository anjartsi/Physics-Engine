var shadow = new Thing(300,200);
shadow.bigness=25;
shadow.col='';
shadow.path.rect((shadow.posX-shadow.bigness),(shadow.posY-shadow.bigness),(2*shadow.bigness),(2*shadow.bigness))
shadow.initialize();

var red = new Mobile(300,200);
red.bigness = 25;
red.mass=1;
red.vx= 0;
red.vy=0;
// red.fy=-98;
red.fx = 1000;
red.shap='square';
red.col='red';
red.initialize();



var wall = new Wall(10,10,canvasHeight-20);
wall.initialize();

var wall2 = new Wall(505,10,canvasHeight-20);
wall2.initialize();

var wall3 = new Wall(760,10,canvasHeight-20);
wall3.initialize();

// var floor = new Immobile(10,10);
// floor.shap='platform';
// floor.initialize();

// var ceiling = new Immobile(10,450);
// ceiling.shap='platform';
// ceiling.initialize();

// Draw everything 
ctx.drawImage(gridlines,0,0);		
for (var i = 0; i < allThings.length; i++) {
	allThings[i].draw(ctx);
};
