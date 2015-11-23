function addSlider(name,min,max){
	var smin=5;smax=280;
	var tel='<div id="ID_'+name+'" class="slider">\n'+
				'<span class="prop_name">'+name+'</span>\n'+
				'<span class="prop_value">'+prop[name].v.toFixed(2)+'</span>\n'+
				'<span class="prop_min">'+min.toFixed(2)+'</span>\n'+
				'<span class="prop_max">'+max.toFixed(2)+'</span>\n'+
				'<div class="slider_line"></div>\n'+
				'<div class="slider_block"></div>\n'+
			'</div>';
	_ep.append(tel);
	var ts=$("#ID_"+name+">.slider_block");
	var tv=$("#ID_"+name+">.prop_value");
	ts.css("left",prop[name].v/(max-min)*(smax-smin)+smin+"px");
	ts.bind("mousedown",function(e){
		var omp=e.pageX;
		var op=parseInt(ts.css("left"));
		$(document).bind("mousemove",function(e1){
			var np=e1.pageX-omp+op;
			if(np<smin){np=smin}
			if(np>smax){np=smax}
			ts.css("left",np+"px");
			var rv=(np-smin)/(smax-smin)*(max-min)+min;
			if(e1.altKey){
				$("#ID_"+name+">.prop_value").text(rv.toFixed(2));
			}else{
				$("#ID_"+name+">.prop_value").text(Math.round(rv).toFixed(2));
			}
			prop[name].v=Math.round(rv);
			e1.stopPropagation();
			return false;
		});
		$(document).bind("mouseup",function(e2){
			$(document).unbind("mousemove");
			$(document).unbind("mouseup");
			render();
			e2.stopPropagation();
		});
		e.stopPropagation();
	});
	tv.bind("mousedown",function(e){
		var omp=e.pageX;
		var op=parseInt(tv.text());
		$(document).bind("mousemove",function(e1){
			$("html,body").css("cursor","url(img/CURSORID-15.cur),default");
			tv.css("cursor","url(img/CURSORID-15.cur),e-resize");
			var np=(e1.pageX-omp)/2+op;
			if(np<min){np=min}
			if(np>max){np=max}
			var rv=(np-min)/(max-min)*(smax-smin)+smin;
			ts.css("left",rv+"px");
			if(e1.altKey){
				tv.text(np.toFixed(2));
			}else{
				tv.text(Math.round(np).toFixed(2));
			}
			prop[name].v=Math.round(np);
			e1.stopPropagation();
			return false;
		});
		$(document).bind("mouseup",function(e2){
			$("html,body").css("cursor","default");
			tv.css("cursor","url(img/CURSORID-18.cur),e-resize");
			$(document).unbind("mousemove");
			$(document).unbind("mouseup");
			render();
			e2.stopPropagation();
		});
		e.stopPropagation();
	});
}
function addList(name,list){
	var tl="";
	for(var s=0;s<list.length;s++){
		tl+="<li>"+list[s]+"</li>\n"
	}
	var tel='<div id="ID_'+name+'" class="list">\n'+
				'<span class="prop_name">'+name+'</span>\n'+
				'<span class="prop_value">'+prop[name].v+'</span>\n'+
				'<ul>\n'+tl+'</ul>\n'+
			'</div>';
	_ep.append(tel);
	var tv=$("#ID_"+name+">.prop_value");
	var ul=$("#ID_"+name+">ul");
	ul.css("display","none");
	tv.click(function(e){
		ul.css("display","block");
		e.stopPropagation();
	});
	ul.find("li").click(function(e){
		var ts=$(this).text();
		if(ts != tv.text()){
			tv.text(ts);
			prop[name].v=ts;
			updataUI();
			render();
		}
		ul.css("display","none");
		e.stopPropagation();
	});
} 
//
function updataUI(){
	$("#effectBox").empty();
	var pl=propSwitch[prop["Type"].v];
	//console.log(pl);
	for(var p=0;p<pl.length;p++){
		var tp=prop[pl[p]];
		if(tp.type=="slider"){
			addSlider(pl[p],tp.min,tp.max);
		}else if(tp.type=="list"){
			addList(pl[p],tp.options);
		}
	}
}
//
function updataLink(){
	var source=svg.outerSVG();
	source = source.replace(/<(g|\/g|\/svg|rect|path|polygon)/,"\n<$1");
	source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
	source = '<?xml version="1.0" encoding="utf-8"?>\n' + source;
	var url = "data:image/svg+xml;charset=utf-8,"+encodeURIComponent(source);
	$("#export").attr("href",url);
}
//
function setScale(s){
	_cp.css({"-ms-transform":"scale("+s+")",
			"-moz-transform":"scale("+s+")",
			"-webkit-transform":"scale("+s+")",
			"-o-transform":"scale("+s+")",
			"transform":"scale("+s+")"});
}
//
$(function(){
	$("#mask").click(function(e){
		e.stopPropagation();
		return false;
	});
	$("#fit").click(function(e){
		if($(this).css("background-image").indexOf("s100")>0){
			$(this).css("background-image","url(img/f2c.png)");
			setScale(1);
		}else{
			$(this).css("background-image","url(img/s100.png)");
			setScale(scl);
		}
		e.stopPropagation();
	});
	$("#show").click(function(e){
		if($(this).css("background-image").indexOf("show")>0){
			$(this).css("background-image","url(img/hide.png)");
			$("#svg").css("display","block");
		}else{
			$(this).css("background-image","url(img/show.png)");
			$("#svg").css("display","none");
		}
		e.stopPropagation();
	});
});