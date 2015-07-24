// Array containing all the objects that exist
var allThings = [];
var allMobiles = [];
var allImmobiles = [];

/*****************************************************************************************************
THINGS
If it's a thing, it belongs here
*****************************************************************************************************/
var Thing = function(x,y) {
	// Position and mass
	this.posX = x;
	this.posY = y;
	this.m = 1;
	// Shape
	this.shap=''
	this.path = new Path2D();
	this.bigness = 10;
}

Thing.prototype.draw = function(ctx) {
	ctx.save();
	ctx.strokeStyle='black';
	ctx.fillStyle = this.col;
	ctx.stroke(this.path);
	ctx.fill(this.path);
	ctx.restore;
}
Thing.prototype.initialize = function() {
	allThings.push(this);
}

/*****************************************************************************************************
MOBILE
Objects that move
So far they are only square-shaped
*****************************************************************************************************/
var Mobile = function(x, y) {
	Thing.call(this,x,y);
	// Position
	this.posX = x;
	this.posY = y;
	// Velocity
	this.vx = 0;
	this.vy = 0;
	// Whether the object will undergo a collision between this frame and next frame
	this.willCollideX = false; 
	this.willCollideY = false;
	
	this.bounced=false;//trial
	this.bouncedOff;//trial
	// Mass and Force
	this.m = 1;
	this.fx = 0;
	this.fy = 0;
	// Shape
	this.shap='square'
	this.path = new Path2D();
	// Half side length
	this.bigness = 20;

	this.dataT = [];
	this.dataPos = [];
	this.dataV = [];
	this.dataF = [];
}
/*************
MOBILE Methods
*************/
Mobile.prototype = Object.create(Thing.prototype)
Mobile.prototype.constructor = Mobile;
// First method that should be called for each object. 
// Adds the object to the list(s) it belongs to.
// Creates the path for the object's shape .
Mobile.prototype.initialize = function() {
	allThings.push(this);
	allMobiles.push(this);
}

Mobile.prototype.makePath = function() {
	this.path= new Path2D();
	if (this.shap=='square') {
		this.path.rect((this.posX-this.bigness),(this.posY-this.bigness),(2*this.bigness),(2*this.bigness))
	}
}

// Draws the object based on its color and path
Mobile.prototype.draw = function(ctx) {
	this.makePath();
	ctx.save();
	ctx.strokeStyle='black';
	ctx.fillStyle = this.col;
	ctx.stroke(this.path);
	ctx.fill(this.path);
	ctx.restore();
}

Mobile.prototype.addText = function() {
	ctx.save();
	ctx.fillStyle='black';
	ctx.translate(this.posX,this.posY);
	ctx.textAlign='center'
	ctx.scale(1,-1);
	ctx.fillText('( '+this.posX+' , '+this.posY+' )',0,0)
	ctx.restore();
}

// Changes all the properties of the mobile object after each time increment
Mobile.prototype.incrementTime = function(dt) {
	if(this.vx&&!this.bounced){this.posX+= this.vx*(dt/1000);}
	if(this.vy){this.posY+= this.vy*(dt/1000);}
	if(this.fx&&!this.bounced){this.vx+=this.fx/this.m*dt/1000;}
	if(this.fy){this.vy+=this.fy/this.m*dt/1000;}
	// Clear this property because the bounce was already handled
	this.bouncedOff=null;
	this.bounced = false;
};

// Checks for collisions and sets the willCollideX or willCollideY to true if there is a collision 
Mobile.prototype.checkForCollisions = function(otherObject,dt) {
	// Right Edge
	if(this.posX+this.bigness<=otherObject.posX-otherObject.bigness&&this.posX+this.bigness+this.vx*dt>=otherObject.posX-otherObject.bigness) {console.log('collide')}
	// Left Edge

	// Top Edge

	// Bottom Edge
}

Mobile.prototype.record = function() {
	this.dataT.push(elapsedTime);
	this.dataPos.push(this.posX);
	this.dataV.push(this.vx);
	this.dataF.push(this.fx);
}

