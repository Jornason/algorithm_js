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

function TopoSortIndegree(am, w, h)
{
	this.init(am, w, h);
}



TopoSortIndegree.INDEGREE_ARRAY_ELEM_WIDTH = 25;
TopoSortIndegree.INDEGREE_ARRAY_ELEM_HEIGHT = 25;
TopoSortIndegree.INDEGREE_ARRAY_START_X = 50;
TopoSortIndegree.INDEGREE_ARRAY_START_Y = 60;


TopoSortIndegree.STACK_START_X = TopoSortIndegree.INDEGREE_ARRAY_START_X + 100;
TopoSortIndegree.STACK_START_Y = TopoSortIndegree.INDEGREE_ARRAY_START_Y;
TopoSortIndegree.STACK_HEIGHT = TopoSortIndegree.INDEGREE_ARRAY_ELEM_HEIGHT;


TopoSortIndegree.TOPO_ARRAY_START_X = TopoSortIndegree.STACK_START_X + 150;
TopoSortIndegree.TOPO_ARRAY_START_Y = TopoSortIndegree.INDEGREE_ARRAY_START_Y;
TopoSortIndegree.TOPO_HEIGHT = TopoSortIndegree.INDEGREE_ARRAY_ELEM_HEIGHT;


TopoSortIndegree.MESSAGE_LABEL_1_X = 70;
TopoSortIndegree.MESSAGE_LABEL_1_Y = 10;

TopoSortIndegree.MESSAGE_LABEL_2_X = 70;
TopoSortIndegree.MESSAGE_LABEL_2_Y = 40;


TopoSortIndegree.HIGHLIGHT_CIRCLE_COLOR = "#000000";
TopoSortIndegree.MESSAGE_COLOR = "#0000FF";


TopoSortIndegree.prototype = new Graph();
TopoSortIndegree.prototype.constructor = TopoSortIndegree;
TopoSortIndegree.superclass = Graph.prototype;

TopoSortIndegree.prototype.addControls =  function()
{		
	this.startButton = addControlToAlgorithmBar("Button", "Do Topological Sort");
	this.startButton.onclick = this.startCallback.bind(this);
	this.startButton1 = addControlToAlgorithmBar("Button", "Graph Completed");
	this.startButton1.onclick = this.initial_details.bind(this);
	TopoSortIndegree.superclass.addControls.call(this, false);
}	


TopoSortIndegree.prototype.init = function(am, w, h)
{
	this.flag=false;
	this.showEdgeCosts = false;
	TopoSortIndegree.superclass.init.call(this, am, w, h, true, true); // TODO:  add no edge label flag to this?
	// Setup called in base class init function
	this.send_rect_info();
}
TopoSortIndegree.prototype.send_rect_info = function()
{
	TopoSortIndegree.superclass.send_rect_info.call(this,"TopoSortIndegree");
}
TopoSortIndegree.prototype.disable_own = function()
{
	this.startButton.disabled = false;
	this.startButton1.disabled = true;
}
TopoSortIndegree.prototype.disable_default = function()
{
	this.startButton1.disabled = false;
	this.startButton.disabled = true;
}
		
