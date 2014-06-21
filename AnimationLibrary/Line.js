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


// This class is somewhat poorly named -- it handles links between vertices in graphs,
//  pointers in linked lists, and so on. 


var LINE_maxHeightDiff = 5;
var LINE_minHeightDiff = 3;
var LINE_range= LINE_maxHeightDiff - LINE_minHeightDiff + 1;
var LINE_highlightDiff = 3;

	
function Line(n1, n2, color, cv, d, weight, anchorIndex)
{
	this.pointxl=[];
	this.pointyl=[];
	this.curve_calculated=false;
	this.arrowHeight = 8;
	this.arrowWidth = 4;
	this.cont=null;
	this.Node1 = n1;
	this.Node2 = n2;
	this.Dirty = false;
	this.directed = d;
	this.edgeColor = color;
	this.edgeLabel = weight;
	this.highlighted = false;
	this.addedToScene = true;
	this.anchorPoint = anchorIndex;
	this.highlightDiff = 0;
	this.curve = cv;
	this.contrla=0;
	this.contrlb=0;
	
	this.alpha = 1.0;
	this.color = function color()
	{
		return this.edgeColor;   
	}
	   
	this.setColor = function(newColor)
	{
		this.edgeColor = newColor;
		Dirty = true;
	}
	   
	this.setHighlight = function(highlightVal)
	{
		this.highlighted = highlightVal;   
	}
		   
	this.pulseHighlight = function(frameNum)
	{
	   if (this.highlighted)
	   {
		   var frameMod = frameNum / 14.0;
		   var delta  = Math.abs((frameMod) % (2 * LINE_range  - 2) - LINE_range + 1)
		   this.highlightDiff =  delta + LINE_minHeightDiff;
		   Dirty = true;			   
	   }
	}
	   
	   
	this.hasNode = function(n)
	{
		return ((this.Node1 == n) || (this.Node2 == n));   
	}
	   
	   
	this.createUndoDisconnect  = function()
        {
		return new UndoConnect(this.Node1.objectID, this.Node2.objectID, true, this.edgeColor, this.directed, this.curve, this.edgeLabel, this.anchorPoint);
	}
	   
	   
	this.sign = function(n)
	{
	   if (n > 0)
	   {
		   return 1;
	   }
	   else
	   {
		   return -1;
	   }
	}
	this.check_for_cut_line = function(a1,b1,a2,b2,an1,an2){
		var slope = (b2-b1)/(a2-a1);	
		var a=b2-b1;
		var b=a1-a2;
		var c=b1*(a2-a1)-a1*(b2-b1);
		var g=0;
		for(g=0;g<this.pointxl.length;g++){
			var b1x;
			var d=Math.abs((a*this.pointxl[g]+b*this.pointyl[g]+c))/Math.sqrt(a*a+b*b);
			b1x=(d > 0.000001) && (d < 20) && ((Math.min(a1,a2)<this.pointxl[g]) && (Math.max(a1,a2)>this.pointxl[g]));
			if(b1x){
				break;
				}
		}
		if(g!=this.pointxl.length){
		var theta =Math.atan(-slope);
		if(theta<0)
			theta=theta+Math.PI;
		var a1_new=a1*Math.cos(theta)-b1*Math.sin(theta);
		var b1_new=-a1*Math.sin(theta)-b1*Math.cos(theta);
		var a2_new=a2*Math.cos(theta)-b2*Math.sin(theta);
		var b2_new=-a2*Math.sin(theta)-b2*Math.cos(theta);
		var anx_new=an1*Math.cos(theta)-an2*Math.sin(theta);
		var any_new=-an1*Math.sin(theta)-an2*Math.cos(theta);
		var temp_xarr=[];
		var temp_yarr=[];
		var e=0;
		for( e=0;e<this.pointxl.length;e++){
			temp_xarr.push(this.pointxl[e]*Math.cos(theta)-this.pointyl[e]*Math.sin(theta));
			temp_yarr.push(-this.pointxl[e]*Math.sin(theta)-this.pointyl[e]*Math.cos(theta));
		}
			return this.check_for_cut_parabola(a1_new,b1_new,a2_new,b2_new,anx_new,any_new,temp_xarr,temp_yarr,0.25,[a1,b1,a2,b2]);
			}
		else {
			this.curve_calculated=true;
			this.draw_basic([a1,b1,a2,b2,an1,an2]);
			this.curve_original=0;
			return [an1,an2];
			}
	}
	this.check_for_cut_parabola = function(a1_new,b1_new,a2_new,b2_new,anx_new,any_new,arrx,arry,cur,arr_original){
		if(cur<1.25){
		var x=(a1_new+a2_new)/2.0;
		var ar= this.control_next([a1_new,b1_new,a2_new,b2_new],cur);
		var anx_neww=ar[0];
		var any_neww=ar[1];
		var m=(b2_new-any_neww)/(a2_new-anx_neww);
		var c=m/(2*(a2_new-x));
		var y=b2_new-c*Math.pow(a2_new-x,2);
		var a_en=c;
		var b_en=-2*x*c;
		var c_en=y+c*Math.pow(x,2);
		var r=0;
		var num_points=0;
		for(r=0;r<arrx.length;r++){
			var x_temp=arrx[r];
			var y_temp=arry[r];
			var x_cube=2*a_en*a_en;
			var x_sqr= 3*a_en*b_en;
			var x_one=1+b_en*b_en+2*a_en*(c_en-y_temp);
			var x_zero=b_en*(c_en-y_temp)-x_temp;
			var roots_x=this.findRoots(x_cube,x_sqr,x_one,x_zero);
			var roots_y1=a_en*roots_x[0]*roots_x[0]+b_en*roots_x[0]+c_en;
			var d1=Math.pow(x_temp-roots_x[0],2)+Math.pow(y_temp-roots_y1,2);
			var d1_range=((Math.min(a1_new,a2_new)-30<x_temp && x_temp<Math.max(a1_new,a2_new)+30) &&(d1<400));
			if(!roots_x[3]){
				var roots_y2=a_en*roots_x[1]*roots_x[1]+b_en*roots_x[1]+c_en;
				var roots_y3=a_en*roots_x[2]*roots_x[2]+b_en*roots_x[2]+c_en;
				var d2=Math.pow(x_temp-roots_x[1],2)+Math.pow(y_temp-roots_y2,2);
				var d3=Math.pow(x_temp-roots_x[2],2)+Math.pow(y_temp-roots_y3,2);
				var d2_range=(Math.min(a1_new,a2_new)<x_temp && x_temp<Math.max(a1_new,a2_new)) && (Math.min(b1_new,any_neww-20)<y_temp && y_temp>Math.max(b1_new,any_neww-20)) && (d2<400);
				var d3_range=(Math.min(a1_new,a2_new)<x_temp && x_temp<Math.max(a1_new,a2_new)) && (Math.min(b1_new,any_neww-20)<y_temp && y_temp>Math.max(b1_new,any_neww-20)) && (d3<400);
				if(d2_range || d3_range || d1_range)
					break;
			}
			else{
				if(d1_range){
					num_points++;
				}

			}
		}
		if(num_points!=2){
			var e=this.control_next([a1_new,b1_new,a2_new,b2_new],cur+0.25);
			return this.check_for_cut_parabola(a1_new,b1_new,a2_new,b2_new,e[0],e[1],arrx,arry,cur+0.25,arr_original);
		}
		else {
			var ar1 = this.control_next([arr_original[0],-arr_original[1],arr_original[2],-arr_original[3]],cur);
			ar1=[ar1[0],-ar1[1]];
			this.curve_calculated=true;
			this.curve_original=cur;
			this.draw_basic([arr_original[0],arr_original[1],arr_original[2],arr_original[3],ar1[0],ar1[1]]);
			return ar1;
			}}
		else{
			var ar1 = this.control_next([arr_original[0],-arr_original[1],arr_original[2],-arr_original[3]],cur);
			ar1=[ar1[0],-ar1[1]];
			this.curve_calculated=true;
			this.curve_original=cur;
			this.draw_basic([arr_original[0],arr_original[1],arr_original[2],arr_original[3],ar1[0],ar1[1]]);
			return ar1;	
		}
}
	this.findRoots = function (a,b,c,d){
		var x1=0;
		var x2=0;
		var x3=0;
		var choice=0;
		var sign=0;
		var dans=0;
		var x_isimg=false;
f = eval(((3*c)/a) - (((b*b)/(a*a))))/3

g = eval((2*((b*b*b)/(a*a*a))-(9*b*c/(a*a)) + ((27*(d/a)))))/27

h = eval(((g*g)/4) + ((f*f*f)/27))

if (h > 0)

{
m = eval(-(g/2)+ (Math.sqrt(h)))

k=1
if (m < 0) k=-1; else k=1
m2 = eval(Math.pow((m*k),(1/3)))
m2 = m2*k
k=1
n = eval(-(g/2)- (Math.sqrt(h)))
if (n < 0) k=-1; else k=1
n2 = eval(Math.pow((n*k),(1/3)))
n2 = n2*k
k=1
x1= eval ((m2 + n2) - (b/(3*a)))

x2=(-1*(m2 + n2)/2 - (b/(3*a)) + " + i* " + ((m2 - n2)/2)*Math.pow(3,.5));
x_isimg=true;
x3=(-1*(m2 + n2)/2 - (b/(3*a)) + " - i* " + ((m2 - n2)/2)*Math.pow(3,.5));
}


if (h<=0)

{
r = (eval(Math.sqrt((g*g/4)-h)))
k=1
if (r<0) k=-1
rc = Math.pow((r*k),(1/3))*k
k=1
theta =Math.acos((-g/(2*r)))
x1=eval (2*(rc*Math.cos(theta/3))-(b/(3*a)))
x2a=rc*-1
x2b= Math.cos(theta/3)
x2c= Math.sqrt(3)*(Math.sin(theta/3))
x2d= (b/3*a)*-1
x2=eval(x2a*(x2b + x2c))-(b/(3*a))
x3=eval(x2a*(x2b - x2c))-(b/(3*a))

x1=x1*1E+14;x1=Math.round(x1);x1=(x1/1E+14);
x2=x2*1E+14;x2=Math.round(x2);x2=(x2/1E+14);
x3=x3*1E+14;x3=Math.round(x3);x3=(x3/1E+14);

}



if ((f+g+h)==0)

{
if (d<0) {sign=-1};if (d>=0) {sign=1};
if (sign>0){dans=Math.pow((d/a),(1/3));dans=dans*-1};
if (sign<0){d=d*-1;dans=Math.pow((d/a),(1/3))};
x1=dans; x2=dans;x3=dans;
}
 	return [x1,x2,x3,x_isimg];	
}
	this.draw_basic = function(arr) {
		this.cont.beginPath();
		this.cont.moveTo(arr[0], arr[1]);
		this.cont.quadraticCurveTo(arr[4],arr[5], arr[2], arr[3]);
		this.cont.stroke();
	}
	this.control_next = function(arr,cur){
		var delx=arr[2]-arr[0];
		var dely=arr[3]-arr[1];
		var midx=(delx)/2.0+arr[0];
		var midy=(dely)/2.0+arr[1];
		var contx=midx-dely*cur;
		var conty=midy+delx*cur;
		return [contx,conty];
	}
	this.give_anchor_for_id=function(curve){
		var fromPos = this.Node1.getTailPointerAttachPos(this.Node2.x, this.Node2.y, this.anchorPoint);
		var toPos = this.Node2.getHeadPointerAttachPos(this.Node1.x, this.Node1.y);
		var temp_array=this.control_next([fromPos[0],-fromPos[1],toPos[0],-toPos[1]],curve);
		return [temp_array[0],-temp_array[1]];
	}
	this.drawArrow = function()
	{
		var pensize=arguments[0];
		var color=arguments[1];
		this.cont=arguments[2];
		this.cont.strokeStyle = color;
		this.cont.fillStyle = color;
		this.cont.lineWidth = pensize;
		var fromPos = this.Node1.getTailPointerAttachPos(this.Node2.x, this.Node2.y, this.anchorPoint);
		var toPos = this.Node2.getHeadPointerAttachPos(this.Node1.x, this.Node1.y);
		var deltaX ;
		var deltaY ;
		var midX ;
		var midY ;
		var controlX;
		var controlY;
		if(this.curve==-1.57){
		deltaX = toPos[0] - fromPos[0];
		deltaY = toPos[1] - fromPos[1];
		midX = (deltaX) / 2.0 + fromPos[0];
		midY = (deltaY) / 2.0 + fromPos[1];
		controlX=midX;
		controlY=midY;
		var new_control=new Array();
		if(this.curve_calculated==true){
			this.draw_basic([fromPos[0],fromPos[1],toPos[0],toPos[1],this.contrla,this.contrlb]);
			}
		else{ 
			new_control=this.check_for_cut_line(fromPos[0],fromPos[1],toPos[0],toPos[1],controlX,controlY);
			controlX=new_control[0];
			controlY=new_control[1];
			this.contrla=controlX;
			this.contrlb=controlY;	
		}
		}
		else{
		deltaX = toPos[0] - fromPos[0];
		deltaY = toPos[1] - fromPos[1];
		midX = (deltaX) / 2.0 + fromPos[0];
		midY = (deltaY) / 2.0 + fromPos[1];
		controlX = midX - deltaY * this.curve;
		controlY = midY + deltaX * this.curve;
		this.contrla=controlX;
		this.contrlb=controlY;
		this.draw_basic([fromPos[0],fromPos[1],toPos[0],toPos[1],this.contrla,this.contrlb]);
		}
		//this.cont.closePath();
			
		// Position of the edge label:  First, we will place it right along the
		// middle of the curve (or the middle of the line, for curve == 0)
		
		var labelPosX = 0.25* fromPos[0] + 0.5*this.contrla+ 0.25*toPos[0]; 
		var labelPosY =  0.25* fromPos[1] + 0.5*this.contrlb + 0.25*toPos[1]; 
			
		// Next, we push the edge position label out just a little in the direction of
		// the curve, so that the label doesn't intersect the cuve (as long as the label
		// is only a few characters, that is)
		var midLen = Math.sqrt(deltaY*deltaY + deltaX*deltaX);
		if (midLen != 0)
		{
			if(this.curve==-1.57){
			labelPosX +=  ( deltaY * this.sign(this.curve_calculated))  / midLen * 10 
			labelPosY += (-deltaX * this.sign(this.curve_calculated))  / midLen * 10  
			}
			else{
			labelPosX +=  (- deltaY * this.sign(this.curve))  / midLen * 10 
			labelPosY += ( deltaX * this.sign(this.curve))  / midLen * 10  
			}
		}
			


		this.cont.textAlign = 'center';
		this.cont.font         = '10px sans-serif';
		this.cont.textBaseline   = 'middle'; 
		this.cont.fillText(this.edgeLabel, labelPosX, labelPosY);

		if (this.directed)
		{
			var xVec = this.contrla - toPos[0];
			var yVec = this.contrlb - toPos[1];
			var len = Math.sqrt(xVec * xVec + yVec*yVec);
		
			if (len > 0)
			{
				xVec = xVec / len
				yVec = yVec / len;
				
				this.cont.beginPath();
				this.cont.moveTo(toPos[0], toPos[1]);
				this.cont.lineTo(toPos[0] + xVec*this.arrowHeight - yVec*this.arrowWidth, toPos[1] + yVec*this.arrowHeight + xVec*this.arrowWidth);
				this.cont.lineTo(toPos[0] + xVec*this.arrowHeight + yVec*this.arrowWidth, toPos[1] + yVec*this.arrowHeight - xVec*this.arrowWidth);
				this.cont.lineTo(toPos[0], toPos[1]);
				this.cont.closePath();
				this.cont.stroke();
				this.cont.fill();
			}

		}
	   }
	   
	   
	   this.draw = function()
	   {
	   	var ctx=arguments[0];
		   if (!this.addedToScene)
		   {
			   return;   
		   }
		   ctx.globalAlpha = this.alpha;
			
			
			if(arguments.length==1){
				if (this.highlighted)
				this.drawArrow(this.highlightDiff, "#FF0000", ctx);
				this.drawArrow(1, this.edgeColor, ctx);
				}
			else{
				
				if (this.highlighted)
				this.drawArrow(this.highlightDiff, "#FF0000", ctx,"pimp");
				this.drawArrow(1, this.edgeColor, ctx,"pimp");
				
				}
	   }
	   
	   
}
	


function UndoConnect(from, to, createConnection, edgeColor, isDirected, cv, lab, anch)
{
	this.fromID = from;
	this.toID = to;
	this.connect = createConnection;
	this.color = edgeColor;
	this.directed = isDirected;
	this.curve = cv;
	this.edgeLabel = lab;
	this.anchorPoint = anch;
}


UndoConnect.prototype.undoInitialStep = function(world)
{
	if (this.connect)
	{
		world.connectEdge(this.fromID, this.toID, this.color, this.curve, this.directed, this.edgeLabel,this.anchorPoint);
	}
	else
	{
		world.disconnect(this.fromID,this.toID);
	}
}


UndoConnect.prototype.addUndoAnimation = function(animationList)
{
	return false;
}