// If an object collides with another object, it bounces back
Mobile.prototype.bounce = function(x,y,otherObject) {
	this.bounced =true; 
	this.bouncedOff = otherObject;
	var oldX = this.posX;
	if(x) {
		this.vx *= -1;
		// Was going RIGHT when it bounced
		if(this.bouncedOff.posX>this.posX){
			// Change the position of the mobile object so it touches the edge of the otherObject
			this.posX = this.bouncedOff.posX-this.bouncedOff.thickness-this.bigness;

			// Use conservation of energy to adjust the velocity accordingly
			this.vx = -Math.sqrt(this.vx*this.vx+2*this.fx*oldX/this.m-2*this.fx*this.posX/this.m)
			}
			// Was going LEFT when it bounced
			else {
				// this.posX = this.bouncedOff.posX+this.bouncedOff.thickness+this.bigness;
			}
	}
	if(y) {this.vy *= -1;}

}

Mobile.prototype.kineticE = function() {
	return 0.5*this.m*this.vx*this.vx;
}

Mobile.prototype.potentialE =function() {
	return 1*this.fx*this.posX;
}

Mobile.prototype.totalE = function() {
	return this.kineticE() + this.potentialE();
}
/*****************************************************************************************************
IMMOBILE
Objects that don't move
Walls and Platforms
*****************************************************************************************************/
var Immobile = function(x, y, bigness) {
	Thing.call(this,x,y)

	this.posX = x;
	this.posY = y;	
	this.m = Infinity;
	// Shape --> Can be wall or platform
	this.shap='';
	this.path = new Path2D();
	// bigness--> Height of a wall or width of a platform
	if(bigness==undefined){this.bigness=200}

	this.col = 'black';
}

Immobile.prototype = Object.create(Thing.prototype)
Immobile.prototype.constructor = Immobile;
Immobile.prototype.initialize = function() {
	allThings.push(this);
	allImmobiles.push(this);
}

/*********
Walls
Vertical Immobile Objects
*********/
var Wall = function(x,y,bigness) {
	Immobile.call(this,x,y,bigness);
	// Position
	this.posX = x;
	this.posY = y;
	// Shape
	this.path = new Path2D();
	this.bigness = bigness; //Height of the wall
	if(bigness==undefined){this.bigness=200}
	this.thickness = 2;
}
Wall.prototype = Object.create(Immobile.prototype)
Wall.prototype.constructor = Wall;

Wall.prototype.initialize = function() {
	allThings.push(this);
	allImmobiles.push(this);
	this.path.moveTo(this.posX-this.thickness,this.posY);
	this.path.lineTo(this.posX+this.thickness,this.posY);
	this.path.lineTo(this.posX+this.thickness,this.posY+this.bigness);
	this.path.lineTo(this.posX-this.thickness,this.posY+this.bigness);
	this.path.closePath();
}

Wall.prototype.draw = function(ctx) {
	ctx.strokeStyle='black';
	ctx.fillStyle = this.col;
	ctx.stroke(this.path);
	ctx.fill(this.path);
}

Wall.prototype.checkForCollisions = function(mobile) {
	// Mobile object going to the right
	var rightEdgeNow = mobile.posX+mobile.bigness;
	var rightEdgeFuture = rightEdgeNow + mobile.vx*dt/1000;
	
	var leftEdgeNow = mobile.posX - mobile.bigness;
	var leftEdgeFuture = leftEdgeNow + mobile.vx*dt/1000;

	if(rightEdgeNow<=this.posX-this.thickness && rightEdgeFuture>=this.posX-this.thickness) {
		mobile.bounce(true,false,this);
	}
	// Mobile Object going to the left
	else if(leftEdgeNow>=this.posX+this.thickness && leftEdgeFuture<=this.posX+this.thickness){
		mobile.bounce(true,false,this);
	}
}

/*********
Platforms
*********/
var Platform = function(x,y,bigness) {
	Immobile.call(this,x,y,bigness);
	this.posX = x;
	this.posY = y;
	this.bigness = bigness;
}
Platform.prototype = Object.create(Immobile.prototype)
Platform.prototype.constructor = Platform;
Platform.prototype.checkForCollisions = function(mobile) {
	// Mobile object going up
	if(mobile.topEdge<=this.posY && mobile.topEdge+(mobile.vy*dt/1000)>=this.posY) {
		mobile.bounce(false,true,this);
	}
	// Mobile object going down
	else if(mobile.botEdge>=this.posY+2 && mobile.botEdge+(mobile.vy*dt/1000)<=this.posY+2){
		mobile.bounce(false,true,this);
	}
}
