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

// TODO:  UNDO (all the way) is BROKEN.  Redo reset ...


function Graph(am, w, h, dir, dag)
{
	if (am == undefined)
	{
		return;
	}
	this.init(am, w, h, dir,dag);
}

Graph.prototype = new Algorithm();
Graph.prototype.constructor = Graph;
Graph.superclass = Algorithm.prototype;

var LARGE_ALLOWED = [[false, true, true, false, true, false, false, true, false, false, false, false, false, false, true, false, false, false],
									[true, false, true, false, true, true,  false, false, false, false, false, false, false, false, false, false, false, false],
									[true, true, false, true,  false, true, true,  false, false, false, false, false, false, false, false, false, false, false],
									[false, false, true, false, false,false, true, false, false, false, true, false, false,  false, false, false, false, true],
									[true, true, false, false,  false, true, false, true, true, false, false, false, false, false, false, false,  false,  false],
									[false, true, true, false, true, false, true,   false, true, true, false, false, false, false, false, false,  false,  false],
									[false, false, true, true, false, true, false, false, false, true, true, false, false, false, false, false,  false,  false],
									[true, false, false, false, true, false, false, false, true, false, false, true, false, false, true, false, false, false],
									[false, false, false, false, true, true, false, true, false, true, false, true, true, false,   false, false, false, false],
									[false, false, false, false, false, true, true, false, true, false, true, false, true, true,  false,  false, false, false],
									[false, false, false, true, false,  false, true, false, false, true, false, false, false, true, false, false, false, true],
									[false, false, false, false, false, false, false, true, true, false, false, false, true, false, true, true, false, false],
									[false, false, false, false, false, false, false, false, true, true, false, true, false, true, false, true, true, false],
									[false, false, false, false, false, false, false, false, false, true, true, false, true, false, false, false, true, true],
									[false, false, false, false, false, false, false, true, false, false, false, true, false, false, false, true, false, false],
									[false, false, false, false, false, false, false, false, false, false, false, true, true, false, true, false, true, true],
									[false, false, false, false, false, false, false, false, false, false, false, false, true, true, false, true, false, true],
									[false, false, false, false, false, false, false, false, false, false, true, false, false, true, false, true, true, false]];

var LARGE_CURVE  = [[0, 0, -0.4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.25, 0, 0, 0],
								   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
								   [0.4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
								   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -0.25],
								   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
								   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
								   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
								   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
								   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
								   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
								   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
								   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
								   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
								   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
								   [-0.25, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
								   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.4],
								   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
								   [0, 0, 0, 0.25, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -0.4, 0, 0]]



var LARGE_X_POS_LOGICAL = [600, 700, 800, 900,
										  650, 750, 850,
										  600, 700, 800, 900,
										  650, 750, 850,
										  600, 700, 800, 900];


var LARGE_Y_POS_LOGICAL = [50, 50, 50, 50,
										  150, 150, 150,
										  250, 250, 250, 250, 
										  350, 350, 350, 
										  450,  450, 450, 450];


var SMALL_ALLLOWED = [[false, true,  true,  true,  true,  false, false, false],
									 [true,  false, true,  true,  false, true,  true,  false],
									 [true,  true,  false, false, true,  true,  true,  false],
									 [true,  true,  false, false, false, true,  false, true],
									 [true,  false, true,  false, false,  false, true,  true],
									 [false, true,  true,  true,  false, false, true,  true],
									 [false, true,  true,  false, true,  true,  false, true],
									 [false, false, false, true,  true,  true,  true,  false]];

var SMALL_CURVE = [[0, 0.001, 0, 0.5, -0.5, 0, 0, 0],
								  [0, 0, 0, 0.001, 0, 0.001, -0.2, 0],
								  [0, 0.001, 0, 0, 0, 0.2, 0, 0],
								  [-0.5, 0, 0, 0, 0, 0.001, 0, 0.5],
								  [0.5, 0, 0, 0, 0, 0, 0, -0.5],
								  [0, 0, -0.2, 0, 0, 0, 0.001, 0.001],
								  [0, 0.2, 0, 0, 0, 0, 0, 0],
								  [0, 0, 0, -0.5, 0.5, 0, 0, 0]];

var SMALL_X_POS_LOGICAL = [800, 725, 875, 650, 950, 725, 875, 800];
var SMALL_Y_POS_LOGICAL = [25, 125, 125, 225, 225, 325, 325, 425];


var SMALL_ADJ_MATRIX_X_START = 700;
var SMALL_ADJ_MATRIX_Y_START = 40;
var SMALL_ADJ_MATRIX_WIDTH = 30;
var SMALL_ADJ_MATRIX_HEIGHT = 30;

