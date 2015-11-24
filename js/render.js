function simple(shape){
	var bb,gm,sx,sy,pix,tr,tg,tb,ta,sc;
	bb=shape.getBBox();
	gm=g.transform().globalMatrix;
	sx=parseInt(gm.x(bb.cx,bb.cy));
	sy=parseInt(gm.y(bb.cx,bb.cy));
	if(sx<0){sx=0}else if(sx>=w){sx=w-1}
	if(sy<0){sy=0}else if(sy>=h){sy=h-1}
	pix=sy*w+sx;
	tr=Math.round(pd.data[pix*4]);
	tg=Math.round(pd.data[pix*4+1]);
	tb=Math.round(pd.data[pix*4+2]);
	ta=pd.data[pix*4+3]/255;
	sc="rgba("+tr+","+tg+","+tb+","+ta+")";
	shape.attr({fill:sc});
}
function updataLink(){
	var source=svg.outerSVG();
	source = source.replace(/<(g|\/g|\/svg|rect|path|polygon|desc)/g,"\n\r<$1");
	source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
	source = '<?xml version="1.0" encoding="utf-8"?>\n\r' + source;
	var url = "data:image/svg+xml;charset=utf-8,"+encodeURIComponent(source);
	$("#export").attr("href",url);
}
function drawPoly(e,x,y,s){
	var or=arguments[4] ? arguments[4] : 0;
	var ra=Math.PI*2/e;
	var temp=[];
	for(p=0;p<e;p++){
		temp.push(s*Math.sin(ra*p+or)+x);
		temp.push(s*-Math.cos(ra*p+or)+y);
	}
	return g.polygon(temp);
}
function render(){
	$("#svg>g").empty();
	$("#pBar").css("width","0px");
	$("#pBarBox").css("display","block");
	var fix=.5,allc,curc,ts;
	var L=Math.sqrt(w*w+h*h);
	var tType=prop["Type"].v;
	if(tType=="Rect"){
		var sizeX=prop["Width"].v;
		var sizeY=prop["Height"].v;
		var rot=prop["Rotation"].v;
		var cx=Math.ceil(L/sizeX);
		var cy=Math.ceil(L/sizeY);
		allc=cx*cy;curc=0;
		g.transform("translate("+w/2+","+h/2+") rotate("+rot+",0,0)");
		var spx=-sizeX*cx/2;
		var spy=-sizeY*cy/2;
		for(var j=0;j<cy;j++){
			for(var i=0;i<cx;i++){
				ts=g.rect(spx+i*sizeX,spy+j*sizeY,sizeX+fix,sizeY+fix);
				simple(ts);
				curc ++;
				if(curc%100==0){$("#pBar").css("width",parseInt(curc/allc*500)+"px")}
			}
		}
	}else if(tType=="Hex"){
		var size=prop["Size"].v;
		var rx=size*Math.sqrt(3);
		var ry=size*1.5;
		var rot=prop["Rotation"].v;
		var cx=Math.ceil(L/rx);
		var cy=Math.ceil(L/ry);
		allc=cx*cy;curc=0;
		g.transform("translate("+w/2+","+h/2+") rotate("+rot+",0,0)");
		var spx=-rx*cx/2;
		var spy=-ry*cy/2;
		for(var j=0;j<cy;j++){
			for(var i=0;i<cx;i++){
				if(j%2==0){
					ts=drawPoly(6,spx+(i+.5)*rx,spy+j*ry+size,size+fix);
				}else{
					ts=drawPoly(6,spx+(i+1)*rx,spy+j*ry+size,size+fix);
				}
				simple(ts);
				curc ++;
				if(curc%100==0){$("#pBar").css("width",parseInt(curc/allc*500)+"px")}
			}
		}
	}else if(tType=="Tri1"){
		var size=prop["Size"].v;
		var rx=size/2;
		var ry=size*Math.sqrt(3)/2;
		var dsize=size*Math.sqrt(3)/3;
		var rot=prop["Rotation"].v;
		var cx=Math.ceil(L/rx);
		var cy=Math.ceil(L/ry);
		allc=cx*cy;curc=0;
		g.transform("translate("+w/2+","+h/2+") rotate("+rot+",0,0)");
		var spx=-rx*cx/2;
		var spy=-ry*cy/2;
		for(var j=0;j<cy;j++){
			for(var i=0;i<cx;i++){
				if(j%2==0){
					if(i%2==0){
						ts=drawPoly(3,spx+i*rx,spy+(j+2/3)*ry,dsize+fix);
					}else{
						ts=drawPoly(3,spx+i*rx,spy+(j+1/3)*ry,dsize+fix,Math.PI/3);
					}
				}else{
					if(i%2==0){
						ts=drawPoly(3,spx+i*rx,spy+(j+1/3)*ry,dsize+fix,Math.PI/3);
					}else{
						ts=drawPoly(3,spx+i*rx,spy+(j+2/3)*ry,dsize+fix);
					}
				}
				simple(ts);
				curc ++;
				if(curc%100==0){$("#pBar").css("width",parseInt(curc/allc*500)+"px")}
			}
		}
	}else{
		//...
	}
	updataLink();
	$("#pBar").css("width","500px");
	var pbt=setTimeout(function(){
		$("#pBarBox").css("display","none");
		clearTimeout(pbt);
	},500);
}