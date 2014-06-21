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
var DFS_TREE_COLOR = "#0000FF";
var BFS_QUEUE_HEAD_COLOR = "#0000FF";


var QUEUE_START_X = 30;
var QUEUE_START_Y = 50;
var QUEUE_SPACING = 30;


function DFS(am)
{
	this.init(am);
	
}

DFS.prototype = new Graph();
DFS.prototype.constructor = DFS;
DFS.superclass = Graph.prototype;

DFS.prototype.addControls =  function()
{		
	
	addLabelToAlgorithmBar("Start Vertex: ");
	this.startField = addControlToAlgorithmBar("Text", "");
	this.startField.onkeydown = this.returnSubmit(this.startField,  this.startCallback.bind(this), 2, true);
	this.startButton = addControlToAlgorithmBar("Button", "Run DFS");
	this.startButton.onclick = this.startCallback.bind(this);
	this.startButton1 = addControlToAlgorithmBar("Button", "Graph Completed");
	this.startButton1.onclick = this.initial_details.bind(this);
	//this.create_left_canvas();
	DFS.superclass.addControls.call(this);
}	


DFS.prototype.init = function(am, w, h)
{
	this.flag=false;
	showEdgeCosts = false;
	DFS.superclass.init.call(this, am, w, h); // TODO:  add no edge label flag to this?
	// Setup called in base class constructor
	this.send_rect_info();
}


DFS.prototype.send_rect_info = function()
{
	DFS.superclass.send_rect_info.call(this,"DFS");
}
DFS.prototype.disable_own = function()
{
	this.startButton.disabled = false;
	this.startButton1.disabled = true;
}
DFS.prototype.disable_default = function()
{
	this.startButton1.disabled = false;
	this.startButton.disabled = true;
}
DFS.prototype.setup = function() 
{
	
	this.flag=false;
	if(!this.owning)
	{
	DFS.superclass.setup.call(this);
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
		this.cmd("CreateRectangle", this.visitedID[i], "f", AUX_ARRAY_WIDTH, AUX_ARRAY_HEIGHT, VISITED_START_X, AUX_ARRAY_START_Y + i*AUX_ARRAY_HEIGHT);
		this.cmd("CreateLabel", this.visitedIndexID[i], i, VISITED_START_X - AUX_ARRAY_WIDTH , AUX_ARRAY_START_Y + i*AUX_ARRAY_HEIGHT);
		this.cmd("SetForegroundColor",  this.visitedIndexID[i], VERTEX_INDEX_COLOR);
		this.cmd("CreateRectangle", this.parentID[i], "", AUX_ARRAY_WIDTH, AUX_ARRAY_HEIGHT, PARENT_START_X, AUX_ARRAY_START_Y + i*AUX_ARRAY_HEIGHT);
		this.cmd("CreateLabel", this.parentIndexID[i], i, PARENT_START_X - AUX_ARRAY_WIDTH , AUX_ARRAY_START_Y + i*AUX_ARRAY_HEIGHT);
		this.cmd("SetForegroundColor",  this.parentIndexID[i], VERTEX_INDEX_COLOR);
		
	}
	this.cmd("CreateLabel", this.nextIndex++, "Parent", PARENT_START_X - AUX_ARRAY_WIDTH, AUX_ARRAY_START_Y - AUX_ARRAY_HEIGHT * 1.5, 0);
	this.cmd("CreateLabel", this.nextIndex++, "Visited", VISITED_START_X - AUX_ARRAY_WIDTH, AUX_ARRAY_START_Y - AUX_ARRAY_HEIGHT * 1.5, 0);
	this.animationManager.setAllLayers([0, this.currentLayer]);
	this.animationManager.StartNewAnimation(this.commands);
	this.animationManager.skipForward();
	this.animationManager.clearHistory();
	this.highlightCircleL = this.nextIndex++;
	this.highlightCircleAL = this.nextIndex++;
	this.highlightCircleAM= this.nextIndex++;
	
	}
}
//-----------

DFS.prototype.initial_details = function(event) 
{
	this.startButton.disabled = false;
	if(this.messageID == undefined)
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
		this.cmd("CreateRectangle", this.visitedID[i], "f", AUX_ARRAY_WIDTH, AUX_ARRAY_HEIGHT, VISITED_START_X, AUX_ARRAY_START_Y + i*AUX_ARRAY_HEIGHT);
		this.cmd("CreateLabel", this.visitedIndexID[i], i, VISITED_START_X - AUX_ARRAY_WIDTH , AUX_ARRAY_START_Y + i*AUX_ARRAY_HEIGHT);
		this.cmd("SetForegroundColor",  this.visitedIndexID[i], VERTEX_INDEX_COLOR);
		this.cmd("CreateRectangle", this.parentID[i], "", AUX_ARRAY_WIDTH, AUX_ARRAY_HEIGHT, PARENT_START_X, AUX_ARRAY_START_Y + i*AUX_ARRAY_HEIGHT);
		this.cmd("CreateLabel", this.parentIndexID[i], i, PARENT_START_X - AUX_ARRAY_WIDTH , AUX_ARRAY_START_Y + i*AUX_ARRAY_HEIGHT);
		this.cmd("SetForegroundColor",  this.parentIndexID[i], VERTEX_INDEX_COLOR);
		
	}
	if(this.flag==false){
	this.cmd("CreateLabel", this.nextIndex++, "Parent", PARENT_START_X - AUX_ARRAY_WIDTH, AUX_ARRAY_START_Y - AUX_ARRAY_HEIGHT * 1.5, 0);
	this.cmd("CreateLabel", this.nextIndex++, "Visited", VISITED_START_X - AUX_ARRAY_WIDTH, AUX_ARRAY_START_Y - AUX_ARRAY_HEIGHT * 1.5, 0);
	}
	this.flag=true;
	this.animationManager.setAllLayers([0, this.currentLayer]);
	this.animationManager.StartNewAnimation(this.commands);
	this.animationManager.skipForward();
	this.animationManager.clearHistory();
	this.highlightCircleL = this.nextIndex++;
	this.highlightCircleAL = this.nextIndex++;
	this.highlightCircleAM= this.nextIndex++;
}