var SMALL_ADJ_LIST_X_START = 600;
var SMALL_ADJ_LIST_Y_START = 30;

var SMALL_ADJ_LIST_ELEM_WIDTH = 50;
var SMALL_ADJ_LIST_ELEM_HEIGHT = 30;

var SMALL_ADJ_LIST_HEIGHT = 36;
var SMALL_ADJ_LIST_WIDTH = 36;

var SMALL_ADJ_LIST_SPACING = 10;


var LARGE_ADJ_MATRIX_X_START = 575;
var LARGE_ADJ_MATRIX_Y_START = 30;
var LARGE_ADJ_MATRIX_WIDTH = 23;
var LARGE_ADJ_MATRIX_HEIGHT = 23;

var LARGE_ADJ_LIST_X_START = 600;
var LARGE_ADJ_LIST_Y_START = 30;

var LARGE_ADJ_LIST_ELEM_WIDTH = 50;
var LARGE_ADJ_LIST_ELEM_HEIGHT = 26;

var LARGE_ADJ_LIST_HEIGHT = 30;
var LARGE_ADJ_LIST_WIDTH = 30;

var LARGE_ADJ_LIST_SPACING = 10;



var VERTEX_INDEX_COLOR ="#0000FF";
var EDGE_COLOR = "#000000";

var SMALL_SIZE = 8;
var LARGE_SIZE = 18;

var HIGHLIGHT_COLOR = "#0000FF";
var fla=false;
Graph.prototype.add_details = function()
{
	this.nextIndex = 0;
	this.hit_counter=0;
	this.circleID = new Array();
	this.x_array  = new Array();
	this.y_array  = new Array();
	this.x_array_down = new Array();
	this.y_array_down = new Array();
	this.adj_matrix = new Array();
	this.adj_matrixID = new Array();
}
Graph.prototype.send_rect_info = function(item)
{
	this.running=item;
}

Graph.prototype.canvas_clicked = function(x,y)
{

	   	
if(this.owning && this.layer==1 && this.enable_canvas){
var mainint=1;
var index1=-1;
var index2=-1;
var d1;
var d2;
var tempX;
var tempY;
var on_or_not1=false;
var on_or_not2=false;
var inner1=true;
var inner2=true;
var a;
var b;
	if(this.hit_counter>1){
		 a = this.x_array_down[this.x_array_down.length-1];
		 b = this.y_array_down[this.y_array_down.length-1];
		for(var j=0;j<this.hit_counter-1;j++)
		{
			tempX=this.x_array[j];
			tempY=this.y_array[j];
			d1=Math.pow(Math.abs(tempX-a),2)+Math.pow(Math.abs(tempY-b),2);
			if(d1<=400){
				index1=j;
				on_or_not1=on_or_not1||true;
			}
			else if(d1<=4900)
				inner1=inner1 && false;
			d2=Math.pow(Math.abs(tempX-x),2)+Math.pow(Math.abs(tempY-y),2);
			if(d2<=400){
				index2=j;
				on_or_not2=on_or_not2||true;
			}
			else if(d2<=4900)
				inner2=inner2 && false;
		}
		if(on_or_not1==true && on_or_not2==true){
			if(index1 != index2)
				mainint=0;
			else mainint=2;
		}
		else if(on_or_not2==true && on_or_not1==false){
			mainint=2;
		}
		else if(inner2==true){
			mainint=1;
		}
		else
			mainint=2;
	
	}
	
	if(mainint==1){
		this.init3(x,y,this.hit_counter);
	}
	else if(mainint==2)
		this.hit_counter=this.hit_counter-1;
	else {
		
		this.hit_counter=this.hit_counter-1;	
		this.putEdges(index1,index2);		
		}
		}
	
}
Graph.prototype.strip = function()
{
	this.hit_counter=this.hit_counter-1;
	this.x_array_down.pop();
	this.y_array_down.pop();
}
Graph.prototype.canvas_clicked_down = function(x,y)
{
	if(this.owning  && this.layer==1 &&this.enable_canvas){
	if(fla==false){
		this.animationManager.resetAll();
		this.add_details();
		fla=true;	
		
	}

	this.hit_counter=this.hit_counter+1;
	this.x_array_down.push(x);
	this.y_array_down.push(y);
	}
	}
