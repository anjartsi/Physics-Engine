"use strict"
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
	this.pos = [x,y];
	this.m = 1;
	// Shape
	this.shap=''
	this.path = new Path2D();
	this.bigness = 10;
	// Array holding 4 edges of the object, top-right-bottom-left
	this.edges = [];
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
	this.setEdges();
}

Thing.prototype.setEdges = function() {
	this.edges[0] = this.pos[1]+this.bigness; // top edge
	this.edges[1] = this.pos[0]+this.bigness; // right edge
	this.edges[2] = this.pos[1]-this.bigness; // bottom edge
	this.edges[3] = this.pos[0]-this.bigness; // left edge
}
/*****************************************************************************************************
MOBILE
Objects that move
So far they are only square-shaped
*****************************************************************************************************/
var Mobile = function(x, y) {
	Thing.call(this,x,y);
	// Position, Velocity, Force
	this.pos = [x,y];
	this.v = [0,0];
	this.f = [0,0];
	// Mass 
	this.m = 1;

	// Whether the object will undergo a collision between this frame and next frame
	this.willCollide = [false,false]; 
	
	this.bounced=false;//trial
	this.bouncedOff;//trial

	// Shape
	this.shap='square'
	this.path = new Path2D();
	// Half side length
	this.bigness = 20;
	this.edges = [];

	// trial
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
	this.setEdges();
	}

Mobile.prototype.setEdges = function() {
	this.edges[0] = this.pos[1]+this.bigness; // top edge
	this.edges[1] = this.pos[0]+this.bigness; // right edge
	this.edges[2] = this.pos[1]-this.bigness; // bottom edge
	this.edges[3] = this.pos[0]-this.bigness; // left edge
}

Mobile.prototype.makePath = function() {
	this.path= new Path2D();
	if (this.shap=='square') {
		this.path.rect(this.edges[3],this.edges[2],(2*this.bigness),(2*this.bigness));
		
		// Old path without using edges. Remove this if edges don't cause problems
		// this.path.rect((this.pos[0]-this.bigness),(this.pos[1]-this.bigness),(2*this.bigness),(2*this.bigness));
	}
}

// Draws the object based on its color and path
Mobile.prototype.draw = function(ctx) {
	this.setEdges();
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
	ctx.translate(this.pos[0],this.pos[1]);
	ctx.textAlign='center'
	ctx.scale(1,-1);
	ctx.fillText('( '+this.pos[0]+' , '+this.pos[1]+' )',0,0)
	ctx.restore();
}

// Changes all the properties of the mobile object after each time increment
Mobile.prototype.incrementTime = function(dt) {
	// Change the position and velocity
	for(var i = 0;i<this.v.length;i++) {
		if(this.v[i]&&!this.willCollide[i]) {this.pos[i]+= this.v[i]*(dt/1000);}
		if(this.f[i]&&!this.willCollide[i]) {this.v[i]+=this.f[i]/this.m*dt/1000;}
	}
	// Remove this bottom commented code
	// if(this.v[0]&&!this.willCollide[0]){this.pos[0]+= this.v[0]*(dt/1000);}
	// if(this.v[1]){this.pos[1]+= this.v[1]*(dt/1000);}
	// if(this.f[0]&&!this.willCollide[0]){this.v[0]+=this.f[0]/this.m*dt/1000;}
	// if(this.f[1]){this.v[1]+=this.f[1]/this.m*dt/1000;}
	// Clear this property because the bounce was already handled
	this.bouncedOff=null; //trial
	this.bounced = false; //trial

	this.willCollide = [false, false]
	// this.setEdges();
};

// Checks for collisions and sets the willCollideX or willCollideY to true if there is a collision 
Mobile.prototype.checkForCollisions = function(otherObject,dt) {
	for(var i = 0;i<this.edges.length;i++) {
		if((this.edges[i]<=otherObject.edges[(i+2)%4])&&(this.edges[i]+this.v[(i+1)%2]*dt/1000>=otherObject.edges[(i+2)%4])) {
			this.willCollideX = true;
			this.collide(otherObject,i,dt);
			console.log(i);
		}
		else if (2==3) {
			console.log('hi')
		}	
	}

	// // Right Edge
	// if((this.edges[1]<=otherObject.edges[3])&&(this.edges[1]+this.v[0]*dt/1000>=otherObject.edges[3])) {
	// 	this.willCollideX = true;
	// 	this.collide(otherObject,1,dt);
	// }
	// // Left Edge
	// if((this.edges[3]>=otherObject.edges[1])&&(this.edges[3]+this.v[0]*dt/1000<=otherObject.edges[1])) {
	// 	this.willCollideX = true;
	// 	this.collide(otherObject,1,dt);
	// }		
	// Top Edge

	// Bottom Edge
}