TopoSortIndegree.prototype.setup = function() 
{
	
	this.flag=false;
	if(!this.owning){
	TopoSortIndegree.superclass.setup.call(this); 
	this.messageID = new Array();
	this.animationManager.setAllLayers([0, this.currentLayer]);
	
	
	this.messageID = new Array();
	this.commands = new Array();
	this.indegreeID = new Array(this.size);
	this.setIndexID = new Array(this.size);
	this.indegree = new Array(this.size);
	this.orderID = new Array(this.size);
	
	
	
	for (var i = 0; i < this.size; i++)
	{
		this.indegreeID[i] = this.nextIndex++;
		this.setIndexID[i] = this.nextIndex++;
		this.orderID[i] = this.nextIndex++;
		this.cmd("CreateLabel", this.orderID[i], "", 0, 0); // HACK!!
		this.cmd("CreateRectangle", this.indegreeID[i], " ", TopoSortIndegree.INDEGREE_ARRAY_ELEM_WIDTH, TopoSortIndegree.INDEGREE_ARRAY_ELEM_HEIGHT, TopoSortIndegree.INDEGREE_ARRAY_START_X, TopoSortIndegree.INDEGREE_ARRAY_START_Y + i*TopoSortIndegree.INDEGREE_ARRAY_ELEM_HEIGHT);
		this.cmd("CreateLabel", this.setIndexID[i], i, TopoSortIndegree.INDEGREE_ARRAY_START_X - TopoSortIndegree.INDEGREE_ARRAY_ELEM_WIDTH ,TopoSortIndegree.INDEGREE_ARRAY_START_Y + i*TopoSortIndegree.INDEGREE_ARRAY_ELEM_HEIGHT);
		this.cmd("SetForegroundColor",  this.setIndexID[i], VERTEX_INDEX_COLOR);				
	}
	if(!this.flag)
	this.cmd("CreateLabel", this.nextIndex++, "Indegree", TopoSortIndegree.INDEGREE_ARRAY_START_X - 1 * TopoSortIndegree.INDEGREE_ARRAY_ELEM_WIDTH, TopoSortIndegree.INDEGREE_ARRAY_START_Y - TopoSortIndegree.INDEGREE_ARRAY_ELEM_HEIGHT * 1.5, 0);
	this.flag=true;
	
	this.message1ID = this.nextIndex++;
	this.message2ID = this.nextIndex++;
	this.cmd("CreateLabel", this.message1ID, "", TopoSortIndegree.MESSAGE_LABEL_1_X, TopoSortIndegree.MESSAGE_LABEL_1_Y, 0);
	this.cmd("SetTextColor", this.message1ID, TopoSortIndegree.MESSAGE_COLOR);
	this.cmd("CreateLabel", this.message2ID, "", TopoSortIndegree.MESSAGE_LABEL_2_X, TopoSortIndegree.MESSAGE_LABEL_2_Y);
	this.cmd("SetTextColor", this.message2ID, TopoSortIndegree.MESSAGE_COLOR);
	
	this.stackLabelID = this.nextIndex++;
	this.topoLabelID = this.nextIndex++;
	this.cmd("CreateLabel", this.stackLabelID, "", TopoSortIndegree.STACK_START_X, TopoSortIndegree.STACK_START_Y - TopoSortIndegree.STACK_HEIGHT);
	this.cmd("CreateLabel", this.topoLabelID, "", TopoSortIndegree.TOPO_ARRAY_START_X, TopoSortIndegree.TOPO_ARRAY_START_Y - TopoSortIndegree.TOPO_HEIGHT);
	
	this.animationManager.StartNewAnimation(this.commands);
	this.animationManager.skipForward();
	this.animationManager.clearHistory();
	
	this.highlightCircleL = this.nextIndex++;
	this.highlightCircleAL = this.nextIndex++;
	this.highlightCircleAM= this.nextIndex++;
	
	this.initialIndex = this.nextIndex;
	}
}
		