Graph.prototype.init = function(am, w, h, directed, dag){
	directed = (directed ==  undefined) ? true : directed;
	dag = (dag == undefined) ? false : dag;

	Graph.superclass.init.call(this, am, w, h);
	
	this.nextIndex = 0;
	this.nextIndex = 0;
	this.currentLayer = 1;
	this.isDAG = dag;
	this.directed = directed;
	this.running_type="default";
	this.currentLayer = 1;
	this.layer=1;
	this.addControls();
 	this.owning=false;
	this.setup_small();
	
}

Graph.prototype.addControls = function(addDirection)
{
	
	if (addDirection == undefined)
	{
		addDirection = true;
	}
	this.newGraphButton = addControlToAlgorithmBar("Button", "New Graph");
	this.newGraphButton.onclick =  this.newGraphCallback.bind(this);
	

	if (addDirection)
	{
		var radioButtonList = addRadioButtonGroupToAlgorithmBar(["Directed Graph", "Undirected Graph"], "GraphType");
		this.directedGraphButton = radioButtonList[0];
		this.directedGraphButton.onclick = this.directedGraphCallback.bind(this, true);
		this.undirectedGraphButton = radioButtonList[1];
		this.undirectedGraphButton.onclick = this.directedGraphCallback.bind(this, false);
		this.directedGraphButton.checked = this.directed;
		this.undirectedGraphButton.checked = !this.directed;
		
	}
	

	var radioButtonList = addRadioButtonGroupToAlgorithmBar(["Small Graph", "Large Graph"], "GraphSize");
	this.smallGraphButton = radioButtonList[0];
	this.smallGraphButton.onclick = this.smallGraphCallback.bind(this);
	this.largeGraphButton = radioButtonList[1];
	this.largeGraphButton.onclick = this.largeGraphCallback.bind(this);
	this.smallGraphButton.checked = true;
	
	var radioButtonList = addRadioButtonGroupToAlgorithmBar(["Logical Representation", 
															  "Adjacency List Representation", 
															  "Adjacency Matrix Representation"
															], 
															"GraphRepresentation");
															
											
	this.logicalButton = radioButtonList[0];
	this.logicalButton.onclick = this.graphRepChangedCallback.bind(this,1);
	this.adjacencyListButton = radioButtonList[1];
	this.adjacencyListButton.onclick = this.graphRepChangedCallback.bind(this,2);
	this.adjacencyMatrixButton = radioButtonList[2];
	this.adjacencyMatrixButton.onclick = this.graphRepChangedCallback.bind(this,3);
	this.logicalButton.checked = true;
		var radioButtonList = addRadioButtonGroupToAlgorithmBar(["Default Graph","Make your own Graph"], "Graphown");
		this.defaultGraphButton = radioButtonList[0];
		this.defaultGraphButton.onclick = this.ownGraphCallback.bind(this, false);
		this.ownGraphButton = radioButtonList[1];
		this.ownGraphButton.onclick = this.ownGraphCallback1.bind(this, true);
		this.ownGraphButton.checked = false;
		this.defaultGraphButton.checked = true;
}
Graph.prototype.ownGraphCallback1 = function (newown, event)
{
	if (newown != this.owning)
	{
		
		this.running_type="own";
		this.send_type(this.running,this.running_type);
		fla=false;
		this.owning =newown;
		this.animationManager.resetAll();
		this.nextIndex=0;
		this.enable_canvas=true;
		if(this.owning)
		this.disable_default();
		else
		this.disable_own();
			this.largeGraphButton.disabled=true;
			this.smallGraphButton.disabled=true;
		
	}
}
Graph.prototype.ownGraphCallback = function (newown, event)
{
	if (newown != this.owning)
	{
		
		this.running_type="default";
		this.send_type(this.running,this.running_type);
		fla=false;
		this.owning =newown;
		this.animationManager.resetAll();
		this.nextIndex=0;
		this.setup();
		if(this.owning)
		this.disable_default();
		else
		this.disable_own();
			
	}
}
Graph.prototype.directedGraphCallback = function (newDirected, event)
{
	if (newDirected != this.directed)
	{
		this.directed =newDirected;
		this.animationManager.resetAll();
		fla=false;
		this.nextIndex=0;
		this.setup();

	}
}



Graph.prototype.smallGraphCallback = function (event)
{
	if(!this.owning)
	if (this.size != SMALL_SIZE)
	{
		this.animationManager.resetAll();
		fla=false;
		this.nextIndex=0;
		this.setup_small();
		
	}
}

Graph.prototype.largeGraphCallback = function (event)
{
	if(!this.owning)
	if (this.size != LARGE_SIZE)
	{
		this.animationManager.resetAll();
		fla=false;
		this.nextIndex=0;
		this.setup_large();	
	}	
}