Mobile.prototype.record = function() {
	this.dataT.push(elapsedTime);
	this.dataPos.push(this.pos[0]);
	this.dataV.push(this.v[0]);
	this.dataF.push(this.f[0]);
}

// Elastic collision
Mobile.prototype.collide = function(otherObject,side,dt) {
	// The distance between this object and the other in the last instance before their collision
	var dx = 0; 
	// The small amount of time required for this object to collide (MUST be less than dt)
	var dtPrime =0;
	if(otherObject instanceof Immobile) {
		dx = Math.abs(this.edges[side]-otherObject.edges[(side+2)%4])
		// dtPrime = dx/(this.v[0]);
		// console.log(dtPrime);
		this.v[0] *=-1;
	}
	else if (otherObject instanceof Mobile) {

	}
}

// If an object collides with another object, it bounces back
Mobile.prototype.bounce = function(x,y,otherObject) {
	this.bounced =true; 
	this.bouncedOff = otherObject;
	var oldX = this.pos[0];
	if(x) {
		this.v[0] *= -1;
		// Was going RIGHT when it bounced
		if(this.bouncedOff.pos[0]>this.pos[0]){
			// Change the position of the mobile object so it touches the edge of the otherObject
			this.pos[0] = this.bouncedOff.pos[0]-this.bouncedOff.thickness-this.bigness;

			// Use conservation of energy to adjust the velocity accordingly
			this.v[0] = -Math.sqrt(this.v[0]*this.v[0]+2*this.f[0]*oldX/this.m-2*this.f[0]*this.pos[0]/this.m)
			}
			// Was going LEFT when it bounced
			else {
				// this.pos[0] = this.bouncedOff.pos[0]+this.bouncedOff.thickness+this.bigness;
			}
	}
	if(y) {this.v[1] *= -1;}

}

/*****************************************************************************************************
IMMOBILE
Objects that don't move
Walls and Platforms
*****************************************************************************************************/
var Immobile = function(x, y, bigness) {
	Thing.call(this,x,y)

	this.pos[0] = x;
	this.pos[1] = y;	
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
	this.pos[0] = x;
	this.pos[1] = y;
	// Shape
	this.path = new Path2D();
	this.bigness = bigness; //Height of the wall
	if(bigness==undefined){this.bigness=200}
	this.thickness = 2;
}
Wall.prototype = Object.create(Immobile.prototype)
Wall.prototype.constructor = Wall;

Immobile.prototype.setEdges = function() {
	this.edges[0] = this.pos[1]+this.bigness; // top edge
	this.edges[1] = this.pos[0]+this.thickness; // right edge
	this.edges[2] = this.pos[1]; // bottom edge
	this.edges[3] = this.pos[0]-this.thickness; // left edge
}

Wall.prototype.initialize = function() {
	this.setEdges();
	allThings.push(this);
	allImmobiles.push(this);
	this.path.rect(this.edges[3],this.edges[2],(2*this.thickness),(this.bigness));

}


Wall.prototype.draw = function(ctx) {
	ctx.strokeStyle='black';
	ctx.fillStyle = this.col;
	ctx.stroke(this.path);
	ctx.fill(this.path);
}

// This needs to be removed. 
Wall.prototype.checkForCollisions = function(mobile) {
	// Mobile object going to the right
	var rightEdgeNow = mobile.pos[0]+mobile.bigness;
	var rightEdgeFuture = rightEdgeNow + mobile.v[0]*dt/1000;
	
	var leftEdgeNow = mobile.pos[0] - mobile.bigness;
	var leftEdgeFuture = leftEdgeNow + mobile.v[0]*dt/1000;

	if(rightEdgeNow<=this.pos[0]-this.thickness && rightEdgeFuture>=this.pos[0]-this.thickness) {
		mobile.bounce(true,false,this);
	}
	// Mobile Object going to the left
	else if(leftEdgeNow>=this.pos[0]+this.thickness && leftEdgeFuture<=this.pos[0]+this.thickness){
		mobile.bounce(true,false,this);
	}
}

/*********
Platforms
*********/
var Platform = function(x,y,bigness) {
	Immobile.call(this,x,y,bigness);
	this.pos[0] = x;
	this.pos[1] = y;
	this.bigness = bigness;
}
Platform.prototype = Object.create(Immobile.prototype)
Platform.prototype.constructor = Platform;
Platform.prototype.checkForCollisions = function(mobile) {
	// Mobile object going up
	if(mobile.topEdge<=this.pos[1] && mobile.topEdge+(mobile.v[1]*dt/1000)>=this.pos[1]) {
		mobile.bounce(false,true,this);
	}
	// Mobile object going down
	else if(mobile.botEdge>=this.pos[1]+2 && mobile.botEdge+(mobile.v[1]*dt/1000)<=this.pos[1]+2){
		mobile.bounce(false,true,this);
	}
}
