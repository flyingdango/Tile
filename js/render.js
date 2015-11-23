function simple(x,y){
	var sx=parseInt(x),sy=parseInt(y);
	if(sx<0){sx=0}else if(sx>=w){sx=w-1}
	if(sy<0){sy=0}else if(sy>=h){sy=h-1}
	var pix=sy*w+sx;
	var tr=Math.round(pd.data[pix*4]);
	var tg=Math.round(pd.data[pix*4+1]);
	var tb=Math.round(pd.data[pix*4+2]);
	var ta=pd.data[pix*4+3]/255;
	//console.log([sx,sy,tr,tg,tb,ta]);
	return "rgba("+tr+","+tg+","+tb+","+ta+")";
}
function updataLink(){
	var source=svg.outerSVG();
	source = source.replace(/<(g|\/g|\/svg|rect|path|polygon|desc)/g,"\n\r<$1");
	source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
	source = '<?xml version="1.0" encoding="utf-8"?>\n\r' + source;
	var url = "data:image/svg+xml;charset=utf-8,"+encodeURIComponent(source);
	$("#export").attr("href",url);
}
function drawHex(x,y,s){
	var ra=Math.PI/3;
	var temp=[];
	for(p=0;p<6;p++){
		temp.push(s*Math.sin(ra*p)+x);
		temp.push(s*-Math.cos(ra*p)+y);
	}
	return g.polygon(temp);
}
function render(){
	$("#svg>g").empty();
	var fix=.5;
	var L=Math.sqrt(w*w+h*h);
	var tType=prop["Type"].v;
	if(tType=="Rect"){
		var sizeX=prop["Width"].v;
		var sizeY=prop["Height"].v;
		var rot=prop["Rotation"].v;
		var cx=Math.ceil(L/sizeX);
		var cy=Math.ceil(L/sizeY);
		//console.log([cx,cy]);
		g.transform("translate("+w/2+","+h/2+") rotate("+rot+",0,0)");
		var spx=-sizeX*cx/2;
		var spy=-sizeY*cy/2;
		var ts,bb,gm,simp,pix,sc;
		for(var j=0;j<cy;j++){
			for(var i=0;i<cx;i++){
				ts=g.rect(spx+i*sizeX,spy+j*sizeY,sizeX+fix,sizeY+fix);
				bb=ts.getBBox();
				gm=g.transform().globalMatrix;
				sc=simple(gm.x(bb.cx,bb.cy),gm.y(bb.cx,bb.cy));
				ts.attr({fill:sc});
			}
		}
	}else if(tType=="Hex"){
		var size=prop["Size"].v;
		var rx=size*Math.sqrt(3);
		var ry=size*1.5;
		var rot=prop["Rotation"].v;
		var cx=Math.ceil(L/rx);
		var cy=Math.ceil(L/ry);
		g.transform("translate("+w/2+","+h/2+") rotate("+rot+",0,0)");
		var spx=-rx*cx/2;
		var spy=-ry*cy/2;
		var ts,bb,gm,simp,pix,sc;
		for(var j=0;j<cy;j++){
			for(var i=0;i<cx;i++){
				if(j%2==0){
					ts=drawHex(spx+(i+.5)*rx,spy+j*ry+size,size+fix);
				}else{
					ts=drawHex(spx+(i+1)*rx,spy+j*ry+size,size+fix);
				}
				bb=ts.getBBox();
				gm=g.transform().globalMatrix;
				sc=simple(gm.x(bb.cx,bb.cy),gm.y(bb.cx,bb.cy));
				ts.attr({fill:sc});
			}
		}
	}else{
		//...
	}
	updataLink();
}