Graph.prototype.newGraphCallback = function(event)
{
	this.animationManager.resetAll();
	fla=false;
	this.nextIndex=0;
	this.setup();			
}


Graph.prototype.graphRepChangedCallback = function(newLayer, event) 
{
	this.layer=newLayer
	this.animationManager.setAllLayers([0,newLayer]);
	this.currentLayer = newLayer;
}


Graph.prototype.recolorGraph = function()
{
var size_or_hits;
if(this.owning)
	size_or_hits=this.hit_counter;
else
	size_or_hits=this.size;
	for (var i = 0; i < size_or_hits; i++)
	{
		for (var j = 0; j < size_or_hits; j++)
		{
			if (this.adj_matrix[i][j] >= 0)
			{
				this.setEdgeColor(i, j, EDGE_COLOR);				
			}
		}
	}
}		

Graph.prototype.highlightEdge = function(i,j, highlightVal)
{
	this.cmd("SetHighlight", this.adj_list_edges[i][j], highlightVal);
	this.cmd("SetHighlight", this.adj_matrixID[i][j], highlightVal);
	this.cmd("SetEdgeHighlight", this.circleID[i], this.circleID[j], highlightVal);		
	if (!this.directed)
	{
		this.cmd("SetEdgeHighlight", this.circleID[j], this.circleID[i], highlightVal);
	}
}

Graph.prototype.setEdgeColor = function(i,j, color)
{
	this.cmd("SetForegroundColor", this.adj_list_edges[i][j], color);
	this.cmd("SetTextColor", this.adj_matrixID[i][j], color);
	this.cmd("SetEdgeColor", this.circleID[i], this.circleID[j], color);		
	if (!this.directed)
	{
		this.cmd("SetEdgeColor", this.circleID[j], this.circleID[i], color);
	}
}



Graph.prototype.clearEdges = function()
{
var size_or_hits;
if(this.owning)
	size_or_hits=this.hit_counter;
else
	size_or_hits=this.size;
	for (var i = 0; i < size_or_hits; i++)
	{
		for (var j = 0; j < size_or_hits; j++)
		{
			if (this.adj_matrix[i][j] >= 0)
			{
				this.cmd("Disconnect", this.circleID[i], this.circleID[j]);
			}
		}
	}
}


Graph.prototype.rebuildEdges = function()
{
	this.clearEdges();
	this.buildEdges();
}




Graph.prototype.setup_small = function()
{
	this.allowed = SMALL_ALLLOWED;
	this.curve = SMALL_CURVE;
	this. x_pos_logical = SMALL_X_POS_LOGICAL;
	this. y_pos_logical = SMALL_Y_POS_LOGICAL;
	this.adj_matrix_x_start = SMALL_ADJ_MATRIX_X_START;
	this.adj_matrix_y_start = SMALL_ADJ_MATRIX_Y_START;
	this.adj_matrix_width = SMALL_ADJ_MATRIX_WIDTH;
	this.adj_matrix_height = SMALL_ADJ_MATRIX_HEIGHT;
	this.adj_list_x_start = SMALL_ADJ_LIST_X_START;
	this.adj_list_y_start = SMALL_ADJ_LIST_Y_START;
	this.adj_list_elem_width = SMALL_ADJ_LIST_ELEM_WIDTH;
	this.adj_list_elem_height = SMALL_ADJ_LIST_ELEM_HEIGHT;
	this.adj_list_height = SMALL_ADJ_LIST_HEIGHT;
	this.adj_list_width = SMALL_ADJ_LIST_WIDTH;
	this.adj_list_spacing = SMALL_ADJ_LIST_SPACING;
	this.size = SMALL_SIZE;
	this.setup();
}

Graph.prototype.setup_large = function()
{
	this.allowed = LARGE_ALLOWED;
	this.curve = LARGE_CURVE;
	this. x_pos_logical = LARGE_X_POS_LOGICAL;
	this. y_pos_logical = LARGE_Y_POS_LOGICAL;
	this.adj_matrix_x_start = LARGE_ADJ_MATRIX_X_START;
	this.adj_matrix_y_start = LARGE_ADJ_MATRIX_Y_START;
	this.adj_matrix_width = LARGE_ADJ_MATRIX_WIDTH;
	this.adj_matrix_height = LARGE_ADJ_MATRIX_HEIGHT;
	this.adj_list_x_start = LARGE_ADJ_LIST_X_START;
	this.adj_list_y_start = LARGE_ADJ_LIST_Y_START;
	this.adj_list_elem_width = LARGE_ADJ_LIST_ELEM_WIDTH;
	this.adj_list_elem_height = LARGE_ADJ_LIST_ELEM_HEIGHT;
	this.adj_list_height = LARGE_ADJ_LIST_HEIGHT;
	this.adj_list_width = LARGE_ADJ_LIST_WIDTH;
	this.adj_list_spacing = LARGE_ADJ_LIST_SPACING;
	this.size = LARGE_SIZE;
	this.setup();		
}

