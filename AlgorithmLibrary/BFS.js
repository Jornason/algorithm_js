// Copyright 2011 David Galles, University of San Francisco. All rights reserved.
//
// Redistribution and use in source and binary forms, with or without modification, are
// permitted provided that the following conditions are met:
//
// 1. Redistributions of source code must retain the above copyright notice, this list of
// conditions and the following disclaimer.
//
// 2. Redistributions in binary form must reproduce the above copyright notice, this list
// of conditions and the following disclaimer in the documentation and/or other materials
// provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED BY <COPYRIGHT HOLDER> ``AS IS'' AND ANY EXPRESS OR IMPLIED
// WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
// FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> OR
// CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
// SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
// ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
// NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
// ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
// The views and conclusions contained in the software and documentation are those of the
// authors and should not be interpreted as representing official policies, either expressed
// or implied, of the University of San Francisco

var AUX_ARRAY_WIDTH = 25;
var AUX_ARRAY_HEIGHT = 25;
var AUX_ARRAY_START_Y = 50;

var VISITED_START_X = 475;
var PARENT_START_X = 400;

var HIGHLIGHT_CIRCLE_COLOR = "#000000";
var BFS_TREE_COLOR = "#0000FF";
var BFS_QUEUE_HEAD_COLOR = "#0000FF";


var QUEUE_START_X = 30;
var QUEUE_START_Y = 50;
var QUEUE_SPACING = 30;


function BFS(am)
{
	this.init(am);
	
}

BFS.prototype = new Graph();
BFS.prototype.constructor = BFS;
BFS.superclass = Graph.prototype;

BFS.prototype.addControls =  function()
{
	addLabelToAlgorithmBar("Start Vertex: ");
	this.startField = addControlToAlgorithmBar("Text", "");
	this.startField.onkeydown = this.returnSubmit(this.startField,  this.startCallback.bind(this), 2, true);
	this.startField.size = 2;
	this.startButton = addControlToAlgorithmBar("Button", "Run BFS");
	this.startButton.onclick = this.startCallback.bind(this);
	this.startButton1 = addControlToAlgorithmBar("Button", "Graph Completed");
	this.startButton1.onclick = this.initial_details.bind(this);
	BFS.superclass.addControls.call(this);
	
}	


BFS.prototype.init = function(am, w, h)
{
	this.flag=false;
	showEdgeCosts = false;
	BFS.superclass.init.call(this, am, w, h); // TODO:  add no edge label flag to this?
	this.send_rect_info();
}

BFS.prototype.send_rect_info = function()
{
	BFS.superclass.send_rect_info.call(this,"BFS");
}
BFS.prototype.disable_own = function()
{
	this.startButton.disabled = false;
	this.startButton1.disabled = true;
}
BFS.prototype.disable_default = function()
{
	this.startButton1.disabled = false;
	this.startButton.disabled = true;
}
BFS.prototype.setup = function()
{
	
	this.flag=false;
	if(!this.owning){
	
	BFS.superclass.setup.call(this);
	
	this.messageID = new Array();
	this.commands = new Array();
	this.visitedID = new Array(this.size);
	this.visitedIndexID = new Array(this.size);
	this.parentID = new Array(this.size);
	this.parentIndexID = new Array(this.size);
	
	for (var i = 0; i < this.size; i++)
	{
		this.visitedID[i] = this.nextIndex++;
		this.visitedIndexID[i] = this.nextIndex++;
		this.parentID[i] = this.nextIndex++;
		this.parentIndexID[i] = this.nextIndex++;
		this.cmd("CreateRectangle", this.visitedID[i], "f", AUX_ARRAY_WIDTH, AUX_ARRAY_HEIGHT, VISITED_START_X-125, AUX_ARRAY_START_Y + i*AUX_ARRAY_HEIGHT);
		this.cmd("CreateLabel", this.visitedIndexID[i], i, VISITED_START_X - AUX_ARRAY_WIDTH-125 , AUX_ARRAY_START_Y + i*AUX_ARRAY_HEIGHT);
		this.cmd("SetForegroundColor",  this.visitedIndexID[i], VERTEX_INDEX_COLOR);
		this.cmd("CreateRectangle", this.parentID[i], "", AUX_ARRAY_WIDTH, AUX_ARRAY_HEIGHT, PARENT_START_X-125, AUX_ARRAY_START_Y + i*AUX_ARRAY_HEIGHT);
		this.cmd("CreateLabel", this.parentIndexID[i], i, PARENT_START_X - AUX_ARRAY_WIDTH-125 , AUX_ARRAY_START_Y + i*AUX_ARRAY_HEIGHT);
		this.cmd("SetForegroundColor",  this.parentIndexID[i], VERTEX_INDEX_COLOR);
	}
	this.cmd("CreateLabel", this.nextIndex++, "Parent", PARENT_START_X - AUX_ARRAY_WIDTH-125, AUX_ARRAY_START_Y - AUX_ARRAY_HEIGHT * 1.5, 0);
	this.cmd("CreateLabel", this.nextIndex++, "Visited", VISITED_START_X - AUX_ARRAY_WIDTH-125, AUX_ARRAY_START_Y - AUX_ARRAY_HEIGHT * 1.5, 0);
	this.cmd("CreateLabel", this.nextIndex++, "BFS Queue", QUEUE_START_X, QUEUE_START_Y - 30, 0);
	animationManager.setAllLayers([0, this.currentLayer]);
	animationManager.StartNewAnimation(this.commands);
	animationManager.skipForward();
	animationManager.clearHistory();
	this.highlightCircleL = this.nextIndex++;
	this.highlightCircleAL = this.nextIndex++;
	this.highlightCircleAM= this.nextIndex++;
	
	}
}