TopoSortIndegree.prototype.initial_details = function()
{
	this.messageID = new Array();
	this.animationManager.setAllLayers([0, this.currentLayer]);
	
	
	this.messageID = new Array();
	this.commands = new Array();
	this.indegreeID = new Array(this.hit_counter);
	this.setIndexID = new Array(this.hit_counter);
	this.indegree = new Array(this.hit_counter);
	this.orderID = new Array(this.hit_counter);
	
	
	
	for (var i = 0; i < this.hit_counter; i++)
	{
		this.indegreeID[i] = this.nextIndex++;
		this.setIndexID[i] = this.nextIndex++;
		this.orderID[i] = this.nextIndex++;
		this.cmd("CreateLabel", this.orderID[i], "", 0, 0); // HACK!!
		this.cmd("CreateRectangle", this.indegreeID[i], " ", TopoSortIndegree.INDEGREE_ARRAY_ELEM_WIDTH, TopoSortIndegree.INDEGREE_ARRAY_ELEM_HEIGHT, TopoSortIndegree.INDEGREE_ARRAY_START_X, TopoSortIndegree.INDEGREE_ARRAY_START_Y + i*TopoSortIndegree.INDEGREE_ARRAY_ELEM_HEIGHT);
		this.cmd("CreateLabel", this.setIndexID[i], i, TopoSortIndegree.INDEGREE_ARRAY_START_X - TopoSortIndegree.INDEGREE_ARRAY_ELEM_WIDTH ,TopoSortIndegree.INDEGREE_ARRAY_START_Y + i*TopoSortIndegree.INDEGREE_ARRAY_ELEM_HEIGHT);
		this.cmd("SetForegroundColor",  this.setIndexID[i], VERTEX_INDEX_COLOR);				
	}
	if(!this.flag)
	this.cmd("CreateLabel", this.nextIndex++, "Indegree", TopoSortIndegree.INDEGREE_ARRAY_START_X - 1 * TopoSortIndegree.INDEGREE_ARRAY_ELEM_WIDTH, TopoSortIndegree.INDEGREE_ARRAY_START_Y - TopoSortIndegree.INDEGREE_ARRAY_ELEM_HEIGHT * 1.5, 0);
	this.flag=true;
	
	this.message1ID = this.nextIndex++;
	this.message2ID = this.nextIndex++;
	this.cmd("CreateLabel", this.message1ID, "", TopoSortIndegree.MESSAGE_LABEL_1_X, TopoSortIndegree.MESSAGE_LABEL_1_Y, 0);
	this.cmd("SetTextColor", this.message1ID, TopoSortIndegree.MESSAGE_COLOR);
	this.cmd("CreateLabel", this.message2ID, "", TopoSortIndegree.MESSAGE_LABEL_2_X, TopoSortIndegree.MESSAGE_LABEL_2_Y);
	this.cmd("SetTextColor", this.message2ID, TopoSortIndegree.MESSAGE_COLOR);
	
	this.stackLabelID = this.nextIndex++;
	this.topoLabelID = this.nextIndex++;
	this.cmd("CreateLabel", this.stackLabelID, "", TopoSortIndegree.STACK_START_X, TopoSortIndegree.STACK_START_Y - TopoSortIndegree.STACK_HEIGHT);
	this.cmd("CreateLabel", this.topoLabelID, "", TopoSortIndegree.TOPO_ARRAY_START_X, TopoSortIndegree.TOPO_ARRAY_START_Y - TopoSortIndegree.TOPO_HEIGHT);
	
	this.animationManager.StartNewAnimation(this.commands);
	this.animationManager.skipForward();
	this.animationManager.clearHistory();
	
	this.highlightCircleL = this.nextIndex++;
	this.highlightCircleAL = this.nextIndex++;
	this.highlightCircleAM= this.nextIndex++;
	
	this.initialIndex = this.nextIndex;
}		
TopoSortIndegree.prototype.startCallback = function(event)
{
	this.implementAction(this.doTopoSort.bind(this),"");
}