Graph.prototype.adjustCurveForDirectedEdges = function(curve, bidirectional)
{
	if (!bidirectional || Math.abs(curve) > 0.01)
	{
		return curve;
	}
	else
	{
		return 0.1;
	}	
}
Graph.prototype.init3 = function(a,b,c){
	this.commands = new Array();
	this.x_array.push(a);
	this.y_array.push(b);
		this.circleID[c-1] = this.nextIndex++;
		this.cmd("CreateCircle", this.circleID[c-1], c-1, a, b);
		this.cmd("SetTextColor", this.circleID[c-1], VERTEX_INDEX_COLOR, 0);
		this.cmd("SetLayer", this.circleID[c-1], 1);
	var arr=new Array();
	for(var t=0;t<this.adj_matrix.length+1;t++){
		arr.push(-1);
	}
	for(var t1=0;t1<this.adj_matrix.length;t1++){
		this.adj_matrix[t1].push(-1);
	}
	this.adj_matrix[this.adj_matrix.length]=arr;
	var arr1=new Array();
	for(var t=0;t<this.adj_matrixID.length+1;t++){
		arr1.push(this.nextIndex++);
	}
	for(var t1=0;t1<this.adj_matrixID.length;t1++){
		this.adj_matrixID[t1].push(this.nextIndex++);
	}
	this.adj_matrixID[this.adj_matrixID.length]=arr1;
	this.buildEdges1();
	this.buildAdjList();
	this.buildAdjMatrix();
	this.animationManager.setAllLayers([0, this.currentLayer],"pimp");
	this.animationManager.StartNewAnimation(this.commands,"pimp");
	this.animationManager.skipForward("pimp");
	this.animationManager.clearHistory("pimp");
	this.clearHistory();
	if(this.owning)
		this.disable_default();
		else
		this.disable_own();
}
//-----------------------------
Graph.prototype.putEdges = function(i1,j1)
{
if(this.adj_matrix[i1][j1] == 1 && !this.showEdgeCosts)
{

}
else
{
var weight;
var der_before=false;
if (this.showEdgeCosts)
	{
	weight=prompt("Please enter the weight of the edge","0");
	if(weight==null || weight=="")
		return;
	this.adj_matrix[i1][j1]=parseInt(weight);
	if(this.adj_matrix[i1][j1]!=-1)
		der_before=true;
	}

	this.commands=new Array();
	this.receive_point1(this.x_array,this.y_array);	
	if(der_before && this.directed){
			this.cmd("Disconnect", this.circleID[i1], this.circleID[j1]);
			}
	else if(der_before && !this.directed)
		{
			this.cmd("Disconnect", this.circleID[i1], this.circleID[j1]);
			this.cmd("Disconnect", this.circleID[j1], this.circleID[i1]);
		}
	if (this.directed)
	{
	
		
		this.adj_matrixID[i1][j1] = this.nextIndex++;
					if (this.showEdgeCosts)
					{
						this.adj_matrix[i1][j1] = parseInt(weight);
						this.cmd1("Connect", this.circleID[i1], this.circleID[j1], EDGE_COLOR, this.adjustCurveForDirectedEdges(0, this.adj_matrix[j1][i1] >= 0), 1, weight,"dim");
					}
					else
					{
						this.cmd1("Connect", this.circleID[i1], this.circleID[j1], EDGE_COLOR, this.adjustCurveForDirectedEdges(0, this.adj_matrix[j1][i1] >= 0), 1, "","dim");
						this.adj_matrix[i1][j1] = 1;
					}				
	}
	else
	{
		
		this.adj_matrixID[i1][j1] = this.nextIndex++;
		this.adj_matrixID[j1][i1] = this.nextIndex++;
				if (this.showEdgeCosts)
					{
						this.adj_matrix[i1][j1] = parseInt(weight);
						this.cmd1("Connect", this.circleID[i1], this.circleID[j1], EDGE_COLOR, 0, 0, weight,"dim");	
					}
					else
					{
						this.adj_matrix[i1][j1] = 1;
						this.cmd1("Connect", this.circleID[i1], this.circleID[j1], EDGE_COLOR, 0, 0, "","dim");	
					}
					this.adj_matrix[j1][i1]=this.adj_matrix[i1][j1];
	}
	this.buildEdges1();
	this.buildAdjList();
	this.buildAdjMatrix();
	this.animationManager.setAllLayers([0, this.currentLayer],"pimp");
	this.animationManager.StartNewAnimation(this.commands,"pimp");
	this.animationManager.skipForward("pimp");
	this.animationManager.clearHistory("pimp");
	this.clearHistory();
	if(this.owning)
		this.disable_default();
		else
		this.disable_own();
	}
}
//---------------------------
Graph.prototype.buildAdjList = function()
{
var size_or_hits=0;	
if(this.owning)
	size_or_hits=this.hit_counter;
else
	size_or_hits=this.size;	
	
		
	this.adj_list_index = new Array(size_or_hits);
	this.adj_list_list = new Array(size_or_hits);
	this.adj_list_edges = new Array(size_or_hits);
	
	for (var i = 0; i < size_or_hits; i++)
	{
		this.adj_list_index[i] = this.nextIndex++;
		this.adj_list_edges[i] = new Array(size_or_hits);
		this.adj_list_index[i] = this.nextIndex++;
		this.adj_list_list[i] = this.nextIndex++;
		this.cmd("CreateRectangle", this.adj_list_list[i], "", this.adj_list_width, this.adj_list_height, this.adj_list_x_start, this.adj_list_y_start + i*this.adj_list_height);
		this.cmd("SetLayer", this.adj_list_list[i], 2);
		this.cmd("CreateLabel", this.adj_list_index[i], i, this.adj_list_x_start - this.adj_list_width , this.adj_list_y_start + i*this.adj_list_height);
		this.cmd("SetForegroundColor",  this.adj_list_index[i], VERTEX_INDEX_COLOR);
		this.cmd("SetLayer", this.adj_list_index[i], 2);
		var lastElem = this.adj_list_list[i];
		var nextXPos = this.adj_list_x_start + this.adj_list_width + this.adj_list_spacing;
		var hasEdges = false;
		for (var j = 0; j < size_or_hits; j++)
		{
			if (this.adj_matrix[i][j] > 0)
			{
				hasEdges = true;
				this.adj_list_edges[i][j] = this.nextIndex++;
				this.cmd("CreateLinkedList",this.adj_list_edges[i][j], j,this.adj_list_elem_width, this.adj_list_elem_height, 
					nextXPos, this.adj_list_y_start + i*this.adj_list_height, 0.25, 0, 1, 2);
				this.cmd("SetNull", this.adj_list_edges[i][j], 1);
				this.cmd("SetText", this.adj_list_edges[i][j], this.adj_matrix[i][j], 1); 
				this.cmd("SetTextColor", this.adj_list_edges[i][j], VERTEX_INDEX_COLOR, 0);
				this.cmd("SetLayer", this.adj_list_edges[i][j], 2);
				
				nextXPos = nextXPos + this.adj_list_elem_width + this.adj_list_spacing;
				this.cmd("Connect", lastElem, this.adj_list_edges[i][j]);
				this.cmd("SetNull", lastElem, 0);
				lastElem = this.adj_list_edges[i][j];						
			}	
		}
		if (!hasEdges)
		{
			this.cmd("SetNull", this.adj_list_list[i], 1);					
		}
	}
}