BFS.prototype.initial_details = function(event)
{
	this.startButton.disabled = false;
	this.messageID = new Array();
	this.commands = new Array();
	this.visitedID = new Array(this.hit_counter);
	this.visitedIndexID = new Array(this.hit_counter);
	this.parentID = new Array(this.hit_counter);
	this.parentIndexID = new Array(this.hit_counter);
	for (var i = 0; i < this.hit_counter; i++)
	{
		this.visitedID[i] = this.nextIndex++;
		this.visitedIndexID[i] = this.nextIndex++;
		this.parentID[i] = this.nextIndex++;
		this.parentIndexID[i] = this.nextIndex++;
		this.cmd("CreateRectangle", this.visitedID[i], "f", AUX_ARRAY_WIDTH, AUX_ARRAY_HEIGHT, VISITED_START_X-125, AUX_ARRAY_START_Y + i*AUX_ARRAY_HEIGHT);
		this.cmd("CreateLabel", this.visitedIndexID[i], i, VISITED_START_X - AUX_ARRAY_WIDTH-125 , AUX_ARRAY_START_Y + i*AUX_ARRAY_HEIGHT);
		this.cmd("SetForegroundColor",  this.visitedIndexID[i], VERTEX_INDEX_COLOR);
		this.cmd("CreateRectangle", this.parentID[i], "", AUX_ARRAY_WIDTH, AUX_ARRAY_HEIGHT, PARENT_START_X-125, AUX_ARRAY_START_Y + i*AUX_ARRAY_HEIGHT);
		this.cmd("CreateLabel", this.parentIndexID[i], i, PARENT_START_X - AUX_ARRAY_WIDTH-125 , AUX_ARRAY_START_Y + i*AUX_ARRAY_HEIGHT);
		this.cmd("SetForegroundColor",  this.parentIndexID[i], VERTEX_INDEX_COLOR);
	}
	if(this.flag==false){
	this.cmd("CreateLabel", this.nextIndex++, "Parent", PARENT_START_X - AUX_ARRAY_WIDTH-125, AUX_ARRAY_START_Y - AUX_ARRAY_HEIGHT * 1.5, 0);
	this.cmd("CreateLabel", this.nextIndex++, "Visited", VISITED_START_X - AUX_ARRAY_WIDTH-125, AUX_ARRAY_START_Y - AUX_ARRAY_HEIGHT * 1.5, 0);
	this.cmd("CreateLabel", this.nextIndex++, "BFS Queue", QUEUE_START_X, QUEUE_START_Y - 30, 0);
	}
	this.flag=true;
	animationManager.setAllLayers([0, this.currentLayer]);
	animationManager.StartNewAnimation(this.commands);
	animationManager.skipForward();
	animationManager.clearHistory();
	
	this.highlightCircleL = this.nextIndex++;
	this.highlightCircleAL = this.nextIndex++;
	this.highlightCircleAM= this.nextIndex++;
}

