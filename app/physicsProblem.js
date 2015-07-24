var shadow = new Thing(300,200);
shadow.bigness=25;
shadow.col='black';
shadow.path.rect((shadow.pos[0]-shadow.bigness),(shadow.pos[1]-shadow.bigness),(2*shadow.bigness),(2*shadow.bigness))
shadow.initialize();

var red = new Mobile(300,200);
red.bigness = 25;
red.m = 1;
red.v= [100,00];
red.f=[0,-500]
red.shap='square';
red.col='red';
red.initialize();



var wall = new Wall(210,10,canvasHeight-20);
wall.initialize();

var wall2 = new Wall(502,10,canvasHeight-20);
wall2.initialize();

var wall3 = new Wall(760,10,canvasHeight-20);
wall3.initialize();

var floor = new Platform(10,8,canvasWidth-20);
floor.initialize();

var ceiling = new Platform(10,canvasHeight-20,canvasWidth-20);
ceiling.initialize();


// Draw everything 
ctx.drawImage(gridlines,0,0);		
for (var i = 0; i < allThings.length; i++) {
	allThings[i].draw(ctx);
};
