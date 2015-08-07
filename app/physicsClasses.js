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
	this.bigness = [10,10];
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
	this.edges[0] = this.pos[1]+this.bigness[1]; // top edge
	this.edges[1] = this.pos[0]+this.bigness[0]; // right edge
	this.edges[2] = this.pos[1]-this.bigness[1]; // bottom edge
	this.edges[3] = this.pos[0]-this.bigness[0]; // left edge
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

	// Shape
	this.shap='square'
	this.path = new Path2D();
	// Half side length [horizontal,vertical]
	this.bigness = [20,20];

	// top, right, bottom, left edges
	this.edges = [];
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
	this.edges[0] = this.pos[1]+this.bigness[1]; // top edge
	this.edges[1] = this.pos[0]+this.bigness[0]; // right edge
	this.edges[2] = this.pos[1]-this.bigness[1]; // bottom edge
	this.edges[3] = this.pos[0]-this.bigness[0]; // left edge
}

Mobile.prototype.makePath = function() {
	this.path= new Path2D();
	if (this.shap=='square') {
		this.path.rect(this.edges[3],this.edges[2],(2*this.bigness[0]),(2*this.bigness[1]));
		
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
		if(this.v[i]&&!this.willCollide[i]) {this.pos[i]+= this.v[i]*(dt/1000)+this.f[i]/this.m*dt*dt/1000000;}
		if(this.f[i]&&!this.willCollide[i]) {this.v[i]+=this.f[i]/this.m*dt/1000;}
	}

	this.willCollide = [false, false];
};

// Checks for collisions and sets the willCollideX or willCollideY to true if there is a collision 
Mobile.prototype.checkForCollisions = function(otherObject,dt) {
	/**
		Example of this if statement, assume the object is travelling to the right:
		If the right edge of the object is to the left of the otherObject
		AND if the right edge of the object in the NEXT instance (after adding velocity and acceleration)
		will be to the right of the otherObject, then there is a collision
	**/
	var edgeNow;
	var edgeFuture;
	for(var i = 0;i<this.edges.length;i++) {
		//Top edge and right edge
		if((this.edges[i]<=otherObject.edges[(i+2)%4]) && (this.edges[i]+this.v[(i+1)%2]*dt/1000+this.f[(i+2)%2]/this.m*dt*dt/1000000>=otherObject.edges[(i+2)%4]+otherObject.v[(i+1)%2]*dt/1000+otherObject.f[(i+2)%2]/otherObject.m*dt*dt/1000000)) {
			this.willCollide[(i+1)%2]= true;
			this.collide(otherObject,i,dt,1);
			// if(otherObject instanceof Immobile) {console.log(this.edges[i]+' , '+otherObject.edges[(i+2)%4]);}
		}
		// Bottom edge and left edge
		else if ((this.edges[i]>=otherObject.edges[(i+2)%4]) && (this.edges[i]+this.v[(i+1)%2]*dt/1000+this.f[(i+2)%2]/this.m*dt*dt/1000000<=otherObject.edges[(i+2)%4]+otherObject.v[(i+1)%2]*dt/1000+otherObject.f[(i+2)%2]/otherObject.m*dt*dt/1000000)) {
			this.willCollide[(i+1)%2]= true;
			this.collide(otherObject,i,dt,-1);
			// if(otherObject instanceof Immobile) {console.log(this.edges[i]+' , '+otherObject.edges[(i+2)%4]);}
		}	
	}
}

