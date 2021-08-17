Ext.define('App.cmp.FotoUpload', {
	extend : 'Ext.Panel',
	result:null,
	tempResult:null,
	border:false,
	face:false,
	paddingBottom:false,
	closeAction:'destroy',
	property:{},
	cls:'i-transparent',
	width: 150,
	height: 170,
	input:true,
	html:'<img style="width: 150px;height: 170px;border: 1px solid #99bce8;cursor:pointer;" src="'+url+'upload/NO.GIF"></img>',
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
			panelWindow=new Ext.Panel({html:'<img src="'+url+'upload/NO.GIF"></img>',paddingBottom:false,border:false,}),
			buttonDownload=new Ext.Button({
				tooltip:'Unduh Gambar',
				iconCls:'fa fa-download',
				handler:function(){
					var base64Matcher = new RegExp("^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$"),src='';
					if (base64Matcher.test($this.tempResult)) {src='data:image/png;base64,'+$this.tempResult;} else {src=url+'upload/'+$this.tempResult;}
					window.open(src);
				}
			}),
			windowFoto=new Ext.Window({
				title:'Foto',
				closeAction:'hide',
				modal:true,
				glyph:0xf03e,
				// iconCls:'fa fa-image',
				tbar:[
					btnDeleteImage=new Ext.Button({
						tooltip:'Ganti Gambar',
						iconCls:'fa fa-upload',
						disabled:disabled,
						handler:function(){
							file.fileInputEl.set({accept:'image/*'});
							file.fileInputEl.dom.click();
						}
					}),'-',
					btnReplaceImage=new Ext.Button({
						tooltip:'Hapus Gambar',
						iconCls:'fa fa-trash',
						disabled:disabled,
						handler:function(){
							panelWindow.update('<img src="'+url+'upload/NO.GIF"></img>');
							$this.setNull();
							windowFoto.center();
							buttonDownload.disable();
						}
					}),'-',
					buttonDownload
				],
				items:[panelWindow],
				listeners:{
					show:function(a){
						if($this.input==false){btnDeleteImage.disable();btnReplaceImage.disable();
						}else{btnDeleteImage.enable();btnReplaceImage.enable();}
						if($this.result != null){
							buttonDownload.enable();
							var base64Matcher = new RegExp("^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$"),src='';
							if (base64Matcher.test($this.tempResult)) {src='data:image/png;base64,'+$this.tempResult;
							} else {src=url+'upload/'+$this.tempResult;}
							panelWindow.update('<img style="max-width:'+(size.width-200)+'px;max-height:'+(size.height-200)+'px;"  src="'+src+'"></img>');
						}else{
							buttonDownload.disable();
							panelWindow.update('<img style="max-width:'+(size.width-200)+'px;max-height:'+(size.height-200)+'px;" src="'+url+'upload/NO.GIF"></img>');
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
												$this.update('<img style="width: '+($this.width-2)+'px;height: '+($this.height-2)+'px; border: 1px solid #99bce8;cursor:pointer;" src="data:image/png;base64,'+r.d+'"></img>');
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
									$this.update('<img style="width: '+($this.width-2)+'px;height: '+($this.height-2)+'px; border: 1px solid #99bce8;cursor:pointer;" src="data:image/png;base64,'+btoa(e.target.result)+'"></img>');
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
		this.items=[file]
		this.listeners={'render': function(panel) {panel.body.on('click', function(){windowFoto.show();});}}
		this.callParent(arguments);
		if(this.value != undefined){this.setFoto(this.value);}
	},
	setFoto:function(foto){
		var $this=this;
		if(foto != null && foto != ''){
			$this.result=true;
			$this.tempResult=foto;
			var base64Matcher = new RegExp("^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$"),src='';
			if (base64Matcher.test(foto)) {src='data:image/png;base64,'+foto;} else {src=url+'upload/'+foto;}
			$this.update('<img style="width: '+($this.width-2)+'px;height: '+($this.height-2)+'px; border: 1px solid #99bce8;cursor:pointer;" src="'+src+'"></img>');
		}else{$this.setNull();}
	},
	setNull:function(){
		var $this=this;
		$this.result=null;
		$this.tempResult=null;
		$this.update('<img style="width: 150px;height: 170px;border: 1px solid #99bce8;cursor:pointer;" src="'+url+'upload/NO.GIF"></img>');
	}
});