BFS.prototype.startCallback = function(event)
{
	var startvalue;
	if (this.startField.value != "")
	{
		var size_or_hits=this.size;
		if(this.owning){
			this.initial_details();
			size_or_hits=this.hit_counter;
			}
		this.flag=true;
		startvalue = this.startField.value;
		this.startField.value = "";
		if (parseInt(startvalue) <size_or_hits)
			this.implementAction(this.doBFS.bind(this),startvalue);
	}
}

BFS.prototype.doBFS = function(startVetex)
{
var size_or_hits;
if(this.owning)
	size_or_hits=this.hit_counter;
else
	size_or_hits=this.size;
	this.visited = new Array(size_or_hits);
	this.commands = new Array();
	this.queue = new Array(size_or_hits);
	var head = 0;
	var tail = 0;
	var queueID = new Array(size_or_hits);
	var queueSize = 0;
	
	if (this.messageID != null)
	{
		for (var i = 0; i < this.messageID.length; i++)
		{
			this.cmd("Delete", this.messageID[i]);
		}
	}
	
	this.messageID = new Array();
	for (i = 0; i < size_or_hits; i++)
	{
		this.cmd("SetText", this.visitedID[i], "f");
		this.cmd("SetText", this.parentID[i], "");
		this.visited[i] = false;
		queueID[i] = this.nextIndex++;
		
	}
	var vertex = parseInt(startVetex);
	this.visited[vertex] = true;
	this.queue[tail] = vertex;
	this.cmd("CreateLabel", queueID[tail],  vertex, QUEUE_START_X + queueSize * QUEUE_SPACING, QUEUE_START_Y);
	queueSize = queueSize + 1;
	tail = (tail + 1) % (size_or_hits);
	while (queueSize > 0)
	{
	
		vertex = this.queue[head];
		
		if(!this.owning)
		this.cmd("CreateHighlightCircle", this.highlightCircleL, HIGHLIGHT_CIRCLE_COLOR, this.x_pos_logical[vertex], this.y_pos_logical[vertex]);
		else
		this.cmd("CreateHighlightCircle", this.highlightCircleL, HIGHLIGHT_CIRCLE_COLOR, this.x_array[vertex], this.y_array[vertex]);
		
		this.cmd("SetLayer", this.highlightCircleL, 1);
		this.cmd("CreateHighlightCircle", this.highlightCircleAL, HIGHLIGHT_CIRCLE_COLOR,this.adj_list_x_start - this.adj_list_width, this.adj_list_y_start + vertex*this.adj_list_height);
		this.cmd("SetLayer", this.highlightCircleAL, 2);
		this.cmd("CreateHighlightCircle", this.highlightCircleAM, HIGHLIGHT_CIRCLE_COLOR,this.adj_matrix_x_start  - this.adj_matrix_width, this.adj_matrix_y_start + vertex*this.adj_matrix_height);
		this.cmd("SetLayer", this.highlightCircleAM, 3);
		this.cmd("SetTextColor", queueID[head], BFS_QUEUE_HEAD_COLOR);
		
		for (var neighbor = 0; neighbor < size_or_hits; neighbor++)
		{
			if (this.adj_matrix[vertex][neighbor] > 0)
			{
				this.highlightEdge(vertex, neighbor, 1);
				this.cmd("SetHighlight", this.visitedID[neighbor], 1);
				this.cmd("Step");
				if (!this.visited[neighbor])
				{
					this.visited[neighbor] = true;
					this.cmd("SetText", this.visitedID[neighbor], "T");
					this.cmd("SetText", this.parentID[neighbor], vertex);
					this.highlightEdge(vertex, neighbor, 0);
					this.cmd("Disconnect", this.circleID[vertex], this.circleID[neighbor]);
				if(this.owning){
					if(this.directed)
					this.cmd1("Connect", this.circleID[vertex], this.circleID[neighbor], BFS_TREE_COLOR, 0, 1, "","dim");
					else
					this.cmd1("Connect", this.circleID[vertex], this.circleID[neighbor], BFS_TREE_COLOR, 0, 0, "","dim");
					}
					else{
					if(this.directed)
					this.cmd("Connect", this.circleID[vertex], this.circleID[neighbor], BFS_TREE_COLOR, this.curve[vertex][neighbor], 1, "");
					else
					this.cmd("Connect", this.circleID[vertex], this.circleID[neighbor], BFS_TREE_COLOR, this.curve[vertex][neighbor], 0, "");
					}
					
					this.queue[tail] = neighbor;
					this.cmd("CreateLabel", queueID[tail],  neighbor, QUEUE_START_X + queueSize * QUEUE_SPACING, QUEUE_START_Y);
					tail = (tail + 1) % (size_or_hits);
					queueSize = queueSize + 1;
				}
				else
				{
					this.highlightEdge(vertex, neighbor, 0);
				}
				this.cmd("SetHighlight", this.visitedID[neighbor], 0);
				this.cmd("Step");						
			}
			
		}
		this.cmd("Delete", queueID[head]);
		head = (head + 1) % (size_or_hits);
		queueSize = queueSize - 1;
		for (i = 0; i < queueSize; i++)
		{
			var nextQueueIndex = (i + head) % size_or_hits;
			this.cmd("Move", queueID[nextQueueIndex], QUEUE_START_X + i * QUEUE_SPACING, QUEUE_START_Y);
		}
		
		this.cmd("Delete", this.highlightCircleL);
		this.cmd("Delete", this.highlightCircleAM);
		this.cmd("Delete", this.highlightCircleAL);
	}
	return this.commands
	
}