TopoSortIndegree.prototype.doTopoSort = function(ignored)
{
var size_or_hits=0;
if(this.owning)
	size_or_hits=this.hit_counter;
else
	size_or_hits=this.size;
	this.commands = new Array();
	var stack = new Array(size_or_hits);
	var stackID = new Array(size_or_hits);
	var stackTop = 0;
	
	var vertex;
	for (var vertex = 0; vertex < size_or_hits; vertex++)
	{
		this.cmd("SetText", this.indegreeID[vertex], "0");
		this.indegree[vertex] = 0;
		stackID[vertex] = this.nextIndex++;
		this.cmd("Delete", this.orderID[vertex]);
	}
	
	this.cmd("SetText", this.message1ID, "Calculate this.indegree of all verticies by going through every edge of the graph");
	this.cmd("SetText", this.topoLabelID, "");
	this.cmd("SetText", this.stackLabelID, "");
	for (vertex = 0; vertex < size_or_hits; vertex++)
	{
		var adjListIndex = 0;
		var neighbor;
		for (neighbor = 0; neighbor < size_or_hits; neighbor++)
			if (this.adj_matrix[vertex][neighbor] >= 0)
			{
				adjListIndex++;
				this.highlightEdge(vertex, neighbor, 1);
				this.cmd("Step");
				if(!this.owning)
				this.cmd("CreateHighlightCircle", this.highlightCircleL, TopoSortIndegree.HIGHLIGHT_CIRCLE_COLOR, this.x_pos_logical[neighbor], this.y_pos_logical[neighbor]);
				else
				this.cmd("CreateHighlightCircle", this.highlightCircleL, TopoSortIndegree.HIGHLIGHT_CIRCLE_COLOR, this.x_array[neighbor], this.y_array[neighbor]);
				this.cmd("SetLayer", this.highlightCircleL, 1);
				this.cmd("CreateHighlightCircle", this.highlightCircleAL, TopoSortIndegree.HIGHLIGHT_CIRCLE_COLOR,this.adj_list_x_start + adjListIndex * (this.adj_list_width + this.adj_list_spacing), this.adj_list_y_start + vertex*this.adj_list_height);
				this.cmd("SetLayer", this.highlightCircleAL, 2);
				this.cmd("CreateHighlightCircle", this.highlightCircleAM, TopoSortIndegree.HIGHLIGHT_CIRCLE_COLOR,this.adj_matrix_x_start  + neighbor * this.adj_matrix_width, this.adj_matrix_y_start - this.adj_matrix_height);
				this.cmd("SetLayer", this.highlightCircleAM, 3);
				
				this.cmd("Move", this.highlightCircleL,TopoSortIndegree.INDEGREE_ARRAY_START_X - TopoSortIndegree.INDEGREE_ARRAY_ELEM_WIDTH ,TopoSortIndegree.INDEGREE_ARRAY_START_Y + neighbor*TopoSortIndegree.INDEGREE_ARRAY_ELEM_HEIGHT);
				
				this.cmd("Move", this.highlightCircleAL, TopoSortIndegree.INDEGREE_ARRAY_START_X - TopoSortIndegree.INDEGREE_ARRAY_ELEM_WIDTH ,TopoSortIndegree.INDEGREE_ARRAY_START_Y + neighbor*TopoSortIndegree.INDEGREE_ARRAY_ELEM_HEIGHT);
				this.cmd("Move", this.highlightCircleAM,TopoSortIndegree.INDEGREE_ARRAY_START_X - TopoSortIndegree.INDEGREE_ARRAY_ELEM_WIDTH ,TopoSortIndegree.INDEGREE_ARRAY_START_Y + neighbor*TopoSortIndegree.INDEGREE_ARRAY_ELEM_HEIGHT);
				
				this.cmd("Step");
				this.indegree[neighbor] = this.indegree[neighbor] + 1;
				this.cmd("SetText", this.indegreeID[neighbor], this.indegree[neighbor]);
				this.cmd("SetTextColor", this.indegreeID[neighbor],  "#FF0000");
				this.cmd("Step");
				this.cmd("Delete", this.highlightCircleL);
				this.cmd("Delete", this.highlightCircleAL);
				this.cmd("Delete", this.highlightCircleAM);
				this.cmd("SetTextColor", this.indegreeID[neighbor], EDGE_COLOR);
				this.highlightEdge(vertex, neighbor, 0);
			}
		
	}
	this.cmd("SetText", this.message1ID, "Collect all vertices with 0 this.indegree onto a stack");
	this.cmd("SetText", this.stackLabelID, "Zero Indegree Vertices");
	
	for (vertex = 0; vertex < size_or_hits; vertex++)
	{
		this.cmd("SetHighlight", this.indegreeID[vertex], 1);
		this.cmd("Step");
		if (this.indegree[vertex] == 0)
		{
			stack[stackTop] =vertex;
			this.cmd("CreateLabel", stackID[stackTop], vertex, TopoSortIndegree.INDEGREE_ARRAY_START_X - TopoSortIndegree.INDEGREE_ARRAY_ELEM_WIDTH, TopoSortIndegree.INDEGREE_ARRAY_START_Y + vertex*TopoSortIndegree.INDEGREE_ARRAY_ELEM_HEIGHT);
			this.cmd("Move", stackID[stackTop], TopoSortIndegree.STACK_START_X, TopoSortIndegree.STACK_START_Y + stackTop * TopoSortIndegree.STACK_HEIGHT);
			this.cmd("Step")
			stackTop++;
		}
		this.cmd("SetHighlight", this.indegreeID[vertex], 0);
		
	}
	this.cmd("SetText", this.topoLabelID, "Topological Order");
	
	var nextInOrder = 0;
	while (stackTop >  0)
	{
		stackTop--;
		var nextElem = stack[stackTop];
		this.cmd("SetText", this.message1ID, "Pop off top vertex with this.indegree 0, add to topological sort");
		this.cmd("CreateLabel", this.orderID[nextInOrder], nextElem, TopoSortIndegree.STACK_START_X, TopoSortIndegree.STACK_START_Y + stackTop * TopoSortIndegree.STACK_HEIGHT);
		this.cmd("Delete", stackID[stackTop]);
		this.cmd("Step");
		this.cmd("Move", this.orderID[nextInOrder], TopoSortIndegree.TOPO_ARRAY_START_X, TopoSortIndegree.TOPO_ARRAY_START_Y + nextInOrder * TopoSortIndegree.TOPO_HEIGHT);
		this.cmd("Step");
		this.cmd("SetText", this.message1ID, "Find all neigbors of vertex " + String(nextElem) + ", decrease their this.indegree.  If this.indegree becomes 0, add to stack");
		this.cmd("SetHighlight", this.circleID[nextElem], 1);
		this.cmd("Step")
		
		adjListIndex = 0;
		
		for (vertex = 0; vertex < size_or_hits; vertex++)
		{
			if (this.adj_matrix[nextElem][vertex] >= 0)
			{
				adjListIndex++;
				this.highlightEdge(nextElem, vertex, 1);
				this.cmd("Step");
				if(!this.owning)
				this.cmd("CreateHighlightCircle", this.highlightCircleL, TopoSortIndegree.HIGHLIGHT_CIRCLE_COLOR, this.x_pos_logical[vertex], this.y_pos_logical[vertex]);
				else
				this.cmd("CreateHighlightCircle", this.highlightCircleL, TopoSortIndegree.HIGHLIGHT_CIRCLE_COLOR, this.x_array[vertex], this.y_array[vertex]);
				this.cmd("SetLayer", this.highlightCircleL, 1);
				this.cmd("CreateHighlightCircle", this.highlightCircleAL, TopoSortIndegree.HIGHLIGHT_CIRCLE_COLOR,this.adj_list_x_start + adjListIndex * (this.adj_list_width + this.adj_list_spacing), this.adj_list_y_start + nextElem*this.adj_list_height);
				this.cmd("SetLayer", this.highlightCircleAL, 2);
				this.cmd("CreateHighlightCircle", this.highlightCircleAM, TopoSortIndegree.HIGHLIGHT_CIRCLE_COLOR,this.adj_matrix_x_start  + vertex * this.adj_matrix_width, this.adj_matrix_y_start - this.adj_matrix_height);
				this.cmd("SetLayer", this.highlightCircleAM, 3);
				
				this.cmd("Move", this.highlightCircleL,TopoSortIndegree.INDEGREE_ARRAY_START_X - TopoSortIndegree.INDEGREE_ARRAY_ELEM_WIDTH ,TopoSortIndegree.INDEGREE_ARRAY_START_Y + vertex*TopoSortIndegree.INDEGREE_ARRAY_ELEM_HEIGHT);
				
				this.cmd("Move", this.highlightCircleAL, TopoSortIndegree.INDEGREE_ARRAY_START_X - TopoSortIndegree.INDEGREE_ARRAY_ELEM_WIDTH ,TopoSortIndegree.INDEGREE_ARRAY_START_Y + vertex*TopoSortIndegree.INDEGREE_ARRAY_ELEM_HEIGHT);
				this.cmd("Move", this.highlightCircleAM,TopoSortIndegree.INDEGREE_ARRAY_START_X - TopoSortIndegree.INDEGREE_ARRAY_ELEM_WIDTH ,TopoSortIndegree.INDEGREE_ARRAY_START_Y + vertex*TopoSortIndegree.INDEGREE_ARRAY_ELEM_HEIGHT);
				
				this.cmd("Step");
				this.indegree[vertex] = this.indegree[vertex] - 1;
				this.cmd("SetText", this.indegreeID[vertex], this.indegree[vertex]);
				this.cmd("SetTextColor", this.indegreeID[vertex], "#FF0000");
				this.cmd("Step");
				if (this.indegree[vertex] == 0)
				{
					stack[stackTop] =vertex;
					this.cmd("CreateLabel", stackID[stackTop], vertex, TopoSortIndegree.INDEGREE_ARRAY_START_X - TopoSortIndegree.INDEGREE_ARRAY_ELEM_WIDTH, TopoSortIndegree.INDEGREE_ARRAY_START_Y + vertex*TopoSortIndegree.INDEGREE_ARRAY_ELEM_HEIGHT);
					this.cmd("Move", stackID[stackTop], TopoSortIndegree.STACK_START_X, TopoSortIndegree.STACK_START_Y + stackTop * TopoSortIndegree.STACK_HEIGHT);
					this.cmd("Step");
					stackTop++;							
				}
				this.cmd("Delete", this.highlightCircleL);
				this.cmd("Delete", this.highlightCircleAL);
				this.cmd("Delete", this.highlightCircleAM);
				this.cmd("SetTextColor", this.indegreeID[vertex], EDGE_COLOR);
				this.highlightEdge(nextElem, vertex, 0);
				
			}
		}
		this.cmd("SetHighlight", this.circleID[nextElem], 0);
		
		nextInOrder++;
		
		
		
	}
	
	
	this.cmd("SetText", this.message1ID, "");
	this.cmd("SetText", this.stackLabelID, "");
	
	return this.commands
	
}