//----------
DFS.prototype.startCallback = function(event)
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
		if (parseInt(startvalue) < size_or_hits)
			this.implementAction(this.doDFS.bind(this),startvalue);
	}
}



DFS.prototype.doDFS = function(startVetex)
{
var size_or_hits;
if(this.owning)
	size_or_hits=this.hit_counter;
else
	size_or_hits=this.size;
	this.visited = new Array(size_or_hits);
	this.commands = new Array();
	if (this.messageID != null)
	{
		for (var i = 0; i < this.messageID.length; i++)
		{
			this.cmd("Delete", this.messageID[i]);
		}
	}
	//this.rebuildEdges();
	this.messageID = new Array();
	for (i = 0; i < size_or_hits; i++)
	{
		this.cmd("SetText", this.visitedID[i], "f");
		this.cmd("SetText", this.parentID[i], "");
		this.visited[i] = false;
	}
	var vertex = parseInt(startVetex);
	if(!this.owning)
	this.cmd("CreateHighlightCircle", this.highlightCircleL, HIGHLIGHT_CIRCLE_COLOR, this.x_pos_logical[vertex], this.y_pos_logical[vertex]);
	else
	this.cmd("CreateHighlightCircle", this.highlightCircleL, HIGHLIGHT_CIRCLE_COLOR, this.x_array[vertex], this.y_array[vertex]);
	this.cmd("SetLayer", this.highlightCircleL, 1);
	this.cmd("CreateHighlightCircle", this.highlightCircleAL, HIGHLIGHT_CIRCLE_COLOR,this.adj_list_x_start - this.adj_list_width, this.adj_list_y_start + vertex*this.adj_list_height);
	this.cmd("SetLayer", this.highlightCircleAL, 2);
	
	this.cmd("CreateHighlightCircle", this.highlightCircleAM, HIGHLIGHT_CIRCLE_COLOR,this.adj_matrix_x_start  - this.adj_matrix_width, this.adj_matrix_y_start + vertex*this.adj_matrix_height);
	this.cmd("SetLayer", this.highlightCircleAM, 3);
	
	this.messageY = 30;
	this.mesX=[];
	this.mesY=[];
	this.dfsVisit(vertex, 10);
	this.defined_flag=true;
	this.cmd("Delete", this.highlightCircleL);
	this.cmd("Delete", this.highlightCircleAL);
	this.cmd("Delete", this.highlightCircleAM);
	return this.commands
	
}
DFS.prototype.erase = function()
{
	for(var t=0;t<this.mesX.length;t++){
		var nextMessage = this.nextIndex++;
		this.cmd("CreateLabel", nextMessage, "", this.mesX[i], this.mesY[i], 0);
	}
}
DFS.prototype.dfsVisit = function(startVertex, messageX)
{
var size_or_hits;
if(this.owning)
	size_or_hits=this.hit_counter;
else
	size_or_hits=this.size;
	var nextMessage = this.nextIndex++;
	this.messageID.push(nextMessage);
	
	this.cmd("CreateLabel",nextMessage, "DFS(" +  String(startVertex) +  ")", messageX, this.messageY, 0);
	this.mesX.push(messageX);
	this.mesY.push(this.messageY);
	this.messageY = this.messageY + 20;
	if (!this.visited[startVertex])
	{
		this.visited[startVertex] = true;
		this.cmd("SetText", this.visitedID[startVertex], "T");
		this.cmd("Step");
		for (var neighbor = 0; neighbor < size_or_hits; neighbor++)
		{
			if (this.adj_matrix[startVertex][neighbor] > 0)
			{
				this.highlightEdge(startVertex, neighbor, 1);
				this.cmd("SetHighlight", this.visitedID[neighbor], 1);
				if (this.visited[neighbor])
				{
					nextMessage = this.nextIndex;
					this.cmd("CreateLabel", nextMessage, "Vertex " + String(neighbor) + " already visited.", messageX, this.messageY, 0);
					this.mesX.push(messageX);
					this.mesY.push(this.messageY);
				}
				this.cmd("Step");
				this.highlightEdge(startVertex, neighbor, 0);
				this.cmd("SetHighlight", this.visitedID[neighbor], 0);
				if (this.visited[neighbor])
				{
					this.cmd("Delete", nextMessage);
				}
				
				if (!this.visited[neighbor])
				{
					this.cmd("Disconnect", this.circleID[startVertex], this.circleID[neighbor]);
					if(!this.directed)
					this.cmd("Disconnect", this.circleID[neighbor], this.circleID[startVertex]);
					if(this.owning){
					if(this.directed)
					this.cmd1("Connect", this.circleID[startVertex], this.circleID[neighbor], DFS_TREE_COLOR, 0, 1, "","dim");
					else
					this.cmd1("Connect", this.circleID[startVertex], this.circleID[neighbor], DFS_TREE_COLOR, 0, 0, "","dim");
					}
					else{
					
					if(this.directed){
					this.cmd("Connect", this.circleID[startVertex], this.circleID[neighbor], DFS_TREE_COLOR, this.adjustCurveForDirectedEdges(this.curve[startVertex][neighbor], this.adj_matrix[neighbor][startVertex] >= 0), 1, "");
					}
					else
					this.cmd("Connect", this.circleID[startVertex], this.circleID[neighbor], DFS_TREE_COLOR, this.curve[startVertex][neighbor], 0, "");				
					}
					if(!this.owning)
					this.cmd("Move", this.highlightCircleL, this.x_pos_logical[neighbor], this.y_pos_logical[neighbor]);
					else
					this.cmd("Move", this.highlightCircleL, this.x_array[neighbor], this.y_array[neighbor]);
					this.cmd("Move", this.highlightCircleAL, this.adj_list_x_start - this.adj_list_width, this.adj_list_y_start + neighbor*this.adj_list_height);
					this.cmd("Move", this.highlightCircleAM, this.adj_matrix_x_start - this.adj_matrix_width, this.adj_matrix_y_start + neighbor*this.adj_matrix_height);
					
					this.cmd("SetText", this.parentID[neighbor], startVertex);
					this.cmd("Step");
					this.dfsVisit(neighbor, messageX + 20);							
					nextMessage = this.nextIndex;
					this.cmd("CreateLabel", nextMessage, "Returning from recursive call: DFS(" + String(neighbor) + ")", messageX + 20, this.messageY, 0);
					this.mesX.push(messageX);
					this.mesY.push(this.messageY);
					this.cmd("Move", this.highlightCircleAL, this.adj_list_x_start - this.adj_list_width, this.adj_list_y_start + startVertex*this.adj_list_height);
				if(!this.owning)
					this.cmd("Move", this.highlightCircleL, this.x_pos_logical[startVertex], this.y_pos_logical[startVertex]);
				else
					this.cmd("Move", this.highlightCircleL, this.x_array[startVertex], this.y_array[startVertex]);
					this.cmd("Move", this.highlightCircleAM, this.adj_matrix_x_start - this.adj_matrix_width, this.adj_matrix_y_start + startVertex*this.adj_matrix_height);
					this.cmd("Step");
					this.cmd("Delete", nextMessage);
				}
				this.cmd("Step");
				
				
				
			}
			
		}
		
	}
		
}



