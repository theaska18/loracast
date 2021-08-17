Ext.define('App.cmp.TextField',{
	extend: 'Ext.form.TextField',
	property:{},
	press:{},
	event:{},
	enableKeyEvents:true,
	margin:true,
	labelAlign:'right',
	initComponent:function(){
		var property=this.property,event=this.event,$this=this;
		property.type='textfield';
		if(this.listeners==undefined){this.listeners=[];}
		
		//blur
		var blurOri=null;
		if(this.listeners.blur!=undefined){blurOri=this.listeners.blur;}
		var blur=function(textfield,e){
			if(blurOri != null){blurOri(textfield,e);}
			if(event.blur != undefined){event.blur(textfield,e);}
			textfield.val(textfield.getValue());
			if($this.user_property!= undefined){
				Ext.Ajax.request({
					url : url + 'admin/setUserProperty',
					method : 'POST',
					params : {code : $this.user_property.code,name:$this.user_property.name,value:$this.getValue()},
					success : function(response) {var r = ajaxSuccess(response);},
					failure : function(jqXHR, exception) {ajaxError(jqXHR, exception,true);}
				});
			}
		}
		this.listeners.blur=blur;
		//focus
		var focusOri=null;
		if(this.listeners.focus!=undefined){focusOri=this.listeners.focus;}
		var focus=function(textfield,e){
			if(focusOri != null){focusOri(textfield,e);}
			if(event.focus != undefined){event.focus(textfield,e);}
		}
		this.listeners.focus=focus;
		//keydown
		var keydownOri=null;
		if(this.listeners.keydown!=undefined){keydownOri=this.listeners.keydown;}
		var keydown=function(textfield,e){
			if(keydownOri != null){keydownOri(textfield,e);}
			if(e.keyCode == 13){textfield.val(textfield.getValue());}
			_ctrl(textfield,e);
			return false;
		}
		this.listeners.keydown=keydown;
		if(this.maxLength==undefined){this.maxLength=64;}
		var allowBlank='';
		if(this.allowBlank != undefined && this.allowBlank ==false){allowBlank='<span style="color:red;">*</span>';}
		var labelWidth=95;
		if(this.labelWidth != undefined){labelWidth=this.labelWidth-5;}
		if(this.fieldLabel != undefined && this.fieldLabel !=''){
			if(this.width == undefined && this.anchor==undefined){this.anchor='100%';}
			this.emptyText=this.fieldLabel.replace('<br>','');
			var cssWidth='';
			if(this.labelAlign=='right'){
				cssWidth='width:'+labelWidth+'px;';
			}
			this.fieldLabel='<span style="float:left;text-align:left;text-overflow: ellipsis;white-space: nowrap;overflow: hidden;'+cssWidth+'" title="'+this.fieldLabel+'">'+this.fieldLabel+allowBlank+'</span>';		
		}
		this.load=function(){
			if($this.user_property!= undefined){
				Ext.Ajax.request({
					url : url + 'admin/getUserProperty',
					method : 'GET',
					params : {code : $this.user_property.code,name:$this.user_property.name},
					success : function(response) {var r = ajaxSuccess(response);if (r.r == 'S'){$this.setValue(r.d);}},
					failure : function(jqXHR, exception) {ajaxError(jqXHR, exception,true);}
				});
			}
		}
		this.callParent(arguments);
		this.load();
	},
	val:function(val){
		var textfield=this,property=textfield.property;
		val=val.trim().replace(/  +/g, ' ');
		if(property.space != undefined && property.space===false){val=val.replace(/ /g,'');}
		if(property.upper != undefined && property.upper===true){val=val.toUpperCase();}
		if(property.lower != undefined && property.lower===true){val=val.toLowerCase();}
		if(property.dynamic != undefined && property.dynamic===true){val=val.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1);});}
		textfield.setValue(val);
	}
});