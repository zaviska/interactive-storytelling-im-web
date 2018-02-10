(function (cjs, an) {

var p; // shortcut to reference prototypes
var lib={};var ss={};var img={};
lib.ssMetadata = [];


// symbols:
// helper functions:

function mc_symbol_clone() {
	var clone = this._cloneProps(new this.constructor(this.mode, this.startPosition, this.loop));
	clone.gotoAndStop(this.currentFrame);
	clone.paused = this.paused;
	clone.framerate = this.framerate;
	return clone;
}

function getMCSymbolPrototype(symbol, nominalBounds, frameBounds) {
	var prototype = cjs.extend(symbol, cjs.MovieClip);
	prototype.clone = mc_symbol_clone;
	prototype.nominalBounds = nominalBounds;
	prototype.frameBounds = frameBounds;
	return prototype;
	}


(lib.Tween1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Ebene_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#000000").ss(1,1,1).p("EAq9gfMMAAAA+ZMhV5AAAIAAgH");

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#000000").s().p("Egq8AfNIAAgHMAAAg+SMBV5AAAMAAAA+Zg");

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-275.8,-200.6,551.8,401.4);


(lib.ball = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Ebene_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#000000").ss(0.1,1,1).p("AMaAAQAAFJjoDpQjpDolJAAQlIAAjpjoQjojpAAlJQAAlIDojpQDpjoFIAAQFJAADpDoQDoDpAAFIg");
	this.shape.setTransform(79.4,79.4);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.rf(["#FFFFFF","#000000"],[0,1],0,0,0,0,0,80).s().p("AoxIxQjojoAAlJQAAlIDojpQDpjoFIAAQFJAADoDoQDpDpAAFIQAAFJjpDoQjoDplJAAQlIAAjpjpg");
	this.shape_1.setTransform(79.4,79.4);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

}).prototype = getMCSymbolPrototype(lib.ball, new cjs.Rectangle(-1,-1,160.8,160.8), null);


// stage content:
(lib.ball_glow = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// ball
	this.instance = new lib.ball();
	this.instance.parent = this;
	this.instance.setTransform(268.2,193.4,1,1,0,0,0,79.4,79.4);
	this.instance.shadow = new cjs.Shadow("rgba(255,255,255,1)",0,0,0);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(63));

	// background
	this.instance_1 = new lib.Tween1("synched",0);
	this.instance_1.parent = this;
	this.instance_1.setTransform(274.9,200.4);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).to({startPosition:0},31).to({startPosition:0},1).to({startPosition:0},30).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(274,199.7,551.8,401.4);
// library properties:
lib.properties = {
	id: 'F7B1ABFE477C9F45BD64B028FF93FA67',
	width: 550,
	height: 400,
	fps: 24,
	color: "#FFFFFF",
	opacity: 1.00,
	manifest: [],
	preloads: []
};



// bootstrap callback support:

(lib.Stage = function(canvas) {
	createjs.Stage.call(this, canvas);
}).prototype = p = new createjs.Stage();

p.setAutoPlay = function(autoPlay) {
	this.tickEnabled = autoPlay;
}
p.play = function() { this.tickEnabled = true; this.getChildAt(0).gotoAndPlay(this.getTimelinePosition()) }
p.stop = function(ms) { if(ms) this.seek(ms); this.tickEnabled = false; }
p.seek = function(ms) { this.tickEnabled = true; this.getChildAt(0).gotoAndStop(lib.properties.fps * ms / 1000); }
p.getDuration = function() { return this.getChildAt(0).totalFrames / lib.properties.fps * 1000; }

p.getTimelinePosition = function() { return this.getChildAt(0).currentFrame / lib.properties.fps * 1000; }

an.bootcompsLoaded = an.bootcompsLoaded || [];
if(!an.bootstrapListeners) {
	an.bootstrapListeners=[];
}

an.bootstrapCallback=function(fnCallback) {
	an.bootstrapListeners.push(fnCallback);
	if(an.bootcompsLoaded.length > 0) {
		for(var i=0; i<an.bootcompsLoaded.length; ++i) {
			fnCallback(an.bootcompsLoaded[i]);
		}
	}
};

an.compositions = an.compositions || {};
an.compositions['F7B1ABFE477C9F45BD64B028FF93FA67'] = {
	getStage: function() { return exportRoot.getStage(); },
	getLibrary: function() { return lib; },
	getSpriteSheet: function() { return ss; },
	getImages: function() { return img; }
};

an.compositionLoaded = function(id) {
	an.bootcompsLoaded.push(id);
	for(var j=0; j<an.bootstrapListeners.length; j++) {
		an.bootstrapListeners[j](id);
	}
}

an.getComposition = function(id) {
	return an.compositions[id];
}



})(createjs = createjs||{}, AdobeAn = AdobeAn||{});
var createjs, AdobeAn;