TopoSortIndegree.prototype.setup_large = function()
{
	this.d_x_pos = TopoSortIndegree.D_X_POS_LARGE;
	this.d_y_pos = TopoSortIndegree.D_Y_POS_LARGE;
	this.f_x_pos = TopoSortIndegree.F_X_POS_LARGE;
	this.f_y_pos = TopoSortIndegree.F_Y_POS_LARGE;
	
	TopoSortIndegree.superclass.setup_large.call(this); 
}		
TopoSortIndegree.prototype.setup_small = function()
{
	
	this.d_x_pos = TopoSortIndegree.D_X_POS_SMALL;
	this.d_y_pos = TopoSortIndegree.D_Y_POS_SMALL;
	this.f_x_pos = TopoSortIndegree.F_X_POS_SMALL;
	this.f_y_pos = TopoSortIndegree.F_Y_POS_SMALL;

	TopoSortIndegree.superclass.setup_small.call(this); 
}

TopoSortIndegree.prototype.dfsVisit = function(startVertex, messageX, printCCNum)
{
var size_or_hits=0;
if(this.owning)
	size_or_hits=this.hit_counter;
else
	size_or_hits=this.size;
	var nextMessage = this.nextIndex++;
	this.messageID.push(nextMessage);
	this.cmd("CreateLabel",nextMessage, "DFS(" +  String(startVertex) +  ")", messageX, this.messageY, 0);
	
	this.messageY = this.messageY + 20;
	if (!this.visited[startVertex])
	{
		this.d_times[startVertex] = this.currentTime++;
		this.cmd("CreateLabel", this.d_timesID_L[startVertex], "d = " + String(this.d_times[startVertex]), this.d_x_pos[startVertex], this.d_y_pos[startVertex]);				
		this.cmd("CreateLabel", this.d_timesID_AL[startVertex], "d = " + String(this.d_times[startVertex]), this.adj_list_x_start - 2*this.adj_list_width, this.adj_list_y_start + startVertex*this.adj_list_height - 1/4*this.adj_list_height);
		this.cmd("SetLayer",  this.d_timesID_L[startVertex], 1);
		this.cmd("SetLayer",  this.d_timesID_AL[startVertex], 2);
		
		this.visited[startVertex] = true;
		this.cmd("Step");
		for (var neighbor = 0; neighbor < size_or_hits; neighbor++)
		{
			if (this.adj_matrix[startVertex][neighbor] > 0)
			{
				this.highlightEdge(startVertex, neighbor, 1);
				if (this.visited[neighbor])
				{
					nextMessage = this.nextIndex;
					this.cmd("CreateLabel", nextMessage, "Vertex " + String(neighbor) + " already this.visited.", messageX, this.messageY, 0);
				}
				this.cmd("Step");
				this.highlightEdge(startVertex, neighbor, 0);
				if (this.visited[neighbor])
				{
					this.cmd("Delete", nextMessage, "DNM");
				}
				
				if (!this.visited[neighbor])
				{
					this.cmd("Disconnect", this.circleID[startVertex], this.circleID[neighbor]);
					this.cmd("Connect", this.circleID[startVertex], this.circleID[neighbor], TopoSortIndegree.DFS_TREE_COLOR, this.curve[startVertex][neighbor], 1, "");
					if(!this.owning)
					this.cmd("Move", this.highlightCircleL, this.x_array[neighbor], this.y_array[neighbor]);
					else
					this.cmd("Move", this.highlightCircleL, this.x_array[neighbor], this.y_array[neighbor]);
					this.cmd("Move", this.highlightCircleAL, this.adj_list_x_start - this.adj_list_width, this.adj_list_y_start + neighbor*this.adj_list_height);
					this.cmd("Move", this.highlightCircleAM, this.adj_matrix_x_start - this.adj_matrix_width, this.adj_matrix_y_start + neighbor*this.adj_matrix_height);
					
					this.cmd("Step");
					this.dfsVisit(neighbor, messageX + 10, printCCNum);							
					nextMessage = this.nextIndex;
					this.cmd("CreateLabel", nextMessage, "Returning from recursive call: DFS(" + String(neighbor) + ")", messageX + 20, this.messageY, 0);
					
					this.cmd("Move", this.highlightCircleAL, this.adj_list_x_start - this.adj_list_width, this.adj_list_y_start + startVertex*this.adj_list_height);
					if(!this.owning)
					this.cmd("Move", this.highlightCircleL, this.x_pos_logical[startVertex], this.y_pos_logical[startVertex]);
					else
					this.cmd("Move", this.highlightCircleL, this.x_array[startVertex], this.y_array[startVertex]);
					this.cmd("Move", this.highlightCircleAM, this.adj_matrix_x_start - this.adj_matrix_width, this.adj_matrix_y_start + startVertex*this.adj_matrix_height);
					this.cmd("Step");
					this.cmd("Delete", nextMessage, 18);
				}
				this.cmd("Step");
				
				
				
			}
			
		}
			
		
		this.f_times[startVertex] = this.currentTime++;
		this.cmd("CreateLabel", this.f_timesID_L[startVertex],"f = " + String(this.f_times[startVertex]), this.f_x_pos[startVertex], this.f_y_pos[startVertex]);
		this.cmd("CreateLabel", this.f_timesID_AL[startVertex], "f = " + String(this.f_times[startVertex]), this.adj_list_x_start - 2*this.adj_list_width, this.adj_list_y_start + startVertex*this.adj_list_height + 1/4*this.adj_list_height);
		
		this.cmd("SetLayer",  this.f_timesID_L[startVertex], 1);
		this.cmd("SetLayer",  this.f_timesID_AL[startVertex], 2);
		
		this.cmd("Step");
		
		var i;
		for (i = this.topoOrderArrayL.length; i > 0; i--)
		{
			this.topoOrderArrayL[i] = this.topoOrderArrayL[i-1];
			this.topoOrderArrayAL[i] = this.topoOrderArrayAL[i-1];
			this.topoOrderArrayAM[i] = this.topoOrderArrayAM[i-1];
		}		
		
		var nextVertexLabel = this.nextIndex++;
		this.messageID.push(nextVertexLabel);
		if(!this.owning)
		this.cmd("CreateLabel", nextVertexLabel, startVertex, this.x_pos_logical[startVertex],  this.y_pos_logical[startVertex]);
		else
		this.cmd("CreateLabel", nextVertexLabel, startVertex, this.x_array[startVertex],  this.y_array[startVertex]);
		this.cmd("SetLayer", nextVertexLabel, 1);
		this.topoOrderArrayL[0] = nextVertexLabel;
		
		nextVertexLabel = this.nextIndex++;
		this.messageID.push(nextVertexLabel);
		this.cmd("CreateLabel", nextVertexLabel, startVertex,this.adj_list_x_start - this.adj_list_width, this.adj_list_y_start + startVertex*this.adj_list_height);
		this.cmd("SetLayer", nextVertexLabel, 2);
		this.topoOrderArrayAL[0] = nextVertexLabel;
		
		nextVertexLabel = this.nextIndex++;
		this.messageID.push(nextVertexLabel);
		this.cmd("CreateLabel", nextVertexLabel, startVertex,this.adj_matrix_x_start - this.adj_matrix_width, this.adj_matrix_y_start + startVertex*this.adj_matrix_height);
		this.cmd("SetLayer", nextVertexLabel, 3);
		this.topoOrderArrayAM[0] = nextVertexLabel;
		
		for (i = 0; i < this.topoOrderArrayL.length; i++)
		{
			this.cmd("Move", this.topoOrderArrayL[i], TopoSortIndegree.ORDERING_INITIAL_X, 
					 TopoSortIndegree.ORDERING_INITIAL_Y + i * TopoSortIndegree.ORDERING_DELTA_Y);
			this.cmd("Move", this.topoOrderArrayAL[i], TopoSortIndegree.ORDERING_INITIAL_X, 
					 TopoSortIndegree.ORDERING_INITIAL_Y + i * TopoSortIndegree.ORDERING_DELTA_Y);
			this.cmd("Move", this.topoOrderArrayAM[i], TopoSortIndegree.ORDERING_INITIAL_X, 
					 TopoSortIndegree.ORDERING_INITIAL_Y + i * TopoSortIndegree.ORDERING_DELTA_Y);
			
		}
		this.cmd("Step");
		
		
		
	}
	
}