Graph.prototype.buildEdges = function()
{
	var size_or_hits=0;
if(this.owning)
	size_or_hits=this.hit_counter;
else
	size_or_hits=this.size;
	
for (var i = 0; i < size_or_hits; i++)
	{
		for (var j = 0; j < size_or_hits; j++)
		{
			if (this.adj_matrix[i][j] >= 0)
			{
				var edgeLabel;
				if (this.showEdgeCosts)
				{
					edgeLabel = String(this.adj_matrix[i][j]);
				}
				else
				{
					edgeLabel = "";
				}
				if (this.directed)
				{
					this.cmd("Connect", this.circleID[i], this.circleID[j], EDGE_COLOR, this.adjustCurveForDirectedEdges(this.curve[i][j], this.adj_matrix[j][i] >= 0), 1, edgeLabel);
				}
				else
				{
					if(i<j)
					this.cmd("Connect", this.circleID[i], this.circleID[j], EDGE_COLOR, this.curve[i][j], 0, edgeLabel);							
				}
			}
		}
	}
	
}
Graph.prototype.buildEdges1 = function()
{
	var size_or_hits=0;
if(this.owning)
	size_or_hits=this.hit_counter;
else
	size_or_hits=this.size;
for (var i = 0; i < size_or_hits; i++)
	{
		for (var j = 0; j < size_or_hits; j++)
		{
			if (this.adj_matrix[i][j] >= 0)
			{
				this.cmd("Disconnect", this.circleID[i], this.circleID[j]);
				if(!this.directed)
					this.cmd("Disconnect", this.circleID[j], this.circleID[i]);
				var edgeLabel;
				if (this.showEdgeCosts)
				{
					edgeLabel = String(this.adj_matrix[i][j]);
				}
				else
				{
					edgeLabel = "";
				}
				if (this.directed)
				{
					this.cmd1("Connect", this.circleID[i], this.circleID[j],EDGE_COLOR, 0, 1, edgeLabel,"dim");
				}
				else
				{
					this.cmd1("Connect", this.circleID[i], this.circleID[j], EDGE_COLOR, 0, 0,edgeLabel,"dim");
				}
			}
		}
	}
	
}
Graph.prototype.setup = function() 
{	
	
	this.nextIndex=0;
	this.flag1=false;
	this.commands = new Array();
	this.circleID = new Array(this.size);
	for (var i = 0; i < this.size; i++)
	{
		this.circleID[i] = this.nextIndex++;
		this.cmd("CreateCircle", this.circleID[i], i, this. x_pos_logical[i], this. y_pos_logical[i]);
		this.cmd("SetTextColor", this.circleID[i], VERTEX_INDEX_COLOR, 0);
		this.cmd("SetLayer", this.circleID[i], 1);
	}
	
	this.adj_matrix = new Array(this.size);
	this.adj_matrixID = new Array(this.size);
	for (i = 0; i < this.size; i++)
	{
		this.adj_matrix[i] = new Array(this.size);
		this.adj_matrixID[i] = new Array(this.size);
	}

	var edgePercent;
	if (this.size == SMALL_SIZE)
	{
		if (this.directed)
		{
			edgePercent = 0.4;
		}
		else
		{
			edgePercent = 0.5;					
		}
		
	}
	else
	{
		if (this.directed)
		{
			edgePercent = 0.35;
		}
		else
		{
			edgePercent = 0.6;					
		}
		
	}
	
	var lowerBound = 0;
	if (this.directed)
	{
		for (var i = 0; i < this.size; i++)
		{
			for (var j = 0; j < this.size; j++)
			{
				this.adj_matrixID[i][j] = this.nextIndex++;
				if ((this.allowed[i][j]) && Math.random() <= edgePercent && (i < j || Math.abs(this.curve[i][j]) < 0.01 || this.adj_matrixID[j][i] == -1) && (!this.isDAG || (i < j)))
				{
					if (this.showEdgeCosts)
					{
						this.adj_matrix[i][j] = Math.floor(Math.random()* 9) + 1;
					}
					else
					{
						this.adj_matrix[i][j] = 1;
					}
					
				}
				else
				{
					this.adj_matrix[i][j] = -1;
				}
				
			}				
		}
		this.buildEdges();
	}
	else
	{
		for (i = 0; i < this.size; i++)
		{
			for (j = i+1; j < this.size; j++)
			{
				
				this.adj_matrixID[i][j] = this.nextIndex++;
				this.adj_matrixID[j][i] = this.nextIndex++;
				
				if ((this.allowed[i][j]) && Math.random() <= edgePercent)
				{
					if (this.showEdgeCosts)
					{
						this.adj_matrix[i][j] = Math.floor(Math.random()* 9) + 1;
					}
					else
					{
						this.adj_matrix[i][j] = 1;
					}
					this.adj_matrix[j][i] = this.adj_matrix[i][j];
				/*	if (this.showEdgeCosts)
					{
						var edgeLabel  = String(this.adj_matrix[i][j]);
					}
					else
					{
						edgeLabel = "";
					}
					this.cmd("Connect", this.circleID[i], this.circleID[j], EDGE_COLOR, this.curve[i][j], 0, edgeLabel);
				*/}
				else
				{
					this.adj_matrix[i][j] = -1;
					this.adj_matrix[j][i] = -1;
				}
				
			}				
		}
		
		this.buildEdges();
		
		
		for (i=0; i < this.size; i++)
		{
			this.adj_matrix[i][i] = -1;
		}
		
	}
		
	// Craate Adj List
	this.buildAdjList();
	
	
	// Create Adj Matrix
	
	this.buildAdjMatrix();
	
	
	
	this.animationManager.setAllLayers([0, this.currentLayer]);
	this.animationManager.StartNewAnimation(this.commands);
	this.animationManager.skipForward();
	this.animationManager.clearHistory();
	this.clearHistory();
}