// NEED TO OVERRIDE IN PARENT
BFS.prototype.reset = function()
{
	// Throw an error?
}




BFS.prototype.enableUI = function(event)
{			
	if(this.owning)
	this.startButton1.disabled=false;
	this.startField.disabled = false;
	this.startButton.disabled = false;
	this.startButton
	BFS.superclass.enableUI.call(this,event);
}
BFS.prototype.disableUI = function(event)
{
	this.startButton1.disabled=true;
	this.startField.disabled = true;
	this.startButton.disabled = true;
	
	BFS.superclass.disableUI.call(this, event);
}
BFS.prototype.canvas_clicked = function(event)
{
	 var evt = event ? event:window.event;
 var clickX=0, clickY=0;

 if ((evt.clientX || evt.clientY) &&
     document.body &&
     document.body.scrollLeft!=null) {
  clickX = evt.clientX + document.body.scrollLeft;
  clickY = evt.clientY + document.body.scrollTop;
 }
 if ((evt.clientX || evt.clientY) &&
     document.compatMode=='CSS1Compat' && 
     document.documentElement && 
     document.documentElement.scrollLeft!=null) {
  clickX = evt.clientX + document.documentElement.scrollLeft;
  clickY = evt.clientY + document.documentElement.scrollTop;
 }
 if (evt.pageX || evt.pageY) {
  clickX = evt.pageX;
  clickY = evt.pageY;
 }
var  b1=(clickX-1 > 400) && (clickY-138 > 25) && (clickX-1 < 400+canvas.width-10-400) && (clickY-138<canvas.height-17-25);
 var b2=(this.evt_downX-1 > 400) && (this.evt_downY-138 > 25) && (this.evt_downX-1 < 400+canvas.width-10-400) &&(this.evt_downY-138<canvas.height-17-25);
if(b1 && b2)
	BFS.superclass.canvas_clicked.call(this,clickX-1,clickY-138);
else 
	BFS.superclass.strip.call(this);
return false;
}
BFS.prototype.canvas_clicked_down = function(event)
{
	BFS.superclass.canvas_clicked_down.call(this,event.clientX-1,event.clientY-138);
	this.evt_downX=event.clientX;
	this.evt_downY=event.clientY;
	return false;
}

var currentAlg;

function init()
{
	var animManag = initCanvas();
	currentAlg = new BFS(animManag, canvas.width, canvas.height);
}
function handleEvent(event)
{
	currentAlg.canvas_clicked(event);
}
function handleDown(event)
{
	currentAlg.canvas_clicked_down(event);
}
