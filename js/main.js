var _ep,_cp,_win,canvas,ctx,svg,g,scl=1;
var img,w,h,pd,rer=new FileReader();
var prop={
	"Type":{"type":"list","options":["Rect","Hex","Tri1"],"v":"Rect"},
	"Size":{"type":"slider","min":10,"max":400,"v":50},
	"Width":{"type":"slider","min":10,"max":400,"v":50},
	"Height":{"type":"slider","min":10,"max":400,"v":50},
	"Rotation":{"type":"slider","min":0,"max":360,"v":0},
};
var propSwitch={
	"Rect":["Type","Width","Height","Rotation"],
	"Hex":["Type","Size","Rotation"],
	"Tri1":["Type","Size","Rotation"],
};
$(function(){
	_win={
		"w":parseInt($("#compBox").css("width"))-10,
		"h":parseInt($("#compBox").css("height"))-10,
	}
	canvas=document.getElementById('bg');
	ctx=canvas.getContext("2d");
	svg=Snap("#svg");
	g=svg.g();
	_ep=$("#effectBox");
	_cp=$("#comp");
	rer.onload=function(e){
		img=new Image();
		img.src=e.target.result;
		img.onload=function(){
			ctx.clearRect(0,0,canvas.width,canvas.height);
			w=img.width;h=img.height;
			_cp.css({"width":w,"height":h});
			_cp.css({"left":(_win.w+10-w)/2+"px","top":(_win.h+10-h)/2+"px"});
			if(w>_win.w || h>_win.h){
				scl=(w/h > _win.w/_win.h) ? (_win.w/w) : (_win.h/h);
				setScale(scl);
			}else{
				scl=1;
				setScale(1);
			}
			canvas.width=w;canvas.height=h;
			svg.attr({width:w,height:h});
			g.attr({transform:"translate("+parseInt(w/2)+","+parseInt(h/2)+")"});
			ctx.drawImage(img,0,0,w,h);
			pd=ctx.getImageData(0,0,w,h);
			$("#mask").css("display","none");
			updataUI();
			render();
		}
	}
	$("#file").change(function(e){
		var files = e.target.files;
		if(files.length==0){return}
		if(files[0].type.indexOf("image") == -1){
			alert("not a valid image file");
			return;
		}
		rer.readAsDataURL(files[0]); 
	});
});