Graph.prototype.resetAll = function()
{
	
}


Graph.prototype.buildAdjMatrix = function()
{
var size_or_hits=0;	
if(this.owning)
	size_or_hits=this.hit_counter;
else
	size_or_hits=this.size;
	
	this.adj_matrix_index_x = new Array(size_or_hits);
	this.adj_matrix_index_y = new Array(size_or_hits);
	for (var i = 0; i < size_or_hits; i++)
	{
		this.adj_matrix_index_x[i] = this.nextIndex++;
		this.adj_matrix_index_y[i] = this.nextIndex++;
		this.cmd("CreateLabel", this.adj_matrix_index_x[i], i,   this.adj_matrix_x_start + i*this.adj_matrix_width, this.adj_matrix_y_start - this.adj_matrix_height);
		this.cmd("SetForegroundColor", this.adj_matrix_index_x[i], VERTEX_INDEX_COLOR);
		this.cmd("CreateLabel", this.adj_matrix_index_y[i], i,   this.adj_matrix_x_start  - this.adj_matrix_width, this.adj_matrix_y_start + i* this.adj_matrix_height);
		this.cmd("SetForegroundColor", this.adj_matrix_index_y[i], VERTEX_INDEX_COLOR);
		this.cmd("SetLayer", this.adj_matrix_index_x[i], 3);
		this.cmd("SetLayer", this.adj_matrix_index_y[i], 3);
		
		for (var j = 0; j < size_or_hits; j++)
		{
			this.adj_matrixID[i][j] = this.nextIndex++;
			if (this.adj_matrix[i][j] < 0)
			{
				var lab = ""						
			}
			else
			{
				lab = String(this.adj_matrix[i][j])
			}
			this.cmd("CreateRectangle", this.adj_matrixID[i][j], lab, this.adj_matrix_width, this.adj_matrix_height, 
				this.adj_matrix_x_start + j*this.adj_matrix_width,this.adj_matrix_y_start + i * this.adj_matrix_height);
			this.cmd("SetLayer", this.adj_matrixID[i][j], 3);
			
			
		}				
	}
}



