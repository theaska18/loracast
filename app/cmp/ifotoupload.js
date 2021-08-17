(function ($) {
    var unicode_charAt = function(string, index) {
        var first = string.charCodeAt(index);
        var second;
        if (first >= 0xD800 && first <= 0xDBFF && string.length > index + 1) {
            second = string.charCodeAt(index + 1);
            if (second >= 0xDC00 && second <= 0xDFFF) {
                return string.substring(index, index + 2);
            }
        }
        return string[index];
    };
    var unicode_slice = function(string, start, end) {
        var accumulator = "";
        var character;
        var stringIndex = 0;
        var unicodeIndex = 0;
        var length = string.length;
        while (stringIndex < length) {
            character = unicode_charAt(string, stringIndex);
            if (unicodeIndex >= start && unicodeIndex < end) {
                accumulator += character;
            }
            stringIndex += character.length;
            unicodeIndex += 1;
        }
        return accumulator;
    };
    $.fn.initial = function (options) {
        var colors = ["#1abc9c", "#16a085", "#f1c40f", "#f39c12", "#2ecc71", "#27ae60", "#e67e22", "#d35400", "#3498db", "#2980b9", "#e74c3c", "#c0392b", "#9b59b6", "#8e44ad", "#bdc3c7", "#34495e", "#2c3e50", "#95a5a6", "#7f8c8d", "#ec87bf", "#d870ad", "#f69785", "#9ba37e", "#b49255", "#b49255", "#a94136"];
        var finalColor;
        return this.each(function () {
            var e = $(this);
            var settings = $.extend({
                name: 'Name',
                color: null,
                seed: 0,
                charCount: 1,
                textColor: '#ffffff',
                height: 100,
                width: 100,
                fontSize: 60,
                fontWeight: 400,
                fontFamily: 'HelveticaNeue-Light,Helvetica Neue Light,Helvetica Neue,Helvetica, Arial,Lucida Grande, sans-serif',
                radius: 0
            }, options);
            settings = $.extend(settings, e.data());
            var c = unicode_slice(settings.name, 0, settings.charCount).toUpperCase();
            var cobj = $('<text text-anchor="middle"></text>').attr({
                'y': '50%',
                'x': '50%',
                'dy' : '0.35em',
                'pointer-events':'auto',
                'fill': settings.textColor,
                'font-family': settings.fontFamily
            }).html(c).css({
                'font-weight': settings.fontWeight,
                'font-size': settings.fontSize+'px',
            });
            if(settings.color == null){
                var colorIndex = Math.floor((c.charCodeAt(0) + settings.seed) % colors.length);
                finalColor = colors[colorIndex]
            }else{
                finalColor = settings.color
            }
            var svg = $('<svg></svg>').attr({
                'xmlns': 'http://www.w3.org/2000/svg',
                'pointer-events':'none',
                'width': settings.width,
                'height': settings.height
            }).css({
                'background-color': finalColor,
                'width': settings.width+'px',
                'height': settings.height+'px',
                'border-radius': settings.radius+'px',
                '-moz-border-radius': settings.radius+'px'
            });
            svg.append(cobj);
            var svgHtml = window.btoa(unescape(encodeURIComponent($('<div>').append(svg.clone()).html())));
            e.attr("src", 'data:image/svg+xml;base64,' + svgHtml);
        })
    };

}(jQuery));
Ext.define('IFotoUpload', {
	alias:'widget.ifotoupload',
	extend : 'Ext.Panel',
	result:null,
	tempResult:null,
	border:false,
	face:false,
	paddingBottom:false,
	closeAction:'destroy',
	property:{},
	style:'border: 1px solid #99bce8;cursor:pointer;background-color:rgb(20, 21, 24);',
	bodyStyle:'text-align:center;',
	cls:'i-transparent',
	width: 150,
	initial: '',
	height: 170,
	input:true,
	html:'<img style="width: 150px;height: 170px;" src="'+url+'upload/NO.GIF"></img>',
	initComponent:function(){
		var property=this.property,btnDeleteImage=null,btnReplaceImage=null;
		property.type='fotoupload';
		disabled=false;
		if(this.input==false){disabled=true;}
		var size = {
				width: window.innerWidth || document.body.clientWidth,
				height: window.innerHeight || document.body.clientHeight
			},
			$this=this,
			panelWindow=new Ext.Panel({ autoScroll:true, html:'<img src="'+url+'upload/NO.GIF"></img>',paddingBottom:false,border:false,bodyStyle:'text-align:center;background-color:#141518;',style:'vertical-align: middle;'}),
			buttonDownload=new Ext.Button({
				tooltip:'Unduh Gambar',
				iconCls:'fa fa-download',
				handler:function(){
					var src=isBase64($this.tempResult);
					if(src !==false){
						src='data:image/png;base64,'+$this.tempResult;
					}else{
						src=url+'upload/'+$this.tempResult;
					}
					// var base64Matcher = new RegExp("^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$"),src='';
					// if (base64Matcher.test($this.tempResult)) {src='data:image/png;base64,'+$this.tempResult;} else {src=url+'upload/'+$this.tempResult;}
					window.open(src);
				}
			}),
			windowFoto=new Ext.Window({
				closeAction:'hide',
				modal:true,
				// frameHeader:false,
				title: '',
				style:'padding:0 ;',
				header: false,
				// bodyPadding:0,
				// frame: false,
				// bodyBorder:false,
				// glyph:0xf03e,
				// shadow:false,
				border:false,
				// bodyBorder:false,
				collapsed:true,
				layout:'fit',
				maximized:true,
				tbar:[
					{
						iconCls:'fa fa-chevron-left',
						tooltip:'Kembali/Keluar',
						text:'Kembali',
						handler:function(){
							windowFoto.close();
						}
					},'->',{
						tooltip:'Zoom Out',
						iconCls:'fa fa-search-minus',
						handler:function(){
							var GFG = panelWindow.el.child('>').child('>').child('>').child('>').dom; 
							var currWidth = GFG.clientWidth; 
							if((currWidth/2)>=2){
								GFG.style.width = (currWidth/2) + "px"; 
							}
						}
					},{
						tooltip:'Zoom In',
						iconCls:'fa fa-search-plus',
						handler:function(){
							var GFG = panelWindow.el.child('>').child('>').child('>').child('>').dom; 
							var currWidth = GFG.clientWidth; 
								GFG.style.width = (currWidth * 2) + "px"; 
						}
					},'->',
					btnDeleteImage=new Ext.Button({
						tooltip:'Ganti Gambar',
						iconCls:'fa fa-upload',
						disabled:disabled,
						handler:function(){
							file.fileInputEl.set({accept:'image/*'});
							file.fileInputEl.dom.click();
						}
					}),
					btnReplaceImage=new Ext.Button({
						tooltip:'Hapus Gambar',
						iconCls:'fa fa-trash',
						disabled:disabled,
						handler:function(){
							if($this.initial != undefined && $this.initial != null && $this.initial != ''){
								panelWindow.update('<img style="width: 150px;height: 170px;" id="initialWindow-'+$this.id.replace('.','_')+'"></img>');
								var split=$this.initial.split(' '),car='',jum=0,
									tmpInitial=$('#tmp-initial'),
									comInitial=$('#initialWindow-'+$this.id.replace('.','_'));
								for(var i=0,iLen=split.length; i<iLen;i++){
									if(split[i] !='' && split[i] !=null && split[i] !='null'){
										car+=split[i].charAt(0);
										jum++;
									}
								}
								if(comInitial.length==0){
									tmpInitial.initial({name:car,charCount:jum,width:$this.width,height:$this.height});
									panelWindow.update('<img id="initialWindow-'+$this.id.replace('.','_')+'" style="width: 150px;height: 170px;" src="'+$('#tmp-initial').attr('src')+'"></img>');
								}else{
									comInitial.initial({name:car,charCount:jum,width:150,height:170});
								}
							}else{
								panelWindow.update('<img src="'+url+'upload/NO.GIF"></img>');
							}
							$this.setNull();
							windowFoto.center();
							buttonDownload.disable();
						}
					}),
					buttonDownload
				],
				items:[panelWindow],
				listeners:{
					show:function(a){
						panelWindow.el.child('>').child('>').child('>').dom.style.verticalAlign = "middle";
						if($this.input==false){btnDeleteImage.disable();btnReplaceImage.disable();
						}else{btnDeleteImage.enable();btnReplaceImage.enable();}
						if($this.result != null){
							buttonDownload.enable();
							var src=isBase64($this.tempResult);
							if(src !==false){
								src='data:image/png;base64,'+$this.tempResult;
							}else{
								src=url+'upload/'+$this.tempResult;
							}
							// var base64Matcher = new RegExp("^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$"),src='';
							// if (base64Matcher.test($this.tempResult)) {src='data:image/png;base64,'+$this.tempResult;
							// } else {src=url+'upload/'+$this.tempResult;}
							panelWindow.update('<img src="'+src+'"></img>');
						}else{
							buttonDownload.disable();
							if($this.initial != undefined && $this.initial != null && $this.initial != ''){
								panelWindow.update('<img style="max-width: 150px;max-height: 170px;" id="initialWindow-'+$this.id.replace('.','_')+'"></img>');
								var split=$this.initial.split(' '),car='',jum=0,
									tmpInitial=$('#tmp-initial'),
									comInitial=$('#initialWindow-'+$this.id.replace('.','_'));
								for(var i=0,iLen=split.length; i<iLen;i++){
									if(split[i] !='' && split[i] !=null && split[i] !='null'){
										car+=split[i].charAt(0);
										jum++;
									}
								}
								if(comInitial.length==0){
									tmpInitial.initial({name:car,charCount:jum,width:$this.width,height:$this.height});
									panelWindow.update('<img id="initialWindow-'+$this.id.replace('.','_')+'" style="width: 150px;height: 170px;" src="'+$('#tmp-initial').attr('src')+'"></img>');
								}else{
									comInitial.initial({name:car,charCount:jum,width:150,height:170});
								}
							}else{
								panelWindow.update('<img src="'+url+'upload/NO.GIF"></img>');
							}
						}
						a.center();
					}
				}
			}),
			file=new Ext.form.field.File({
				type : 'filefield',
				hidden:true,
				result:null,
				listeners:{
					change:function(a){
						var file = a.getEl().down('input[type=file]').dom.files[0],
						reader = new FileReader();
						if($this.face==false){
							windowFoto.close();
						}
						reader.onload = (function(theFile) {
							return function(e) {
								if($this.face==true){
									Ext.Ajax.request({
										url : url + 'cmp/cropFaceDetection',
										method : 'POST',
										params:{uri:'data:image/png;base64,'+btoa(e.target.result)},
										before:function(){windowFoto.setLoading(true);},
										success : function(response) {
											windowFoto.setLoading(false);
											var r = ajaxSuccess(response);
											if (r.r == 'S'){
												if($this.face==true){
													windowFoto.close();
												}
												$this.result=r.d;
												$this.tempResult=r.d;
												$this.update('<img style="max-width: '+($this.width-2)+'px;max-height: '+($this.height-2)+'px;" src="data:image/png;base64,'+r.d+'"></img>');
												panelWindow.update('<img style="max-width:'+(size.width-50)+'px;max-height:'+(size.height-100)+'px;"  src="data:image/png;base64,'+r.d+'"></img>');
											}
										},
										failure : function(jqXHR, exception){
											windowFoto.setLoading(false);
											ajaxError(jqXHR, exception,true);
										}
									});
								}else{
									$this.result=btoa(e.target.result);
									$this.tempResult=btoa(e.target.result);
									$this.update('<img style="max-width: '+($this.width-2)+'px;max-height: '+($this.height-2)+'px;" src="data:image/png;base64,'+btoa(e.target.result)+'"></img>');
									panelWindow.update('<img style="max-width:'+(size.width-50)+'px;max-height:'+(size.height-100)+'px;"  src="data:image/png;base64,'+btoa(e.target.result)+'"></img>');
								}
								windowFoto.center();
								buttonDownload.enable();
							};
						})(file);
						reader.readAsBinaryString(file);
					}
				}
			});
		this.items=[file];
		this.listeners={'render': function(panel) {panel.body.on('click', function(){windowFoto.show();});}};
		
		this.callParent(arguments);
		if(this.value != undefined){this.setFoto(this.value);}
	},
	setFoto:function(foto){
		var $this=this;
		if((foto != null && foto != '' && foto != 'NO.GIF') || (foto == 'NO.GIF' && ($this.initial == undefined || $this.initial == null || $this.initial == ''))){
			$this.result=true;
			$this.tempResult=foto;
			var src=isBase64(foto);
			if(src !==false){
				src='data:image/png;base64,'+foto;
			}else{
				src=url+'upload/'+foto;
			}
			// var base64Matcher = new RegExp("^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$"),src='';
			// if (base64Matcher.test(foto)) {src='data:image/png;base64,'+foto;} else {src=url+'upload/'+foto;}
			$this.update('<img style="max-width: '+($this.width-2)+'px;max-height: '+($this.height-2)+'px; " src="'+src+'"></img>');
			$this.el.child('>').child('>').child('>').dom.style.verticalAlign = "middle";
		}else{
			$this.setNull();
		}
	},
	setNull:function(){
		var $this=this;
		$this.result=null;
		$this.tempResult=null;
		if($this.initial != undefined && $this.initial != null && $this.initial != ''){
			$this.update('<img id="initial-'+$this.id.replace('.','_')+'" style="width: 148px;height: 168px;"></img>');
			var split=$this.initial.split(' '),car='',jum=0
				tmpInitial=$('#tmp-initial'),
				comInitial=$('#initial-'+$this.id.replace('.','_'));
			for(var i=0,iLen=split.length; i<iLen;i++){
				if(split[i] !='' && split[i] !=null && split[i] !='null'){
					car+=split[i].charAt(0);
					jum++;
				}
			}
			if(comInitial.length==0){
				tmpInitial.initial({name:car,charCount:jum,width:$this.width,height:$this.height});
				$this.update('<img id="initial-'+$this.id.replace('.','_')+'" style="width: 148px;height: 168px;" src="'+$('#tmp-initial').attr('src')+'"></img>');
			}else{
				comInitial.initial({name:car,charCount:jum,width:$this.width-2,height:$this.height-2});
			}
		}else{
			$this.update('<img id="initial-'+$this.id.replace('.','_')+'" style="width: 148px;height: 168px;" src="'+url+'upload/NO.GIF"></img>');
		}
	}
});