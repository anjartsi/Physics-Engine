var red = new Mobile(300,200);
red.bigness = 25;
red.vx= 0;
red.vy=0;
// red.fy=-98;
red.fx = 1000;
red.shap='square';
red.col='red';
red.initialize();

// var blue = new Mobile(10,10);
// blue.bigness = 50;
// blue.vx= 250;
// blue.vy=250;
// blue.shap='circle';
// blue.col='blue';
// blue.initialize();


var wall = new Wall(10,10,canvasHeight-20);
wall.initialize();

var wall2 = new Wall(510,10,canvasHeight-20);
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