TopoSortIndegree.prototype.reset = function()
{
	this.nextIndex = this.oldNextIndex;
	this.messageID = new Array();
	this.nextIndex = this.initialIndex;
}



TopoSortIndegree.prototype.enableUI = function(event)
{			
	this.startButton.disabled = false;
	if(this.owning)
	this.startButton1.disabled=false;
	TopoSortIndegree.superclass.enableUI.call(this,event);
}
TopoSortIndegree.prototype.disableUI = function(event)
{
	
	this.startButton.disabled = true;
	this.startButton1.disabled=true;
	TopoSortIndegree.superclass.disableUI.call(this, event);
}


var currentAlg;

function init()
{
	var animManag = initCanvas();
	currentAlg = new TopoSortIndegree(animManag, canvas.width, canvas.height);
}

TopoSortIndegree.prototype.canvas_clicked = function(event)
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
var  b1=(clickX-1 > 380) && (clickY-138 > 25) && (clickX-1 < 380+canvas.width-10-380) && (clickY-138<canvas.height-17-25);
 var b2=(this.evt_downX-1 > 380) && (this.evt_downY-138 > 25) && (this.evt_downX-1 < 380+canvas.width-10-380) &&(this.evt_downY-138<canvas.height-17-25);
if(b1 && b2)
	TopoSortIndegree.superclass.canvas_clicked.call(this,clickX-1,clickY-138);
else 
	TopoSortIndegree.superclass.strip.call(this);
return false;
}
TopoSortIndegree.prototype.canvas_clicked_down = function(event)
{
	TopoSortIndegree.superclass.canvas_clicked_down.call(this,event.clientX-1,event.clientY-138);
	this.evt_downX=event.clientX;
	this.evt_downY=event.clientY;
	return false;
}


function handleEvent(event)
{
	
	currentAlg.canvas_clicked(event);
}
function handleDown(event)
{
	currentAlg.canvas_clicked_down(event);
}