Graph.prototype.removeAdjList = function()
{
var size_or_hits=0;	
if(this.owning)
	size_or_hits=this.hit_counter;
else
	size_or_hits=this.size;
	for (var i = 0; i < size_or_hits; i++)
	{
		this.cmd("Delete", this.adj_list_list[i], "RAL1");
		this.cmd("Delete", this.adj_list_index[i], "RAL2");
		for (var j = 0; j < this.size; j++)
		{
			if (this.adj_matrix[i][j] > 0)
			{
				this.cmd("Delete", this.adj_list_edges[i][j], "RAL3");
			}	
		}
	}
	
}


// NEED TO OVERRIDE IN PARENT
Graph.prototype.reset = function()
{
	// Throw an error?
}


Graph.prototype.disableUI = function(event)
{
	if(this.ownGraphButton.disabled==true)
		this.flag1=true;
	this.ownGraphButton.disabled = true;
	this.defaultGraphButton.disabled=true;
	this.newGraphButton.disabled = true;
	if (this.directedGraphButton != null && this.directedGraphButton != undefined)
		this.directedGraphButton.disabled = true;
	if (this.undirectedGraphButton != null && this.undirectedGraphButton != undefined)
		this.undirectedGraphButton.disabled = true;
	this.smallGraphButton.disabled = true;
	this.largeGraphButton.disabled = true;
	if(this.owning)
		this.enable_canvas=false;
}



Graph.prototype.enableUI = function(event)
{
	if(!this.flag1)
	this.ownGraphButton.disabled = false;
	this.defaultGraphButton.disabled=false;
	this.newGraphButton.disabled = false;
	if (this.directedGraphButton != null && this.directedGraphButton != undefined)
		this.directedGraphButton.disabled = false;
	if (this.undirectedGraphButton != null && this.undirectedGraphButton != undefined)
		this.undirectedGraphButton.disabled = false;
	this.smallGraphButton.disabled = false;
	this.largeGraphButton.disabled = false;
		if(this.owning){
			this.largeGraphButton.disabled=true;
			this.smallGraphButton.disabled=true;
			this.enable_canvas=true;
			}
}



/* no init, this is only a base class! */
 var currentAlg;
 function init()
 {
 var animManag = initCanvas();
 currentAlg = new Graph(animManag, canvas.width, canvas.height);
}

				
	