// Elastic collision
// input: side is the index of the edges array that had the collision
// input: dir is the direction of collision. +1 if it's up or to the right, -1 otherwise
Mobile.prototype.collide = function(otherObject,side,dt,dir) {
	var xv = (side+1)%2;	// the index of the position/velocity/acceleration arrays
	var otherObjEdge = (side+2)%4;	// the index of the other object's edge

	var dx = 0; 	// The distance between this object and the other in the last instance BEFORE the collision
	var dtPrime = 0;	// The small amount of time required for this object to collide (MUST be less than dt)
	var dtLeft = 0;	// The remaining time out of dt that this object would be travelling in the new direction
	
	dx = Math.abs(this.edges[side]-otherObject.edges[otherObjEdge])
	dtPrime = Math.abs(1000*dx/(this.v[xv]));
	dtLeft = dt-dtPrime;

	if(otherObject instanceof Immobile) {
		this.pos[xv] = otherObject.edges[otherObjEdge] - dir*Math.abs(dtLeft*this.v[xv]/1000) - dir*dtLeft*dtLeft*this.f[xv]/this.m/1000000 - dir*this.bigness[xv];

		this.v[xv] += dir*Math.abs(this.f[xv]/this.m*dtPrime/1000) + dir*Math.abs(this.f[xv]/this.m*dtLeft/1000) ;

		this.v[xv] *= -1;	
	}

// Don't forget to conserve momentum and KE
	else if (otherObject instanceof Mobile) {
		var v1 = this.v[xv];
		var v2 = otherObject.v[xv];
		var mu = otherObject.m/this.m;

		this.pos[xv] = otherObject.edges[otherObjEdge] - dir * Math.abs(dtLeft*this.v[xv]/1000) - dir*dtLeft*dtLeft*this.f[xv]/this.m/1000000 - dir*this.bigness[xv];

		var v1fa = v1 + mu*v2 - mu*((v1+mu*v2)/(1+mu) - dir* Math.sqrt( (v2*v2*(1-mu) - 2*v1*v2)/(1+mu)+ Math.pow(((v1+mu*v2)/1+mu),2) ));

		var v1fb = v1 + mu*v2 - mu*((v1+mu*v2)/(1+mu) + dir* Math.sqrt( (v2*v2*(1-mu) - 2*v1*v2)/(1+mu)+ Math.pow(((v1+mu*v2)/1+mu),2) ));

		var v2fa = v1/mu+v2-v1fa/mu;
		var v2fb = v1/mu+v2-v1fb/mu;

		if(v1fa == v1) {
			this.v[xv] = -1* v1fb;
			otherObject.v[xv] = -1*v2fb;
		}

		else {
			this.v[xv] = -1* v1fa;
			otherObject.v[xv] = -1*v2fa;
		}
		otherObject.willCollide[otherObjEdge] = false;
	}

	else {
		this.willCollide[xv] = false;
	}
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
	this.v = [0,0];
	this.f = [0,0];
	this.m = Infinity;
	// Shape --> Can be wall or platform
	this.shap='';
	this.path = new Path2D();
	// bigness--> Height of a wall or width of a platform
	if(bigness==undefined) {this.bigness=[10,10]}

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
	this.bigness = [2,bigness]; //bigness is the height of the wall, the width is 2 by default
	if(bigness==undefined){this.bigness=[200,2]}
}

Wall.prototype = Object.create(Immobile.prototype)
Wall.prototype.constructor = Wall;

Wall.prototype.setEdges = function() {
	this.edges[0] = this.pos[1]+this.bigness[1]; // top edge
	this.edges[1] = this.pos[0]+this.bigness[0]; // right edge
	this.edges[2] = this.pos[1]; // bottom edge
	this.edges[3] = this.pos[0]-this.bigness[0]; // left edge
}

Wall.prototype.initialize = function() {
	this.setEdges();
	allThings.push(this);
	allImmobiles.push(this);
	this.path.rect(this.edges[3],this.edges[2],(2*this.bigness[0]),(this.bigness[1]));

}


Wall.prototype.draw = function(ctx) {
	ctx.strokeStyle='black';
	ctx.fillStyle = this.col;
	ctx.stroke(this.path);
	ctx.fill(this.path);
}

/*********
Platforms
*********/
var Platform = function(x,y,bigness) {
	Immobile.call(this,x,y,bigness);
	// Position
	this.pos[0] = x;
	this.pos[1] = y;
	// Shape
	this.path = new Path2D();
	this.bigness = [bigness,2]; //bigness is the length of the Platform. the height is 2 by default
	if(bigness==undefined) {this.bigness=[2,200]}
}
Platform.prototype = Object.create(Immobile.prototype)
Platform.prototype.constructor = Platform;

Platform.prototype.setEdges = function() {
	this.edges[0] = this.pos[1]+this.bigness[1]; // top edge
	this.edges[1] = this.pos[0]+this.bigness[0]; // right edge
	this.edges[2] = this.pos[1]-this.bigness[1]; // bottom edge
	this.edges[3] = this.pos[0]; // left edge
}

Platform.prototype.initialize = function() {
	this.setEdges();
	allThings.push(this);
	allImmobiles.push(this);
	this.path.rect(this.edges[3],this.edges[2],(this.bigness[0]),(2*this.bigness[1]));

}


Platform.prototype.draw = function(ctx) {
	ctx.strokeStyle='black';
	ctx.fillStyle = this.col;
	ctx.stroke(this.path);
	ctx.fill(this.path);
}