function simple(shape){
	var bb,sp,sx,sy,pix,tr,tg,tb,ta,sc;
	if(arguments[1]){
		sp=arguments[1];
		sx=parseInt(ggm.x(sp[0],sp[1]));
		sy=parseInt(ggm.y(sp[0],sp[1]));
	}else{
		bb=shape.getBBox();
		sx=parseInt(ggm.x(bb.cx,bb.cy));
		sy=parseInt(ggm.y(bb.cx,bb.cy));
	}
	//console.log([sx,sy]);
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
	source = source.replace(/<(g|\/g|\/svg|rect|path|polygon|desc|defs)/g,"\n\r<$1");
	source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
	source = '<?xml version="1.0" encoding="utf-8"?>\n\r' + source;
	var url = "data:image/svg+xml;charset=utf-8,"+encodeURIComponent(source);
	$("#export").attr("href",url);
}
function drawPoly(e,x,y,s){
	var or=arguments[4] ? arguments[4] : 0;
	var ra=Math.PI*2/e;
	var l=(s/2)/(Math.sin(ra/2));
	var temp=[];
	for(p=0;p<e;p++){
		temp.push(l*Math.sin(ra*p+or)+x);
		temp.push(l*-Math.cos(ra*p+or)+y);
	}
	return g.polygon(temp);
}
function drawTri2(x,y,s){
	var or=arguments[3] ? arguments[3] : 0;
	var l=s/Math.sqrt(2);
	var ra=[-Math.PI/4,Math.PI/4,Math.PI*5/4];
	var temp=[];
	for(p=0;p<3;p++){
		temp.push(l*Math.sin(ra[p]+or)+x);
		temp.push(l*-Math.cos(ra[p]+or)+y);
	}
	var tri = g.polygon(temp);
	var tsp=[l/2*Math.sin(-Math.PI/4+or)+x,l/2*-Math.cos(-Math.PI/4+or)+y];
	//console.log(tsp);
	simple(tri,tsp);
}
// function offsetPath(pa,o){
// 	var sum=[0,0],pc,dv,dn,nl,nv,np,npa=[];
// 	pc=pa.length/2;
// 	for(var p=0;p<pc;p++){
// 		sum[0]=sum[0]+pa[p*2];
// 		sum[1]=sum[1]+pa[p*2+1];
// 	}
// 	var avg=[sum[0]/pc,sum[1]/pc];
// 	//console.log(pa);
// 	for(var p=0;p<pc;p++){
// 		dv=[pa[p*2]-avg[0],pa[p*2+1]-avg[1]];
// 		dn=getNormal(dv)
// 		nl=getLength(dv)+o;
// 		nv=[dn[0]*nl,dn[1]*nl];
// 		npa.push(avg[0]+nv[0]);
// 		npa.push(avg[1]+nv[1]);
// 	}
// 	//console.log(npa);
// 	return npa;
// }
// function getLength(v){
// 	return Math.sqrt(v[0]*v[0]+v[1]*v[1]);
// }
// function getNormal(v){
// 	var l=Math.sqrt(v[0]*v[0]+v[1]*v[1]);
// 	if(l==0){return [0,0]}
// 	return [v[0]/l,v[1]/l];
// }
function render(){
	$("#svg>g").empty();
	$("#pBar").css("width","20px");
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
		ggm=g.transform().globalMatrix;
		var spx=-sizeX*cx/2;
		var spy=-sizeY*cy/2;
		for(var j=0;j<cy;j++){
			for(var i=0;i<cx;i++){
				ts=g.rect(spx+i*sizeX,spy+j*sizeY,sizeX+fix,sizeY+fix);
				simple(ts);
				curc ++;
				if(curc%500==0){$("#pBar").css("width",parseInt(curc/allc*500)+"px")}
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
		ggm=g.transform().globalMatrix;
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
				if(curc%500==0){$("#pBar").css("width",parseInt(curc/allc*500)+"px")}
			}
		}
	}else if(tType=="Tri1"){
		var size=prop["Size"].v;
		var rx=size/2;
		var ry=size*Math.sqrt(3)/2;
		var rot=prop["Rotation"].v;
		var cx=Math.ceil(L/rx);
		var cy=Math.ceil(L/ry);
		allc=cx*cy;curc=0;
		g.transform("translate("+w/2+","+h/2+") rotate("+rot+",0,0)");
		ggm=g.transform().globalMatrix;
		var spx=-rx*cx/2;
		var spy=-ry*cy/2;
		for(var j=0;j<cy;j++){
			for(var i=0;i<cx;i++){
				if(j%2==0){
					if(i%2==0){
						ts=drawPoly(3,spx+i*rx,spy+(j+2/3)*ry,size+fix);
					}else{
						ts=drawPoly(3,spx+i*rx,spy+(j+1/3)*ry,size+fix,Math.PI/3);
					}
				}else{
					if(i%2==0){
						ts=drawPoly(3,spx+i*rx,spy+(j+1/3)*ry,size+fix,Math.PI/3);
					}else{
						ts=drawPoly(3,spx+i*rx,spy+(j+2/3)*ry,size+fix);
					}
				}
				simple(ts);
				curc ++;
				if(curc%500==0){$("#pBar").css("width",parseInt(curc/allc*500)+"px")}
			}
		}
	}else if(tType=="Tri2"){
		var size=prop["Size"].v;
		var rot=prop["Rotation"].v;
		var cx=Math.ceil(L/size);
		var cy=Math.ceil(L/size);
		allc=cx*cy;curc=0;
		g.transform("translate("+w/2+","+h/2+") rotate("+rot+",0,0)");
		ggm=g.transform().globalMatrix;
		var spx=-size*cx/2;
		var spy=-size*cy/2;
		for(var j=0;j<cy;j++){
			for(var i=0;i<cx;i++){
				if(j%2==0){
					if(i%2==0){
						drawTri2(spx+(i+.5)*size,spy+(j+.5)*size,size+fix);
						drawTri2(spx+(i+.5)*size,spy+(j+.5)*size,size+fix,Math.PI);
					}else{
						drawTri2(spx+(i+.5)*size,spy+(j+.5)*size,size+fix,-Math.PI/2);
						drawTri2(spx+(i+.5)*size,spy+(j+.5)*size,size+fix,Math.PI/2);
					}
				}else{
					if(i%2==1){
						drawTri2(spx+(i+.5)*size,spy+(j+.5)*size,size+fix);
						drawTri2(spx+(i+.5)*size,spy+(j+.5)*size,size+fix,Math.PI);
					}else{
						drawTri2(spx+(i+.5)*size,spy+(j+.5)*size,size+fix,-Math.PI/2);
						drawTri2(spx+(i+.5)*size,spy+(j+.5)*size,size+fix,Math.PI/2);
					}
				}
				curc ++;
				if(curc%500==0){$("#pBar").css("width",parseInt(curc/allc*500)+"px")}
			}
		}
	}else if(tType=="Delaunay"){
		g.transform("none");
		ggm=g.transform().globalMatrix;
		var size=prop["Size"].v;
		var sampler = poissonDiscSampler(w+size, h+size, size);
		var sample,temp=[];
		var vertices=[[-size,-size],[w+size,-size],[w+size,h+size],[-size,h+size]];
		while ((sample = sampler())) {
		  vertices.push(sample);
		}
		var tris=d3.geom.voronoi().triangles(vertices);
		for(var c=0;c<tris.length;c++){
			temp=[];
			for(var j=0;j<3;j++){
				temp.push(tris[c][j][0],tris[c][j][1]);
			}
			//console.log(temp);
			ts=g.polygon(temp);
			simple(ts);
		}
	}else if(tType=="Voronoi"){
		g.transform("none");
		ggm=g.transform().globalMatrix;
		var size=prop["Size"].v;
		var sampler = poissonDiscSampler(w, h, size);
		var sample,temp=[];
		var vertices=[];
		while ((sample = sampler())) {
		  vertices.push(sample);
		}
		var vo=d3.geom.voronoi();
		var cells=vo(vertices);
		for(var c=0;c<cells.length;c++){
			temp=[];
			for(var j=0;j<cells[c].length;j++){
				temp.push(cells[c][j][0],cells[c][j][1]);
			}
			//console.log(temp);
			ts=g.polygon(temp);
			simple(ts);
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