// NEED TO OVERRIDE IN PARENT
DFS.prototype.reset = function()
{
	// Throw an error?
}




DFS.prototype.enableUI = function(event)
{		
	if(this.owning)
	this.startButton1.disabled=false;	
	this.startField.disabled = false;
	this.startButton.disabled = false;
	this.startButton
	
	
	DFS.superclass.enableUI.call(this,event);
}
DFS.prototype.disableUI = function(event)
{
	this.startButton1.disabled=true;
	this.startField.disabled = true;
	this.startButton.disabled = true;
	
	DFS.superclass.disableUI.call(this, event);
	//this.turn_flag();
}

DFS.prototype.canvas_clicked = function(event)
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
var  b1=(clickX-1 > 495) && (clickY-138 > 25) && (clickX-1 < 495+canvas.width-10-495) && (clickY-138<canvas.height-17-25);
 var b2=(this.evt_downX-1 > 495) && (this.evt_downY-138 > 25) && (this.evt_downX-1 < 495+canvas.width-10-495) &&(this.evt_downY-138<canvas.height-17-25);
if(b1 && b2)
	DFS.superclass.canvas_clicked.call(this,clickX-1,clickY-138);
else 
	DFS.superclass.strip.call(this);
return false;
}
DFS.prototype.canvas_clicked_down = function(event)
{
	DFS.superclass.canvas_clicked_down.call(this,event.clientX-1,event.clientY-138);
	this.evt_downX=event.clientX;
	this.evt_downY=event.clientY;
	return false;
}

var currentAlg;

function init()
{
	var animManag = initCanvas();
	currentAlg = new DFS(animManag, canvas.width, canvas.height);
}
function handleEvent(event)
{
	
	currentAlg.canvas_clicked(event);
}
function handleDown(event)
{
	currentAlg.canvas_clicked_down(event);
}
